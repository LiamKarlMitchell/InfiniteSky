Login.UsernameLength = 13;
Login.PasswordLength = 13;

Login.recv.onLogin = restruct.
	string('Username', Login.UsernameLength + 1).
	string('Password', Login.PasswordLength + 1).
	pad(63);

LoginPC.Set(0x03, {
	Restruct: Login.recv.onLogin,
	function: function(socket, input, buffer){
		console.log(input);
		db.Account.findOne({
			Username: user.Username
		}, function(err, account) {
			if(err){
				console.log("Error on finding account");
				return;
			}
			// if (err) {
			// 	console.log(err);
			// 	sendLoginReply(LoginPC.LoginStatus.CannotAuthenticate);
			// 	socket.close();
			// 	return;
			// }

			// if (account === null) {
			// 	sendLoginReply(LoginPC.LoginStatus.AccountNotFound);
			// 	socket.close();
			// 	return;
			// }

			// if (account.Level>80 && account.active==1) account.active=0;
			// // Check for already logged in
			// if (account.active) {
			// 	// Check with world and login server to see if account is online.
			// 	// if it is not allow continuing anyway.
			// 	var existingLoggedInClient = null;

			// 	//Need to code a way to find already logged in account on login server
			// 	console.log('Trying to find account already logged in from world server');
			// 	console.log(account);
			// 	existingLoggedInClient = world.findAccountSocket(account.Username);
			// 	if (existingLoggedInClient) {
			// 		console.log('Already Logged In - WorldServer');
			// 		existingLoggedInClient.sendInfoMessage('Another client is trying to login to your account.');
			// 		// if it is online then
			// 		sendLoginReply(LoginPC.LoginStatus.AlreadyLoggedIn);
			// 		socket.close();
			// 		return;
			// 	}
			// }

			// // Check for banning
			// // if the account is banned
			// // sendLoginReply(LoginPC.LoginStatus.Suspended);
			// // if the socket.remoteAddress is banned
			// // sendLoginReply(LoginPC.LoginStatus.Suspended);
			// // Account found and password match or admin user and admin pass match
			// if (account.Password == user.Password) {
			// 	socket.authenticated = true;

			// 	//Set user to active in db
			// 	console.log('Setting account to Active is temporarly disabled');
			// 	account.active = 1;
			// 	account.save();
			// 	socket.account = account;

			// 	sendLoginReply(LoginPC.LoginStatus.Success);
			// 	return;
			// }

			// // Account login failed.
			// sendLoginReply(LoginPC.LoginStatus.IncorrectPassword);
		});
	}
});