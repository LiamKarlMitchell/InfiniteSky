// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: monsterinfo
// Finds all monsters and logs out info where name is like what is entered
GMCommands.AddCommand(new Command('monsterinfo',0,function command_monsterinfo(string,client){
	if (string.length==0) return;

	var ID = parseInt(string,10)
	if (ID)
	{
		client.sendInfoMessage("Finding monster where ID is "+ID);
		var monster = infos.Monster[ID];
		if (monster)
		{
			//client.sendInfoMessage(monster.ID + " " + monster.Name+" ");
			client.sendInfoMessage(monster.toString());
		}
		else
		{
			client.sendInfoMessage("Not Found");
		}
		return;
	}

	var monsters = infos.Monster.getByNameLike(string);
	client.sendInfoMessage("Finding monsters where name is like "+string);
	for(var i=0;i<monsters.length;i++)
	{
		var monster = monsters[i];
		//client.sendInfoMessage(monster.ID + " " + monster.Name+" ");
		client.sendInfoMessage(monster.toString());
	}
	client.sendInfoMessage(monsters.length+" found");
}));

/////////////////////////////////////////////////////////////
// Command: monsterinfo alias
GMCommands.AddCommand(GMCommands.getCommand('monsterinfo').Alias('mi'));