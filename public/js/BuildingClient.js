function joinBuildingChat(building_id){
	socket.emit('join_building', {building_id: building_id});
}

function leaveBuildingChat(building_id){
	socket.emit('leave_building', {building_id: building_id});
}
