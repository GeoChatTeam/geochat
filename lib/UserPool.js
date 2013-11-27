users = {};

exports.eachUser = function(callback) {
	for(var user_id in users){
		callback(users[user_id]);
	}
}

exports.add = function(user){
	users[user.user_id] = {location: user.location, chat_styles: user.chat_styles, socket: user.socket};
}

exports.remove = function(id){
	delete users[id];
}
