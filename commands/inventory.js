// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: inventory
// logs out inventory
GMCommands.AddCommand(new Command('inventory',60,function command_inventory(string,client){
	client.sendInfoMessage('Your Inventory:');
	for (var i=0;i<client.character.Inventory.length;i++){
		if (client.character.Inventory[i] && client.character.Inventory[i].ID){
			client.sendInfoMessage(i+': '+JSON.stringify(client.character.Inventory[i]));
		}
	}
}));