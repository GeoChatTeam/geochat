var users = 1;
exports.login = function(req,res){
	req.session.user_id = users;
	users++;
	res.redirect('/chat');
}

exports.register = function(req,res){
	//create user in db
}
