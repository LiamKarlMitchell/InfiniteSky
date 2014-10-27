var shopBuyItem = restruct.
int32lu('Unk1').
int32lu('Unk2').
int32lu('NodeID').
int32lu('ShopPage').
int32lu('ShopIndex').
int32lu('ItemID').
int32lu('Amount').
int32lu('Price').
int32lu('SellerInventoryIndex').
int32lu('BuyerInventoryIndex').
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
int32lu('SellerInventoryIndex').
int32lu('BuyerInventoryIndex').
int32lu('Column_Y').
int32lu('Row_X');

var shopBuyItemRespond = restruct.
int8lu('PacketID').
struct('Input', shopBuyItemRespond2).
int32lu("Action").
string('Name', 13).
string('Buyer', 13);

var TradeShopReply4F = restruct.
int8lu('PacketID').
int32lu('Unk').
int32lu('Unk1').
int8lu('Unk3').
string('Name',24).  
struct('Items',packets.TradeShopItem,25).
pad(4);

var ItemActionReplyPacket = restruct.
int8lu('PacketID').
int32lu('ActionType').
int32lu('NodeID').
int32lu('Unk1').
int32lu('ItemID').
int32lu('LevelRequired').
int32lu('ItemType').
int32lu('ItemQuality').
int32lu('Amount').
int32lu('InventoryIndex').
int32lu('PickupColumn').
int32lu('PickupRow').
int32lu('EquipIndex').
int32lu('MoveColumn').
int32lu('MoveRow').
int32lu('Result');


var packet84 = restruct.
int8lu('PacketID').
int32lu('Action').
int32lu('Value');


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

			if(input.BuyerInventoryIndex < 0 || input.BuyerInventoryIndex > 64){
				return false;
			}

			if(input.ItemID !== itemObj.InvObj.ID){
				return false;
			}

			var itemInfo = infos.Item[input.ItemID];
			var collision = buyer.character.checkInventoryItemCollision(input.Column_Y, input.Row_X, itemInfo.getSlotCount());

			if(!collision){
				console.log("Collision detected");
				return false;
			}

			// console.log('Setting character '+client.character.Name+' inventory['+itemObj.InvIndex+'] = null');
			client.character.Inventory[parseInt(itemObj.InvIndex)] = null;

			itemObj.InvObj.Column = input.Column_Y;
			itemObj.InvObj.Row = input.Row_X;

			buyer.character.Inventory[parseInt(input.BuyerInventoryIndex)] = itemObj.InvObj;

			buyer.character.markModified('Inventory');
			buyer.character.save();

			// console.log("Saved");

			client.character.markModified('Inventory');
			client.character.save();

			if(client_items.length === 0){
				console.log("test");
				client.character.state.Store = 1;
				client.character.Shop.UpdateState();
			}


			delete item_list[itemObj.Index];
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

		client.character.Shop = new shopObject(client);

		for(var i = 0; i < input.Items.length; i++){
			var item = input.Items[i];

			var InventoryItem = client.character.Inventory[item.InventoryIndex];
			if(!item || !InventoryItem || !item.ItemID || !item.Price)
				continue;

			client.character.Shop.PutItem(i, item.Price, InventoryItem, item.InventoryIndex);
		}

		client.write(new Buffer(packets.TradeShopReply.pack({
			"PacketID": 0x4C,
			"Items": input.Items,
			"Name": input.Name
		})));

		client.character.Shop.UpdateState();

		client.character.state.Store = 1;
		client.character.state.StoreName = input.Name;
	}
});

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

WorldPC.Set(0x36, {
	Restruct: shopBuyItem,
	function: function BuyItem(client, input){
		console.log(input);
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

		if(!soldInventoryObj){
			console.log("No sold info!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 4
			})));
			return;
		}

		if((client.character.Silver < soldInventoryObj.Price)){
			console.log("The buyer has no enough money!");
			client.write(new Buffer(shopBuyItemRespond.pack({
				"PacketID": 0x4E,
				"Input": input,
				"Action": 6
			})));
			return;
		}

		client.character.Silver -= soldInventoryObj.Price;

		seller.character.Shop.UpdateState();

		client.write(new Buffer(shopBuyItemRespond.pack({
			"PacketID": 0x4E,
			"Name": seller.character.Name,
			"Input": input,
			"Action": 0
		})));

		var Items = {};
		for(var i=0; i < 25; i++){
			if(seller.character.state.StoreItems[i].ID){
				Items[i] = {};
				Items[i].ItemID = seller.character.state.StoreItems[i].ID;
				Items[i].InventoryIndex = i;
				Items[i].Amount = seller.character.state.StoreItems[i].Amount;
				Items[i].Price = seller.character.state.StoreItems[i].Price;
			}
		}


	    seller.write(new Buffer(ItemActionReplyPacket.pack({
	        PacketID: 0x2B,
	        ActionType: 7,
	        NodeID: seller.node.id,
	        ItemID: 99329,
	        InventoryIndex: soldInventoryObj.InvIndex,
	        Amount: 1,
	        Result: 0
	    })));

	    console.log(soldInventoryObj);


	    var priceReminder = soldInventoryObj.Price - 1;

	    if(priceReminder >= 1){
	    	if((priceReminder+seller.character.Silver) > packets.MAX_SILVER){
			    seller.write(new Buffer(ItemActionReplyPacket.pack({
			        PacketID: 0x2B,
			        ActionType: 8,
			        Result: 0
			    })));
	    	}

		    seller.write(new Buffer(packet84.pack({
		        PacketID: 0x8E,
		        Action: 1,
		        Value: priceReminder
		    })));
	    }else if((seller.character.Silver+1) > packets.MAX_SILVER){
		    seller.write(new Buffer(ItemActionReplyPacket.pack({
		        PacketID: 0x2B,
		        ActionType: 8,
		        Result: 0
		    })));
    	}

		seller.write(new Buffer(TradeShopReply4F.pack({
			"PacketID": 0x4F,
			Unk: input.Unk2,
			Unk1: input.NodeID,
			Unk2: 0,
			Items: Items
		})));

		// seller.character.markModified('Inventory');
		// seller.character.save();

		// client.character.markModified('Inventory');
		// client.character.save();
	}
});