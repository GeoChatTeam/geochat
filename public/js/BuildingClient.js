//responsible for telling the server when a user enters and exits a building.

function getAllBuildings(){
	//ajax to get all buildings
}

function joinBuildingChat(building_id, building_name){
	socket.emit('join_chatroom', {chat_style: building_id});
	makeTab(building_id, building_name);
	
}

function leaveBuildingChat(building_id){
	//ajax to tell server that we've exited that building's chat.
}

jQuery(document).on('click', '#roomList li', function(e){
	joinBuildingChat(jQuery(this).data('id'), jQuery(this).data('name'));
});
