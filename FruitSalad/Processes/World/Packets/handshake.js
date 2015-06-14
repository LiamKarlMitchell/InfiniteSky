World.recv.Handshake = restruct.
	string('AccountName', 13).
	pad(5);
// int8lu('Slot').
// int32lu('MapID');

WorldPC.Set(0x01, {
	Restruct: World.recv.Handshake,
	Size: 27,
	function: function(socket, input){
		// TODO: Add IP validation?
		// var username = buffer.slice(0, 13);

		var transferObj = World.characterTransfer[input.AccountName];
		delete World.characterTransfer[input.AccountName];
		
		if(!transferObj){
			console.log(input);
			console.log("No transfer obj for:", input.AccountName);
			return;
		}

		db.Character.findOne({
			_id: transferObj.character,
			AccountID: transferObj.accountID
		}, function(err, character) {
			if(err) {
				console.log(err);
				// Login.send.onLoginReply.call(socket, Login.LoginStatus.CannotAuthenticate);
				return;
			}

			if(!character){
				console.log("Character not found");
				return;
			}
			// socket.account.
			socket.character = character;
			socket.write('\x15');
		});
	}
});

World.recv.Auth = restruct.
	string('Username', 14).
	string('CharacterName', 13).
	int32lu('MapID').
	int32lu('Slot').
	int32lu('Unknown3').
	int32lu('Unknown4').
	int32lu('Unknown5').
	int32lu('Unknown6').
	int32lu('Unknown7').
	int32lu('Unknown8').
	int32lu('Unknown9').
	int32lu('Unknown10').
	int32lu('Unknown11').
	int32lu('Unknown12').
	int32lu('Unknown13').
	int32lu('Unknown14').
	int32lu('Unknown15').
	int32lu('Unknown16').
	int32lu('Unknown17').
	int32lu('Unknown18').
	int32lu('Unknown19').
	int32lu('Unknown20').
	int32lu('Unknown21').
	string('Unknown22', 3).
	int32lu('Unknown23').
	int8lu('UnknownByte', 1);

World.send.Auth = restruct.
	int8lu('PacketID').
	int8lu('unk').
	int32lu('YongpokFormation').
	int32lu('GuanyinStone').
	int32lu('FujinStone').
	int32lu('JinongStone').
	int32lu('YoguaiStone').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('IntensiveTraining').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk');

World.send.CharacterInfo = restruct.
	int8lu('PacketID').
	int8lu('Status').
	struct('character', structs.Character).
	int8lu('Unknown');

WorldPC.Set(0x02, {
	Restruct: World.recv.Auth,
	function: function World_Login(socket, input) {
		var CharacterData = new Buffer(World.send.CharacterInfo.pack({
			PacketID: 0x16,
			Status: 0,
			character: socket.character,
			Unknown: 0x00
		}));

		// TODO: Set the inventory, storage and bank buffers. Fixing enchant, combine, growth etc. of items.

		CharacterData = socket.character.restruct(CharacterData);

		socket.write(CharacterData);

		var WorldAuthData = new Buffer(World.send.Auth.pack({
			PacketID: 0x17,
			YongpokFormation: 3,
			GuanyinStone: 3,
			FujinStone: 3,
			JinongStone: 3,
			YoguaiStone: 3,
			IntensiveTraining: 3
		}));

		socket.write(WorldAuthData);

		var zone = process.zones[socket.character.MapID];
		if(!zone){
			console.log("Character", socket.character.Name, "trying to log into zone that is not initialized. Zone ID(",socket.character.MapID,")");
			return;
		}

		socket.zone = zone;
		var handshakeData = {};
		handshakeData.id = socket.character._id;
		handshakeData.accountID = socket.character.AccountID;
		handshakeData.hash = socket.remoteAddress + ":" + socket.remotePort;
		zone.thread.send({type: 'character data', data: handshakeData});
		zone.thread.send('world socket', socket);
		socket.paused = true;
	}	
});