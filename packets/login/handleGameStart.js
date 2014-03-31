// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

LoginPC.CharName_Length = 12;
LoginPC.IPAddressLength = 15;
LoginPC.UsernameLength = 13;

LoginPC.MapLoadReply = restruct.
int8lu('packetID').
int8lu("Status").
string("IP", LoginPC.IPAddressLength + 1).
int32lu("Port");

LoginPC.Set(0x09, {
	Restruct: restruct.
	int32lu("MapID").
	int8lu("Slot").
	string("UserID", 8),

	function: function GameStart(socket, packet) {
		if (socket.authenticated == false || !socket._handle) return;
		if (socket.gameStartClicked) return;
		//console.log('Tell client which map server to connect too');
		socket.gameStartClicked = true;
		//socket.characters[packet.Slot].MapID << get the map id of character :P
		// Get clients ip, check if it is on lan with server,
		// if so send it servers lan ip and port
		// otherwise send it real world ip and port
		var theIP = util.config.externalIP;
		if (socket.remoteAddress.indexOf('127') == 0) {
			theIP = '127.0.0.1'
		}


		//console.log('IP for client to connect too before translation: ' + theIP);
		for (var i = 0; i < natTranslations.length; i++) {
			if (natTranslations[i].contains(socket.remoteAddress)) {
				theIP = natTranslations[i].ip;
				break;
			}
		}
		//console.log('IP for client to connect too: ' + theIP);
		var thePort = util.config.ports.world;

		//////////////////////////////// NEED CODE RAWR
		// Need to know how to get the client endpoint ip here.
		// socket.address.endpoint orsomething will need to google around.
		// Will do basic in config, if we can get our endpoint ip
		// Then we can say use that. For external users we will want to point them to the wan ip.
		// If we can get this dynamically it would be best, but if not we will have to code it into the config, im cool with that.
		// Status: 
		// 0 - Good to go
		// 1 - No game server you can connect to
		// 2 - An Unknown Error has occured
		var status = 0;
		if (typeof(socket.characters[packet.Slot]) == 'undefined') {
			console.log('Hack attempt slot not full with user.');
			socket.destroy();
			return;
		}

		socket.character = socket.characters[packet.Slot];
		socket.character.CharacterTypeIdentifier = 1;

		// Send user back to town if they are on a special map but got disconnected
		var SpecialMaps = [119];
		if (SpecialMaps.indexOf(socket.character.MapID)>-1) {
			console.log('Character '+socket.character.Name+' is on a special map and will be put in home town...');
			switch (socket.character.clan) {
				case 0:
					socket.character.MapID = 1;
				break;
				case 1:
					socket.character.MapID = 6;
				break;
				case 2:
					socket.character.MapID = 11;
				break;
			}
		}

		// If map id is a faction map id and your not of that clan or map is not open, you should be reset to yaggnok



		// The Character State object for use in world for moving and health etc.
		socket.character.state = new CharacterState();
		socket.character.state.setAccountID(socket.account._id); // Not Actuall Account ID :( but we can go this.account._id for that.
		socket.character.state.setCharacterID(socket.character._id); // characterID should increment.
		socket.character.state.setFromCharacter(socket.character);
		//console.log(socket.character.state.Location);
		// Ask the zones/mapservers if they are ready for connections
		// If not then set Status to 1
		//status = 1;
		// Add to WorldServer client transfer.
		socket.character.state.ToLocation = socket.character.state.Location;
		socket.character.ToMapID = socket.character.MapID;

		socket.zoneTransfer = true;
		world.addSocketToTransferQueue(socket);

		socket.write(
		new buffer(
		LoginPC.MapLoadReply.pack({
			packetID: 0x0A,
			Status: status,
			IP: theIP,
			Port: thePort
		})));
	}
});

LoginPC.Set(0x0A, {
	Restruct: restruct.
	int32lu("MapID").
	int8lu("Slot").
	int32lu("Port"),

	function: function GameStartFailed(socket, packet) {
		if (!socket.gameStartClicked) return;
		socket.zoneTransfer = false;
		// Remove it from world zone transfer queue
		console.log('The client reports it failed to connect to the zone/map server we told it.');
		// Check to make sure its running?
		// Re run if not?
		// Remove from world transfer
		world.getSocketFromTransferQueue(socket.account.Username);
		socket.gameStartClicked = false;
	}
});