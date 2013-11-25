$(document).ready(function(){
	$.ajax({
		url: 'UserPool/connect',
		type: 'POST'
	});
});

$(window).unload(function(){
	$.ajax({
		url: 'UserPool/disconnect',
		type: 'POST'
	});
});
