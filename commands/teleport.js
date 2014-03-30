// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: teleport
// Teleport on the map
var XYZRegex = /^(-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?)$/m
var XZRegex = /^(-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?)$/m;
GMCommands.AddCommand(new Command('teleport',20,function command_teleport(string,client){
		console.log(client.character.Name+' wants to teleport');
		// Need to code teleport

		var location = new CVec3();
		var MapID = client.character.MapID;

		var match = XZRegex.exec(string);
		if (match != null) {
			location.X = match[1];
			location.Y = client.character.state.Location.Y;
			location.Z = match[2];

			if (client.Teleport(location,MapID)==false) client.sendInfoMessage('Teleport Failed');
		}
		else
		{
			match = XYZRegex.exec(string);
			if (match != null) {
				location.X = match[1];
				location.Y = match[2];
				location.Z = match[3];
				if (client.Teleport(location,MapID)==false) client.sendInfoMessage('Teleport Failed');
			}
		}
}));

/////////////////////////////////////////////////////////////
// Command: teleport alias
GMCommands.AddCommand(GMCommands.getCommand('teleport').Alias('tp'));