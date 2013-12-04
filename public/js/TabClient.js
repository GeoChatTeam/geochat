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
