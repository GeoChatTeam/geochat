socket.on('nickname_accepted', function(data){
	jQuery('#current_nickname').html(data.new_nickname);
	displayNotification('neutral', '<span style="font-weight: italic;">now chatting as ' + data.new_nickname + '.');
});
