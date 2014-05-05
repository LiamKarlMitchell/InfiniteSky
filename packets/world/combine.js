// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
var GetCombineRestruct = restruct.
int32lu('Item1').
int32lu('Item2').
int32lu('Unk3').
int32lu('Unk4');

var CombineRespond = restruct.
int8lu("PacketID").
int8lu('Result').
int32lu('Item1').
int32lu('Item2').
int32lu('Price').
pad(4);

// Results:
// 0 = Success
// 1 = Failed
// Price can be set to any value.
WorldPC.Set(0x61, {
	Restruct: GetCombineRestruct,

	function :function doCombine(client, input) {
		var CombinePrice = config.CombinePrice || 10000;

		if(!Item1 || !Item2) {
			client.write(new Buffer(CombineRespond.pack({
				"PacketID": 0x7F,
				"Result": 1,
				"Item1": input.Item1,
				"Item2": input.Item2,
				"Price": 0
			})));
		} else {
			if((Item2.Combine + 1) > 12 || (client.character.Silver - CombinePrice) < 0 || Item1.ID !== Item2.ID) {
				client.write(new Buffer(CombineRespond.pack({
					"PacketID": 0x7F,
					"Result": 1,
					"Item1": input.Item1,
					"Item2": input.Item2,
					"Price": 0
				})));
				return;
			} else {
				var RandNumber = Math.floor((Math.random() * 100) + 1);


				// TODO: Check Combine value is correct.
				// Combination rates
				var CombineRate = 0;
				if(Item2.Combine > 0 && Item2.Combine < 12) {
					CombineRate = 90 - (5 * Item2.Combine);
				} else {
					throw new Error('Invalid Combine value: ' + Item2.Combine)
				}

				// switch(Item2.Combine)
				// {
				// 	case 1:
				// 		combineRate = 85;
				// 		break;
				// 	case 2:
				// 		combineRate = 80;
				// 		break;
				// 	case 3:
				// 		combineRate = 75;
				// 		break;
				// 	case 4:
				// 		combineRate = 70;
				// 		break;
				// 	case 5:
				// 		combineRate = 65;
				// 		break;
				// 	case 6:
				// 		combineRate = 60;
				// 		break;
				// 	case 7:
				// 		combineRate = 55;
				// 		break;
				// 	case 8:
				// 		combineRate = 50;
				// 		break;
				// 	case 9:
				// 		combineRate = 45;
				// 		break;
				// 	case 10:
				// 		combineRate = 40;
				// 		break;
				// 	case 11:
				// 		combineRate = 35;
				// 		break;
				// 	case 12:
				// 		combineRate = 30;
				// 		break;
				// 	default:
				// 		throw new Error('Invalid Combine value: '+Item2.Combine)
				// 	break;
				// }
				
				var result = 0;
				if(RandNumber <= combineRate) {
					if(client.character.Inventory[input.Item1].Combine === undefined) client.character.Inventory[input.Item1].Combine = 1;
					else client.character.Inventory[input.Item1].Combine += 1;

					client.character.Inventory[input.Item2] = null;
				} else {
					result = 1;
				}

				client.character.Silver -= CombinePrice;

				client.character.markModified('Inventory');
				client.character.save();

				client.write(new Buffer(CombineRespond.pack({
					"PacketID": 0x7F,
					"Result": result,
					"Item1": input.Item1,
					"Item2": input.Item2,
					"Price": CombinePrice
				})));
			}
		}
	}
});