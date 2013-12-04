function displayNotification(type, message){
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
}

socket.on('notification', function(data){
	displayNotification(data.type, data.message);
});
