Zone.recv.personalStoreItem = restruct.
    pad(4).
    int32lu('ItemID').
    int32lu('InventoryIndex').
    int32lu('Amount').
    int32lu("Price");

Zone.recv.personalStore = restruct.
    string('Name',24).
    struct('Items', Zone.recv.personalStoreItem, 25).
    pad(12);

Zone.send.personalStoreReply = restruct.
    int8lu('PacketID').
    string('Name',24).
    // Repeats 5x5 so 25 times
    struct('Items', Zone.recv.personalStoreItem, 25).
    pad(4);

ZonePC.Set(0x34, {
  Restruct: Zone.recv.personalStore,
  function: function(client, input){
    var uniqueInventoryIndexes = [];
    if(!input.Name.length){
      return;
    }

    if(client.character.state.Store){
      return;
    }

    // TODO: Error handling
    // TODO: If theres no price
    var isError = false;
    for(var i=0; i<input.Items.length; i++){
      var item = input.Items[i];
      if(!item.ItemID) continue;
      var invItem = client.character.Inventory[item.InventoryIndex];
      if(!invItem) {
        isError = true;
        break;
      }
      if(uniqueInventoryIndexes.indexOf(item.InventoryIndex) > -1) {
        isError = true;
        break;
      }
      uniqueInventoryIndexes.push(item.InventoryIndex);

      item.invItem = invItem;
      client.character.state.StoreItems[i] = {
        ItemID: invItem.ID,
        Amount: invItem.Amount,
        Price: item.Price,
        Enchant: invItem.Enchant || 0,
        Combine: invItem.Combine || 0,
        InventoryIndex: item.InventoryIndex
      };
      client.character.state.StoreItemsLength++;
    }

    if(isError){
      client.character.state.StoreItemsLength = 0;
      return;
    }

    client.character.state.Store = 1;
		client.character.state.StoreName = input.Name;

    client.node.update();
    client.write(new Buffer(Zone.send.personalStoreReply.pack({
			"PacketID": 0x4C,
			"Items": input.Items,
			"Name": input.Name
		})));
    Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
  }
});

ZonePC.Set(0x35, {
  function: function(client){
    if(!client.character.state.Store){
      return;
    }
    client.character.state.Store = 0;
    client.character.state.StoreItemsLength = 0;
    client.character.state.StoreName = "";
    client.character.state.StoreItems = {};

    Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
  }
});

Zone.send.storeBuyInput = restruct.
  int32lu('Unk1').
  int32lu('CharacterID').
  int32lu('NodeID').
  int32lu('ShopPage').
  int32lu('ShopIndex').
  int32lu('ItemID').
  int32lu('Amount').
  int32lu('Price').
  int32lu('SellerInventoryIndex').
  int32lu('BuyerInventoryIndex').
  int32lu('MoveColumn').
  int32lu('MoveRow');

Zone.send.storeBuyResponse = restruct.
  int8lu('PacketID').
  struct('Input', Zone.send.storeBuyInput).
  int32lu("Action").
  string('Name', 13).
  string('Buyer', 13);

Zone.recv.personalStoreBuy = restruct.
  int32lu('Unk1').
  int32lu('CharacterID').
  int32lu('NodeID').
  int32lu('ShopPage').
  int32lu('ShopIndex').
  int32lu('ItemID').
  int32lu('Amount').
  int32lu('Price').
  int8lu('Enchant').
  int8lu('Combine').
  int16lu('SellerInventoryIndex').
  int32lu('BuyerInventoryIndex').
  int32lu('MoveColumn').
  int32lu('MoveRow').
  int32lu('Unk13').
  int32lu('Unk14').
  int32lu('Unk15');

Zone.send.updateSellersItemList = restruct.
  int8lu('PacketID').
  int32lu('CharacterID').
  int32lu('NodeID').
  int8lu('Unk3').
  string('Name',24).
  struct('Items', Zone.recv.personalStoreItem, 25).
  pad(4);

