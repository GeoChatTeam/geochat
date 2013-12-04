var socket = io.connect();

socket.on('connect', function(data){
    console.log('connected');
});

socket.on('error', function(data){
    console.log('unable to connect');
});

var chat_rooms = {};

socket.on('user_joined_building', function(data){
	chat_rooms[data.building_id].user_entered(data.nickname);
});

socket.on('user_left_building', function(data){
	chat_rooms[data.building_id].user_left(data.nickname);
});

socket.on('user_in_range', function(data){
	chat_rooms['nearby'].user_entered(data.nickname);
	//TODO: add the user's marker, data.latitude, data.longitude
});

socket.on('user_out_of_range', function(data){
	chat_rooms['nearby'].user_left(data.nickname);
	//TODO: remove the user's marker
});

socket.on('user_in_range_location_change', function(data){
	//data.nickname, data.latitude, data.longitude
})

//this is for when the current user joins a building chat
socket.on('building_chat_joined', function(data){
	chat_rooms[data.building_id] = new ChatRoom(data.building_id, data.inhabitants);
});

function joinBuildingChat(building_id){
	socket.emit('join_building', {building_id: building_id});
}

function leaveBuildingChat(building_id){
	socket.emit('leave_building', {building_id: building_id});
	delete chat_rooms[building_id];
}
