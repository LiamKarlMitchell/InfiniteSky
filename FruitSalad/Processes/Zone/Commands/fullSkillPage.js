
GMCommands.AddCommand(new Command('full',60,function command_testskilllearn(string, client){
	for (var i = 20; i < 30; i++) {
						client.character.SkillList[i] = {						
				      ID: 100,				      
				      Level: 1
				    };

				    client.character.markModified('SkillList');
				    client.character.save()
					}
					GMCommands.getCommand('reload').Execute.call(this,'',client);	
  
}));

