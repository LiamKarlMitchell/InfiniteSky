// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: where
// Tells you where you are
GMCommands.AddCommand(new Command('where',20,function command_where(string,client){
	client.sendInfoMessage('XYZ: '+client.character.state.Location.toString());
	log('test from where');
}));