// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: expinfo
// Tells you info about expinfo
GMCommands.AddCommand(new Command('expinfo',0,function command_expinfo(string,client){
	if (string.length===0) return;

	var Level = parseInt(string,10)
	if (Level)
	{
		client.sendInfoMessage("Finding EXP where Level is "+Level);
		var exp = infos.Exp[Level];
		if (exp)
		{
			//client.sendInfoMessage(exp.toString());
			for (var a in exp) {
				client.sendInfoMessage(a+': '+exp[a]);
			}
		}
		else
		{
			client.sendInfoMessage("Not Found");
		}
		return;
	}
}));