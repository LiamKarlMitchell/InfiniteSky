Zone.send.CharacterInfo = restruct.
	int8lu('PacketID').
	int8lu('Status').
	struct('character', structs.Character).
	int8lu('Unknown');

GMCommands.AddCommand(new Command('reload',60,function command_test(string, client){
  client.character.save(function(err){
    if(err){
      return;
    }

    db.Character.findOne({Name: client.character.Name}, function(err, character){
      if(err){
        return;
      }

      if(!character){
        return;
      }

      for(var name in character){
        client.character[name] = character[name];
      }

			client.character.unk = 12;

      var CharacterData = new Buffer(Zone.send.CharacterInfo.pack({
        PacketID: 0x16,
        Status: 0,
        character: client.character,
        Unknown: 0x00
      }));

      CharacterData = client.character.restruct(CharacterData);
      client.write(CharacterData);
      Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);

    });
  });
}));
