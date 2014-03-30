// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: hide
// Command to hide
// Should prevent the action packets being sent to Everyone currently but want it to be anyone whos gm level is lower than yours
GMCommands.AddCommand(new Command('hide',80,function command_hide(string,client){
	client.character.state.hidden=true;
	client.sendInfoMessage('You are invisible to others');
}));