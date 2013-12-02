socket.on('nickname_update', function(data){
	jQuery('#current_nickname').html(data.nickname);
	jQuery('#chat').append('<span style="font-weight: italic;">now chatting as ' + data.nickname + '.')
});
