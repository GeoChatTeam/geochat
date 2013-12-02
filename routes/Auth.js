exports.login = function(db) {
	return function(req,res) {
		
		var email = req.body.email;
		var password = req.body.password;

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc){
			if (err) {
				console.log(err);
				res.send("Database error.");
				return;
			}
			if (doc[0] === undefined) { // we queried the database for this email and found no match (not registered)
				res.send("The requested email address is not yet registered.");
				return;
			}
			if (doc[0].password !== password) { // supplied password does not match stored password
				res.send("Incorrect password.");
				return;
			}
			req.session.user_id = doc[0]._id; // attach user ID from database to session (validated login)
			res.redirect('/chat'); // redirect to chat page
		});
	}
}

exports.register = function(db) {
	return function(req,res) {

		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;

		if (password !== password2) { // supplied passwords do not match
			res.send("Passwords entered do not match.");
			return;
		}

		if (password.length < 6) { // password is too short
			res.send("Password must be at least 6 characters.");
			return;
		}

		var umassEmailPattern = new RegExp('.*@umass.edu'); 
		if (!umassEmailPattern.test(email)) { // email address does not end in @umass.edu
			res.send("Does not appear to be a valid UMASS email address.");
			return;
		}

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc) {
			if (err) {
				console.log(err);
				res.send("Database error.");
				return;
			}
			if (doc[0] !== undefined) { // we queried the database for this email and found a match (already registered)
				res.send("The requested email address is already registered.");
				return;
			} else {
				// Insert new user into the database. (how do we want to be assigning IDs?)
				usersCollection.insert({
					'email' : email,
					'password' : password,
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.send("Error adding user to the database.");
						return;
					} else {
						req.session.user_id = doc._id; // attach user ID to session (validated login)
						res.redirect('/chat'); // redirect to chat page
					}
				});	
			}
		});
	}
}
