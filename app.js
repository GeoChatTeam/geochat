var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

var Chat = require('./routes/Chat');
var Building = require('./routes/Building');
var Auth = require('./routes/Auth');
var UserPool = require('./lib/UserPool');
var ActiveUser = require('./lib/ActiveUser');
var Buildings = require('./lib/Building');
var Mailman = require('./lib/Mailman');
var Tab=require('./routes/Tab');

var db = require('monk')('localhost/geochatdb'); // this points to the database
var mail = require('nodemailer').mail;

var EXPRESS_SID_KEY = 'express.sid';
var COOKIE_SECRET = 'qwerty1234567890';

var cookieParser = express.cookieParser(COOKIE_SECRET);
var sessionStore = new express.session.MemoryStore();

// Configure Express app with :
// * Cookie Parser created above
// * Configure Session Store
app.configure(function () {
        app.use(cookieParser);
        app.use(express.session({
        store: sessionStore,
        cookie: { 
            httpOnly: true
        },
        key: EXPRESS_SID_KEY
    }));
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

//web sockets init
var io = require('socket.io').listen(server);

// We configure the socket.io authorization handler (handshake)
io.set('authorization', function (data, callback) {
    if(!data.headers.cookie) {
        return callback('No cookie transmitted.', false);
    }

    // We use the Express cookieParser created before to parse the cookie
    // Express cookieParser(req, res, next) is used initialy to parse data in "req.headers.cookie".
    // Here our cookies are stored in "data.headers.cookie", so we just pass "data" to the first argument of function
    cookieParser(data, {}, function(parseErr) {
        if(parseErr) { return callback('Error parsing cookies.', false); }

        // Get the SID cookie
        var sidCookie = (data.secureCookies && data.secureCookies[EXPRESS_SID_KEY]) ||
                        (data.signedCookies && data.signedCookies[EXPRESS_SID_KEY]) ||
                        (data.cookies && data.cookies[EXPRESS_SID_KEY]);

        // Then we just need to load the session from the Express Session Store
        sessionStore.load(sidCookie, function(err, session) {
                // And last, we check if the used has a valid session and if he is logged in
            if (err || !session || !session.user_id) {
                callback('Error', false);
            } else {
                // If you want, you can attach the session to the handshake data, so you can use it again later
                data.session = session;

                callback(null, true);
            }
        });
    });
});
//end websockets init

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', Chat.index);
app.get('/chat', Chat.chat);
app.get('/users', Auth.userList(db));
app.get('/logOut', Auth.logOut);
app.get('/tab/:id',Tab.makeTab);
app.post('/login', Auth.login(db));
app.post('/register', Auth.register(db, mail));
app.post('/confirm', Auth.confirmRegister(db));

var user_pool = new UserPool();
var buildings = Buildings.createAll();
var mailman = new Mailman(user_pool, buildings);

//socket things below. there are basically routes.
io.sockets.on('connection', function (socket) {
	var session = socket.handshake.session;
	
	var current_user = new ActiveUser(session.user_id, socket);
	user_pool.add(current_user);

	// init(latitude, longitude)
	socket.on('init', function(data){		
		// which users are in range in nearby chat?
			// tell them we are in range
		user_pool.delta_users_in_range(current_user, data.latitude, data.longitude).forEach(function(in_range_user){
			// update in range data structure
			user_pool.users_are_now_in_range(current_user.id, in_range_user.id);
			
			in_range_user.socket.emit('user_in_range', {nickname: current_user.nickname, latitude: current_user.getLatitude(), longitude: current_user.getLongitude()});	
		});
		
		current_user.location = {latitude: data.latitude, longitude: data.longitude};
		
		var nicknames = [];
		var locations = [];
		user_pool.users_in_range(current_user).forEach(function(iterative_user){
			nicknames.push(iterative_user.nickname);	
			locations.push({latitude: iterative_user.getLatitude(), longitude: iterative_user.getLongitude()});
		});
		current_user.socket.emit('nearby_chat_joined', {inhabitants: nicknames, locations: locations});
		
		current_user.socket.emit('nickname_granted', {nickname: current_user.nickname, building_id: 'nearby'});
		
		user_pool.users_are_now_in_range(current_user.id, current_user.id);
		current_user.socket.emit('user_in_range', {nickname: current_user.nickname, latitude: current_user.getLatitude(), longitude: current_user.getLongitude()});
	});
	// join_building(building_id)
	socket.on('join_building', function(data){
		// update the building list to include him/her
		buildings[data.building_id].users[current_user.id] = current_user;
		
		var users_in_building = [];
		buildings[data.building_id].eachUser(function(user_in_building){
				users_in_building.push(user_in_building.nickname);
		});
		current_user.socket.emit('building_chat_joined', {building_id: data.building_id, inhabitants: users_in_building});
		
		// get all users in the building
			// let them know we entered
		buildings[data.building_id].eachUser(function(user_in_building){
			user_in_building.socket.emit('user_joined_building', {nickname: current_user.nickname, building_id: data.building_id});	
		});	
	});
	// leave_building(building_id)
	socket.on('leave_building', function(data){
		// get all the users in the building
			// tell them we left
		buildings[data.building_id].eachUser(function(user_in_building){
			user_in_building.socket.emit('user_left_building', {nickname: current_user.nickname, building_id: data.building_id});	
		});
		
		// update building list to no longer include him/her
		delete buildings[data.building_id].users[current_user.id];
	});
	// update_location(latitude, longitude)
	socket.on('update_location', function(data){
		user_pool.users_in_range(current_user).forEach(function(user_in_range){
			user_in_range.socket.emit('user_in_range_location_change', {nickname: current_user.nickname, latitude: data.latitude, longitude: data.longitude});	
		});
		
		user_pool.delta_users_out_of_range(current_user, data.latitude, data.longitude).forEach(function(out_of_range_user){
			// update in range data structure
			user_pool.users_are_now_out_of_range(current_user.id, out_of_range_user.id);
			
			out_of_range_user.socket.emit('user_out_of_range', {nickname: current_user.nickname});	
		});
		
		user_pool.delta_users_in_range(current_user, data.latitude, data.longitude).forEach(function(in_range_user){
			// update in range data structure
			user_pool.users_are_now_in_range(current_user.id, in_range_user.id);
			
			in_range_user.socket.emit('user_in_range', {nickname: current_user.nickname, latitude: current_user.getLatitude(), longitude: current_user.getLongitude()});	
		});
		
		current_user.location = {latitude: data.latitude, longitude: data.longitude};
	});
	// update_nickname(nickname, building_id)
	socket.on('update_nickname', function(data){
		if(user_pool.nicknameUnique(data.nickname)){
			user_pool.users_in_range(current_user).forEach(function(in_range_user){
				in_range_user.socket.emit('user_nearby_nickname_updated', {prev_nickname: current_user.nickname, new_nickname: data.nickname});	
			});
			
			for(var i = 0; i < buildings.length; i++){
				var building = buildings[i];
				
				if(building.users[current_user.id]){
					building.eachUser(function(user_in_building){
						user_in_building.socket.emit('user_in_building_nickname_updated', {prev_nickname: current_user.nickname, new_nickname: data.nickname, building_id: i});	
					});	
				}
			}
			
			current_user.nickname = data.nickname;
			
			current_user.socket.emit('nickname_granted', {nickname: data.nickname, building_id: data.building_id});
		} 
		else {
			current_user.socket.emit('nickname_denied', {nickname: data.nickname, building_id: data.building_id});
		}
	});
	// send_nearby_message(message)
	socket.on('send_nearby_message', function(data){
		mailman.handle_nearby_message(current_user.id, data.message);
	});
	// send_building_message(building_id, message)
	socket.on('send_building_message', function(data){
		mailman.handle_building_message(current_user.id, data.message, data.building_id);
	});
	// send_whisper_message(receiver_id, message)
	socket.on('send_whisper_message', function(data){
		mailman.handle_whisper_message(current_user.id, data.message, data.receiver_id);
	});
	// disconnect()
	socket.on('disconnect', function(data){
		// notify nearby chat
		user_pool.users_in_range(current_user).forEach(function(nearby_user){
			nearby_user.emit('user_out_of_range', {nickname: current_user.nickname});	
		});
		
		// notifify users from buildings
		for(var i = 0; i < buildings.length; i++){
			var building = buildings[i];
				
			if(building.users[current_user.id]){
				building.eachUser(function(user_in_building){
					user_in_building.socket.emit('user_left_building', {nickname: current_user.nickname, building_id: i});	
				});	
				
				// remove from buildings
				delete building.users[current_user.id];
			}
		}
		
		
		// remove from user pool
		delete user_pool.users[current_user.id];
	});
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

