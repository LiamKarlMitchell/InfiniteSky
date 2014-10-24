// 528 in total : 528 - 1 = 527
// 527 - title_zie = 503
// 503 body
// DWORD is 4 bytes
// 1 page is 100 bytes
// pad 3

var shopObject = function(client){
	var item_list = {};

	for(var i=0; i < 25; i++){
		item_list[i] = null;
	}

	var item = function(){
		return {
			Price: 0,
			InvObj: null,
			State: {
				page: 0,
				index: 0
			},
			Index: 0,
			InvIndex: 0,
			InvPosition: {
				x: null,
				y: null
			}
		}
	}

	return {
		SellItem: function(buyer, input){
			//TODO: Checks of amount and such in both inventories
			var itemObj = null;
			var client_items = [];
			for(var i=0; i < 25; i++){
				var item = item_list[i];

				if(item && item.State.page === input.ShopPage && item.State.index === input.ShopIndex){
					itemObj = item;
				}else if(item){
					console.log(item);
					client_items[i] = {
						ItemID: item.InvObj.ID,
						InventoryIndex: item.InvIndex,
						Amount: !item.InvObj.Amount ? 0 : item.InvObj.Amount,
						Price: item.Price
					};
				}
			}

			if(!itemObj){
				return false;
			}

			if(input.InventoryIndex < 0 || input.InventoryIndex > 64){
				return false;
			}

			if(input.ItemID !== itemObj.InvObj.ID){
				return false;
			}

			var itemInfo = infos.Item[input.ItemID];
			var collision = buyer.character.checkInventoryItemCollision(input.Column_Y, input.Row_X, itemInfo.getSlotCount());

			if(!collision){
				return false;
			}

			client.character.Inventory[itemObj.InvIndex] = null;

			itemObj.InvObj.Column = input.Column_Y;
			itemObj.InvObj.Row = input.Row_X;


			buyer.character.Inventory[input.InventoryIndex] = itemObj.InvObj;

			buyer.character.markModified('Inventory');
			buyer.character.save();

			client.character.markModified('Inventory');
			client.character.save();

			delete item_list[itemObj.Index];


			// console.log(item_list);


			// client.write(new Buffer(packets.TradeShopReply.pack({
			// 	"PacketID": 0x4C,
			// 	"Items": client_items,
			// 	"Name": client.character.state.StoreName
			// })));

			return itemObj;
		},

		ItemExistsOnPage: function(shopPage, shopIndex){
			for(var i=0; i < 25; i++){
				var item = item_list[i];

				if(item && item.State.page === shopPage && item.State.index === shopIndex){
					return item;
				}
			}
			return false;
		},

		PutItem: function(index, price, invObj, invIndex){
			if(item_list[index]){
				return false;
			}

			var ShopPage = (index / 5).toFixed(0);
			ShopPage = ShopPage > (index / 5) ? ShopPage -1 : ShopPage;
			ShopPage = parseInt(ShopPage);
			var ShopIndex = index - (ShopPage * 5);

			pObj = new item();
			pObj.Price = price;

			pObj.State.page = ShopPage;
			pObj.State.index = ShopIndex;

			pObj.InvObj = invObj;

			pObj.Index = index;
			pObj.InvIndex = invIndex;

			pObj.InvPosition = {x: invObj.Column, y: invObj.Row};

			item_list[index] = pObj;
		},

		UpdateState: function(){
			for(var i=0; i < 25; i++){
				client.character.state.StoreItems[i].ID = 0;
				client.character.state.StoreItems[i].Amount = 0;
				client.character.state.StoreItems[i].Price = 0;
				client.character.state.StoreItems[i].Enchant = 0;
				client.character.state.StoreItems[i].Combine = 0;
				var item = item_list[i];

				if(!item){
					continue;
				}

				var invObj = item.InvObj;

				if(!invObj){
					console.log("No inv obj?");
					continue;
				}


				if(!invObj.ID){
					console.log("Item has no ID");
					continue;
				}

				client.character.state.StoreItems[i].ID = invObj.ID;
				client.character.state.StoreItems[i].Amount = !invObj.Amount ? 0 : invObj.Amount;
				client.character.state.StoreItems[i].Price = item.Price;
				client.character.state.StoreItems[i].Enchant = !invObj.Enchant ? 0 : invObj.Enchant;
				client.character.state.StoreItems[i].Combine = !invObj.Combine ? 0 : invObj.Combine;
			}
		}
	}
}

