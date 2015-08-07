// var buffer = new Buffer(Zone.send.createGuild.pack({
//   PacketID: 0x9D,
//   GuildName: client.character.GuildName,
//   LeaderName: client.character.state.Guild.leader,
//   Level: guild.level,
//   Members: guild.getMembersList(),
//   Privileges: guild.getPrivilegesList(),
//   Result: 0
// }));
//
// invitedBy.write(buffer);
//
//
// var test = restruct.
//   int8lu('id').
//   int32lu('unk').
//   int32lu('unk2').
//   int32lu('unk3').
//   int32lu('unk4');
//
// console.log(test.size);

GMCommands.AddCommand(new Command('g',60,function command_test(string, client){
  client.character.state.unk1 = 2;
  client.character.state.unk2 = 2;
  Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
}));

GMCommands.AddCommand(new Command('g2',60,function command_test(string, client){
  // global.rpc.api.invalidateGuildForClient(['Ane', 'Test', 'Test2']);

  // client.write(new Buffer(Zone.send.onGuildToClient.pack({
  //   PacketID: 0x54,
  //   Switch: 0x18
  // })));

  // client.write(new Buffer(test.pack({
  //   id: 0x7C,
  //   unk: client.character._id,
  //   unk2: client.node.id,
  //   unk3: 1,
  //   unk4: 1
  // })));
}));
