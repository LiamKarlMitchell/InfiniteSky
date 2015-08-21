GMCommands.AddCommand(new Command('dd',60,function command_test(string, client){
  client.character.DamageDealer = new DamageDealer(client);
}));

GMCommands.AddCommand(new Command('t',60,function command_test(string, client){
  Zone.QuadTree.findNodeById(client.node.id, function(node){
    client.character.DamageDealer.attack(node);
  });
}));
