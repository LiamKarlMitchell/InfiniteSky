// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var LoginServerInfo_List = restruct.
int8lu('Unk').
int32lu('PlayerCount');

var LoginServerListInfoPacket = restruct.
int8lu('PacketID').
struct('Servers', LoginServerInfo_List, 4);

LoginPC.onConnected = function (socket) {
	// var LoginServerInfo = new Buffer(21);
	// LoginServerInfo.fill(0);
	// LoginServerInfo.writeUInt32LE(5, 17); // Online Count.
	var srvs = [];
	srvs[0] = {
		Unk: 0,
		PlayerCount: 1000
	};
	var packet = LoginServerListInfoPacket.pack({
		PacketID: 0x00,
		Servers: srvs
	});
	socket.write(new Buffer(packet));
}