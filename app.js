var express = require('express');
var chat = require('./routes/chat');
var Building = require('./routes/Building');
var Auth = require('./routes/Auth');
var UserPool = require('./lib/UserPool');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
var io = require('socket.io').listen(server);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', chat.index);
app.get('/chat', chat.chat);

app.post('/login', Auth.login);
app.post('/register', Auth.register);

var user_pool = {};
//{user_id: 2, location: 'idk', chat_styles: [0,1,2,3,4,5], socket: socket}

io.sockets.on('connection', function (socket) {
	
	socket.on('location_update', function(data){
		console.log('location: ' + data);
	});
	
	socket.on('building', function(data){
		//either add or delete building from chat_styles.
		console.log('building: ' + data);
	});
	
	socket.on('message', function (data) {
		console.log('message: ' + data);
	});
  
	socket.on('disconnect', function(data){
		user_pool.remove(req.session.user_id);
	});
	
	user_pool.add({user_id : req.session.user_id, location: null, chat_styles: [], socket: socket});
	
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

