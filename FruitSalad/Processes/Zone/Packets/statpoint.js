// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
ZonePC.Set(0x16, {
	Restruct: restruct.
	int32lu('Key').
	int32lu('Value').
	int8lu('Unknown'),

	function: function SpendStatpoint(client, input) {
		if(!client.character.StatPoints) return;

		var spend;
		if(input.Key === 0 || input.Key === 1 || input.Key === 2 || input.Key === 3) spend = 1;
		if(input.Key === 4 || input.Key === 5 || input.Key === 6 || input.Key === 7) spend = 5;

		if(!spend){
			return;
		}

		if(spend > client.character.StatPoints){
			return;
		}

		var update;
		switch(input.Key){
			case 0:
			case 4:
			update = 'Damage';
			client.character.Stat_Strength += spend;
			break;

			case 1:
			case 5:
			update = 'MaxChi';
			client.character.Stat_Chi += spend;
			break;

			case 2:
			case 6:
			update = ['DodgeRate', 'HitRate'];
			client.character.Stat_Dexterity += spend;
			break;

			case 3:
			case 7:
			update = 'MaxHp';
			client.character.Stat_Vitality += spend;
			break;
		}

		if(!update){
			return;
		}

		client.character.StatPoints -= spend;
		client.character.infos.update(update, function(){
			client.character.save(function(err){
				if(err){
					return;
				}

				client.write(new Buffer(Zone.send.KeyValueUnsigned.pack({
					PacketID: 0x84,
					Key: 0x37,
					Value: input.Key
				})));
			});
		});
	}
});

// Reset Stats 61
