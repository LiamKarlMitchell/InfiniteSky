// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: tonpc
// Takes you to an NPC by ID or Name
GMCommands.AddCommand(new Command('tonpc',0,function command_tonpc(string,client){
	if (string.length==0) return;

	var ID = parseInt(string,10)
	var npc = null;
	if (ID)
	{
		npc = NPCInfo.getByID(ID);
		client.sendInfoMessage("Going to NPC by ID not yet implemented.");
	}
	else
	{
		var npcs = NPCInfo.getByNameLike(string);
		if (npcs.length>0)
		{
			for (var i=0;i<npcs.length;i++)
			{
				var zoneNPCS = client.Zone.getNPCWhereID(npcs[i]._ID);
				if (zoneNPCS.length>0)
				{
					// NPC's found on current map matching the ID
					// Find nearest one and teleport you to it.
					client.sendInfoMessage("Found NPC "+npcs[i]._ID+" ("+zoneNPCS[0].UniqueID+") "+npcs[i].Name+" on current Map");

					if (client.Teleport(zoneNPCS[0].Location)==false) client.sendInfoMessage('Move Zone Failed');
					return;
				}
			}
			
		}
	}

	// Find on other zone.
	// Find the zone the npc is on.
		client.sendInfoMessage("Finding NPC in other zones not yet implemented.");
		return;

	if (npc)
	{
		client.sendInfoMessage("Found NPC Info "+npc.ID+" "+npc.Name);

		// Check current zone first
		var npcs = client.Zone.getNPCWhereID(npc.ID);
		if (npcs.length>0)
		{
			// NPC's found on current map matching the ID
			// Find nearest one and teleport you to it.
			client.sendInfoMessage("Found "+npcs.length+" of npc "+npc.ID+" "+npc.Name+" on your current map.");

			if (client.Teleport(this.client.Zone.getID(),npcs[0].Location)==false) client.sendInfoMessage('ToNPC Failed');
			return;
		}

		

	}

}));