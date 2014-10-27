// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
/////////////////////////////////////////////////////////////
// Command: paygod
// Command Drops some special items
GMCommands.AddCommand(new Command('paygod', 60, function command_cut(string, client) {
 {
	        var spawninfo = {
	            'ID': 99001,
	            'Location': client.character.state.Location,
	            'Direction': client.character.state.FacingDirection
	        };
	        var itemspawn = client.Zone.createItem(spawninfo);
	        client.Zone.addItem(itemspawn);
	    }
	{
{
	        var spawninfo = {
	            'ID': 1,
	            'Amount': 1589000,
	            'Location': client.character.state.Location,
	            'Direction': client.character.state.FacingDirection
	        };
	        var itemspawn = client.Zone.createItem(spawninfo);
	        client.Zone.addItem(itemspawn);

	    }
	{
{
	        var spawninfo = {
	            'ID': 141,
	            'Location': client.character.state.Location,
	            'Direction': client.character.state.FacingDirection
	        };
	        var itemspawn = client.Zone.createItem(spawninfo);
	        client.Zone.addItem(itemspawn);
	        
	    }}}
	}
));