// TODO: Clean up response callbacks.
ZonePC.Set(0x36, {
  Restruct: Zone.recv.personalStoreBuy,
  function: function(client, input){
    var seller = Zone.clientNodeTable[input.NodeID];
    if(!seller){
      console.log("We got no seller");
      client.write(new Buffer(Zone.send.storeBuyResponse.pack({
  			"PacketID": 0x4E,
  			"Name": seller.character.Name,
        "Buyer": client.character.Name,
  			"Input": input,
  			"Action": 1
  		})));
      return;
    }

    var storeIndex = (input.ShopPage * 5) + input.ShopIndex;
    var storeItem = seller.character.state.StoreItems[storeIndex];

    if(!storeItem || !seller.character.Inventory[storeItem.InventoryIndex]){
      client.write(new Buffer(Zone.send.storeBuyResponse.pack({
  			"PacketID": 0x4E,
  			"Name": seller.character.Name,
        "Buyer": client.character.Name,
  			"Input": input,
  			"Action": 3
  		})));
      return;
    }

    if(storeItem.Price > client.character.Silver){
      client.write(new Buffer(Zone.send.storeBuyResponse.pack({
  			"PacketID": 0x4E,
  			"Name": seller.character.Name,
        "Buyer": client.character.Name,
  			"Input": input,
  			"Action": 6
  		})));
      return;
    }

    db.Item.findById(input.ItemID, function(err, item){
      if(err){
        client.write(new Buffer(Zone.send.storeBuyResponse.pack({
    			"PacketID": 0x4E,
    			"Name": seller.character.Name,
          "Buyer": client.character.Name,
    			"Input": input,
    			"Action": 4
    		})));
        console.log("We got error");
        return;
      }

      if(!item){
        console.log("We got no item");
        client.write(new Buffer(Zone.send.storeBuyResponse.pack({
    			"PacketID": 0x4E,
    			"Name": seller.character.Name,
          "Buyer": client.character.Name,
    			"Input": input,
    			"Action": 4
    		})));
        return;
      }

      var intersection = client.character.inventoryIntersection(input.MoveRow, input.MoveColumn, item.getSlotSize());
      if(intersection){
        client.write(new Buffer(Zone.send.storeBuyResponse.pack({
    			"PacketID": 0x4E,
    			"Name": seller.character.Name,
          "Buyer": client.character.Name,
    			"Input": input,
    			"Action": 4
    		})));
        return;
      }

      var buyerNextInventoryIndex = client.character.nextInventoryIndex();
      if(buyerNextInventoryIndex === null){
        client.write(new Buffer(Zone.send.storeBuyResponse.pack({
    			"PacketID": 0x4E,
    			"Name": seller.character.Name,
          "Buyer": client.character.Name,
    			"Input": input,
    			"Action": 4
    		})));
        return;
      }

      client.character.Silver -= storeItem.Price;
      seller.character.Silver += storeItem.Price; // TODO: See what happens when sold item will overflow character current silver.
      var invItem = client.character.Inventory[buyerNextInventoryIndex] = clone(seller.character.Inventory[storeItem.InventoryIndex], false);
      seller.character.Inventory[storeItem.InventoryIndex] = null;

      invItem.Row = input.MoveRow;
      invItem.Column = input.MoveColumn;

      seller.character.markModified('Inventory');
      client.character.markModified('Inventory');

      seller.character.save(function(err){
        if(err){
          client.write(new Buffer(Zone.send.storeBuyResponse.pack({
      			"PacketID": 0x4E,
      			"Name": seller.character.Name,
            "Buyer": client.character.Name,
      			"Input": input,
      			"Action": 4
      		})));
          return;
        }
        seller.write(new Buffer(Zone.send.storeBuyResponse.pack({
    			"PacketID": 0x4E,
    			"Name": seller.character.Name,
          "Buyer": client.character.Name,
    			"Input": input,
    			"Action": 0
    		})));

        client.character.save(function(err){
          if(err){
            return;
          }
          client.write(new Buffer(Zone.send.storeBuyResponse.pack({
      			"PacketID": 0x4E,
      			"Name": seller.character.Name,
            "Buyer": client.character.Name,
      			"Input": input,
      			"Action": 0
      		})));
        });

        seller.character.state.StoreItemsLength--;
        // When last item sold, the state store flags are reseted.
        if(seller.character.state.StoreItemsLength === 0){
          seller.character.state.Store = 0;
          seller.character.state.StoreName = "";
          seller.character.state.StoreItems = {};
        }

        delete seller.character.state.StoreItems[storeIndex];
        Zone.sendToAllArea(seller, true, seller.character.state.getPacket(), config.network.viewable_action_distance);

        seller.write(new Buffer(Zone.send.updateSellersItemList.pack({
    			"PacketID": 0x4F,
    			CharacterID: input.CharacterID,
    			NodeID: input.NodeID,
    			Items: seller.character.state.StoreItems
    		})));
      });
    });
  }
})
