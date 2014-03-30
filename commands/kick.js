// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: kick
// Command to kick a character from server
GMCommands.AddCommand(new Command('kick',80,function command_kick(string,client){
	// Ask the database
	client.sendInfoMessage('Kick here.');
}));