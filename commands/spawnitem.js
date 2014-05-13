// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: spawnitem
// Finds all items and spawns onto your zone
GMCommands.AddCommand(new Command('spawnitem',60,function command_spawnitem(string,client){
	if (string.length===0) return;
	// Get ID from string
	var ID = 0;
	var Amount = 1;	

    var s = string.split(' ');

	if (s.length>=1) {
		ID = Number(s[0]);
	}
	if (s.length>=2) {
		Amount = Number(s[1]);
	}

	// Get XYZ from string?

	// Get Amount from string

	var item = infos.Item[ID];
	if (item!==null)
	{
		client.sendInfoMessage("Item found "+item.ID+" "+item.Name+' Spawning '+Amount);
		var spawninfo = {
		'ID': ID,
		'Amount': Amount,
		'Location': client.character.state.Location,
		'Direction': client.character.state.FacingDirection,
		'Owner': client.character.Name
		};

		var itemspawn = client.Zone.createItem(spawninfo);
		client.Zone.addItem(itemspawn);
		return;
	}
	client.sendInfoMessage("Item "+string+" not found.");
}));

/////////////////////////////////////////////////////////////
// Command: spawnitem alias
GMCommands.AddCommand(GMCommands.getCommand('spawnitem').Alias('i'));