// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: spawnnpc
// Finds all npc and spawns onto your zone
GMCommands.AddCommand(new Command('spawnnpc',60,function command_spawnnpc(string,client){
	if (string.length==0) return;
	// Get ID from string
	var ID;
	
	if (isNaN(string)) {
		var npc = infos.Npc.getByNameLike(string);
			if (npc.length) {
				ID = npc[0].ID;
		}
	} else {
		ID = Number(string);
	}


	Number(string);

	// Get XYZ from string?

	// Get Amount from string

	var npc = infos.Npc[ID];
	if (npc)
	{
		client.sendInfoMessage("Npc found "+npc.ID+" "+npc.Name);
		var spawninfo = {
		'UniqueID': 0,
		'ID': ID,
		'Location': client.character.state.Location,
		'Direction': client.character.state.FacingDirection
		}

		var npc = client.Zone.createNPC(spawninfo);
		npc.gmspawn = true;
		client.Zone.addNPC(npc);
		return;
	}
	client.sendInfoMessage("Npc "+string+" not found.");
}));

/////////////////////////////////////////////////////////////
// Command: spawnnpc alias
GMCommands.AddCommand(GMCommands.getCommand('spawnnpc').Alias('sn'));