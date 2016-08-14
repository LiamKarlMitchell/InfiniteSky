GMCommands.AddCommand(new Command('skill',20,function command_clearinventory(string,client){
		// Clear the inventory
		for (var i=0;i<client.character.SkillList.length;i++) {
			client.character.SkillList[i] = null;
		}
		client.character.markModified('SkillList');
	    client.character.save();
        GMCommands.getCommand('reload').Execute.call(this,'',client);	
}));
