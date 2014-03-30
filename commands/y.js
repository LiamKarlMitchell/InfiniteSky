// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: y
// Tells you your y position on the current map or null if in invalid spot.
GMCommands.AddCommand(new Command('y',90,function command_y(string,client){
	var y = client.Zone.GetY(client.character.state.Location.X, client.character.state.Location.Z);
	client.sendInfoMessage('y: '+y);
	log('test from y');
}));