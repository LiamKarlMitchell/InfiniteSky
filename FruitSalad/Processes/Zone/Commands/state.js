GMCommands.AddCommand(new Command('state',60,function command_test(string, client){
  client.character.Level = 145;
  // client.character.state.InDuel = 0;
  // client.character.state.InDuelChallenger = 0;
  Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
}));
