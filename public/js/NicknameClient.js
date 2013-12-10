function updateNickname(nickname, building_id){
	socket.emit('update_nickname', {nickname: nickname, building_id: building_id});
}
//changes the place where we show their nickname (at the top right at the time of writing this)
socket.on('nickname_granted', function(data){
	jQuery('#current_nickname').html(data.nickname);
	displayNotification(data.building_id, 'Now chatting as ' + data.nickname + '.', 'success');
});
//they didn't get the name they wanted
socket.on('nickname_denied', function(data){
	displayNotification(data.building_id, 'The nickname "' + data.nickname + '" is already taken.', 'error');
});
//delegates to ChatRoom.js
socket.on('user_in_building_nickname_updated', function(data){
	chat_rooms[data.building_id].nicknameChange(data.prev_nickname, data.new_nickname);
});
//delegates to ChatRoom.js and informs location_client to update the map
socket.on('user_nearby_nickname_updated', function(data){
	chat_rooms['nearby'].nicknameChange(data.prev_nickname, data.new_nickname);
	location_client.updateMarkerTitle(data.prev_nickname, data.new_nickname);
});
