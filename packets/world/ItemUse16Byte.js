WorldPC.ItemUse16Bytes = restruct.
	int32ls('Type').
	int32ls('Index').
	int32ls('Unknown1').
	int32ls('Unknown2');

// Action: 
//   0 - 
//   1 - 
//   2 - 
//   3 - 
//   4 - 
//   5 - Wargod Skill

WorldPC.Set(0x63, {
	Restruct: WorldPC.ItemUse16Bytes,
	function: function UseItem(client, input) {
		console.log("ItemUse16Bytes called ( "+input.Type+', '+input.Index+" )");
		switch(input.Type) {
			case 5: // Learn WarGod Skill
				if (input.Index>8) {
					console.log('Error invalid WarGod index.');
					return;
				}

				switch (client.character.Clan) {
					case 0:
					if (input.Index > 2) {
						console.log('Invalid WarGod index for clan.');
					}
					break;
					case 1:
					if (input.Index > 5 || input.Index < 3) {
						console.log('Invalid WarGod index for clan.');
					}
					break;
					case 2:
					if (input.Index > 9 || input.Index < 6) {
						console.log('Invalid WarGod index for clan.');
					}
					break;
				}
				
				// 112 Fiery Dragon
				// 113 Thunderous Dragon
				// 114 Spirit of Pegas
				// 115 Deadly Thunder
				// 116 Ghostly Gust
				// 117 Lunar Explosion
				// 118 Destructive Swirl
				// 119 Bloody Gallop
				// 120 Devilish Blast
				var skillinfo = infos.Skill[112+input.Index];
				if (!skillinfo) {
					console.log('Error WarGod Skill index '+input.Index+' was not found.');
				}

				client.sendInfoMessage('Learning Skill ['+skillinfo.Name+'] is not currently implemented.');

				// TODO: Learn WarGod Skill from ItemID 99214, 99215, 99216
				// Reply to packet
				// Remove item from inventory

			break;
			default:
			client.sendInfoMessage('ItemUse16Bytes Type '+input.Type+' is not currently implemented.');
			break;
		}
	}
});