function makeTab(id,name){
    $.ajax({
        url: ('/tab/' + id),
        dataType: 'html',
        success: function(data){
            if(jQuery('#tabs-'+id).length!=0){
                return;
            }
            jQuery('#tabs').append(data);
            jQuery('#tab_list').append('<li id="link-'+id+'"><a href="#tabs-'+id+'">'+name+'<button style="width: 20px; height: 20px; line-height: 0;padding: 2" class="close" data-id="'+id+'">X</button></a></li>');
            $('#tabs').tabs('refresh');
            joinBuildingChat(id);
        }
    })
}
function removeTab(id){
    jQuery("#tabs-"+id).remove();
    jQuery("#link-"+id).remove();
    $('#tabs').tabs('refresh');
}

jQuery(document).on('click', '#roomList li', function(e){
	var building_id = jQuery(this).data('id');
	var building_name = jQuery(this).data('name');
	makeTab(building_id, building_name);
	jQuery(this).hide();
});

jQuery(document).on('click','.close',function(){
	var building_id = jQuery(this).data("id");
	removeTab(building_id);
	jQuery('#roomList li[data-id="'+ building_id+'"]').show();
	leaveBuildingChat(building_id);
});