WorldPC.Set(0x34, {
 	Restruct: packets.TradeShop,
    function: function handleItemOpenStore(client, input) {
    	if (!client.authenticated) return;

		client.write(new Buffer(packets.TradeShopReply.pack({
			"PacketID": 0x4C,
			"Items": input.Items,
			"Name": input.Name
		})));

		client.character.Shop = new shopObject(client);

		for(var i = 0; i < input.Items.length; i++){

			var item = input.Items[i];
			var InventoryItem = client.character.Inventory[item.InventoryIndex];
			if(!item || !InventoryItem || !item.ItemID || !item.Price)
				continue;

			console.log(item);

			client.character.Shop.PutItem(i, item.Price, InventoryItem, item.InventoryIndex);
		}

		client.character.Shop.UpdateState();

		client.character.state.Store = 1;
		client.character.state.StoreName = input.Name;
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
int32lu('InventoryIndex').
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
int32lu('InventoryIndex').
int32lu('Column_Y').
int32lu('Row_X');

var shopBuyItemRespond = restruct.
int8lu('PacketID').
struct('Input', shopBuyItemRespond2).
int32lu("Action").
string("Name", 13).
string('Buyer', 13);

var shopBuyItemRespond2 = restruct.
int8lu('PacketID').
struct('Input', shopBuyItemRespond2).
int32lu("Action").
int32lu('Unk').
int32lu('Unk1').
int32lu('Unk2').
int8lu('Unk3').
string('Buyer', 13);

WorldPC.Set(0x36, {
	Restruct: shopBuyItem,
	function: function BuyItem(client, input){
		console.log(input);
		// Action = 2, when we do not find our NodeID and or we are not in range
		var seller = client.Zone.findCharacterSocketNodeID(input.NodeID);
		console.log("Seller: " + seller.character.Name);
		if(!seller){
			console.log("No seller!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 1
			})));
			return;
		}

		// console.log("Seller: " + seller.character.Name);
		// console.log(input);

		var itemInfo = infos.Item[input.ItemID];

		if(!itemInfo){
			console.log("No item info!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 3
			})));
			return;
		}

		console.log(client.character.Inventory.length);

		var buyerCollision = client.character.checkInventoryItemCollision(input.Column_Y, input.Row_X, itemInfo.getSlotCount());

		if(!buyerCollision){
			console.log("Buyer collision problem!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 4
			})));
			return;
		}



		var soldInventoryObj = seller.character.Shop.SellItem(client, input);

		if(soldInventoryObj === false){
			console.log("No sold info!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 4
			})));
			return;
		}

		console.log(soldInventoryObj);

		seller.character.Shop.UpdateState();

		client.write(new Buffer(shopBuyItemRespond.pack({
			"PacketID": 0x4E,
			"Name": seller.character.Name,
			"Input": input,
			"Action": 0
		})));

		// input.InventoryIndex = soldInventoryObj.InvIndex;
		// input.Column_Y = soldInventoryObj.InvPosition.x;
		// input.Row_X = soldInventoryObj.InvPosition.y;
		// input.NodeID = seller.node.id;

		// console.log(seller);

		console.log(soldInventoryObj.InvPosition);

		console.log(input);

		// input.InventoryIndex = soldInventoryObj.InvIndex;
		// input.Unk13 = soldInventoryObj.InvIndex;
		// input.Unk14 = soldInventoryObj.InvIndex;
		// // input.ShopPage = 0;
		// // input.ShopIndex = 0;
		// input.Unk9 = soldInventoryObj.InvIndex;
		// // input.Column_Y = 20;
		// // input.Column_X = 20;
		// // input.Unk1 = 0;
		// // input.Unk2 = 7;
		// input.Unk15 = soldInventoryObj.InvIndex;


		// input.Unk9 = 1;

		// input.NodeID = client.node.id;

		console.log(input);

// var shopBuyItemRespond2 = restruct.
// int32lu('Unk1').
// int32lu('Unk2').
// int32lu('NodeID').
// int32lu('ShopPage').
// int32lu('ShopIndex').
// int32lu('ItemID').
// int32lu('Amount').
// int32lu('Price').
// int32lu('Unk9').
// int32lu('InventoryIndex').
// int32lu('Column_Y').
// int32lu('Row_X');


		seller.write(new Buffer(shopBuyItemRespond.pack({
			"PacketID": 0x4E,
			"Input": {
				Unk2: input.Unk2,
				NodeID: input.NodeID,
				ShopPage: 2,
				ShopIndex: 4,
				ItemID: input.ItemID,
				Amount: input.Amount,
				Price: input.Price,
				Unk1: 2,
				Unk9: 2,
				InventoryIndex: 2,
				Column_Y: 2,
				Row_X: 2

			},
			"Buyer": client.character.Name,
			"Action": 0,
			Unk: 2,
			Unk1: 2,
			Unk2: 2,
			Unk3: 2
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


