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
        }
    })
}
function removeTab(id){
    jQuery("#tabs-"+id).remove();
    jQuery("#link-"+id).remove();
    $('#tabs').tabs('refresh');
}

jQuery(document).on('click', '#roomList li', function(e){
	joinBuildingChat(jQuery(this).data('id'));
	makeTab(jQuery(this).data('id'), jQuery(this).data('name'));
	jQuery(this).hide();
});
