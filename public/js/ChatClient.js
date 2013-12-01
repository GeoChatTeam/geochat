//responsible for sending and receiving messages.

// SENDING

//message types: whisper, nearby, building
// if whisper then receiver_id must be a user_id
// if nearby or building then receiver_id is null
function sendMessage(message, chat_style, receiver_id){
    if(socket === undefined || socket === null){
        console.log("no socket connection!");
        return;
    }

    socket.emit('message', {chat_style: chat_style, receiver_id: receiver_id, message: message});
}

// handling sending a nearby, broadcast message to all withhin range
jQuery(document).on('submit', '#chat_form', function(e){
    var field = jQuery(this).find("input[type='text']");
    var message = field.val();
    field.val(''); //clear the field
    field.focus();

    sendMessage(message, 'nearby', null);

    return false;
});

// RECEIVING

// when we receive a message from the server
socket.on('message', function (data) {
    console.log('received message: ' + data);
});
