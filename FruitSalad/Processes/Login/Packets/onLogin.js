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
	pad(14). // Hash
	int32lu('UsePin').
	int32lu('Unk').
	string('Pin', 5);

Login.send.onLoginReply = function(status){
	var obj = {};
	obj.PacketID = 0x03;
	obj.Status = status;
	// obj.Hash = this.socket.hash ? this.socket.hash : ""; // TODO: Instead use a crypto hash, 12 char long as a account id to authorize character transfer.
	obj.Pin = this.account && this.account.UsePin ? this.account.Pin : "****";
	obj.UsePin = this.account && this.account.UsePin ? 1 : 0;
	var buffer = new Buffer(Login.send.onLogin.pack(obj));
	new Buffer(this.hash).copy(buffer, 14, this.hash);
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

			socket.account = account;

			if(account === null){
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

			account.Logged = true;
			socket.authenticated = true;
			socket.hash = crypto.randomBytes(14);

			account.save();
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
		if(!socket.authenticated){
			return;
		}

		socket.characters = [];

		// How do we tell to what server are we logging on?

		db.Character.find({
			AccountID: socket.account._id,
			ServerName: config.world.server_name
		}, function(error, characters) {
			if (error) {
				// Handle error here
				dumpError(error);
				return;
			}

			var charactersLength = typeof(characters) !== "undefined" ? characters.length : 0;
			if (charactersLength > 3) {
				console.log("Too many characters!~!!!");
				charactersLength = 3;
			}

			for (var i = 0; i < charactersLength; i++) {
				socket.characters[i] = characters[i];
				socket.write(
						new Buffer(Login.send.CharacterInfo.pack({
							packetID: 0x05,
							Slot: i,
							Exists: 1,
							Character: characters[i]
						}))
				);
			}

			for (var i = charactersLength; i < 3; i++) {
				socket.write(new Buffer(Login.send.CharacterInfo.pack({
					packetID: 0x05,
					Slot: i,
					Exists: 0
				})));
			}
		});
	}
});