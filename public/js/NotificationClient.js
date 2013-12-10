//a convenience function for showing a notification on a chat screen.
//you can give a message type of success, error, or neutral which styles the notification
//repeats a lot of the code that displayMessage does, might extract that.
function displayNotification(chat_style, message, type){
	var styles = {
		success: "color: green; font-weight: italic;", 
		error: "color: red; font-weight: italic;", 
		neutral: "font-weight: bold;"
	};
	var str = '<span title="'+timeStamp()+'" style="'+ styles[type] +'">' + message + '</span><br />';
	jQuery('#tabs-' + chat_style + ' .chat').append(str);
	scrollDown('#tabs-' + chat_style + ' .chat');
}

//is a jquery animation to scroll the chat screen down. it's really smooth.
function scrollDown(selector){
  $(selector).stop().animate({
    scrollTop: $(selector)[0].scrollHeight
  }, 500);
}
