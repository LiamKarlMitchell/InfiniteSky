// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: mc
// Count monsters on map
GMCommands.AddCommand(new Command('mc',0,function command_monstercount(string,client){	
	client.sendInfoMessage('Monsters on Zone: '+client.Zone.Monsters.length);
	//client.Zone.Objects.Find();
}));