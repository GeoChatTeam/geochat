// handling sending a nearby message to all
jQuery(document).on('submit', 'form.textEntry', function(e){
    var chat_style = jQuery(this).data('id');
    var field = jQuery(this).find("input[type='text']");
    var message = field.val();
    field.val('');
    field.focus();

	//check if the message is a nickname command
	var nicknameCommandRegEx = /^\/nick (\w+)/;
	var matches = nicknameCommandRegEx.exec(message);
	
	if(matches){
		updateNickname(matches[1], chat_style);
	} else if(chat_style === 'nearby') {
		sendNearbyMessage(message);
	} else {
		sendBuildingMessage(chat_style, message);
	}
	
	e.preventDefault(); //stop from submitting
});

function sendNearbyMessage(message){
	socket.emit('send_nearby_message', {message: message});
}

function sendBuildingMessage(building_id, message){
	socket.emit('send_building_message', {building_id: building_id, message: message});
}


socket.on('receive_nearby_message', function(data){
	var display = jQuery('#tabs-nearby .chat');
	display.append('<span title="'+timeStamp()+'" style="color:red;">' + data.nickname + '</span>: ');
	display.append(document.createTextNode(data.message));
	display.append('<br />');
  scrollDown('#tabs-nearby .chat');
});

socket.on('receive_building_message', function(data){
	var display = jQuery('#tabs-' + data.building_id + ' .chat');
	display.append('<span title="'+timeStamp()+'" style="color:red;">' + data.nickname + '</span>: ');
	display.append(document.createTextNode(data.message));
	display.append('<br />');
  scrollDown('#tabs-nearby .chat');
});

socket.on('receive_whisper_message', function(data){
	var str = '(private message)' + data.nickname + ': ' + data.message;
	alert(str);
});

jQuery(document).on('click', '.userList span', function(e){
	var nickname = jQuery(this).html();
	var message = prompt('What would you like to whisper to '+nickname+'?');
	socket.emit('send_whisper_message', {receiver_nickname: nickname, message: message});
});

function timeStamp(){
  var time = new Date();
  return '(' + time.toLocaleTimeString() + ')';
}