// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// WorldPC.Set(0x26,{
// 	function: function(socket, data) {

// 	}
// });
// 	console.log('Code: Trade Request Made');
// 	handleTradeRequest.call(this, data.slice(8));
// break;
// WorldPC.Set(0x27,{
// 	function: function(socket, data) {

// 	}
// });
// 	console.log('Code: Cancel Trade Request Sent to player');
// break;
// WorldPC.Set(0x28,{
// 	function: function(socket, data) {

// 	}
// });
// 	console.log('Code: Trade request reply');
// 	handleTradeRequestReply.call(this, data.slice(8));
// break;
// WorldPC.Set(0x34,{
// 	function: function(socket, data) {

// 	}
// });
// 	handleOpenTradeShop.call(this, data.slice(8));
// break;
// WorldPC.Set(0x38,{
// 	function: function(socket, data) {

// 	}
// }

var requestTrade = restruct.
string('Name', 13).
int32lu('Unk1').
int32lu('Unk2');

var tradeRequest = restruct.
int8lu('PacketID').
string('Name', 13).
int32lu('Result');

var OnTradeRequestRespondRestruct = restruct.
string('Name', 13).
int8lu('Result').
int32lu('Unk1').
int32lu('Unk2');

var tradeStart = restruct.
int8lu('PacketID'); //0x42

var tradeResponse = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Result');

var RestructTheItemMoveToTradeWindow = restruct.
int8lu('ActionType'). // 1 is for item 2 is for silver 5 for gold
int32lu('Silver').
int32lu('Index').
int32lu('InventoryIndex').
int32lu('Amount').
int32lu('Unk6').
int32lu('Unk7').
int32lu('Unk8').
int32lu('Unk9').
int32lu('Unk10').
int8lu('Unk11');


WorldPC.Set(0x26,{
	Restruct: requestTrade,
	function: function(client, input) {
		console.log(input);
		var invited = world.findCharacterSocket(input.Name);
		if(!invited) return;
		
		invited.write(new Buffer(tradeRequest.pack({
			PacketID: 0x3f,
			Name: client.character.Name
		})));
	}
});

WorldPC.Set(0x28, {
	Restruct: OnTradeRequestRespondRestruct,
	function: function(client, input){
		console.log(input);
		
		var inviter = world.findCharacterSocket(input.Name);
		if(input.Result === 0){
			inviter.write(new Buffer(tradeResponse.pack({
				PacketID: 0x41,
				Name: client.character.Name,
				Result: 0
			})));
			
			client.write(new Buffer(tradeStart.pack({
				PacketID: 0x42
			})));
			inviter.write(new Buffer(tradeStart.pack({
				PacketID: 0x42
			})));
			
			client.character.InTrade = inviter;
			inviter.character.InTrade = client;
			client.character.TradeAccepted = 0;
			inviter.character.TradeAccepted = 0;
		}
	}
});

WorldPC.Set(0x2A, {
	Size: 8,
	function: function(client){
		console.log(client.character.Name + " has canceled the Trade!");
	}
});

var acceptItem = restruct.
int8lu('PacketID').
int8lu('Unk', 1384).
int8lu('Player').
int32lu('Unk2', 2);

// Packet 44 Functor 0040DBC0 PacketSize 1394

WorldPC.Set(0x2B, {
	Restruct: RestructTheItemMoveToTradeWindow,
	function: function(client, input){
		console.log(input);
		var packTest = [];
		for(var i=0; i<1384; i++){
			packTest.push(1);
		}
		client.write(new Buffer(acceptItem.pack({
			PacketID: 0x44,
			Unk: packTest,
			Player: 1,
			Unk2: [100, 120]
		})));
	}
});

var onTradeAccept = restruct.
int8lu('PacketID').
int8lu('Unk1').
int8lu('Unk2');

var finishTrade = restruct.
int8lu('PacketID').
int8lu('Result').
int8lu('Unk1', 1288);

// Packet 46 Functor 0040DCF0 PacketSize 1290

WorldPC.Set(0x2C, {
	Size: 9,
	function: function(client){
		if(!client.character.TradeAccepted) client.character.TradeAccepted = 1;
		
		if(client.character.TradeAccepted && client.character.InTrade.character.TradeAccepted){
			client.write(new Buffer(finishTrade.pack({
				PacketID: 0x46
			})));
			client.character.InTrade.write(new Buffer(finishTrade.pack({
				PacketID: 0x46
			})));
		}
		
		// client.character.InTrade.write(new Buffer(onTradeAccept.pack({
		// 	PacketID: 0x45,
		// 	Unk1: 3,
		// 	Unk2: 3
		// })));
		// client.write(new Buffer(onTradeAccept.pack({
		// 	PacketID: 0x45,
		// 	Unk1: 3,
		// 	Unk2: 3
		// })));
		console.log(client.character.Name + " is ready to trade with " + client.character.InTrade.character.Name);
	}
});