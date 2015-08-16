GMCommands.AddCommand(new Command('heal',60,function command_test(string, client){
  client.character.state.CurrentHP = client.character.infos.MaxHP;
  client.character.state.CurrentChi = client.character.infos.MaxChi;
  client.character.save();
  client.send2F();
}));
