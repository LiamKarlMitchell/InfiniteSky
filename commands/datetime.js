// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: datetime
// Command to get the datetime of server
GMCommands.AddCommand(new Command('datetime',0,function command_datetime(string,client){
	client.sendInfoMessage('Server DateTime: '+new Date());
}));