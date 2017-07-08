// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: save
// Command to force save of character
GMCommands.AddCommand(new Command('save',0,function command_save(string,client){
	client.sendInfoMessage('Saving your Character and Account to DB');
	client.character.save();
	client.account.save();
}));