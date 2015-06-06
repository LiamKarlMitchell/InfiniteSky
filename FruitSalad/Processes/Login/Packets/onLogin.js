Login.UsernameLength = 13;
Login.PasswordLength = 13;

Login.recv.onLogin = restruct.
	string('Username', Login.UsernameLength + 1).
	string('Password', Login.PasswordLength + 1).
	pad(63);

Login.LoginStatus = {
	Success: 0,
	CannotAuthenticate: 1,
	AccountNotFound: 2,
	IncorrectPassword: 3,
	Suspended: 4,
	AlreadyLoggedIn: 5,
	NeedToPay: 6,
	WrongVersion: 7,
	Maintenance: 8,
	ServerFull: 9,
	UnknownError: 10
};

Login.send.onLogin = restruct.
	int8lu('PacketID').
	int8lu('Status').
	int32lu('Unk').
	int32lu('Unk').
	int32lu('Unk').
	string('Username', Login.UsernameLength + 1).
	int32lu('UsePin').
	int32lu('Unk').
	string('Pin', 5);

Login.send.onLoginReply = function(status){
	var obj = {};
	obj.PacketID = 0x03;
	obj.Status = status;
	// TODO: Instead use a crypto hash, 12 char long as a account id to authorize character transfer.
	// USERNAME MUST BE SENT
	if (this.account) {
		obj.Username = this.account.Username;
		obj.Pin = '****';
		obj.UsePin = this.account.UsePin ? 1 : 0;
	}

	var packedObj = Login.send.onLogin.pack(obj);
	var buffer = new Buffer(packedObj);
	
	this.write(buffer);
};

LoginPC.Set(0x03, {
	Restruct: Login.recv.onLogin,
	function: function(socket, input){
		db.Account.findOne({
			Username: input.Username
		}, function(err, account) {
			if(err) {
				console.log(err);
				Login.send.onLoginReply.call(socket, Login.LoginStatus.CannotAuthenticate);
				return;
			}

			if(account === null){
				//TODO: Add configurable flag for adding accounts that does not exists.
				// console.log("creating account");
				// db.Account.create({
				// 	_id: 2,
				// 	Username: input.Username,
				// 	Password: input.Password,
				// 	Level: 80
				// });
				Login.send.onLoginReply.call(socket, Login.LoginStatus.AccountNotFound);
				return;
			}


			if(account.Status > 0){
				Login.send.onLoginReply.call(socket, Login.LoginStatus.Suspended);
				return;
			}

			if(account.Logged){
				Login.send.onLoginReply.call(socket, Login.LoginStatus.AlreadyLoggedIn);
				return;
			}

			if(account.Password !== input.Password){
				Login.send.onLoginReply.call(socket, Login.LoginStatus.AccountNotFound);
				return;
			}

			socket.account = account;
			account.Logged = true;
			socket.authenticated = true;

			// account.save();
			Login.send.onLoginReply.call(socket, Login.LoginStatus.Success);
		});
	}
});


Login.send.CharacterInfo = restruct.
	int8lu('packetID').
	int8lu('Slot').
	int8lu('Exists').
	struct('Character', structs.Character).
	int8lu('Unknown');

LoginPC.Set(0x04, {
	function: function(socket){
		if(!socket.authenticated || socket.handleGameStart || socket.zoneTransfer){
			return;
		}

		socket.characters = new Array(3);
		socket.characters.length = 0;

		// How do we tell to what server are we logging onto?

		// For more information on sorting see: http://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose
		db.Character.find({
			AccountID: socket.account._id,
			ServerName: config.world.server_name
		}, null, {
			sort: { Slot: 1 } // Sort characters by slot ascending.
		}, function(error, characters) {
			if (error) {
				// Handle error here
				dumpError(error);
				return;
			}

			// We only have 3 character slots in this game so loop through and send character for each one.
			for (var i = 0; i < 3; i++) {
				var character = characters[i];
				if (character !== undefined) {
					socket.characters[i] = character;
				}
				// If the character was not found in the db then a blank character structure will be sent.
				// It is just what the game expects sadly.
				socket.write(
					new Buffer(Login.send.CharacterInfo.pack({
						packetID: 0x05,
						Slot: i,
						Exists: (character !== undefined ? 1 : 0),
						Character: character
					}))
				);
			}
		});
	}
});
