GMCommands.AddCommand(new Command('invt',20,function command_clearinventory(string,client){
		

		client.character.SkillPoints= 0;
		client.character.markModified('SkillPoints');
                client.character.save();
                console.log(client.character.Honor)
                
}));