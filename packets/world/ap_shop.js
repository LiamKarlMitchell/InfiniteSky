// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.Set(0x75, {
	Size: 8,
	function: function OpenAPShop(socket, input) {
	// get the packet
	console.log("Character opened AP Shop");
	// Send the reply currency back.
	socket.write(new Buffer(packets.Value.pack({ PacketID: 0x9E, Value: socket.account.AP })));
	}
});

// Unreconized PacketID: 0x76 Size: 40
// 00000000: 5000 0000 3c84 0100 0700 0000 3c84 0100  P...<.......<...
// 00000010: 0000 0000 0200 0000 0100 0000 0000 0000  ................
// 00000020: 0266 d042 801b ae43                      .fPB...C
