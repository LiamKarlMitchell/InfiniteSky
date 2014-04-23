// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: set
// sets some value
GMCommands.AddCommand(new Command('set',60,function command_set(string,client){
		// Get value name
		s =  string.split(' ');
		var ValueName = s[0];
		// Get value
		var Value = 0;
		var Value2 = 0;
		var Value3 = 0;

		if (s.length>=2)
		{
			Value = s[1];
		}
		if (s.length>=3)
		{
			Value2 = s[2];
		}
		if (s.length>=4)
		{
			Value3 = s[3];
		}

		if (isNaN(Value) || isNaN(Value2) || isNaN(Value3)) {
			client.sendInfoMessage("Only enter numbers for set values.");
			return;
		}

		var sendCharUpdate = false;

		switch(ValueName.toLowerCase())
		{
			case 'silver':
				// For giving/taking silver
				//var silverDifference = (client.character.Silver+Value) - client.character.Silver;

				client.write(
					new Buffer(
						packets.KeyValue.pack({
							'PacketID': 142,
							'Key': 1,
							'Value': Value-client.character.Silver // The difference in silver
						})
					)
				);

				// Set the silver
				client.character.Silver = Value;

				console.log('Set '+client.character.Name+' silver to '+Value);
			break;
			case 'gold':
				// For giving/taking gold
				//var silverDifference = (client.character.SilverBig+Value) - client.character.SilverBig;

				// client.write(
				// 	new Buffer(
				// 		packets.KeyValue.pack({
				// 			'PacketID': 142,
				// 			'Key': 1,
				// 			'Value': Value-client.character.SilverBig // The difference in silver
				// 		})
				// 	)
				// );

				// Set the silver
				client.character.SilverBig = Value;

				console.log('Set '+client.character.Name+' gold to '+Value);
			break;
			case 'statpoints':
				client.character.StatPoints = Value;
			break;
			case 'skillpoints':
				client.character.SkillPoints = Value;
			break;
			case 'gender':
				if (client.character.Gender==0)
				{
					client.character.Gender=1;
					client.character.state.Gender=1;
				}
				else
				{
					client.character.Gender=0;
					client.character.state.Gender=0;
				}
				sendCharUpdate = true;
			break;
			case 'hair':
				client.character.Hair = Value;
				client.character.state.Hair = Value;
				sendCharUpdate = true;
			break;
			case 'face':
				client.character.Face = Value;
				client.character.state.Face = Value;
				sendCharUpdate = true;
			break;
			case 'clan':
				client.character.Clan = Value % 3;
				client.character.state.Clan = Value % 3;
				sendCharUpdate = true;
			break;
			case 'duel_win':
				client.character.duel_win = Value;
				sendCharUpdate = true;
			break;
			case 'duel_loose':
				client.character.duel_loose = Value;
				sendCharUpdate = true;
			break;
			case 'honor':
				client.character.Honor = Value;
				client.character.do2FPacket=1;
				sendCharUpdate = true;
			break;
			case 'hp':
				client.character.state.CurrentHP = Value;
				client.character.do2FPacket=1;
				sendCharUpdate = true;
			break;
			case 'chi':
				client.character.state.CurrentChi = Value;
				client.character.do2FPacket=1;
				sendCharUpdate = true;
			break;
			case 'skill':
				client.character.state.Skill = Value;
				client.character.state.Frame = 0;
				sendCharUpdate = true;
			break;
			case 'frame':
				client.character.state.Frame = Value;
				sendCharUpdate = true;
			break;
			case 'stance':
				client.character.state.Stance = Value;
				sendCharUpdate = true;
			break;
			case 'ap':
				client.account.AP = Value;
				sendCharUpdate = true;
			break;
			case 'ring':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Ring) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Ring.ID = Value;
				client.character.Ring.Enchant = Value2;
				client.character.Ring.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'cape':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Cape) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Cape.ID = Value;
				client.character.Cape.Enchant = Value2;
				client.character.Cape.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'armor':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Armor) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Armor.ID = Value;
				client.character.Armor.Enchant = Value2;
				client.character.Armor.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'gloves':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Gloves) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Glove.ID = Value;
				client.character.Glove.Enchant = Value2;
				client.character.Glove.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'amulet':
				var ii = infos.Item[Value].Necklace;
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Amulet.ID = Value;
				client.character.Amulet.Enchant = Value2;
				client.character.Amulet.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'boots':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Boots) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Boot.ID = Value;
				client.character.Boot.Enchant = Value2;
				client.character.Boot.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'bottle':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Bottle) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.CalbashBottle.ID = Value;
				client.character.CalbashBottle.Enchant = Value2;
				client.character.CalbashBottle.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'weapon':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}

				if (!(
					ii.ItemType === infos.Item.Type.Sword ||
					ii.ItemType === infos.Item.Type.Blade ||
					ii.ItemType === infos.Item.Type.Marble ||
					ii.ItemType === infos.Item.Type.Katana ||
					ii.ItemType === infos.Item.Type.DoubleBlade ||
					ii.ItemType === infos.Item.Type.Lute ||
					ii.ItemType === infos.Item.Type.LightBlade ||
					ii.ItemType === infos.Item.Type.LongSpear ||
					ii.ItemType === infos.Item.Type.Scepter)) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Weapon.ID = Value;
				client.character.Weapon.Enchant = Value2;
				client.character.Weapon.Combine = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'pet':
				var ii = infos.Item[Value];
				if (!ii) {
					client.sendInfoMessage(Value+' is not a valid Item.');
					break;
				}
				if (ii.ItemType !== infos.Item.Type.Pet) {
					client.sendInfoMessage('Item is not valid Type for this slot.');
					break;
				}
				client.character.Pet.ID = Value;
				client.character.Pet.Activity = Value2;
				client.character.Pet.Growth = Value3;
				client.character.save();
				sendCharUpdate = true;
			break;
			case 'map':
				if (zones[Value]) {
					client.sendInfoMessage('Please relog to load into map if possible.');
					client.character.MapID = Value;
					client.character.ToMapID = Value;
					client.character.save();
					client.account.active = 0;
					client.account.save();
					client.destroy();
				}
				else
				{
					client.sendInfoMessage('Zone not found');
				}
			break;			
			default:
				client.sendInfoMessage(ValueName+' is not a valid value to set try one of these');
				client.sendInfoMessage('silver, statpoints, skillpoints, gender, hair, face, clan, duel_win, duel_loose, name, skill, frame, stance, ap, ring, cape, armor, glove, amulet, boot, bottle, weapon, pet, mapid');
				break;
			break;
		}


		if (sendCharUpdate) {
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
			client.character.updateInfos();

			client.Zone.sendToAllArea(client,true,packets.makeCompressedPacket(		
				0x18,
				new Buffer(
						packets.ActionReplyPacket.pack(
							client.character.state
							)
						)
				),config.viewable_action_distance
			);
		}
		//client.send2FUpdate();
}));