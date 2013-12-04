// SENDING

// handling sending a nearby message to all
jQuery(document).on('submit', 'form.textEntry', function(e){
    var chat_style = jQuery(this).find("input[type='hidden']").val();
    var field = jQuery(this).find("input[type='text']");
    var message = field.val();
    field.val('');
    field.focus();

	handleMessage(chat_style, message);
	
	e.preventDefault(); //stop from submitting
});

//message: String
//chat_style: 'whisper', 'nearby', 'building'
//reciever_id:
// if chat_style === 'whisper' then must be a user_id
// else then null
function handleMessage(chat_style, message){		
	//check if the message is a nickname command
	var nicknameCommandRegEx = /^\/nick (\w+)/;
	var matches = nicknameCommandRegEx.exec(message);
	
	if(matches){
		socket.emit('nickname_update', {nickname: matches[1]});
	} else {
		socket.emit('message', {chat_style: chat_style, receiver_id: receiver_id, message: message});
	}
}

//RECEIVING

socket.on('message', function (data) {
	displayMessage(data.nickname, data.message, data.type);
});

function displayMessage(nickname, message, type){
	if(type === 'whisper'){
		alert('User with nickname ' + nickname + ' sent you a message: ' + message);
	}
		
	//createTextNode is used so that whatever the user had input is treated as text and not markup
	jQuery('#chat-none').append('<span style="font-weight: bold; color: red;">' + nickname + '</span>: ');
	jQuery('#chat-none').append(document.createTextNode(message))
	jQuery('#chat-none').append('<br />');
	var objDiv = document.getElementById("tabs");
	objDiv.scrollTop = objDiv.scrollHeight;
}


