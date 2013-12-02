var Mailman = function(user_pool, users){
    this.user_pool = user_pool;
    this.users = users;
};

Mailman.prototype.handleMessageReceived = function(user_id, chat_style, receiver_id, message){
    var sender = this.user_pool.find_by_user_id(user_id);

    if(receiver_id === undefined || receiver_id === null){
        console.log(chat_style + " message received from, " + sender.user_id + ", with message: " + message);
    } else {
        console.log(chat_style + " message received from, " + sender.user_id + ", with message: " + message + " to user with ID: " + receiver_id);
    }

    this.user_pool.eachUser(function(user){
		if(user.user_id === user_id){return;}
		
		if(true){ //here you can filter out users based on chat_style
			user.sendMessage(message);
		}
	});   
};

module.exports = Mailman;
