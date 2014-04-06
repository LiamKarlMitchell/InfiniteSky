// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var MapLoadReply = restruct.
int8lu('packetID').
int8lu("Status").
string("IP", packets.IPAddressLength + 1).
int32lu("Port");


var ZoneChangePacket = restruct.
int32lu("ZoneID"). // 01 00 00 00 
int32lu("PortalID"). // 00 00 00 00
int32lu("Unknown1"). // 00 00 00 00
int32lu("Unknown2"); // 03 70 53 45
WorldPC.Set(0x08, {
	Restruct: ZoneChangePacket,

	function: function ZoneChangeRequest(socket, request) {
		if (!socket.authenticated) return;


		socket.sendInfoMessage('[Zone Change Request] ' + socket.character.Name + ' wants to goto ' + request.ZoneID);
		var status = 1;
		var theIP = "";
		var thePort = 0;

		// // Hopefully unknown1 or unknown2 will contain some info if we are using NPC or portal.
		// // Used for NPC or Item Zones.
		var SpecialZones = [
		0,
		// All Faction/Clan from Town
		119, // Nangi
		// Jinong from Yellow Gate Master in Town and Yongu
		14, // Soham Forest
		37 // Yongu
		];
		// // Check if zone exists
		if (request.ZoneID == 0) {
			socket.sendInfoMessage('Client wants to go back to town map.');
			// Check if they are using town portal scroll
			switch (socket.character.clan) {
			case 0:
				request.ZoneID = 1;
				break;
			case 1:
				request.ZoneID = 6;
				break;
			case 2:
				request.ZoneID = 11;
				break;
			}
		}

		var TransferZone = zones[request.ZoneID];
		if (TransferZone) {
			socket.sendInfoMessage('Zone [' + TransferZone.getName() + '] Exists');

			var PortalStart = null;
			var PortalEnd = null;
			for (var i = 0; i < socket.Zone.MoveRegions.length; i++) {
				if (socket.Zone.MoveRegions[i].ZoneID === request.ZoneID) {
					PortalStart = socket.Zone.MoveRegions[i];
					console.log(i,PortalStart);
					break;
				}
			}


			if (SpecialZones.indexOf(request.ZoneID)>-1) {
				PortalStart = socket.Zone.MoveRegions[0];
			}

			if (PortalStart) {
				for (var i = TransferZone.MoveRegions.length - 1; i >= 0; i--) {
					if (TransferZone.MoveRegions[i].ZoneID === socket.Zone.getID()) {
						PortalEnd = TransferZone.MoveRegions[i];
						console.log(i,PortalEnd);
						break;
					}
				};

				if (!PortalEnd) PortalEnd = TransferZone.MoveRegions[0];

				if (PortalEnd) {
					socket.sendInfoMessage('Portal end point found')


					// Check if they are allowed to transfer
					// Check if portal exists
					// Portal going through is going to be within radius of player xyz
					// Going to map id they wanna goto.
					//socket.Zone.
					//TransferZone
					// Find TranseferZone portal going from MapID.
					// It is second one.
					// 
					// Set portalendpoint to othermap portalinfo 0 if not found
					// Check if they have rights to go there
					// var Portal = null;
					// var SpecialZone = false;
					// if (SpecialZones.indexOf(request.ZoneID) > -1) {
					// 	socket.sendInfoMessage("Special Zone");
					// 	SpecialZone = true;
					// 	// Check that your near the npc for it on the map etc or using right item.
					// 	// int32ls('Unknown1').
					// 	// int32ls('ZoneID').
					// 	// int32ls('Unknown2').
					// 	// int32ls('Unknown3').
					// 	// int32ls('X').
					// 	// int32ls('Y').
					// 	// int32ls('Z').
					// 	// int32ls('Radius');
					// 	Portal = {
					// 		ZoneID: socket.Zone.getID(),
					// 		X: socket.character.state.Location.X,
					// 		Y: socket.character.state.Location.Y,
					// 		Z: socket.character.state.Location.Z,
					// 		Radius: 100
					// 	};
					// } else {
					// 	Portal = socket.Zone.getPortal(request.ZoneID);
					// }
					// if (Portal == null && SpecialZone == false) {
					// 	socket.sendInfoMessage('Portal does not exist');
					// 	status = 1;
					// } else {
					// 	// Check collision with portal if Radius is > 0
					// 	// Check other requirements of portal
					// 	var PortalEndPoint = null;
					// 	// if (SpecialZone)
					// 	// 	{
					// 	// 		TransferZone.getPortalEndPoint(0);
					// 	// 	}
					// 	// 	else
					// 	// 	{
					// 	// 		TransferZone.getPortalEndPoint(socket.Zone.getID());
					// 	// 	}
					// 	// PORTALS ARE FUCKED RIGHT NOW
					// 	socket.sendInfoMessage('Portals are fucked right now!');
					// 	//PortalEndPoint = TransferZone.getPortalEndPoint(socket.Zone.getID());
					// 	if (PortalEndPoint == null) {
					// 		PortalEndPoint = TransferZone.getPortal(0);
					// 	}
					// 	if (PortalEndPoint == null) {
					// 		socket.sendInfoMessage('Portal end Point not exist');
					// 		status = 1;
					// 	} else {
					//socket.sendInfoMessage('Tell client which map server to connect too');
					//socket.characters[gamestart.Slot].MapID << get the map id of character :P
					// Get clients ip, check if it is on lan with server,
					// if so send it servers lan ip and port
					// otherwise send it real world ip and port
					theIP = util.config.externalIP;
					if (socket.remoteAddress.indexOf('127') == 0) {
						theIP = '127.0.0.1'
					}


					//socket.sendInfoMessage('IP for client to connect too before translation: ' + theIP);
					for (var i = 0; i < natTranslations.length; i++) {
						if (natTranslations[i].contains(socket.remoteAddress)) {
							theIP = natTranslations[i].ip;
							break;
						}
					}
					//socket.sendInfoMessage('IP for client to connect too: ' + theIP);
					thePort = util.config.ports.world;

					//////////////////////////////// NEED CODE RAWR
					// Need to know how to get the client endpoint ip here.
					// socket.address.endpoint orsomething will need to google around.
					// Will do basic in util.config, if we can get our endpoint ip
					// Then we can say use that. For external users we will want to point them to the wan ip.
					// If we can get socket dynamically it would be best, but if not we will have to code it into the util.config, im cool with that.
					// Status: 
					// 0 - Good to go
					// 1 - No game server you can connect to
					// 2 - An Unknown Error has occured
					// The Character State object for use in world for moving and health etc.
					//socket.character.state.setFromCharacter(socket.character);
					//socket.sendInfoMessage(socket.character.state.Location);
					// Ask the zones/mapservers if they are ready for connections
					// If not then set Status to 1
					status = 0;
					// Add to WorldServer client transfer.
					// Set the ZoneID and XYZ they are to goto.
					socket.character.state.ToLocation.X = PortalEnd.X;
					socket.character.state.ToLocation.Y = PortalEnd.Y;
					socket.character.state.ToLocation.Z = PortalEnd.Z;
					

					socket.character.ToMapID = request.ZoneID;

					socket.character.save();

					socket.zoneTransfer = true;
					socket.zoneForceTransfer = true;
					world.addSocketToTransferQueue(socket);

					// socket.write(makeCompressedPacket(
					// 		0x18, new buffer(
					// 		WorldPC.ActionReplyPacket.pack(
					// 		socket.character.state))));
					// 		return;					

				} else {
					socket.sendInfoMessage('Portal endpoint not found');
				}
			} else {
				socket.sendInfoMessage('Portal to that map not found');
			}

		}
		else
		{
			socket.sendInfoMessage('Zone not found');
		}


		socket.write(
		new buffer(
		MapLoadReply.pack({
			packetID: 0x0A,
			Status: status,
			IP: theIP,
			Port: thePort
		})));

	}
});