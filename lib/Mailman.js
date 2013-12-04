var buildings = require('../data/buildings.json');

var geolib = require('geolib');

function isWithinRange(user1, user2, radius){
	geolib.isPointInCircle(
		{latitude: user1.getLatitude(), longitude: user1.getLongitude()},
		{latitude: user2.getLatitude(), longitude: user2.getLongitude()},
		radius
	);
}

var Mailman = function(user_pool, users){
    this.user_pool = user_pool;
    this.users = users;
};


Mailman.prototype.sendMessage = function(receiver, sender, message, type){
	this.socket.emit('message', {message: message, nickname: sender.nickname, type: type});
};

Mailman.prototype.handleMessageReceived = function(user_id, chat_style, receiver_id, message){
    var sender = this.user_pool.find_by_user_id(user_id);

    if(chat_style === 'whisper'){
         var receiver = this.user_pool.find_by_user_id(receiver_id);
         
         if(receiver !== null){
              sendMessage(receiver, sender, message, 'whisper');	
         }
    }
	else{
		this.user_pool.eachUser(function(potential_receiver){
			if(chat_style === 'nearby'){
				if(true || isWithinRange(sender, potential_receiver, 400)){
					console.log('sent \"' + message + '\" to user: ' + potential_receiver.nickname); // remove
					sendMessage(receiver, sender, message, 'nearby');
				}
			}
			else if(potential_receiver.hasChatStyle(chat_style)){
				if(true || isWithinRange(sender, potential_receiver, 400)){
					console.log('sent \"' + message + '\" to user: ' + potential_receiver.nickname); // remove
					sendMessage(receiver, sender, message, chat_style);
				}
			}
		});
	}
};

module.exports = Mailman;
