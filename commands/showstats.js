// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: showstats
// Command to show stats on character
GMCommands.AddCommand(new Command('showstats',20,function command_showstats(string,client){
	client.character.stats.toString();
}));