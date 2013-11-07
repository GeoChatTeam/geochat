exports.index = function(req, res){
	res.render('home.ejs', {title: 'geochat'});
};
exports.chat=function(req,res){
    res.render('chat.ejs',{title:'geochat'});
}