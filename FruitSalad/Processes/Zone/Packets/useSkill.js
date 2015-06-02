Zone.recv.useSkill = restruct.
	int32lu('ChiUsage').
	int32lu('SkillID').
	int32lu('SkillLevel').
	int32lu('ChiUsage2').
	int32lu('Unk5').
	int32lu('Unk6');

ZonePC.Set(0x19, {
	Restruct: Zone.recv.useSkill,
	function: function makeIt(client, input){
		console.log('make it method');

		// if(client.character.state.onSkillStateUpdate){
			// client.character.state.onSkillStateUpdate = false;

	        client.character.state.SkillID = input.SkillID;
			client.character.state.SkillLevel = 20;

			Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
		// }
	}
});
