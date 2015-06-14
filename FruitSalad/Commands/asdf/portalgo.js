// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: portalgo
// Trys to teleport you to a portalinfo on this map
GMCommands.AddCommand(new Command('portalgo',60,function command_bring(string, client){
	var i = 0;
	console.log('portalgo: '+string);
	if (string.length) {
		i = parseInt(string,10);
	}

	var Zone = client.Zone;
	
	if (i>=Zone.MoveRegions.length) {
		client.sendInfoMessage('No portal of this index.');
		return;
	}
	
	var location = new CVec3();
	location.X = Zone.MoveRegions[i].X;
	location.Y = Zone.MoveRegions[i].Y;
	location.Z = Zone.MoveRegions[i].Z;
	if (client.Teleport(location,Zone.ID)==false) client.sendInfoMessage('Teleport Failed');
}));