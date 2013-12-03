socket.on('nickname_accepted', function(data){
	jQuery('#current_nickname').html(data.nickname);
	displayNotification('neutral', '<span style="font-weight: italic;">now chatting as ' + data.nickname + '.');
});
