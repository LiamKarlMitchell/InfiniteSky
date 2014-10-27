// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: removespawnednpc
// Finds all monsters and spawns onto your zone
GMCommands.AddCommand(new Command('removespawnednpc',80,function command_removespawnednpc(string,client){
	    client.sendInfoMessage('Not working...');
	    return;
		var RemoveMonsters = [];
		for (var i in client.Zone.NPC) {
			console.log(i);
			if (client.Zone.NPC[i]!=null && client.Zone.NPC[i].gmspawn === true) {
				//RemoveNPC.push(i);
				console.log(i);
			}
		}
		
		for (var i=0;i<RemoveNPC.length;i++) {
			//client.Zone.removeNPC(i);
		}
	client.sendInfoMessage("Npc "+RemoveNPC.length+" removed.");
}));