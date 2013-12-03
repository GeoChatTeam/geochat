exports.login = function(db) {
	return function(req,res) {
		
		var email = req.body.email;
		var password = req.body.password;

		var validUmassEmailPattern = /^\w+@umass.edu$/;
		if(!validUmassEmailPattern.test(email)) { // email address is either malformed or not a a UMASS address
			res.render('home.ejs', {title: 'GEOCHAT', login_err: "LOGIN FAILED: Please enter a valid, UMASS email address.", reg_err: ''});
			return;
		}

		var usersCollection = db.get('users');

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc){
			if (err) {
				console.log(err);
				res.render('home.ejs', {title: 'GEOCHAT', login_err: "ERROR: We had an issue with our database. Please try again.", reg_err: ''});
				return;
			}
			if (doc[0] === undefined) { // we queried the database for this email and found no match (not registered)
			res.render('home.ejs', {title: 'GEOCHAT', login_err: "LOGIN FAILED: Email not found.", reg_err: ''});
				return;
			}
			if (doc[0].password !== password) { // supplied password does not match stored password
				res.render('home.ejs', {title: 'GEOCHAT', login_err: "LOGIN FAILED: Incorrect password.", reg_err: ''});
				return;
			}
			req.session.user_id = doc[0]._id; // attach user ID from database to session (validated login)
			res.redirect('/chat'); // redirect to chat page
		});
	};
};

exports.register = function(db, mail) {
	return function(req,res) {

		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;

		if (password !== password2) { // supplied passwords do not match
			res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "REGISTRATION FAILED: Passwords do not match. Please try again."});
			return;
		}

		if (password.length < 6) { // password is too short
			res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "REGISTRATION FAILED: Password must be at least 6 characters. Please try again."});
			return;
		}

		var validUmassEmailPattern = /^\w+@umass.edu$/;
		if(!validUmassEmailPattern.test(email)) { // email address is either malformed or not a a UMASS address
			res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "REGISTRATION FAILED: Please enter a valid, UMASS email address."});
			return;
		}

		var usersCollection = db.get('users');
		var prospectiveUsersCollection = db.get('prospective_users');
		var verificationCode;

		// Fetch user information matching supplied email address
		usersCollection.find({ 'email' : email }, {}, function(err, doc) {
			if (err) {
				console.log(err);
				res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "ERROR: We had an issue with our database. Please try again."});
				return;
			}

			//if (doc[0] !== undefined) { // we queried the database for this email and found a match (already registered)
			if (1===2) {
				res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "REGISTRATION FAILED: Requested email is already registered."});
				return;
			} else {
				// Insert new user into prospective users collection (pending email verification)
				prospectiveUsersCollection.insert({
					'email' : email,
					'password' : password,
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "ERROR: We had an issue with our database. Please try again."});
						return;
					} else {
						verificationCode = doc._id; // use _id as verification code

						if (verificationCode == undefined) {
							res.render('home.ejs', {title: 'GEOCHAT', login_err: '', reg_err: "ERROR: Verification code undefined. Unable to register."});
							return;			
						}

						// Send a validation email to the supplied address
						mail({
						    from: "GEOCHAT <do_not_reply@geochat.com>",
						    to: email,
						    subject: "Confirm your GEOCHAT registration! ✔", // Subject line
						    html: "<b>Welcome to GEOCHAT!</b><p></p><p>Thank you for registering with GEOCHAT. Please click on the button below to confirm your registration with this email address. You may then login with your supplied credentials.</p><form name=\"submitForm\" method=\"POST\" action=\"http://localhost:3000/confirm\"><input type=\"hidden\" name=\"code\" value=\"" + verificationCode + "\"><input type=\"submit\" value=\"Confirm Registration\"></form><p></p><i>This is an automatically generated email. Replies to this email will not be received.</i>" // html body
						});

						res.send("<b>Email Verification</b><p></p><p>We have sent a verification message to <i>" + email + "</i>. Follow the link inside to finalize registration and go chat!</p>");
					}
				});	
			}
		});
	};
};

exports.confirmRegister = function(db) {
	return function(req,res) {

		var verificationCode = req.body.code;

		if (verificationCode == undefined) {
			res.send("ERROR: Verification code undefined. Unable to register user");
			return;
		}

		var usersCollection = db.get('users');
		var prospectiveUsersCollection = db.get('prospective_users');

		// Fetch user information matching verification code
		prospectiveUsersCollection.find({ '_id' : verificationCode }, {}, function(err, doc) {
			if (err) {
				console.log(err);
				res.send("VERIFICATION ERROR: We had an issue with our database. Please try again.");
				return;
			}
			if (doc[0] == undefined) { // the verification code is not found in the prospective_users collection
				res.send("VERIFICATION FAILED: Verification code does not match.");
				return;
			} else {
				// Insert new user into the users collection.
				usersCollection.insert({
					'email' : doc[0].email,
					'password' : doc[0].password,
				}, function(err, doc) {
					if (err) {
						console.log(err);
						res.send("VERIFICATION ERROR: We had an issue with our database. Please try again.");
						return;
					} else {
						res.redirect('/'); // redirect to chat page
					}
				});	
			}
		});
	}
}

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
