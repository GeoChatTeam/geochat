module.exports.createAll = function(){
	var buildings = [];
	
	require('../data/buildings').forEach(function(building_hash){
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
	this.users[user.id] = true;
};

Building.prototype.remove_user = function(user){
	delete this.users[user.id];
};