var ActiveUser = function(user_id, location, chat_styles, nickname, socket){
	this.user_id = user_id;
	this.location = location;
	this.socket = socket;
	this.nickname = nickname;
	
	this.chat_styles = {};
	for(var i = 0; i < chat_styles.length; i++){
		this.chat_styles[chat_styles[i]] = true;
	}
	//if chat_styles was [0,1,2,7]
	//then this.chat_styles is {0: true, 1: true, 2: true, 7: true}
	//this allows for the fastest lookups and deletion
}

ActiveUser.prototype.updateLocation = function(location){
	this.location = location;
}

ActiveUser.prototype.addChatStyle = function(chat_styles){
	this.chat_styles[chat_style] = true;
}

ActiveUser.prototype.removeChatStyle = function(chat_style){
	if(chat_style in this.chat_styles){
		delete this.chat_styles[chat_style];
	}
}

ActiveUser.prototype.hasChatStyle = function(chat_style){
	return (chat_style in this.chat_styles);
}

ActiveUser.prototype.sendMessage = function(message){
	this.socket.emit('message', {message: message});
}

ActiveUser.prototype.getNickname = function(){
  return this.nickname;
}

ActiveUser.prototype.updateNickname = function(nickname){
  this.nickname = nickname;
}

module.exports = ActiveUser;
