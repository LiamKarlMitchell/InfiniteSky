// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: b
// broadcasts message to all zones

/**
 * /b Broadcasts a message to all zones.
 * @param  {string} Example: /b Hello World
 * @param  {socket}
 */
GMCommands.AddCommand(new Command('b', 60,  function command_broadcast(string, client) {
	if (string.length === 0) 
	{
		client.sendInfoMessage("Example Usage: /b hi");
		return;
	}

	// world.sendToAll(new Buffer(
 //    	WorldPC.MessagePacket.pack({
 //    		PacketID: 0x1C,
 //    		Message: string
	// 	})
	// ));
}));

// process.api.zonecall(1, 'sendToAll', new Buffer(
// 			Zone.send.chat.pack({
// 				PacketID: 0x2A,
// 				Name: 'test',
// 				Message: 'Hello World'
// 			})
// 		)
// );

// TODO: Fix process.api.zonecall