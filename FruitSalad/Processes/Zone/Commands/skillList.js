GMCommands.AddCommand(new Command('list',20,function command_clearinventory(string,client){
		console.log(client.character.SkillList)
}));