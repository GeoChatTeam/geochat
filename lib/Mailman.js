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

Mailman.prototype.handleMessageReceived = function(user_id, chat_style, receiver_id, message){
    var sender = this.user_pool.find_by_user_id(user_id);

    if(chat_style === 'whisper'){
         var receiver = this.user_pool.find_by_user_id(receiver_id);
         
         if(receiver !== null){
              receiver.sendMessage(message, sender, 'whisper');	
         }
    }
		else{
			this.user_pool.eachUser(function(user){
				if(chat_style === 'nearby' || user.hasChatStyle(chat_style)){
					//do not search the sender out of this, they should receive the message too.	
					if(isWithinRange(sender, user, 400)){
						console.log('sent \"' + message + '\" to user: ' + user.nickname); // remove
						user.sendMessage(message, sender, 'nearby');
					}
				}
			});
		}
};

module.exports = Mailman;
