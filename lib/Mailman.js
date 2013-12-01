var Mailman = function(user_pool, users){
    this.user_pool = user_pool;
    this.users = users;
}

Mailman.prototype.handleMessageReceived = function(user_id, chat_style, receiver_id, message){
    var sender = this.user_pool.find_by_user_id(user_id)

    if(receiver_id === undefined || receiver_id === null){
        console.log(chat_style + " message received from, " + sender.user_id + ", with message: " + message)
    }
    else{
        console.log(chat_style + " message received from, " + sender.user_id + ", with message: " + message + " to user with ID: " + receiver_id)
    }

    var active_users = this.user_pool.users;

    for(var active_user in active_users){
        active_users[active_user].socket.emit('message', {message: message})
    }
}

module.exports = Mailman;