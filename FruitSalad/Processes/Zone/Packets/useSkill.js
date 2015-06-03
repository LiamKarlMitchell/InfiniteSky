Zone.recv.useSkill = restruct.
	int32lu('ChiUsage').
	int32lu('SkillID').
	int32lu('SkillLevel').
	int32lu('ChiUsage2').
	int32lu('Unk5').
	int32lu('Unk6');

ZonePC.Set(0x19, {
	Restruct: Zone.recv.useSkill,
	function: function useSkill(client, input){
		if(client.character.state.onSkillUseState){
			client.character.state.onSkillUseState = false;

			client.node.update();
	        client.character.state.SkillID = input.SkillID;
			client.character.state.SkillLevel = input.SkillLevel;
			Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
		}
	}
});
