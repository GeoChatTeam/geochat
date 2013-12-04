var ActiveUser = function(id, socket){
	this.id = id;
	this.socket = socket;
	this.nickname = 'user-' + this.id;
	this.chat_styles = {};
};

ActiveUser.prototype.addChatStyle = function(chat_styles){
	this.chat_styles[chat_style] = true;
};

ActiveUser.prototype.removeChatStyle = function(chat_style){
	delete this.chat_styles[chat_style];
};

ActiveUser.prototype.hasChatStyle = function(chat_style){
	return (chat_style in this.chat_styles);
};

ActiveUser.prototype.sendNotification = function(type, message){
	this.socket.emit('receive_notification', {type: type, message: message});
};

ActiveUser.prototype.getLatitude = function(){
	if(this.location) return this.location.latitude;
};

ActiveUser.prototype.getLongitude = function(){
	if(this.location) return this.location.longitude;
};

// location stuff

var geolib = require('geolib');

ActiveUser.prototype.isWithinRange = function(other_user, range){
	geolib.isPointInCircle(
		{latitude: this.getLatitude(), longitude: this.getLongitude()},
		{latitude: other_user.getLatitude(), longitude: other_user.getLongitude()},
		range
	);
};

ActiveUser.prototype.to_s = function(){
	var result = "{ ";
	result += "id: " + this.id + ", ";
	result += "location: " + this.location + ", ";
	result += "socket: " + this.socket + ", ";
	result += "nickname: " + this.nickname + ", ";
	result += "chat_styles: " + JSON.stringify(this.chat_styles) + " }";
	return result;
};

module.exports = ActiveUser;
