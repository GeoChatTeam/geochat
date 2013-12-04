function createBuilding(building_hash){
	this.name = building_hash['name'];
	this.location = {latitude: building_hash['latitude'], longitude: building_hash['longitude']};
}

module.exports.createAll = function(){
	var buildings = [];
	
	require('../data/buildings').forEach(function(building_hash){
		buildings.push(createBuilding(building_hash));	
	});
	
	return buildings;
};

