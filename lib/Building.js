module.exports.createAll = function(){
	var buildings = [];
	
	require('../data/buildings_complete').forEach(function(building_hash){
		buildings.push(new Building(building_hash));	
	});
	
	return buildings;
};

var Building = function(building_hash){
	this.name = building_hash['name'];
	this.location = {latitude: building_hash['latitude'], longitude: building_hash['longitude']};
	this.users = {};
};

Building.prototype.add_user = function(user){
	this.users[user.id] = user;
};

Building.prototype.remove_user = function(user){
	delete this.users[user.id];
};

Building.prototype.eachUser = function(fn){
	for(var user in this.users){
		fn(this.users[user]);
	}
}