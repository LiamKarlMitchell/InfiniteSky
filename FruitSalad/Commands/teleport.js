// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: teleport
// Teleport on the map
var XYZRegex = /^(-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?)$/m
var XZRegex = /^(-?\d+(?:\.\d)?) (-?\d+(?:\.\d)?)$/m;
GMCommands.AddCommand(new Command('teleport',20,function command_teleport(string,client){
		// Need to code teleport
		console.log(client.character.Name+' wants to teleport');
		
		var location = new CVec3();
		var zoneID = client.character.MapID;

		var match = XZRegex.exec(string);
		if (match != null) {
			location.X = parseFloat(match[1]);
			location.Y = client.character.state.Location.Y;
			location.Z = parseFloat(match[2]);
		} else {
			match = XYZRegex.exec(string);
			if (match != null) {
				location.X = parseFloat(match[1]);
				location.Y = parseFloat(match[2]);
				location.Z = parseFloat(match[3]);
			}
		}

		if (isNaN(location.X) || isNaN(location.Y) || isNaN(location.Z)) {
			client.sendInfoMessage('Invlaid input');
			return;
		}

		if (!Zone.move(client, location, zoneID)) {
			client.sendInfoMessage('Teleport Failed');
		}
}));

/////////////////////////////////////////////////////////////
// Command: teleport alias
GMCommands.AddCommand(GMCommands.getCommand('teleport').Alias('tp'));