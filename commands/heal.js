// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: heal
// Command to heal a character
GMCommands.AddCommand(new Command('heal',20,function command_heal(string,client){
	client.character.stats.heal({HP: 1000, SP: 1000});
}));