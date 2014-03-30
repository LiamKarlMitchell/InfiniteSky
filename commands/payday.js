// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: payday
// Command Drops lots of cash random amounts 1 to 500
GMCommands.AddCommand(new Command('payday', 60, function command_cut(string, client) {
	var item = infos.Item[1]);
	for (var i = 0; i < 50; i++) {

		var Amount = Math.floor((Math.random() * 500 + 1));
		if (item != null) {
			var spawninfo = {
				'ID': item.ID,
				'Amount': Amount,
				'Location': client.character.state.Location,
				'Direction': client.character.state.FacingDirection
			};

			var itemspawn = client.Zone.createItem(spawninfo);
			client.Zone.addItem(itemspawn);
		}
}
}));