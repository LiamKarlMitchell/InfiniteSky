// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: maps
// Lists maps loaded
GMCommands.AddCommand(new Command('maps', 50, function command_goto(string, client) {
	client.sendInfoMessage('These maps are set to be loaded:');

var output = '';
	for (var i=0;i<zonesinfo.Zones.length;i++) {
		var z = zonesinfo.Zones[i];
		if (z.Load) {
          output+=z.Name+' ';
          if (z.DisplayName) output+='['+z.DisplayName+'] ';
		}
	}
	client.sendInfoMessage(output);
}));