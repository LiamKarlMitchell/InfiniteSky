// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: clearinventory
// clears the characters inventory
GMCommands.AddCommand(new Command('clearinventory',20,function command_clearinventory(string,client){
		// Clear the inventory
		for (var i=0;i<client.character.Inventory.length;i++) {
			client.character.Inventory[i] = null;
		}
		client.character.markModified('Inventory');
		client.character.save();
        client.sendInfoMessage('Please log out and back in for changes to apply or type /load.');
}));