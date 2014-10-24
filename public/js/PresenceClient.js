//Author: Chris Ciollaro
//this is the file responsible for who is in what chat room (including the user)
//get a socket going.
var socket = io.connect();

socket.on('connect', function(data){
    console.log('socket connected');
});

socket.on('error', function(data){
    console.log('socket unable to connect');
});

//is a data structure to hold all of the chat rooms that the user is in
var chat_rooms = {};
//delegates to ChatRoom.js
socket.on('user_joined_building', function(data){
	chat_rooms[data.building_id].user_entered(data.nickname);
});
//delegates to ChatRoom.js

socket.on('user_left_building', function(data){
	chat_rooms[data.building_id].user_left(data.nickname);
});
//delegates to ChatRoom.js
//adds the user to the map
socket.on('user_in_range', function(data){
	chat_rooms['nearby'].user_entered(data.nickname);
	location_client.addMarker(data.nickname, data.latitude, data.longitude);
});
//delegates to ChatRoom.js
//removes the user from the map
socket.on('user_out_of_range', function(data){
	chat_rooms['nearby'].user_left(data.nickname);
	location_client.removeMarker(data.nickname);
});

socket.on('user_in_range_location_change', function(data){
	location_client.removeMarker(data.nickname);
	location_client.addMarker(data.nickname, data.latitude, data.longitude);
})

//this is for when the current user joins a building chat
socket.on('building_chat_joined', function(data){
	chat_rooms[data.building_id] = new ChatRoom(data.building_id, data.inhabitants);

});
//when you join nearby chat, you need to add all of the inhabitants to your map
socket.on('nearby_chat_joined', function(data){
	chat_rooms['nearby'] = new ChatRoom('nearby', data.inhabitants);
	for(var i = 0; i < data.locations.length; i++){
		location_client.addMarker(data.inhabitants[i], data.locations[i].latitude, data.locations[i].longitude);
	}
	
	jQuery('#current_nickname').html(data.current_user_nickname);
	displayNotification('nearby', 'Now chatting as ' + data.current_user_nickname + '.', 'success');
	
	chat_rooms['nearby'].user_entered(data.current_user_nickname);
	location_client.addMarker(data.current_user_nickname, data.current_user_latitude, data.current_user_longitude);
});

function joinBuildingChat(building_id){
	socket.emit('join_building', {building_id: building_id});
}

function leaveBuildingChat(building_id){
	socket.emit('leave_building', {building_id: building_id});
	chat_rooms[building_id].user_left(jQuery('#current_nickname').html());
	delete chat_rooms[building_id];
}

socket.on('disconnect', function(data){
	alert('This GeoChat session has expired. You may have logged in to GeoChat in another session.');
	jQuery('body').html('<h2>GeoChat Session Expired</h2>');
});
