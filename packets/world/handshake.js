// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.Set(0x01, {
	Restruct: restruct.
	string('Name', 13).
	int8lu('Slot').
	int32lu('MapID'),

	function: function Handshake(socket, info) {
		console.log(socket.id);
		if (socket.authenticated) return;
		console.log(info);
		console.log('Handshake packet for account %s slot %d', info.Name, info.Slot);

		if (info.Slot > 3) {
			console.log('Hack Attempt on slot.');
			socket.destroy();
			return;
		}

		// Not really used apart from getting Slot as Username and MapID are also in next packet
		//console.log('We should dll inject a session key into Name to be pro and use existing authentication with Login Server.');
		socket.Username = info.Name;
		socket.MapID = info.MapID;
		socket.Slot = info.Slot;

		// if MapID is 0 then get the clan map id
		//////////////////////////// NEED TO CODE MORE! BLAH
		// TODO: Improve game start and zone changing.
		// Can get account and characters here!
		// At this stage the login server/previouszoneserver should still have a connection with the client.
		// We can read the information from that to double check legitness.
		// we should ask zones first we should also store the characters last map id in db and also a respawn mapid, x,y,z
		// on create character we would set the respawn location to their home zone
		// Need to know if mongodb always returns characters/things in same order and if it always loops through them in same order in the for each.. hoping it does
		// on login game start we should store a reference to the selected character in socket.selectedCharacter then we can just grab that.
		console.log('world\\handshake.js '+socket.Username);
		var oldsocket = world.getSocketFromTransferQueue(socket.Username);
		if (oldsocket != null) {
			console.log('Existing socket found');

			// Could maybe use extend new = extend(old,new);
			socket.account = oldsocket.account;
			socket.character = oldsocket.character;
			//console.log('Account Info: ',socket.account);

			// console.log(socket.character.MapID,info.MapID)
			// if (socket.character.MapID!=info.MapID)
			// {
			// 	console.log('hack attempt map teleport hack :P');
			// 	socket.destroy();
			// 	return;
			// }
			//console.log(this);
			//console.log(socket.account);
			//console.log(socket.character);
			// Copy across other details required.
			// Find Zone info
			// Can compare to oldsocket.zone to check map id and portal xyz for validity etc.
			// Check portal endpoints
			socket.Zone = zones[socket.character.ToMapID];
			var newlocation = socket.character.state.ToLocation.X;;
			if (socket.Zone != null) {
				socket.character.MapID = socket.character.ToMapID;

				socket.character.RealX = socket.character.state.ToLocation.X;
				socket.character.RealY = socket.character.state.ToLocation.Y;
				socket.character.RealZ = socket.character.state.ToLocation.Z;
				socket.character.MapID = socket.character.ToMapID;
				socket.character.save();

				// How to remove from login server?
				if (oldsocket.Zone) {
					oldsocket.Zone.removeSocket(oldsocket);
				}
				delete oldsocket;
			} else {
				console.log('Could not find Zone ' + socket.character.MapID);
				delete oldsocket;
				socket.destroy();
			}
		} else {
			console.log('Existing socket not found');
			socket.destroy();
		}

		// Update the characters info
		socket.character.infos.updateAll();
		//eyes.inspect(socket.character.infos);
		//eyes.inspect(socket.character.state);
		socket.character.state.setFromCharacter(socket.character);
		//eyes.inspect(socket.character.state);
		// Check if it has the character on the right slot and if it has right map id
		socket.write('\x15');
	}
});