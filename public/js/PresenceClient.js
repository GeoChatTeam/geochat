var socket = io.connect();

socket.on('connect', function(data){
    console.log('connected');
});

socket.on('error', function(data){
    console.log('unable to connect');
});

var chat_rooms = {};

socket.on('room_enter', function(data){
	
});

socket.on('room_leave', function(data){ //{nickname, room}
	
});

socket.on('nickname_change', function(data){
	
});
