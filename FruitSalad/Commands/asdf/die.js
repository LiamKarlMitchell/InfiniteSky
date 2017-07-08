// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: die
// It kills the character
GMCommands.AddCommand(new Command('die',0,function command_die(string,client){
		console.log(client.character.Name+' kills themself');
		client.character.setHP(0);
		client.sendActionStateToArea();
}));