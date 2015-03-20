// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: cut
// Command to cut a character
GMCommands.AddCommand(new Command('cut',20,function command_cut(string,client){
	//client.damage({ normal: 10 }, client.character.state);

	var Damage = 1000;
	var CutPacket = {
		Action: 5, // 0 if your attacking otherwise 5,6,7 or 1 if skill
		AttackerID: client.character.state.CharacterID,
		AttackerIndex: 0,
		DefenderID: client.character.state.CharacterID,
		DefenderIndex: 0,
		Status: 1, // Depends on attacker or defender | hit or miss, block or not |
		TotalDamage: 1000,
		Deadly: Damage,
		Light: 0,
		Shadow: 0,
		Dark: 0,
		DamageHP: Damage // Deadly bypasses defense
	};

	client.character.state.CurrentHP -= CutPacket.DamageHP;
	client.Zone.sendToAllAreaLocation( client.character.state.Location,packets.makeCompressedPacket(0x2C,new Buffer(packets.AttackPacketReply.pack(CutPacket))),config.viewable_action_distance );

	client.character.do2FPacket = 1;
	// client.write(packets.makeCompressedPacket(
	// 		0x18,
	// 		new Buffer(
	// 				packets.ActionReplyPacket.pack(
	// 					client.character.state
	// 					)
	// 				)
	// 		)
	// );
	client.character.infos.updateAll();
	client.character.do2FPacket=1;
	client.Zone.sendToAllArea(client,true,client.character.state.getPacket(),config.viewable_action_distance);

	client.sendInfoMessage(client.character.Name + ' has cut you for '+Damage);
}));
