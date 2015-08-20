// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: xp
// Gives you experience points
var xp_ExampleUsage = "Example Usage: /xp 10";
GMCommands.AddCommand(new Command('xp',0,function command_giveexp(string,client){
	if (string.length==0) { client.sendInfoMessage(xp_ExampleUsage); return;}
	
	// Get Amount from string
	var Value = parseInt(string);
	if (isNaN(Value)) {
		client.sendInfoMessage(xp_ExampleUsage);
		return;
	}

	zone.giveEXP(client, value);
}));