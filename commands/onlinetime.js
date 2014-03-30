// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: onlinetime
// Command to see how long server has been online
GMCommands.AddCommand(new Command('onlinetime',0,function command_onlinetime(string,client){
	// Ask the database
	client.sendInfoMessage('Unknown.');
}));