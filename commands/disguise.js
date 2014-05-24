// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: disguise
// disguises you as a monster just give it an id, use 0 to undisguise
GMCommands.AddCommand(new Command('disguise',60,function command_disguise(string,client){
	var mi = infos.Monster[string];
	if (!mi) {
		mi = infos.Monster.getByNameLike(string);
		if (mi.length) { 
			mi = mi[0];
		}
	}

	if (!mi) {
		client.sendInfoMessage('Monster "'+string+'" was not found.');
	} else {
		client.sendInfoMessage('Disguise is not yet implemented on this server.');
	}
}));

