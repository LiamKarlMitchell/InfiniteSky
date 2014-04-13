// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: b
// broadcasts message to all zones
GMCommands.AddCommand(new Command('b', 0, function command_giveexp(string, client) {
	if (string.length == 0) {
		client.sendInfoMessage("Example Usage: /b hi");
		return;
	}

	world.sendToAll(new Buffer(
		packets.ChatPacketReply.pack({
			PacketID: 0x2A,
			Name: client.character.Name,
			Message: string
		})));
}));