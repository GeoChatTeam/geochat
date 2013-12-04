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

function scrollDown(selector){
  $(selector).stop().animate({
    scrollTop: $(selector)[0].scrollHeight
  }, 500);
}