GMCommands.AddCommand(new Command('state',0,function command_bring(string,client){
	console.log(client.character.state);

	for(var i in client.character.state.Buffs){
		client.character.state.Buffs[i] = {};
	}

	for(var i in client.character.state.Buffs2){
		client.character.state.Buffs2[i] = {};
	}

	client.character.state.BuffHS = {};

	client.Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
}));