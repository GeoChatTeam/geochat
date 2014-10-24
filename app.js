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
io.use(function(socket, next) {
    var req = socket.request;
    if(!req.headers.cookie) {
        return next('No cookie transmitted.');
    }

    // We use the Express cookieParser created before to parse the cookie
    // Express cookieParser(req, res, next) is used initialy to parse data in "req.headers.cookie".
    cookieParser(req, {}, function(parseErr) {
        if(parseErr) { return next('Error parsing cookies.'); }

        // Get the SID cookie
        var sidCookie = (req.secureCookies && req.secureCookies[EXPRESS_SID_KEY]) ||
                        (req.signedCookies && req.signedCookies[EXPRESS_SID_KEY]) ||
                        (req.cookies && req.cookies[EXPRESS_SID_KEY]);

        // Then we just need to load the session from the Express Session Store
        sessionStore.load(sidCookie, function(err, session) {
                // And last, we check if the used has a valid session and if he is logged in
            if (err || !session || !session.user_id) {
		return next('Error, no user_id in session');
            } else {
                // If you want, you can attach the session to the handshake data, so you can use it again later
                socket.handshake.session = session;

                return next(null);
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

var user_pool = new UserPool();
var buildings = Buildings.createAll();
var mailman = new Mailman(user_pool, buildings);

//socket things below. there are basically routes.
io.sockets.on('connection', function (socket) {
	var session = socket.handshake.session;

	debugger;
	
	if(user_pool.find_by_user_id(session.user_id)){
		user_pool.find_by_user_id(session.user_id).socket.disconnect();
	}
	
	var current_user = new ActiveUser(session.user_id, socket);
	user_pool.add(current_user);

	// init(latitude, longitude)
	socket.on('init', function(data){		
		// users that are in range in nearby chat
		user_pool.delta_users_in_range(current_user, data.latitude, data.longitude).forEach(function(in_range_user){
			// update in range data structure
			user_pool.users_are_now_in_range(current_user.id, in_range_user.id);
			
			in_range_user.socket.emit('user_in_range', {nickname: current_user.nickname, latitude: data.latitude, longitude: data.longitude});	
		});
		
		// we can now update the user's location. we must set this after calling "user_pool.delta_users_in_range".
		current_user.location = {latitude: data.latitude, longitude: data.longitude};
		
		var nicknames_and_locations = user_pool.nicknames_and_locations_of_nearby_to(current_user);
		current_user.socket.emit('nearby_chat_joined', {inhabitants: nicknames_and_locations[0], locations: nicknames_and_locations[1], current_user_nickname: current_user.nickname, current_user_longitude: current_user.getLongitude(), current_user_latitude: current_user.getLatitude()});
	});
	// join_building(building_id)
	socket.on('join_building', function(data){
		// update the building list to include him/her
		buildings[data.building_id].users[current_user.id] = current_user;
		
		current_user.socket.emit('building_chat_joined', {building_id: data.building_id, inhabitants: buildings[data.building_id].nicknames_of_users_in_building});
		
		// get all users in the building
		buildings[data.building_id].eachUser(function(user_in_building){
			// let them know we entered
			user_in_building.socket.emit('user_joined_building', {nickname: current_user.nickname, building_id: data.building_id});	
		});	
	});
	// leave_building(building_id)
	socket.on('leave_building', function(data){
		// update building list to no longer include him/her
		delete buildings[data.building_id].users[current_user.id];
		
		// get all the users in the building
			// tell them we left
		buildings[data.building_id].eachUser(function(user_in_building){
			user_in_building.socket.emit('user_left_building', {nickname: current_user.nickname, building_id: data.building_id});	
		});
	});
	// update_location(latitude, longitude)
	socket.on('update_location', function(data){
		// first, we tell all the users who are displaying a marker for the current_user that the current_user's location has changed
		user_pool.users_in_range(current_user).forEach(function(user_in_range){
			user_in_range.socket.emit('user_in_range_location_change', {nickname: current_user.nickname, latitude: data.latitude, longitude: data.longitude});	
		});
		
		// next, we tell all the users who are now out of range, that the current_user is no longer in their range.
		user_pool.delta_users_out_of_range(current_user, data.latitude, data.longitude).forEach(function(out_of_range_user){
			// update adjacency matrix data structure
			user_pool.users_are_now_out_of_range(current_user.id, out_of_range_user.id);
			
			out_of_range_user.socket.emit('user_out_of_range', {nickname: current_user.nickname});	
		});
		
		// last, we tell all the users who are now in range, that the current_user is in their range.
		user_pool.delta_users_in_range(current_user, data.latitude, data.longitude).forEach(function(in_range_user){
			// update adjacency matrix data structure
			user_pool.users_are_now_in_range(current_user.id, in_range_user.id);
			
			in_range_user.socket.emit('user_in_range', {nickname: current_user.nickname, latitude: data.latitude, longitude: data.longitude});	
		});
		
		current_user.location = {latitude: data.latitude, longitude: data.longitude};
	});
	// update_nickname(nickname, building_id)
	socket.on('update_nickname', function(data){
		// if the desired nickname is available
		if(user_pool.nicknameUnique(data.nickname)){
			// we tell everyone in current_user's range that current_user's nickname has been updated
			user_pool.users_in_range(current_user).forEach(function(in_range_user){
				in_range_user.socket.emit('user_nearby_nickname_updated', {prev_nickname: current_user.nickname, new_nickname: data.nickname});	
			});
			
			buildings.forEach(function(building){
				// if the current_user is in the building
				if(building.users[current_user.id]){
					// notify each user in the building that current_user is leaving
					building.eachUser(function(user_in_building){
						user_in_building.socket.emit('user_in_building_nickname_updated', {prev_nickname: current_user.nickname, new_nickname: data.nickname, building_id: i});	
					});	
				}
			});
			
			// we can finally update their nickname
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
	// send_whisper_message(receiver_nickname, message)
	socket.on('send_whisper_message', function(data){
		mailman.handle_whisper_message(current_user.id, data.message, data.receiver_nickname);
	});
	// disconnect()
	socket.on('disconnect', function(data){
		// notify nearby chat members
		user_pool.users_in_range(current_user).forEach(function(nearby_user){
			nearby_user.socket.emit('user_out_of_range', {nickname: current_user.nickname});	
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

