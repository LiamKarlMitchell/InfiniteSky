// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: npcinfo
// Finds all npcs and logs out info where name is like what is entered
GMCommands.AddCommand(new Command('npcinfo',0,function command_npcinfo(string,client){
	if (string.length==0) return;

	var ID = parseInt(string,10)
	if (ID)
	{
		client.sendInfoMessage("Finding NPC where ID is "+ID);
		var npc = infos.Npc[ID];
		if (npc)
		{
			client.sendInfoMessage(npc.toString());
		}
		else
		{
			client.sendInfoMessage("Not Found");
		}
		return;
	}

	var npcs = infos.Npc.getByNameLike(string);
	client.sendInfoMessage("Finding npcs where name is like "+string);
	for(var i=0;i<npcs.length;i++)
	{
		var npc = npcs[i];
		client.sendInfoMessage(npc.toString());
	}
	client.sendInfoMessage(npcs.length+" found");
}));

/////////////////////////////////////////////////////////////
// Command: npcinfo alias
GMCommands.AddCommand(GMCommands.getCommand('npcinfo').Alias('ni'));