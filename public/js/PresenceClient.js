var socket = io.connect();

socket.on('connect', function(data){
    console.log('connected');
});

socket.on('error', function(data){
    console.log('unable to connect');
});

var chat_room_list = {};

function drawPane(){
	jQuery('#userList').html('');
	for(var user in chat_room_list){
		jQuery('#userList').append(user);
	}
}

socket.on('room_enter', function(data){
	displayNotification('neutral', data.nickname + ' has entered the chatroom.');
	chat_room_list[data.nickname] = true;
	drawPane();
});

socket.on('room_leave', function(data){
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

socket.on('room_populate', function(data){
	for(var i = 0; i < data.users.length; i++){
		chat_room_list[data.users[i]] = true;
	}
	drawPane();
});
