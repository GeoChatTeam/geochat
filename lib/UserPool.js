function UserPool(){
	this.users = {};
}

//user should have 5 attributes: user_id, location, socket, and chat_style, nickname
UserPool.prototype.add = function(user){
	this.users[user.user_id] = user;
};

UserPool.prototype.remove = function(user_id){
	if(user_id in this.users){
		delete this.users[user_id];	
	}
};

UserPool.prototype.find_by_user_id = function(user_id){
    if(user_id in this.users){
        return this.users[user_id];
    }
    else{
        return null;
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

UserPool.prototype.eachUser = function(fn) {
	for(var user_id in this.users){
		fn(this.users[user_id]);
	}
};

UserPool.prototype.nicknameUnique = function(nickname){
  var nicknameFound = false;
  this.eachUser(function(user){
    if(user.getNickname() === nickname){
      nicknameFound = true;
    }
  });
  return !nicknameFound;
};

UserPool.prototype.to_s = function(){
	var result = "";
	for(var user_id in this.users){
		result += this.users[user_id].to_s() + "\n";
	}
	return result;
}

module.exports = UserPool;
