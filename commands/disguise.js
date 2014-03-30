// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: disguise
// disguises you as a monster just give it an id, use 0 to undisguise
GMCommands.AddCommand(new Command('spawnitem',60,function command_spawnitem(string,client){
	console.log(client.character.Name+' wants to disguise as a monster');
}));