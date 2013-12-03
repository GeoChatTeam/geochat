//responsible for telling the server when a user enters and exits a building.

function getAllBuildings(){
	//ajax to get all buildings
}

function joinBuildingChat(building_id){
	//make ajax to tell server that we've entered the building chat.
}

function leaveBuildingChat(building_id){
	//ajax to tell server that we've exited that building's chat.
}

jQuery(document).ready(function(){
    bindClickEventsToBuildingListElements();
});

function bindClickEventsToBuildingListElements(){
    jQuery('#roomList > ul > li').each(function() {
            jQuery(this).unbind('click');
            jQuery(this).click(function(){
             //   jQuery('#tab_list').append("<li><a href=\"#tabs-" + jQuery(this).data('id') + "\">" + jQuery(this).data('name') + "</a></li>");
        })
    });
}