// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: removespawnedmonsters
// Finds all monsters and spawns onto your zone
GMCommands.AddCommand(new Command('removespawnedmonsters',80,function command_removespawnedmonsters(string,client){
	    client.sendInfoMessage('Not working...');
	    return;
		var RemoveMonsters = [];
		for (var i in client.Zone.Monsters) {
			console.log(i);
			if (client.Zone.Monsters[i]!=null && client.Zone.Monsters[i].gmspawn === true) {
				//RemoveMonsters.push(i);
				console.log(i);
			}
		}
		
		for (var i=0;i<RemoveMonsters.length;i++) {
			//client.Zone.removeMonster(i);
		}
	client.sendInfoMessage("Monster "+RemoveMonsters.length+" removed.");
}));