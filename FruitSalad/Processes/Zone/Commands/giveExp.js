GMCommands.AddCommand(new Command('exp',60,function command_test(string, client){
	Zone.giveEXP(client, parseInt(string));
}));
