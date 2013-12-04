function displayNotification(chat_style, message, type){
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
	var str = '<span style="'+ styles[type] +'">' + message + '</span><br />';
	jQuery('tabs-' + chat_style + ' .message').append(str);
}
