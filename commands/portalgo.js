// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: portalgo
// Trys to teleport you to a portalinfo on this map
GMCommands.AddCommand(new Command('portalgo',60,function command_bring(string,client){
	var i = 0;
	if (string.length) {
		i = parseInt(string,10);
	}

	var Zone = client.Zone;
	var MoveRegions = Zone.MoveRegions;
	
	if (i>=MoveRegions.length) i = 0;
	
	var location = new CVec3();
	location.X = MoveRegions[i].X;
	location.Y = MoveRegions[i].Y;
	location.Z = MoveRegions[i].Z;
	if (client.Teleport(location,Zone.getID())==false) client.sendInfoMessage('Teleport Failed');
}));