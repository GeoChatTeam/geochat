exports.index = function(req, res){
	res.render('home.ejs', {title: 'geochat'});
};

exports.chat=function(req,res){
	if(!req.session.user_id){
		res.redirect('/');
	} else {
		res.render('chat.ejs');
	}
}

