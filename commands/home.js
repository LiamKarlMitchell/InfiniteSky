// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: home
// Command to goto characters respawn location
GMCommands.AddCommand(new Command('home',80,function command_home(string,client){
	client.character.sendHome();
}));