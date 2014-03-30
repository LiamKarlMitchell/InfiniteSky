// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: unhide
// Command to unhide
GMCommands.AddCommand(new Command('unhide',80,function command_unhide(string,client){
	client.character.state.hidden=false;
	client.sendInfoMessage('You are visible to others');
}));