// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// WorldPC.Set(0x85,{
// 	function: function(socket, data) {
// 		//handleAutoPillSet.call(this, data.slice(8));
// 	}
// }); // Autopill Set);
WorldPC.Set(139, {
	//Restruct: restruct.int32lu('Slot').int32lu('MapID'),
	Size: 8,

	function: function(socket, data) {
		//logHex(data);
	}
});


// Calabash Bottle Drink with Q
WorldPC.Set(0x7B, {
	Restruct: restruct.int32lu('ID').int32lu('Amount'),

	function: function(socket, data) {
		socket.sendInfoMessage('Bottle drinking not yet implemented');


		if (socket.character.CalbashBottle.ID && socket.character.CalbashBottle.Enchant) {
			//socket.character.CalbashBottle.ID = Value;
			//socket.character.CalbashBottle.Enchant = Value2;
			//socket.character.CalbashBottle.Combine = Value3;
			socket.character.CalbashBottle.Enchant--;
		}

		socket.character.state.Skill = 17;
		socket.character.state.Frame = 0;

		socket.character.updateInfos();

		socket.Zone.sendToAllArea(socket, true, packets.makeCompressedPacket(
		0x18, new Buffer(
		packets.ActionReplyPacket.pack(
		socket.character.state))), config.viewable_action_distance);
	}
});

//0x7B
//0400 0000 1000 0000


// Use Treasure Box lv 10
// Unreconized PacketID: 67 43 Size: 33
// 00000000: 3200 0000 0000 0000 0000 0000 0070 0000  2............p..
// 00000010: 00ff ffff ffff ffff ff00 a039 aa00 0000  ...........9*...
// 00000020: 9a                                       .