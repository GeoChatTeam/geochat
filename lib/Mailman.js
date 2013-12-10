//Author: Andrew Penniman
var Mailman = function(user_pool, buildings, RANGE){
    this.user_pool = user_pool;
    this.buildings = buildings;
};


Mailman.prototype.deliver_nearby_message = function(receiver, sender, message){
	receiver.socket.emit('receive_nearby_message', {nickname: sender.nickname, message: message});
};

Mailman.prototype.deliver_building_message = function(receiver, sender, message, building_id){
	receiver.socket.emit('receive_building_message', {nickname: sender.nickname, message: message, building_id: building_id});
};

Mailman.prototype.deliver_whisper_message = function(receiver, sender, message){
	receiver.socket.emit('receive_whisper_message', {nickname: sender.nickname, message: message});
};

Mailman.prototype.handle_nearby_message = function(sender_id, message){
	var sender = this.user_pool.find_by_user_id(sender_id);
	
	var that = this;
	
	this.user_pool.users_in_range(sender).forEach(function(receiver){
		that.deliver_nearby_message(receiver, sender, message);
	});
};

Mailman.prototype.handle_building_message = function(sender_id, message, building_id){
	var sender = this.user_pool.find_by_user_id(sender_id);
	
	var that = this;
	
	this.buildings[building_id].eachUser(function(receiver){
		that.deliver_building_message(receiver, sender, message, building_id);
	});
};

Mailman.prototype.handle_whisper_message = function(sender_id, message, receiver_nickname){
	this.deliver_whisper_message(this.user_pool.find_by_nickname(receiver_nickname), this.user_pool.find_by_user_id(sender_id), message);
};

module.exports = Mailman;
