function makeTab(id,name){
    $.ajax({
        url: ('/tab/' + id),
        dataType: 'html',
        success: function(data){
            jQuery('#tabs').append(data);
            jQuery('#tab_list').append('<li><a href="#tabs-'+id+'">'+name+'</a></li>');
            $('#tabs').tabs('refresh');
        }
    })
}

jQuery(document).on('click', '#roomList li', function(e){
	joinBuildingChat(jQuery(this).data('id'));
	makeTab(jQuery(this).data('id'), jQuery(this).data('name'));
	jQuery(this).hide();
});
