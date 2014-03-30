// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: skillreset
// Command to issue a skill reset
GMCommands.AddCommand(new Command('skillreset',20,function command_skillreset(string,client){
	// Get level and count skill points they should have
	// Set skillpoints to that
	// Remove all skills and skill bar stuff
	// Send packet to update this?
	client.character.skillreset();
}));