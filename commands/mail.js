// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: mail
// Command to access mail functions
GMCommands.AddCommand(new Command('mail',0,function command_mail(string,client){
	client.sendInfoMessage('You have (0) mail messages');
}));