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
app.get('/tab/:name',Tab.makeTab);
app.post('/login', Auth.login(db));
app.post('/register', Auth.register(db, mail));
app.post('/confirm', Auth.confirmRegister(db));

//our instance of UserPool (which is defined in lib/UserPool.js)
var user_pool = new UserPool();
//our instance of Mailman (which is defined in lib/Mailman.js)
// *** replace null with the users database. the mailman needs access to the active users (user_pool) and the users
var mailman = new Mailman(user_pool, null);

//socket things below. there are basically routes.
io.sockets.on('connection', function (socket) {
	var session = socket.handshake.session;
	var current_user = new ActiveUser(session.user_id, null, [0], socket);
	user_pool.add(current_user);

	socket.on('location_update', function(data){
		current_user.updateLocation({longitude: data.longitude, latitude: data.latitude});
	});
  
	socket.on('nickname_update', function(data){
		if(user_pool.nicknameUnique(data.nickname)){
			user_pool.eachUser(function(user){
				user.announceNicknameChange(current_user.getNickname(), data.nickname);
			});
			current_user.updateNickname(data.nickname);
			
		} else {
			current_user.sendNotification('error', ('The nickname ' + data.nickname + ' is in use, please try another'));
		}
	});
	
	socket.on('message', function (data) {
        // receiver_id should be null unless chat_style === 'whisper'
		mailman.handleMessageReceived(session.user_id, data.chat_style, data.receiver_id, data.message);
	});
	
	socket.on('join_chatroom', function(data){
		user_pool.eachUser(function(){
			//
		});
		//add chat_style to current_user.
	});
  
	socket.on('disconnect', function(data){
		user_pool.eachUser(function(user){
			user.announceDepartureOf(current_user);
		});
		user_pool.remove(current_user.user_id);
	});
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

