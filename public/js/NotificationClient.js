function displayNotification(type, message){
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
	
	jQuery('#chat-none').append('<span style="' + styles[type] +'">' + message + '</span><br />');
	var objDiv = document.getElementById("tabs");
	objDiv.scrollTop = objDiv.scrollHeight;
}

socket.on('notification', function(data){
	displayNotification(data.type, data.message);
});
