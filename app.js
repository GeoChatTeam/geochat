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
var Buildings = require('./lib/Buildings');
var Mailman = require('./lib/Mailman');
var Tab=require('./routes/Tab');

var db = require('monk')('localhost/geochatdb'); // this points to the database
var mail = require('nodemailer').mail;

var EXPRESS_SID_KEY = 'express.sid';
var COOKIE_SECRET = 'qwerty1234567890';
var RANGE = 400;

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
app.get('/tab/:name',Tab.makeTab);
app.post('/login', Auth.login(db));
app.post('/register', Auth.register(db, mail));
app.post('/confirm', Auth.confirmRegister(db));

var user_pool = new UserPool();
var buildings = Buildings.createAll();
var mailman = new Mailman(user_pool, buildings, RANGE);

//socket things below. there are basically routes.
io.sockets.on('connection', function (socket) {
	var session = socket.handshake.session;
	
	var current_user = new ActiveUser(session.user_id, socket);
	user_pool.add(current_user);

	// init(latitude, longitude)
	socket.on('init', function(data){
		data.latitude;
		data.longitude;
		
		// update lat/long of user
		
		// which users are in range in nearby chat?
			// tell them we are in range
	});
	// join_building(building_id)
	socket.on('join_building', function(data){
		data.building_id;
		
		// update the building list to include him/her
		
		// get all users in the building
			// let them know we entered
		
	});
	// leave_building(building_id)
	socket.on('leave_building', function(data){
		data.building_id;
		
		// update building list to no longer include him/her
		
		// get all the users in the building
			// tell them we left
	});
	// update_location(latitude, longitude)
	socket.on('update_location', function(data){
		data.latitude;
		data.longitude;
		
		// which users are now out of range?
			// tell them we have left the nearby chat
		
		// which users are now in range?
			// tell them we have entered the nearby chat
	});
	// update_nickname(nickname)
	socket.on('update_nickname', function(data){
		if(user_pool.nicknameUnique(data.nickname)){
			// announce to all users that are in contact with current_user that his/her nickname has been changed
			
			current_user.nickname = data.nickname;
			
		} 
		else {
			current_user.sendNotification('error', ('The nickname ' + data.nickname + ' is in use, please try another'));
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
		// remove from user pool
		
		// remove from buildings
		
		// notify nearby chat
		
		// notifify users from buildings
	});
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

