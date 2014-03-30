// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: debug
// Gives you experience points
GMCommands.AddCommand(new Command('debug',0,function command_debug(string,client){
	if (client.debug) {
		client.debug = 0;
	}
	else
	{
		client.debug = 1;
	}
	client.sendInfoMessage("Debug: "+(client.debug ? "ON" : "OFF"));
}));