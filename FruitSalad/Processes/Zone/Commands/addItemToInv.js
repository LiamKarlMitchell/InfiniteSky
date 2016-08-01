// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: T
// gives iten to character inv

//todo find out why it bugs the inventory

	GMCommands.AddCommand(new Command('give',20,function command_clearinventory(string,client){
	
		s =  string.split(' ');
		client.character.Inventory = {ID: s,}
		client.character.markModified('Inventory');
		client.character.save();
		GMCommands.getCommand('reload').Execute.call(this,'',client);
			
	}));



