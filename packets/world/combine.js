// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
var GetCombineRestruct = restruct.
int32lu('Item1').
int32lu('Item2').
int32lu('Unk3').
int32lu('Unk4');

  // v2 = *(_DWORD *)(RecvBuffer + 2);
  // v3 = *(_DWORD *)(RecvBuffer + 10);
  // v4 = *(_DWORD *)(RecvBuffer + 6);
  // result = *(_DWORD *)(RecvBuffer + 14);
  // v1 = *(_BYTE *)(RecvBuffer + 1);

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

// Price can be setted to any value.

WorldPC.Set(0x61, {
	Restruct: GetCombineRestruct,
	function: function doCombine(client, input){
		var CombinePrice = 0; // Move to global?
		console.log(input);
		var Item1 = client.character.Inventory[input.Item1];
		var Item2 = client.character.Inventory[input.Item2];

		if(Item1 === undefined || Item1 === null || Item2 === undefined || Item2 === null){
				client.write(new Buffer(CombineRespond.pack({
					"PacketID": 0x7F,
					"Result": 1,
					"Item1": input.Item1,
					"Item2": input.Item2,
					"Price": 0
				})));
		}else{
			if((Item2.Combine+1) > 12 || (client.character.Silver - CombinePrice) < 0 || Item1.ID !== Item2.ID){
				client.write(new Buffer(CombineRespond.pack({
					"PacketID": 0x7F,
					"Result": 1,
					"Item1": input.Item1,
					"Item2": input.Item2,
					"Price": 0
				})));
				return;
			}else{
				client.character.Inventory[input.Item2] = null;
				if(client.character.Inventory[input.Item1].Combine === undefined)
				client.character.Inventory[input.Item1].Combine = 1;
				else client.character.Inventory[input.Item1].Combine += 1;
				
				client.character.Silver -= CombinePrice;

				client.character.markModified('Inventory');
				client.character.save();

				client.write(new Buffer(CombineRespond.pack({
					"PacketID": 0x7F,
					"Result": 0,
					"Item1": input.Item1,
					"Item2": input.Item2,
					"Price": CombinePrice
				})));
			}
		}
	}
});