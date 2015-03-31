// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: giveskills
// gives character some skills to test
GMCommands.AddCommand(new Command('setskills',1,function command_giveskills(string,client){
   for (var i=1;i<30;i++) {
     client.character.SkillList[i] = { ID: i+1, Level: 1 }
   }
   client.character.markModified('SkillList');
   client.character.save();
   client.sendInfoMessage('Please log out and back in for changes to apply.');
}));


GMCommands.AddCommand(new Command('setskill', 60, function command_setskill(string, client) {
	var inputs = string.split(' ');

	if (inputs.length === 0 || inputs.length > 3) {
	  client.sendInfoMessage('Usage /setskill slot <skill> <level>');
	  return;
	}

	var slot    = inputs[0];
	var skillid = inputs[1] || 0;
	var level   = inputs[2] || 1;

	if (isNaN(slot) || (slot < 0 || slot > 29) ) {
	  client.sendInfoMessage('Slot should be a number between 0 and 29.');
	  return;
	}

	if (isNaN(skillid)) {
	 client.sendInfoMessage('Skillid should be a number.');
	 return;
	}

	if (isNaN(level)) {
	  client.sendInfoMessage('Level should be a number.');
	  return;
	}

	if (skillid === 0) {
		client.character.SkillList[slot] = null;
	} else {
		var si = infos.Skill[skillid];

		if (si === null) {
		  client.sendInfoMessage('Skill not found.');
		  return;
		}

		if (level > si.MaxSkillLevel) {
			client.sendInfoMessage('Max level for Skill '+si.Name+' is '+si.MaxSkillLevel+'.');
			return;
		}

		// TODO: Check skillinfo Clan to ensure character can use the skill they are trying to set.

		client.character.SkillList[slot] = { ID: skillid, Level: level };
	}

	client.character.markModified('SkillList');
    client.character.save();

    GMCommands.getCommand('load').Execute.call(this,'',client);
}));