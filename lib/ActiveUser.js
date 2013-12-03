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

ActiveUser.prototype.sendMessage = function(message, sender, type){
	this.socket.emit('message', {message: message, nickname: sender.nickname, type: type});
}

ActiveUser.prototype.sendNotification = function(type, message){
	this.socket.emit('notification', {type: type, message: message});
}

ActiveUser.prototype.getNickname = function(){
	return this.nickname;
}

ActiveUser.prototype.updateNickname = function(nickname){
	this.nickname = nickname;
	this.socket.emit('nickname_accepted', {new_nickname: nickname});
}

ActiveUser.prototype.getLatitude = function(){
	if(this.location) return this.location.latitude;
};

ActiveUser.prototype.getLongitude = function(){
	if(this.location) return this.location.longitude;
};

ActiveUser.prototype.to_s = function(){
	var result = "{ ";
	result += "user_id: " + this.user_id + ", ";
	result += "location: " + this.location + ", ";
	result += "socket: " + this.socket + ", ";
	result += "nickname: " + this.nickname + ", ";
	result += "chat_styles: " + JSON.stringify(this.chat_styles) + " }"
	return result;
}

module.exports = ActiveUser;
