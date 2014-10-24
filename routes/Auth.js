// This code was written by Jonathan Cooper-Ellis.

// This is the route to handle login attempts.
// It validates login credentials, assigns their user_id, and redirects to the chat page.
exports.login = function(db) {
	return function(req,res) {
		
		var email = req.body.email;
		var password = req.body.password;

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc){
			if (err) {
				console.log(err);
				res.render('home.ejs', {title: 'GEOCHAT', login_err: "ERROR: We had an issue with our database. Please try again.", reg_err: ''});
				return;
			}
			var user = doc[0];
			if (user === undefined) { // we queried the database for this email and found no match (not registered)
				//just make it
				usersCollection.insert({
					'email' : req.body.email,
					'password' : req.body.password,
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.send("VERIFICATION ERROR: We had an issue with our database. Please try again.");
						return;
					} else {
						console.log("setting user to doc");
						user = doc;
						req.session.user_id = user._id; // attach user ID from database to session (validated login)
						res.redirect('/chat'); // redirect to chat page
					}
				});	
			} else if (user.password !== password) { // supplied password does not match stored password
				res.render('home.ejs', {title: 'GEOCHAT', login_err: "LOGIN FAILED: Incorrect password.", reg_err: ''});
				return;
			} else {
				req.session.user_id = user._id; // attach user ID from database to session (validated login)
				res.redirect('/chat'); // redirect to chat page
			}
		});
	};
};

exports.userList = function(db){
	return function(req, res){
		db.get('users').find({}, function (err, docs){
			res.json(docs);
		});
	};
};

exports.logOut = function(req, res){
	req.session.user_id = null;
	res.redirect('/');
}
