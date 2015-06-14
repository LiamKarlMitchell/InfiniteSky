// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: spawnmonster
// Finds all monsters and spawns onto your zone
GMCommands.AddCommand(new Command('spawnmonster',60,function command_spawnmonster(string,client){
	if (string.length==0) return;
	// Get ID from string
	var ID;
	
	if (isNaN(string)) {
		var monsters = infos.Monster.getByNameLike(string);
			if (monsters.length) {
				ID = monsters[0].ID;
		}
	} else {
		ID = Number(string);
	}


	Number(string);

	// Get XYZ from string?

	// Get Amount from string

	var monster = infos.Monster[ID];
	if (monster)
	{
		client.sendInfoMessage("Monster found "+monster.ID+" "+monster.Name);
		var spawninfo = {
		'UniqueID': 0,
		'ID': ID,
		'Location': client.character.state.Location,
		'Direction': client.character.state.FacingDirection
		}

		var mon = client.Zone.createMonster(spawninfo);
		mon.gmspawn = true;
		client.Zone.addMonster(mon);
		return;
	}
	client.sendInfoMessage("Monster "+string+" not found.");
}));

/////////////////////////////////////////////////////////////
// Command: spawnmonster alias
GMCommands.AddCommand(GMCommands.getCommand('spawnmonster').Alias('sm'));