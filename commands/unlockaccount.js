// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: unlockaccount
// Command to unlock an account
GMCommands.AddCommand(new Command('unlockaccount',80,function command_unlockaccount(string,client){
	// Ask the database
	var Searcher = {Username: string, active: 1};
	if (string=='__ALL__') {
		Searcher = {active: 1};
	}
	console.log(Searcher);
	db.mongoose.Account.find(Searcher,function (err,acc) {
		if (err) {
			client.sendInfoMessage('Error talking to database...');	
			console.log(err);
			return;
		}
		
		if (acc.length>0) {
			for (var i=0;i<acc.length;i++) {
				acc[i].active = 0;
				acc[i].save();
				client.sendInfoMessage('The account '+acc[i].Username+' has been unlocked.');
			}
		}
		else
		{
			client.sendInfoMessage('The account '+string+' was not found.');
		}
	});
}));