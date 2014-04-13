// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldServerInfoPacket = restruct.
	int8lu('packetID').
	string('encdata',16);

WorldPC.onConnected = function (socket) {
	// Send server info to client here... we don't really seem to have actuall data usage for this
	socket.write(new Buffer(WorldServerInfoPacket.pack({
		packetID: 0x00
	})));

	socket.afterPacketsHandled = function afterPacketsHandled() {
		if(socket.authenticated) {
			socket.send2FUpdate();
		}
	}
}