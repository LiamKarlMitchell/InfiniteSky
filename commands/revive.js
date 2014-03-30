// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: revive
// It kills the character
GMCommands.AddCommand(new Command('revive',0,function command_die(string,client){
		client.character.setHP(client.character.state.MaxHP);
		client.character.state.Skill = 0;
		client.character.state.Frame = 0;
		client.character.state.Stance = 0;
		client.sendActionStateToArea();
}));