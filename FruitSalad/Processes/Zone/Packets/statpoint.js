// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
ZonePC.Set(0x16, {
	Restruct: restruct.
	int32lu('Key').
	int32lu('Value').
	int8lu('Unknown'),

	function: function SpendStatpoint(socket, pac) {
		if (socket.character.StatPoints == 0) return;

		//if (pac.Key==0x55)
		switch (pac.Key) {
		case 0:
		case 1:
		case 2:
		case 3:
			pac.Value = 1;
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			pac.Value = 5;
			break;
		}

		// Check that they have StatPoints to spend
		if (socket.character.StatPoints < pac.Value) return;
		// Vit 3
		// Chi 1
		// Str 0
		// Dex 2
		switch (pac.Key) {
		case 0:
			// Str
			socket.character.StatStrength += pac.Value;
			//socket.sendInfoMessage('Increment Str by ' + pac.Value);
			socket.character.infos.updateStat('StatStrength');
			break;
		case 1:
			// Chi
			socket.character.StatChi += pac.Value;
			//socket.sendInfoMessage('Increment Chi by ' + pac.Value);
			socket.character.infos.updateStat('StatChi');
			break;
		case 2:
			// Dex
			socket.character.StatDexterity += pac.Value;
			//socket.sendInfoMessage('Increment Dex by ' + pac.Value);
			socket.character.infos.updateStat('StatDexterity');
			break;
		case 3:
			// Vit
			socket.character.StatVitality += pac.Value;
			//socket.sendInfoMessage('Increment Vit by ' + pac.Value);
			socket.character.infos.updateStat('StatVitality');
			break;
		case 4:
			// Str 5
			socket.character.StatStrength += pac.Value;
			//socket.sendInfoMessage('Increment Str by ' + pac.Value);
			socket.character.infos.updateStat('StatStrength');
			break;
		case 5:
			// Chi 5
			socket.character.StatChi += pac.Value;
			//socket.sendInfoMessage('Increment Chi by ' + pac.Value);
			socket.character.infos.updateStat('StatChi');
			break;
		case 6:
			// Dex 5
			socket.character.StatDexterity += pac.Value;
			//socket.sendInfoMessage('Increment Dex by ' + pac.Value);
			socket.character.infos.updateStat('StatDexterity');
			break;
		case 7:
			// Vit 5
			socket.character.StatVitality += pac.Value;
			//socket.sendInfoMessage('Increment Vit by ' + pac.Value);
			socket.character.infos.updateStat('StatVitality');
			break;

		default:
			//socket.sendInfoMessage('Invalid statpoint allocation: ' + pac.Key);
			return;
			break;
		}

		socket.character.StatPoints -= pac.Value;

		socket.write(new Buffer(Zone.send.KeyValueUnsigned.pack({
			PacketID: 0x84,
			Key: 0x37,
			// Hur?? koreans.
			Value: pac.Key
		})));


		// socket.character.updateInfos(false);
		// Update character state
		socket.character.state.setFromCharacter(socket.character);

		socket.character.save();
	}
});

// Reset Stats 61