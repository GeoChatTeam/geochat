//chat room represents the people in a room, and is used for displaying that list.
//chat_style can be nearby, or a number representing a building_id
//the array of nicknames are the inhabitants of the room when the user joins the chat room
//inhabitants are kept as an object instead of an array for constant time deletion
var ChatRoom = function(chat_style, array_of_nicknames){
	this.inhabitants = {};
	this.chat_style = chat_style;
	this.user_list_selector = '#tabs-' + this.chat_style + ' .userList';

	for(var i = 0; i < array_of_nicknames.length; i++){
		this.inhabitants[array_of_nicknames[i]] = true;
	}
	this.drawUserList();
};

//loops through the inhabitants of the chatroom and lists them.
//this method gets called every time one of the below three methods are called.
ChatRoom.prototype.drawUserList = function(){
	jQuery(this.user_list_selector).html('');
	for(var inhabitant in this.inhabitants){
		jQuery(this.user_list_selector).append('<span>'+inhabitant+'</span><br />');
	}
}

ChatRoom.prototype.user_entered = function(nickname){
	this.inhabitants[nickname] = true;
	displayNotification(this.chat_style, nickname + ' has entered the chat', 'neutral');
	this.drawUserList();
}

ChatRoom.prototype.user_left = function(nickname){
	delete this.inhabitants[nickname];
	displayNotification(this.chat_style, nickname + ' has left the chat', 'neutral');
	this.drawUserList();
}

ChatRoom.prototype.nicknameChange = function(prev_nickname, new_nickname){
	delete this.inhabitants[prev_nickname];
	this.inhabitants[new_nickname] = true;
	displayNotification(this.chat_style, prev_nickname + ' is now known as ' + new_nickname, 'neutral');
	this.drawUserList();
}
