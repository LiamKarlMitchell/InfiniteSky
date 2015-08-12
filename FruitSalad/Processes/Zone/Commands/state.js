GMCommands.AddCommand(new Command('state',60,function command_test(string, client){
  client.character.state.CurrentHP = 100;
  client.character.state.CurrentChi = 100;
  Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
}));
