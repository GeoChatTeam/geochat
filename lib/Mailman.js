var buildings = require('../data/buildings.json');

function distance(user1, user2){
	Number.prototype.toRad = function() {
	   return this * Math.PI / 180;
	}

	var lat1 = user1.getLatitude(); 
	var lon1 = user1.getLongitude(); 
	var lat2 = user2.getLatitude(); 
	var lon2 = user2.getLongitude(); 


	var R = 6371; // radius of earth km 
	
	//has a problem with the .toRad() method below.
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
					Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 

	return d*1000; //distance in meters.
}

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
		//if(distance(sender, user) <= 400){
		if(true){ //here you can filter out users based on chat_style
			user.sendMessage(message, sender);
		}
	});
};

module.exports = Mailman;
