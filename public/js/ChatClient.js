//responsible for sending and receiving messages.

// SENDING

//message: String
//chat_style: 'whisper', 'nearby', 'building'
//reciever_id:
// if chat_style === 'whisper' then must be a user_id
// else then null
function sendMessage(message, chat_style, receiver_id){
    if(socket === undefined || socket === null){
        console.log("no socket connection!");
        return;
    }

    socket.emit('message', {chat_style: chat_style, receiver_id: receiver_id, message: message});
}

function handleMessage(message){		
	//check if the message is a nickname command
	var nicknameCommandRegEx = /^\/nick (\w+)/;
	var matches = nicknameCommandRegEx.exec(message);
	
	if(matches){
		socket.emit('nickname_update', {nickname: matches[1]});
	} else {
		sendMessage(message, 'nearby', null);	
	}
}

function displayMessage(from, message, type){
	if(type === 'whisper'){
		
	}
	
	//this #chat will be dynamic eventually...
	jQuery('#chat').append('<span style="font-weight: bold; color: red;">' + from + '</span>: ' + message + '<br />');
}

// handling sending a nearby message to all
jQuery(document).on('submit', 'form#textEntry', function(e){
    var field = jQuery(this).find("input[type='text']");
    var message = field.val();
    field.val('');
    field.focus();

	handleMessage(message);
	
	e.preventDefault();
});

// when we receive a message from the server
socket.on('message', function (data) {
	displayMessage(data.nickname, data.message, data.type);
});


