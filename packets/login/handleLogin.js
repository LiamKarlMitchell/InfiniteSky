// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

LoginPC.LoginStatus = {
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

LoginPC.PinStatus = {
	Success: {
		value: 0,
		name: "PinStatus_Success"
	},
	Fail: {
		value: 1,
		name: "PinStatus_Fail"
	},
	Kick: {
		value: 2,
		name: "PinStatus_Kick"
	}
};

LoginPC.UsernameLength = 13;
LoginPC.PasswordLength = 13;

LoginPC.login = restruct.
int8lu('packetID').
string('Username', LoginPC.UsernameLength + 1).
string('Password', LoginPC.PasswordLength + 1);

LoginPC.CharacterInfoPacket = restruct.
int8lu('packetID').
int8lu('Slot').
int8lu('Exists').
struct('Character', structs.Character).
int8lu('Unknown');

var LoginPacket = restruct.
	string('Username', LoginPC.UsernameLength + 1).
	string('Password', LoginPC.PasswordLength + 1).
	pad(63);
//console.log(LoginPacket.size);
// Login Packet

LoginPC.Set(0x03, {
	Restruct: LoginPacket,
	function: function Login(socket,user) {

		// Helper function to send character info
		function sendCharacterInfo() {
			console.log("Processing characters for account _id: " + socket.account._id);

			db.Character.find({
				AccountID: socket.account._id,
				ServerName: config.server_name
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
					socket.write(new Buffer(LoginPC.CharacterInfoPacket.pack({
						packetID: 0x05,
						Slot: i,
						Exists: 1,
						Character: characters[i]
					})));
				}

				for (var i = charactersLength; i < 3; i++) {
					socket.write(new Buffer(LoginPC.CharacterInfoPacket.pack({
						packetID: 0x05,
						Slot: i,
						Exists: 0
					})));
				}
			});
		}

		// An ease of use function to send th elogin success packet back
		function sendLoginReply(loginSuccess) {
			console.log('Writing login reply: '+loginSuccess);

			var LoginReply = new Buffer(41); // Need to use restruct.
			LoginReply.fill(0);
			LoginReply.writeUInt8(0x03, 0);
			LoginReply.writeUInt8(loginSuccess, 1);
			if (socket.account) {
				LoginReply.write(socket.account.Username, 14);
				LoginReply.write("0000", 36);
			}
			// Last 5 bytes if you have a pin
			// 01 00 00 00 2A 2A 2A 2A 00
			socket.write(LoginReply);

			//Send characters to client
			if (loginSuccess == LoginPC.LoginStatus.Success) // If we logged in successfully *its 0 koreans..*
			{
				//console.log('Login success');
				sendCharacterInfo();
			}
		}
		//Regex to strip whitespace/null characters, probably only useful now when receiving data from user on account create!
		//user.Username = user.Username.replace(/[.\s\0\f\r]/g,"");
		//user.Password = user.Password.replace(/[.\s\0\f\r]/g,"");
		//console.log("Login attempt username: " + user.Username);

		//Check whether user exists in db
		// Can do active: 0 to not allow multiple logins :P
		socket.isServerAdmin = false;
		for (var i = 0; i < config.systemAdminIP.length; i++) {
			if (config.systemAdminIP[i] == socket.remoteAddress) {
				socket.isServerAdmin = true;
				break;
			}
		}

		db.Account.findOne({
			Username: user.Username
		}, function(err, account) {
			if (err) {
				console.log(err);
				sendLoginReply(LoginPC.LoginStatus.CannotAuthenticate);
				return;
			}

			if (account == null) {
				sendLoginReply(LoginPC.LoginStatus.AccountNotFound);
				return;
			}

			if (account.Level>80 && account.active==1) account.active=0;
			// Check for already logged in
			if (account.active) {
				// Check with world and login server to see if account is online.
				// if it is not allow continuing anyway.
				var existingLoggedInClient = null;

				//Need to code a way to find already logged in account on login server
				console.log('Trying to find account already logged in from world server');
				//console.log(account);
				existingLoggedInClient = world.findAccountSocket(account.Username);
				if (existingLoggedInClient) {
					console.log('Already Logged In - WorldServer');
					existingLoggedInClient.sendInfoMessage('Another client is trying to login to your account.');
					// if it is online then
					sendLoginReply(LoginPC.LoginStatus.AlreadyLoggedIn);
					return;
				}
			}

			// Check for banning
			// if the account is banned
			// sendLoginReply(LoginPC.LoginStatus.Suspended);
			// if the socket.remoteAddress is banned
			// sendLoginReply(LoginPC.LoginStatus.Suspended);
			// Account found and password match or admin user and admin pass match
			if (account.Password == user.Password) {
				socket.authenticated = true;

				//Set user to active in db
				console.log('Setting account to Active is temporarly disabled');
				account.active = 1;
				account.save();
				socket.account = account;

				sendLoginReply(LoginPC.LoginStatus.Success);
				return;
			}

			// Account login failed.
			sendLoginReply(LoginPC.LoginStatus.IncorrectPassword);
		});


	}
});

// Keep Alive - We don't really care about this packet
LoginPC.Set(0x04,{ Size: 8 });