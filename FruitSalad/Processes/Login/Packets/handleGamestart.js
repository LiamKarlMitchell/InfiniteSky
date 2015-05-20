Login.IPAddressLength = 15;

Login.recv.GameStart = restruct.
	int32lu('MapID').
	int8lu('Slot').
	pad(8); // Probably a user id, but we dont really care about it.

Login.send.MapLoadReply = restruct.
	int8lu('packetID').
	int8lu("Status").
	string("IP", Login.IPAddressLength + 1).
	int32lu("Port");

LoginPC.Set(0x09, {
	Restruct: Login.recv.GameStart,
	function: function(socket, input){
		if(!socket.authenticated || socket.handleGameStart) return;
		socket.handleGameStart = true;


		//TODO: IP cleaning & translations

		if(socket.characters && !socket.characters[input.Slot]){
			console.log('Hack attempt, character slot not full with data.');
			socket.destroy();
			return;
		}

		socket.character = socket.characters[input.Slot];
		// socket.character.state = new CharacterState();
		// socket.character.infos = new CharacterInfos(socket);
		// socket.character.infos.updateAll();

		// TODO: Make sure that we send the player to right map if disconnected w/e.
		// TODO: Set the guild of character

		var transferObj = {
			hash: socket.hash,
			accountID: socket.account._id,
			toMapID: socket.character.MapID,
			character: socket.character._id
		};
		
		process.api.call('World', 'sendSocketToTransferQueue', [transferObj]);
		socket.zoneTransfer = true;

		var key = util.toHexString(socket.hash);
		Login.characterTransfer[key] = function(){
			socket.write(new Buffer(Login.send.MapLoadReply.pack({
				packetID: 0x0A,
				Status: 0,
				IP: '127.0.0.1',
				Port: config.network.ports.world
			})));
			delete Login.characterTransfer[key];
		};
	}
});