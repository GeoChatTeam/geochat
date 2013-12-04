var ChatRoom = function(chat_style, array_of_nicknames){
	this.inhabitants = {};
	this.chat_style = chat_style;
	this.pane_selector = 'chat-' + this.chat_style + ' .userList';

	for(var i = 0; i < array_of_nicknames.length; i++){
		this.inhabitants[array_of_nicknames[i]] = true;
	}
};

ChatRoom.prototype.drawPane = function(){
	jQuery(this.pane_selector).html('');
	for(var inhabitant in this.inhabitants){
		jQuery(this.pane_selector).append(inhabitant + '<br />');
	}
}

ChatRoom.prototype.enter = function(nickname){
	this.inhabitants[nickname] = true;
	displayNotification(this.chat_style, 'neutral', nickname + ' has entered the chat');
	this.drawPane();
}

ChatRoom.prototype.leave = function(nickname){
	delete this.inhabitants[nickname];
	displayNotification(this.chat_style, 'neutral', nickname + ' has left the chat');
	this.drawPane();
}

ChatRoom.prototype.nicknameChange = function(prev_nickname, new_nickname){
	delete this.inhabitants[prev_nickname];
	this.inhabitants[new_nickname] = true;
	displayNotification(this.chat_style, 'neutral', prev_nickname + ' is now known as ' + new_nickname);
	this.drawPane();
}
