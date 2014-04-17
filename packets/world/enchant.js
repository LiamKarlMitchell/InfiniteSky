// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Enchanting Items
// Equipment can be enchanted to offer a higher bonus to the character. Success leads to a % increase based on the material, but failure can lead to a 3% loss or even item destruction.
// NPC: Blacksmith
// Maximum Enchant: 120%
// Enchanting Materials:
// 3% - Tin
// 6% - Dark Steel
// 9% - Black Steel
// 12% - Steel of Eternity
// 15% - Gold of Eternity

// Prices:
// Tin - 20,000
// Dark Steel - 40,000
// Black Steel - 70,000
// Steel of Eternity - 100,000
// Gold of Eternity - 200,000

var ReadEnchantPackeet = restruct.
int32lu('InventoryItemIndex').
int32lu('InventoryEnchantIndex').
int32lu('Unk3').
int32lu('Unk4');

var EnchantRespond = restruct.
int8lu('PacketID').
int8lu('Result').
int32lu('InventoryItemIndex').
int32lu('InventoryEnchantIndex').
int32lu('Price').
int32lu('EnchantValue'); // 1 = 3 so 4 = 12% add

console.log("Respond size: " + EnchantRespond.size);

// Results:
// 0 : Success
// 1 : Reached maximum enchanting %
// 2 : Not used in upgrades
// 3 : Not enough silver
// 4 : Item has been damaged -> Item Disappears
// 5 : Failed -> He loses the enchant

WorldPC.Set(0x3A, {
	Restruct: ReadEnchantPackeet,
	function: function enchantItem(client, input){
		console.log(input);
		var result = 0;

		var enchantingMat = client.character.Inventory[input.InventoryEnchantIndex];
		var Item = client.character.Inventory[input.InventoryItemIndex];

		//TODO: Chance for enchant to success

		if(enchantingMat === undefined || enchantingMat === null || Item === undefined || Item === null){
			client.write(new Buffer(EnchantRespond.pack(
				{
					"PacketID": 0x52,
					"Result": 5,
					"InventoryItemIndex": 0,
					"InventoryEnchantIndex": 0,
					"Price": 0,
					"EnchantRate": 0
				}
			)));
		}else{

			// client.write(new Buffer(EnchantRespond.pack(
			// 	{
			// 		"PacketID": 0x52,
			// 		"Result": 0,
			// 		"InventoryItemIndex": input.InventoryItemIndex,
			// 		"InventoryEnchantIndex": input.InventoryEnchantIndex,
			// 		"Price": 400000000,
			// 		"EnchantRate": result
			// 	}
			// )));

			var enchantValue;
			var enchantPrice;
			var result; // Need to be done
			switch(enchantingMat.ID){
				case 138: // 3%
				enchantPrice = 20000;
				enchantValue = 1;
				break;

				case 139: // 6%
				enchantPrice = 40000;
				enchantValue = 2;
				break;

				case 140: // 9%
				enchantPrice = 70000;
				enchantValue = 3;
				break;

				case 141: // 12%
				enchantPrice = 100000;
				enchantValue = 4;
				break;

				case 99251: // 15%
				enchantPrice = 200000;
				enchantValue = 5;
				break;

				default:
				client.write(new Buffer(EnchantRespond.pack(
					{
						"PacketID": 0x52,
						"Result": 5,
						"InventoryItemIndex": 0,
						"InventoryEnchantIndex": 0,
						"Price": 0,
						"EnchantRate": 0
					}
				)));
				return;
				break;
			}

			if(Item.Enchant >= 40){
				client.write(new Buffer(EnchantRespond.pack(
					{
						"PacketID": 0x52,
						"Result": 1,
						"InventoryItemIndex": input.InventoryItemIndex,
						"InventoryEnchantIndex": input.InventoryEnchantIndex,
						"Price": enchantPrice,
						"EnchantValue": enchantValue
					}
				)));
				return;
			}

			if(client.character.Silver < (client.character.Silver-enchantPrice)){

				client.write(new Buffer(EnchantRespond.pack(
					{
						"PacketID": 0x52,
						"Result": 3,
						"InventoryItemIndex": input.InventoryItemIndex,
						"InventoryEnchantIndex": input.InventoryEnchantIndex,
						"Price": enchantPrice,
						"EnchantValue": enchantValue
					}
				)));
				return;
			}

			if((enchantValue+Item.Enchant) > 40){
				client.character.Inventory[input.InventoryItemIndex].Enchant = 40;
				enchantValue = (enchantValue+Item.Enchant) - 40;
			}else{
				client.character.Inventory[input.InventoryItemIndex].Enchant += enchantValue;
				console.log("Enchanted");
			}

			client.character.Silver -= enchantPrice;
			client.character.Inventory[input.InventoryEnchantIndex] = null;

			client.character.markModified("Inventory");
			client.character.save();

			client.write(new Buffer(EnchantRespond.pack(
				{
					"PacketID": 0x52,
					"Result": 0,
					"InventoryItemIndex": input.InventoryItemIndex,
					"InventoryEnchantIndex": input.InventoryEnchantIndex,
					"Price": enchantPrice,
					"EnchantValue": enchantValue
				}
			)));
		}
	}
});