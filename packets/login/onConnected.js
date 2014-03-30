// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

LoginPC.onConnected = function (socket) {
	var LoginServerInfo = new buffer(21);
	LoginServerInfo.fill(0);
	LoginServerInfo.writeUInt32LE(5, 17); // Online Count.
	socket.write(LoginServerInfo);
}