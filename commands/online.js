// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: online
// Command to see how many accounts are online
GMCommands.AddCommand(new Command('online',0,function command_online(string,client){
	// Ask the database
	db.Account.find({active: 1},function (err,accounts) {
		if (err) {
			client.sendInfoMessage('Error talking to database...');	
			console.log(err);
			return;
		}

		var onlineaccounts = [];

		for (var i=0;i<accounts.length;i++) {
			var w = world.findAccountSocket(accounts[i].Username);
			if (w && w._handle) {
				onlineaccounts.push(w);
			}
			else
			{
				accounts[i].active=0;
				accounts[i].save();
			}
		}

		client.sendInfoMessage('There are '+onlineaccounts.length+' accounts online.');

		if (string=='info') {
			var output = '';
			for (var i=0;i<onlineaccounts.length;i++) {
				output+=onlineaccounts[i].account.Username+':'+onlineaccounts[i].character.Name+' ('+onlineaccounts[i].character.MapID+') ';
			}
			client.sendInfoMessage(output);
		}
	});
}));