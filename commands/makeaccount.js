// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: makeaccount
// Creates an account
GMCommands.AddCommand(new Command('makeaccount',61,function command_makeaccount(string,client){
	s = string.split(' ');
	if (s.length>=2)
	{
		var Username = s[0];
		var Password = s[1];
		var Level = 0;

		if (s.length>=3)
		{
			Level = parseInt(s[2],10);
		}

		if (Level>client.account.Level)
		{
			client.sendInfoMessage("You can't make an account with a gm level Greater than yours");
                        return;
		}

		// Make an account
		db.getNextSequence('accountid',function(id) {

			newaccount = new db.Account({Username: Username, Password: Password, Level: Level, _id: id});
			newaccount.save(function (err) {
				  if (err) {
				  	client.sendInfoMessage('Error making account already exists');
				  	return;
				  }

				  client.sendInfoMessage('Account '+Username+' has been created');
			});
		});
	}
	else
	{
		client.sendInfoMessage('usage: makeaccount username password level');
	}
}));