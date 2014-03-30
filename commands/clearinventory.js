// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: clearinventory
// clears the characters inventory
GMCommands.AddCommand(new Command('clearinventory',20,function command_clearinventory(string,client){
		// Clear the inventory
		client.character.Inventory.length = 0;
		client.character.markModified('Inventory');
		client.character.save();
        client.sendInfoMessage('Please log out and back in for changes to apply.');
}));