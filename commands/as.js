// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: as
// Executes a GM Command as if it were from another client providing they are online
GMCommands.AddCommand(new Command('as',100,function command_as(string,client){
	//var indexofSpace = string.indexOf(' ');
	//var CharacterName = indexofSpace>-1 ? string.substr(indexofSpace+1).toLowerCase() : string;
	//var CommandName = indexofSpace>-1 ? string.substr(0,indexofSpace).toLowerCase() : string;
	//var CommandText = indexofSpace>-1 ? string.substr(indexofSpace+1).toLowerCase() : string;
	// Need to pull out CharacterName, CommandName, CommandText is whats left
	// Need to find characters socket in world if possible
	// Need to do a GMCommand.Execute(CommandName+' '+CommandText,Character)
}));