var socket = io.connect();

socket.on('connect', function(data){
    console.log('connected');
});

socket.on('error', function(data){
    console.log('unable to connect');
});

//has style chat_room: [nickname, nickname, nickname]
var chat_rooms = {};

socket.on('room_enter', function(data){
	
});

socket.on('room_leave', function(data){ //{nickname, room}
	displayNotification('neutral', data.nickname + ' has left the chatroom');
	if(data.nickname in chat_room_list){
		delete chat_room_list[data.nickname];
	}
	drawPane();
});

socket.on('nickname_change', function(data){
	displayNotification('neutral', data.prev_nickname + ' -> ' + data.new_nickname);
	if(data.prev_nickname in chat_room_list){
		delete chat_room_list[data.prev_nickname];
		chat_room_list[data.new_nickname] = true;
	}
	drawPane();
});
