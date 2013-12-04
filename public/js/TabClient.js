function makeTab(name){
    $.ajax({
        url: ('/tab/' + name),
        dataType: 'html',
        success: function(data){
            jQuery('#tabs').append(data);
        }
    })
}