// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: reset
// Resets the character
GMCommands.AddCommand(new Command('reset',20,function command_reset(string,client){
		// Ask if they are sure they want to reset with some sort of dialog? 
		// Or make them type /reset YES
		// This should be coded to clear all inventory, skills, stat, skillpoints etc
		// Basicaly recreating their character.
		client.character.Reset();
		client.send2FUpdate();
}));