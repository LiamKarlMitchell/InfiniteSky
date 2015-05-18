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
		console.log(buffer);
	}
});