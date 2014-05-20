// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: skillinfo
// Finds all skills and logs out info where name is like what is entered
GMCommands.AddCommand(new Command('skillinfo',0,function command_skillinfo(string,client){
	if (string.length==0) return;

	var ID = parseInt(string,10)
	if (ID)
	{
		client.sendInfoMessage("Finding skill where ID is "+ID);
		var skill = infos.Skill[ID];
		if (skill)
		{
			client.sendInfoMessage(skill.toString());
		}
		else
		{
			client.sendInfoMessage("Not Found");
		}
		return;
	}

<<<<<<< HEAD
	var skills = infos.Skill.getByNameLike(string);
=======
	var skills = infos.Skil.getByNameLike(string);
>>>>>>> upstream/master
	client.sendInfoMessage("Finding skills where name is like "+string);
	for(var i=0;i<skills.length;i++)
	{
		var skill = skills[i];
		client.sendInfoMessage(skill.toString());
	}
	client.sendInfoMessage(skills.length+" found");
}));

/////////////////////////////////////////////////////////////
// Command: skillinfo alias
GMCommands.AddCommand(GMCommands.getCommand('skillinfo').Alias('si'));