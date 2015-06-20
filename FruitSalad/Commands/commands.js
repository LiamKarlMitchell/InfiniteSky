// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: commands
// Used to tell the user all of the commands they can execute
GMCommands.AddCommand(new Command('commands',0,function command_commands(string,client){
		client.sendInfoMessage('Avaliable Commands for Level: '+client.account.Level);
		var tmpoutput='';
		for(var i = 0; i < GMCommands.Commands.length; i++) {
			if (client.account.Level>=GMCommands.Commands[i].Level){
	        	//console.log(Commands[i].Name);
				if (tmpoutput.length+GMCommands.Commands[i].Name.length+1<50)
				{
					tmpoutput+=GMCommands.Commands[i].Name+' ';
				}
				else
				{
					client.sendInfoMessage(tmpoutput);	
					tmpoutput=GMCommands.Commands[i].Name+' ';
				}
				// client.sendInfoMessage(Commands[i].Name);
				if (i==GMCommands.Commands.length-1) client.sendInfoMessage(tmpoutput);
			}
		}
}));

/////////////////////////////////////////////////////////////
// Command: commands alias
GMCommands.AddCommand(GMCommands.getCommand('commands').Alias('help'));