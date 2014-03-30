// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.Set(0x75, {
	Size: 8,
	function: function OpenAPShop(socket, input) {
	// get the packet
	console.log("Character opened AP Shop");
	// Send the reply currency back.
	socket.write(new buffer(packets.Value.pack({ PacketID: 0x9E, Value: socket.account.AP })));
	}
});