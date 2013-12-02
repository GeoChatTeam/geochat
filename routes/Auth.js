exports.login = function(db) {
	return function(req,res) {
		
		var email = req.body.email;
		var password = req.body.password;
		console.log(password);

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc){
			if (err) {
				console.log(err);
				res.render('home.ejs', {title: 'GEOCHAT', err: "ERROR: We had an issue with our database. Please try again."});
				return;
			}
			if (doc[0] === undefined) { // we queried the database for this email and found no match (not registered)
			res.render('home.ejs', {title: 'GEOCHAT', err: "LOGIN FAILED: Email not found."});
				return;
			}
			if (doc[0].password !== password) { // supplied password does not match stored password
				res.render('home.ejs', {title: 'GEOCHAT', err: "LOGIN FAILED: Incorrect password."});
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
		console.log(password + ' ' + password2);

		if (password !== password2) { // supplied passwords do not match
			res.render('home.ejs', {title: 'GEOCHAT', err: "REGISTRATION FAILED: Passwords do not match. Please try again."});
			return;
		}

		if (password.length < 6) { // password is too short
			res.render('home.ejs', {title: 'GEOCHAT', err: "REGISTRATION FAILED: Password must be at least 6 characters. Please try again."});
			return;
		}

		var umassEmailPattern = new RegExp('.*@umass.edu'); 
		if (!umassEmailPattern.test(email)) { // email address does not end in @umass.edu
			res.render('home.ejs', {title: 'GEOCHAT', err: "REGISTRATION FAILED: Only UMASS email addresses are accepted."});
			return;
		}

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc) {
			if (err) {
				console.log(err);
				res.render('home.ejs', {title: 'GEOCHAT', err: "ERROR: We had an issue with our database. Please try again."});
				return;
			}
			if (doc[0] !== undefined) { // we queried the database for this email and found a match (already registered)
				res.render('home.ejs', {title: 'GEOCHAT', err: "REGISTRATION FAILED: Requested email is already registered."});
				return;
			} else {
				// Insert new user into the database. (how do we want to be assigning IDs?)
				usersCollection.insert({
					'email' : email,
					'password' : password,
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.render('home.ejs', {title: 'GEOCHAT', err: "ERROR: We had an issue with our database. Please try again."});
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
