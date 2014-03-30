// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: gohomeyourdrunk
// Command to set every online client character to their own respawn location drunk
GMCommands.AddCommand(new Command('gohomeyourdrunk',80,function command_gohomeyourdrunk(string,client){
	client.character.setDrunkLevel(1000);
	client.character.sendHome();
}));