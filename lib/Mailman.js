var Mailman = function(user_pool, buildings, RANGE){
    this.user_pool = user_pool;
    this.buildings = buildings;
    this.RANGE = RANGE;
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
	
	this.user_pool.eachUser(function(potential_receiver){
		if(potential_receiver.isWithinRange(sender, this.RANGE)){
			deliver_nearby_message(potential_receiver, sender, message);
		}
	});
};

Mailman.prototype.handle_building_message = function(sender_id, message, building_id){
	var sender = this.user_pool.find_by_user_id(sender_id);
	
	this.buildings[building_id].eachUser(function(receiver){
		deliver_building_message(receiver, sender, message);
	});
};

Mailman.prototype.handle_whisper_message = function(sender_id, message, receiver_id){
	var sender = this.user_pool.find_by_user_id(sender_id);
	
	deliver_whisper_message(this.user_pool.find_by_user_id(receiver_id), this.user_pool.find_by_user_id(sender_id), message);
};

module.exports = Mailman;
