// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: map
// Tells you the map your on
GMCommands.AddCommand(new Command('map',0,function command_map(string,client){
	client.sendInfoMessage(client.Zone.getID()+' '+client.Zone.getName());
}));