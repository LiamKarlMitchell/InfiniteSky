GMCommands.AddCommand(new Command('dd',60,function command_test(string, client){
  client.character.DamageDealer = new DamageDealer(client);
}));

GMCommands.AddCommand(new Command('t',60,function command_test(string, client){
  // Zone.QuadTree.findNodeById(client.node.id, function(node){
  //   client.character.DamageDealer.attack(node);
  // });

	// var attackInfo = { actionValue: 1, Status: 0 };
	// processAttack(attackInfo, client.character.state, client.character.state.target_id);
	// console.log(attackInfo);

  var obj = {};

  obj.Action = 0;
  obj.CharacterID = client.character.state.CharacterID;
	obj.NodeID = client.character.state.NodeID;

  obj.tUniqueID = 0;
	obj.tNodeID = 0;

  obj.A = 0;
  obj.B = 0;
  obj.C = 0;
  obj.D = 0;

	obj.Damage = Math.random() * 100;
  obj.Successful = 1;
  obj.DamageHP = 100;

	// TODO: Send attack packet to target location.
	client.write(packets.makeCompressedPacket(0x2C, new Buffer(Zone.send.attack.pack(obj))));
}));
