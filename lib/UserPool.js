function UserPool(){
	this.users = {};
}

//user should have 4 attributes: user_id, location, socket, and chat_style
UserPool.prototype.add = function(user){
	var data = {location: user.location, socket: user.socket};
	data.chat_styles = {};
	for(var i = 0; i < user.chat_styles.length; i++){
		data.chat_styles[user.chat_styles[i]] = true;
	}
	//data.chat_styles is now an obj
	//if user.chat_styles was [0,1,2,7]
	//then data.chat_styles is {0: true, 1: true, 2: true, 7: true}
	//this allows for the fastest lookups and deletion
	this.users[user.user_id] = data;
};

UserPool.prototype.remove = function(user_id){
	if(user_id in this.users){
		delete this.users[user_id];	
	}
};

UserPool.prototype.updateLocation = function(user_id, location){
	this.users[user_id].location = location;
};

UserPool.prototype.addChatStyle = function(user_id, chat_style){
	this.users[user_id].chat_styles.push(chat_style);
};

UserPool.prototype.removeChatStyle = function(user_id, chat_style){
	if(chat_style in this.users[user_id].chat_styles){
		delete this.users[user_id].chat_styles[chat_style];
	}
};

UserPool.prototype.eachUser = function(callback) {
	for(var user_id in this.users){
		callback(this.users[user_id]);
	}
};

module.exports = UserPool;
