// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
ZonePC.Set(0x16, {
	Restruct: restruct.
	int32lu('Key').
	int32lu('Value').
	int8lu('Unknown'),

	function: function SpendStatpoint(client, input) {
		if (client.character.StatPoints === 0) return;

		//if (input.Key==0x55)
		switch (input.Key) {
		case 0:
		case 1:
		case 2:
		case 3:
			input.Value = 1;
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			input.Value = 5;
			break;
		}

		// Check that they have StatPoints to spend
		if (client.character.StatPoints < input.Value) return;
		// Vit 3
		// Chi 1
		// Str 0
		// Dex 2
		switch (input.Key) {
		case 0:
			// Str
			client.character.StatStrength += input.Value;
			//client.sendInfoMessage('Increment Str by ' + input.Value);
			client.character.infos.updateStat('StatStrength');
			break;
		case 1:
			// Chi
			client.character.StatChi += input.Value;
			//client.sendInfoMessage('Increment Chi by ' + input.Value);
			client.character.infos.updateStat('StatChi');
			break;
		case 2:
			// Dex
			client.character.StatDexterity += input.Value;
			//client.sendInfoMessage('Increment Dex by ' + input.Value);
			client.character.infos.updateStat('StatDexterity');
			break;
		case 3:
			// Vit
			client.character.StatVitality += input.Value;
			//client.sendInfoMessage('Increment Vit by ' + input.Value);
			client.character.infos.updateStat('StatVitality');
			break;
		case 4:
			// Str 5
			client.character.StatStrength += input.Value;
			//client.sendInfoMessage('Increment Str by ' + input.Value);
			client.character.infos.updateStat('StatStrength');
			break;
		case 5:
			// Chi 5
			client.character.StatChi += input.Value;
			//client.sendInfoMessage('Increment Chi by ' + input.Value);
			client.character.infos.updateStat('StatChi');
			break;
		case 6:
			// Dex 5
			client.character.StatDexterity += input.Value;
			//client.sendInfoMessage('Increment Dex by ' + input.Value);
			client.character.infos.updateStat('StatDexterity');
			break;
		case 7:
			// Vit 5
			client.character.StatVitality += input.Value;
			//client.sendInfoMessage('Increment Vit by ' + input.Value);
			client.character.infos.updateStat('StatVitality');
			break;

		default:
			//client.sendInfoMessage('Invalid statpoint allocation: ' + input.Key);
			return;
			break;
		}

		client.character.StatPoints -= input.Value;

		client.write(new Buffer(Zone.send.KeyValueUnsigned.pack({
			PacketID: 0x84,
			Key: 0x37,
			// Hur?? koreans.
			Value: input.Key
		})));


		// client.character.updateInfos(false);
		// Update character state
		client.character.state.setFromCharacter(client.character);

		client.character.save();
	}
});

// Reset Stats 61
