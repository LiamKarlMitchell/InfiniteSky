GMCommands.AddCommand(new Command('reset',20,function command_clearinventory(string,client){

		client.character.Stat_Dexterity= 0;
		client.character.markModified('Stat_Vitality');
        client.character.save();
		client.character.Stat_Strength=0
		client.character.markModified('Stat_Strength');
        client.character.save();
        client.character.StatPoints=1480
		client.character.markModified('StatPoints');
        client.character.save();
         GMCommands.getCommand('reload').Execute.call(this,'',client);	
		//console.log(client.character.SkillList)
}));