function displayNotification(type, message){
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
	
	jQuery('#chat').append('<span style="' + styles[type] +'">' + message + '</span><br />');
}

socket.on('notification', function(data){
	displayNotification(data.type, data.message);
});
