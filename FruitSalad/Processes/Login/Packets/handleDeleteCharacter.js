Login.recv.deleteCharacter = restruct.
	int8lu('Slot').
	pad(8); // Possible that this is the password to confirm character deletion.

Login.send.deleteCharacter = restruct.
	int8lu('packetID').
	int8lu("Status");

Login.send.deleteCharacterReply = function(status){
	this.write(new Buffer(Login.send.deleteCharacter.pack({
		packetID: 0x08,
		Status: status
	})));
}

LoginPC.Set(0x07, {
	Restruct: Login.recv.deleteCharacter,
	function: function(socket, input){
		// Status:
		// 0 - Success
		// 1 - Failed to delete character
		// 2 - Incorrect password
		// 3 - Unknown error

		if(socket.characters.length === 0){
			Login.send.deleteCharacterReply.call(socket, 3);
			return;
		}

		if(input.Slot < 0 || input.Slot > 2){
			Login.send.deleteCharacterReply.call(socket, 3);
			return;
		}

		var character = socket.characters[input.Slot];
		if(!character){
			Login.send.deleteCharacterReply.call(socket, 3);
			return;
		}
		console.log('Deleting character: '+character.Name);
		character.remove(function(err, removed){
			if(err){
				console.log(err);
				Login.send.deleteCharacterReply.call(socket, 1);
				return;
			}

			console.log(removed);

			if(removed){
				delete socket.characters[input.Slot];
				Login.send.deleteCharacterReply.call(socket, 0);
			}
		});
	}
});
