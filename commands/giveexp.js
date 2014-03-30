// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: giveexp
// Gives you experience points
GMCommands.AddCommand(new Command('giveexp',0,function command_giveexp(string,client){
	if (string.length==0) { client.sendInfoMessage("Example Usage: /giveexp 10");
							return;}
	// Get Amount from string
	var Value = parseInt(string,10);
	if (isNaN(Value)) {
		client.sendInfoMessage("Example Usage: /giveexp 10");
			return;
	}
	client.giveEXP(Value);

	client.sendInfoMessage("Congradulations you have "+client.character.Experience+" EXP");
}));