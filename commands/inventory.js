// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: inventory
// logs out inventory
// GMCommands.AddCommand(new Command('inventory',60,function command_inventory(string,client){
// 	client.sendInfoMessage('Your Inventory:');
// 	for (var i=0;i<client.character.Inventory.length;i++){
// 		if (client.character.Inventory[i] && client.character.Inventory[i].ID){
// 			client.sendInfoMessage(i+': '+JSON.stringify(client.character.Inventory[i]));
// 		}
// 	}
// }));

GMCommands.AddCommand(new Command('inventory',0,function command_inventory(string,client){
	switch(string){
		case 'clean':
		for (var i=0;i<client.character.Inventory.length;i++){
			client.character.Inventory[i] = null;
		}

		client.character.markModified('Inventory');
		client.character.save();
		break;

		case 'fill':
		var x = 0;
		var y = 0;
		for (var i=0;i<client.character.Inventory.length;i++){
			client.character.Inventory[i] = {
	            "Amount" : 99,
	            "ID" : 2,
	            "Row" : x,
	            "Column" : y
	        };
	        y++;
	        if(y === 8){
	        	y = 0;
	        	x++;
	        }
		}

		client.character.markModified('Inventory');
		client.character.save();
		break;

		default:

		console.log(client.character.Inventory);
		break;
	}

}));