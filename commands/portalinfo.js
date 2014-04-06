// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: portalinfo
// Tells you info about portals on this map
GMCommands.AddCommand(new Command('portalinfo',60,function command_bring(string,client){
	var Zone = null;
	
	if (string.length) {
		Zone = zones[string];
	}

	if (Zone===null) {
		Zone = client.Zone;
	}

	var MoveRegions = Zone.MoveRegions;
	
	client.sendInfoMessage('Portals on map '+Zone.getName()+' are:');

	for (var i=0;i<MoveRegions.length;i++) {
		//client.sendInfoMessage(i+'. '+JSON.stringify(MoveRegions[i]));
		client.sendInfoMessage(i+'. X: '+MoveRegions[i].X+' Y: '+MoveRegions[i].Y+' Z: '+MoveRegions[i].Z+' ZoneID: '+MoveRegions[i].ZoneID+' Radius: '+MoveRegions[i].Radius);
	}
}));