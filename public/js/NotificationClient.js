function displayNotification(chat_style, message, type){
	debugger;
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
	var str = '<span style="'+ styles[type] +'">' + message + '</span><br />';
	jQuery('#tabs-' + chat_style + ' .chat').append(str);
}
