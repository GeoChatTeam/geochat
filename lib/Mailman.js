var buildings = require('../data/buildings.json');

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
		//do not search the sender out of this, they should receive the message too.	
		if(true){ //here you can filter out users based on chat_style
			user.sendMessage(message, sender);
		}
	});
};

module.exports = Mailman;
