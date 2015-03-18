// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: disguise
// disguises you as a monster just give it an id, use 0 to undisguise
GMCommands.AddCommand(new Command('disguise',60,function command_disguise(input,client){
	if (input == 0 || input = '') {
		client.character.state.MonsterDisguise = 0;
		client.sendInfoMessage('Undisguised.');
	} else {
	  var mi;

		if (isNaN(input)) {
			mi = infos.Monster.getByNameLike(input);
			if (mi.length) {
				mi = mi[0];
			}
		} else {
			mi = infos.Monster[input];
		}

		if (!mi) {
			client.sendInfoMessage('Monster "'+input+'" was not found.');
			return;
		} else {
			client.character.state.MonsterDisguise = mi.ID;
			client.sendInfoMessage('Disguised as monster '+mi.Name);
		}
  }

	client.character.do2FPacket = 1;
	client.character.infos.updateAll();
	client.Zone.sendToAllArea(client,true,client.character.state.getPacket(),config.viewable_action_distance);
}));
