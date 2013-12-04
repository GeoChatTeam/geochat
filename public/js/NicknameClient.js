function updateNickname(nickname){
	socket.emit('update_nickname', {nickname: nickname});
}

socket.on('nickname_granted', function(data){
	jQuery('#current_nickname').html(data.nickname);
	displayNotification(data.building_id, 'Now chatting as ' + data.nickname + '.', 'success');
});

socket.on('nickname_denied', function(data){
	displayNotification(data.building_id, 'The nickname "' + data.nickname + '" is already taken.', 'error');
});

socket.on('user_in_building_nickname_updated', function(data){
	chat_rooms[data.building_id].nicknameChange(data.prev_nickname, data.new_nickname);
});

socket.on('user_nearby_nickname_updated', function(data){
	chat_rooms['nearby'].nicknameChange(data.prev_nickname, data.new_nickname);
});
