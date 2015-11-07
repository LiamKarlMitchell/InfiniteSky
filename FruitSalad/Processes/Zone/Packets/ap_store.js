// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

Zone.recv.keyValue = restruct.
  int32lu('Key').
  int32lu('Value');

Zone.send.value = restruct.
  int8lu('PacketID').
  int32lu('Value');

// 75 02 00 00 00 01 00 00 00 
ZonePC.Set(0x75, {
	Restruct: Zone.recv.keyValue,
	function: function OpenAPShop(client, input) {
		console.log("Character opened AP Shop");
		// Send the reply currency back.
		client.write(new Buffer(Zone.send.value.pack({ PacketID: 0x9E, Value: client.account.AP })));
	}
});

// Unreconized PacketID: 0x76 Size: 40
// 00000000: 5000 0000 3c84 0100 0700 0000 3c84 0100  P...<.......<...
// 00000010: 0000 0000 0200 0000 0100 0000 0000 0000  ................
// 00000020: 0266 d042 801b ae43                      .fPB...C
