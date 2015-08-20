GMCommands.AddCommand(new Command('t',60,function command_test(string, client){
  client.character.DamageDealer = new DamageDealer(client);
}));
