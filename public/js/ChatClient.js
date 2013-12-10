// handling sending a nearby message to all
jQuery(document).on('submit', 'form.textEntry', function(e){
    //gets either 'nearby' or the building_id
    var chat_style = jQuery(this).data('id');
    var field = jQuery(this).find("input[type='text']");
    var message = field.val();
    field.val('');
    field.focus();

	if(message === ""){
		return false;
	}
	//check if the message is a nickname command
	//aka /nick anything_wordy
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
	displayMessage('nearby', data.nickname, data.message);
});

socket.on('receive_building_message', function(data){
	displayMessage(data.building_id, data.nickname, data.message);
});

//an important step in displayMessage is taking data.message and wrapping it in a text node. this prevents user input from being treated as html or script.
//note it's not necessary to treat nickname as text because a nickname needs to match the regex \w+
function displayMessage(chat_style, nickname, message){
	var display = jQuery('#tabs-'+chat_style+' .chat');
	display.append('<span title="'+timeStamp()+'" style="color:red;">' + nickname + '</span>: ');
	display.append(document.createTextNode(message));
	display.append('<br />');
	scrollDown('#tabs-'+chat_style+' .chat');
}
//alert the whisper. this is temporary.
socket.on('receive_whisper_message', function(data){
	var str = '(private message)' + data.nickname + ': ' + data.message;
	alert(str);
});

//the prompt is also temporary
jQuery(document).on('click', '.userList span', function(e){
	var nickname = jQuery(this).html();
	var message = prompt('What would you like to whisper to '+nickname+'?');
	socket.emit('send_whisper_message', {receiver_nickname: nickname, message: message});
});

//used as hover-over for messages
function timeStamp(){
  var time = new Date();
  return '(' + time.toLocaleTimeString() + ')';
}
