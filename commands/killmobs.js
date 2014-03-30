// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: killmobs
// Kills every monster on zone client is on
GMCommands.AddCommand(new Command('killmobs',90,function command_killmobs(string,client){
		var dropItems = true; // Could get from input
		client.zone.killAllMobs(dropItems);
}));