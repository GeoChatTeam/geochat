var User = function(user_id, location, chat_styles, socket){
	this.user_id = user_id;
	this.location = location;
	this.socket = socket;
	
	this.chat_styles = chat_styles;
}

User.prototype.updateLocation = function(location){
	
}

User.prototype.addChatStyle = function(chat_styles){
	this.chat_styles[chat_style] = true;
}

User.prototype.removeChatStyle = function(chat_style){
	if(chat_style in this.chat_styles){
		delete this.chat_styles[chat_style];
	}
}

User.prototype.hasChatStyle = function(chat_style){
	return (chat_style in this.chat_styles);
}

User.prototype.
User.prototype.

module.exports = User;
