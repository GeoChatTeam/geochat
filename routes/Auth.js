exports.login = function(req,res){
	req.session.user_id = 6;
	res.redirect('/chat');
}

exports.register = function(req,res){
	//create user in db
}
