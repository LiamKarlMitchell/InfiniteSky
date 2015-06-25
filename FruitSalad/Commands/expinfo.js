// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: expinfo
// Tells you info about expinfo
GMCommands.AddCommand(new Command('expinfo',0,function command_expinfo(string,client){
	if (string.length===0) {
		string = client.character.Level;
	}

	var Level = parseInt(string);
	if (Level)
	{
		client.sendInfoMessage("Finding EXP where Level is "+Level);
		db.Exp.getByLevel(Level, function(err, exp) {
			if (err) {
				log.error(err, 'Error finding EXP Information for Level '+Level);
				client.sendInfoMessage('Error: ', err);
				return;
			}

			if (exp) {
				client.sendInfoMessage('Level: '+exp.Level+' Start: '+exp.EXPStart+' End: '+exp.EXPEnd);
			} else {
				client.sendInfoMessage('EXP Info for Level '+Level+' was not found.');
			}
		})
	} else {
		client.sendInfoMessage('Usage: /expinfo <Level>');
	}
}));