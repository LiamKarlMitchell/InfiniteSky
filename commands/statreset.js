// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: statreset
// Command to issue a stat reset
GMCommands.AddCommand(new Command('statreset',20,function command_statreset(string,client){
	// Get level and count stat points they should have
	// Set statpoints to that
	// Reset to base stats
	// Send packet to update this?
	client.character.statreset();
}));