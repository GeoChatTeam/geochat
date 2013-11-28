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

var chat = require('./routes/chat');
var Building = require('./routes/Building');
var Auth = require('./routes/Auth');
var UserPool = require('./lib/UserPool');


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


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', chat.index);
app.get('/chat', chat.chat);

app.post('/login', Auth.login);
app.post('/register', Auth.register);

var user_pool = new UserPool();
//{user_id: 2, location: 'idk', chat_styles: [0,1,2], socket: socket}

io.sockets.on('connection', function (socket) {
	var session = socket.handshake.session;
			
	socket.on('location_update', function(data){
		console.log('location: ' + data);
	});
	
	socket.on('building', function(data){
		//either add or delete building from chat_styles.
		console.log('building: ' + data);
	});
	
	socket.on('message', function (data) {
		console.log('message: ' + data.body);
	});
  
	socket.on('disconnect', function(data){
		user_pool.remove(session.user_id);
	});
	
	user_pool.add({user_id : session.user_id, location: null, chat_styles: [], socket: socket});
	
	console.log('ffffffffffffffffffffffffffff: ' + session.user_id);
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

