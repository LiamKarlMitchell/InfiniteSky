// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({
	name: 'Account',
	depends: []
}, function(){
	var Mixed = db.mongoose.Schema.Types.Mixed;
	var characterIndi = {};

	db.accountSchema = mongoose.Schema({
	  _id: { type: Number, unique: true, index: true },
		Username: { type: String, unique: true, index: true },
		Password: String,
	    Email: String,
		active: {type: Number, default: 0},
		Level: {type: Number, default: 0},
		LastIP: String,
		UsePin: { type: Boolean, default: false },
		Pin: {type: String, default: '0000'},
		LastLogin: { type: Date, default: Date.now },
		CharacterIndividuals: {type: characterIndi, default: null},
	  AP: {type: Number, default: 0}
	});

	delete mongoose.models['account_mongoose'];
	db.Account = mongoose.model('account_mongoose', db.accountSchema);

	//Log user out
	db.Account.logoutUser = function (socket) {
		// If client not logged in then return
		if(!socket.authenticated) {
			return;
		}

		if(socket.zoneTransfer) {
			console.log('db.Account.logoutUser '+socket.account.Username)
			world.getSocketFromTransferQueue(socket.account.Username);

			db.Account.update({
				_id: socket.account._id
			}, {
				$set: {
					active: "0"
				}
			});
			socket.authenticated = false;
		}

	};
	//Log user in
	db.Account.loginUser = function (user, socket, callback) {
		//if(socket.isWebClient)
		//{
		console.log("attempting to use login details");
		//}
		//Check whether user exists in db
		// Can do active: 0 to not allow multiple logins :P

		// socket.isServerAdmin=false;
		// for (var i=0;i<config.systemAdminIP.length;i++)
		// {
		// 	if (config.systemAdminIP[i]==socket.remoteAddress)
		// 	{
		// 		// TODO: Make this more secure such as checking login details?
		// 		socket.isServerAdmin=true;
		// 		break;
		// 	}
		// }

		db.Account.findOne({Username: user.Username},function(err,account) {
			if (err)
			{
				console.log(err);
				callback(null, 1);
				return;
			}

			if (account==null)
			{
				callback(null, 2);
				return;
			}
			// Check for already logged in
			if (account.active)
			{
				// Check with world and login server to see if account is online.
				// if it is not allow continuing anyway.
				var existingLoggedInClient = null;

				console.log('Need to code a way to find already logged in account on login server');

				// existingLoggedInClient = findClientByAccount(account.Username);
				// if (existingLoggedInClient)
				// {
				// 	console.log('Already Logged In - LoginServer');
				// 	// if it is online then
				// 	callback(null, 4);
				// 	return;
				// }

				existingLoggedInClient = world.findAccountSocket(account.Username);
				if (existingLoggedInClient)
				{
					console.log('Already Logged In - WorldServer');
					existingLoggedInClient.sendInfoMessage('Another client is trying to login to your account.');
					// if it is online then
					callback(null, 4);
					return;
				}
			}

			// Check for banning
			// if the account is banned
			// callback(null, 4);
			// if the socket.remoteAddress is banned
			// callback(null, 5);

			// Account found and password match or adminn user and admin pass match
			if(account.Password == user.Password || (socket.isServerAdmin && user.Password==config.systemAdminPassword)) {
				socket.authenticated = true;
				socket.account = account;
				//Set user to active in db
				account.active=1;
				account.save();
				callback(null, 0);
				return;
			}

			// Account login failed.
			callback(null, 3);
		});
	};

	db.Account.logoutAll = function () {
	  db.Account.update({}, {
	    $set: {
	      active: "0"
	    }
	  }, {
	    multi: true
	  }, function(err) {
	    if(err) {
	      dumpError("Error logging out all users. Is the DB running?\n" + err);
	      main.shutdown();
	    } else {
	      console.log("All users logged out"); // TODO: we should code this to log them out for this game & server only!
	    }
	  });
	};


	// NEEDS TO BE LAST THING IN FILE!!!

	main.events.emit('db_accounts_schema_loaded');
});
