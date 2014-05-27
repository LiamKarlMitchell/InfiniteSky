// 528 in total : 528 - 1 = 527
// 527 - title_zie = 503
// 503 body
// DWORD is 4 bytes
// 1 page is 100 bytes
// pad 3

WorldPC.Set(0x34, {
 	Restruct: packets.TradeShop,
    function: function handleItemOpenStore(client, input) {
    	if (!client.authenticated) return;
    	console.log("########################################");

//console.log(input);
console.log("Restruct size: " + packets.TradeShop.size);
console.log("Reply size: " + packets.TradeShopReply.size);

		client.write(new Buffer(packets.TradeShopReply.pack({
			"PacketID": 0x4C,
			"Items": input.Items,
			"Name": input.Name
		})));

		for(var i = 0; i < input.Items.length; i++){
			var item = input.Items[i];
			var InventoryItem = client.character.Inventory[item.InventoryIndex];
			if(!item || !InventoryItem)
				continue;
			client.character.state.StoreItems[i].ID = item.ItemID;
			client.character.state.StoreItems[i].Amount = item.Amount;
			client.character.state.StoreItems[i].Price = item.Price;
			client.character.state.StoreItems[i].Enchant = InventoryItem.Enchant;
			client.character.state.StoreItems[i].Combine = InventoryItem.Combine;
		}

		client.character.state.Store = 1;
		client.character.state.StoreName = input.Name;
		client.character.state.setFromCharacter(client.character);
	}
});
var ShopConfirm = restruct.
string('Title', 24).
int32lu('unk',20);

WorldPC.Set(0x35, {
	Size: 8,
	function: function CloseOpenedShop(client){
		console.log("Shop flag : " + client.character.state.Store);
		if(client.character.state.Store === 1 || client.character.state.Store === 2)
			client.character.state.Store = 0;

		for(var i = 0; i < 25; i++){

			client.character.state.StoreItems[i].ID = 0;
			client.character.state.StoreItems[i].Amount = 0;
			client.character.state.StoreItems[i].Price = 0;
			client.character.state.StoreItems[i].Enchant = 0;
			client.character.state.StoreItems[i].Combine = 0;
		}

		client.character.state.setFromCharacter(client.character);
	}
});

var shopBuyItem = restruct.
int32lu('Unk1').
int32lu('Unk2').
int32lu('NodeID').
int32lu('ShopPage').
int32lu('ShopIndex').
int32lu('ItemID').
int32lu('Amount').
int32lu('Price').
int32lu('Unk9').
int32lu('Unk10').
int32lu('Column_Y').
int32lu('Row_X').
int32lu('Unk13').
int32lu('Unk14').
int32lu('Unk15');

var shopBuyItemRespond2 = restruct.
int32lu('Unk1').
int32lu('Unk2').
int32lu('NodeID').
int32lu('ShopPage').
int32lu('ShopIndex').
int32lu('ItemID').
int32lu('Amount').
int32lu('Price').
int32lu('Unk9').
int32lu('Unk10').
int32lu('Column_Y').
int32lu('Row_X').
int32lu('Unk13');

var shopBuyItemRespond = restruct.
int8lu('PacketID').
struct('Input', shopBuyItemRespond2).
string("Name", 13).
int32lu('Unk13').
int32lu('Unk14').
int32lu('Unk15').
int8lu('Result');

console.log(shopBuyItemRespond.size);

WorldPC.Set(0x36, {
	Restruct: shopBuyItem,
	function: function BuyItem(client, input){
		console.log(input);

		var seller = client.Zone.findCharacterSocketNodeID(input.NodeID);

		client.write(new Buffer(shopBuyItemRespond.pack({
			"PacketID": 0x4E,
			"Name": seller.character.Name,
			"Input": input,
			"Result": 1
		})));
	}
});

// // 4E 01 00 00 00 1B 00 00 00 A3 A3 C6 07 00 00 00 	N...............
// // 00 00 00 00 00 24 43 01 00 00 00 00 00 01 00 00 	.....$C.........
// // 00 00 00 00 00 02 00 00 00 02 00 00 00 00 00 00 	................
// // 00 00 00 00 00 42 6F 62 00 BD C5 BD BA 00 00 00 	.....Bob........
// // D4 00 C1 D7 C0 BD BB F3 C0 CE 00 58 00 49 00    	...........X.I. 

// 4
// 4
// 4
// 3

// WorldPC.Set(0x11, {
// 	Restruct: ShopConfirm,
// 	function: function somTests(client, input){
// 		console.log(input);
// 	}
// });


