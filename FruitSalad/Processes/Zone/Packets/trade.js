// TODO: In trade state.

Zone.recv.tradeRequest = restruct.
  string('Name', 13).
  int32lu('Unk').
  int32lu('Unk2');

Zone.send.tradeRequest = restruct.
  int8lu('PacketID').
  string('Name', 13).
  int32lu('Result');

Zone.recv.acceptTradeRequest = restruct.
  string('Name', 13).
  int8lu('Result').
  int32lu('Unk1').
  int32lu('Unk2');

Zone.send.beginTrade = restruct.
  int8lu('PacketID');

Zone.recv.tradeItem = restruct.
  int8lu('ActionType'). // 1 is for item 2 is for silver 5 for gold
  int32lu('Silver').
  int32lu('Index').
  int32lu('InventoryIndex').
  int32lu('Amount').
  int32lu('Unk6').
  int32lu('Unk7').
  int8lu('Unk11').
  int32lu('StackedSilver').
  int32lu('Unk9').
  int32lu('Unk10');

Zone.send.tradeItem = restruct.
  int32lu('id').
  int32lu('amount').
  int8lu('enchant').
  int8lu('combine').
  int16lu('unk');

Zone.send.tradeItemList = restruct.
  int8lu('PacketID').
  struct('tradeItems', Zone.send.tradeItem, 8).
  int32lu('tradeSilver').
  int32lu('tradeStackedSilver').
  pad(1276). // Character inventory. I dunno why but we lack 4 bytes to have complete inventory offset, maybe we can only trade int16 Silver
  int32lu('Silver').
  int8lu('side').
  int32lu('tradeStackedSilver').
  int32lu('stackedSilver');

ZonePC.Set(0x26, {
  Restruct: Zone.recv.tradeRequest,
  function: function onTradeRequest(client, input){
    console.log(input);
    var invited = Zone.clientNameTable[input.Name];
    console.log(Zone.clientNameTable);
    if(!invited){
      console.log("No invited");
      return;
    }

    if(invited.character.state.inTrade) return;


    // TODO: is writable maybe?
    invited.write(new Buffer(Zone.send.tradeRequest.pack({
			PacketID: 0x3f,
			Name: client.character.Name
		})));
  }
})

ZonePC.Set(0x27, {
  Restruct: Zone.recv.tradeRequest,
  function: function whenTradeRequestPressOk(client, input){
    // console.log(input);
  }
})

ZonePC.Set(0x28, {
  Restruct: Zone.recv.acceptTradeRequest,
  function: function acceptTradeRequest(client, input){
    if(client.character.state.tradeStatus) return;

    console.log(input);
    var inviter = Zone.clientNameTable[input.Name];
    if(!inviter){
      return;
    }

    if(input.Result){
      return;
    }

    client.character.state.tradeStatus = 0;
    inviter.character.state.tradeStatus = 0;

    client.character.state.inTrade = inviter;
    inviter.character.state.inTrade = client;


    client.write(new Buffer(Zone.send.beginTrade.pack({
      PacketID: 0x42
    })));

    inviter.write(new Buffer(Zone.send.beginTrade.pack({
      PacketID: 0x42
    })));
  }
});

ZonePC.Set(0x2B, {
  Restruct: Zone.recv.tradeItem,
  function: function putItemToTradeWindow(client, input){
    if(client.character.state.tradeStatus) return;

    if(!client.character.state.tradeOfferTable){
      client.character.state.tradeOfferTable = [];
      client.character.state.tradeOffer = {};
      client.character.state.tradeOfferSilver = 0;
      client.character.state.tradeOfferStackedSilver = 0;
    }
    // TODO: Work out how to let a choice on amount of pills and such.

    if(input.ActionType === 1){
      var invItem = client.character.Inventory[input.InventoryIndex];
      if(!invItem){
        return;
      }

      if(client.character.state.tradeOffer[input.Index]) return;
      if(client.character.state.tradeOfferTable.indexOf(input.InventoryIndex) === -1){
        client.character.state.tradeOfferTable.push(input.InventoryIndex);
        var item = client.character.state.tradeOffer[input.Index] = clone(invItem, false);
      }
    }else if(input.ActionType === 2){
      if((input.Silver + client.character.state.tradeOfferSilver) > client.character.Silver){
        return;
      }

      client.character.state.tradeOfferSilver = input.Silver; // TODO: Decide if we += the value or we just overwrite. Lets say if we trade 2 Stacked silver instead of 1 as a misstype.
      // overwriting will allow to adjust the value without closing and reopening the trade.

    }else if(input.ActionType === 5){
      if((input.StackedSilver + client.character.state.tradeOfferStackedSilver) > client.character.StackedSilver){
        return;
      }

      client.character.state.tradeOfferStackedSilver = input.StackedSilver;
    }

    var tradeItems = {};
    for(var index in client.character.state.tradeOffer){
      var item = client.character.state.tradeOffer[index];

      // TODO: Being able to trade pets and calbash bottles.
      tradeItems[index] = {
        id: item.ID,
        amount: item.Amount || 0,
        enchant: item.Enchant || 0,
        combine: item.Combine || 0,
      };
    }

    var obj = {
      PacketID: 0x44,
      tradeSilver: client.character.state.tradeOfferSilver,
      tradeStackedSilver: client.character.state.tradeOfferStackedSilver,
      tradeItems: tradeItems,
      side: 1
    };

    var buffer = new Buffer(Zone.send.tradeItemList.pack(obj));
    client.character.state.inTrade.write(buffer);

    obj.side = 0;
    obj.Silver = client.character.Silver - client.character.state.tradeOfferSilver;
    obj.stackedSilver = client.character.StackedSilver - client.character.state.tradeOfferStackedSilver;
    buffer = new Buffer(Zone.send.tradeItemList.pack(obj));

    var inventoryBuffer = new Buffer(structs.StorageItem.size * 64);
    inventoryBuffer.fill(0);

    for(var i=0; i<64; i++){
      var item = client.character.Inventory[i];
      if(item && client.character.state.tradeOfferTable.indexOf(i) === -1){
        new Buffer(structs.StorageItem.pack(item)).copy(inventoryBuffer, structs.StorageItem.size * i);
      }
    }

    inventoryBuffer.copy(buffer, 101);

    client.write(buffer);
  }
});

Zone.send.tradeStatus = restruct.
  int8lu('PacketID').
  int8lu('status').
  int8lu('side');

Zone.send.confirmTrade = restruct.
  int8lu('PacketID').
  int8lu('Result').
  int32lu('Silver').
  pad(1280).
  int32lu('StackedSilver');

Zone.recv.onTradeAccept = restruct.
  int8lu('Action').
  pad(8);

ZonePC.Set(0x2C, {
  Restruct: Zone.recv.onTradeAccept,
  function: function(client, input){
    console.log("Accepting trade", input);

    if(input.Action === 1){
      client.write(new Buffer(Zone.send.tradeStatus.pack({
  			PacketID: 0x45,
  			status: 1,
  			side: 0
  		})));

      client.character.state.inTrade.write(new Buffer(Zone.send.tradeStatus.pack({
  			PacketID: 0x45,
  			status: 1,
  			side: 1
  		})));

      client.character.state.tradeStatus = 1;
      return;
    }else if(input.Action === 2){
      client.write(new Buffer(Zone.send.tradeStatus.pack({
  			PacketID: 0x45,
  			status: 2,
  			side: 0
  		})));

      client.character.state.inTrade.write(new Buffer(Zone.send.tradeStatus.pack({
  			PacketID: 0x45,
  			status: 2,
  			side: 1
  		})));

      client.character.state.tradeStatus = 2;
      if(client.character.state.tradeStatus !== client.character.state.inTrade.character.state.tradeStatus) return;
    }else{
      return;
    }


    var buffer = new Buffer(Zone.send.confirmTrade.pack({
      PacketID: 0x46,
      Silver: client.character.Silver,
      StackedSilver: client.character.StackedSilver
    }));

    var inventoryBuffer = new Buffer(structs.StorageItem.size * 64);
    inventoryBuffer.fill(0);

    for(var i=0; i<64; i++){
      var item = client.character.Inventory[i];
      if(item){
        new Buffer(structs.StorageItem.pack(item)).copy(inventoryBuffer, structs.StorageItem.size * i);
      }
    }

    inventoryBuffer.copy(buffer, 6);

    client.write(buffer);

    if(client.character.state.inTrade){
      var inTradeClient = client.character.state.inTrade;
      buffer = new Buffer(Zone.send.confirmTrade.pack({
        PacketID: 0x46,
        Silver: inTradeClient.character.Silver,
        StackedSilver: inTradeClient.character.StackedSilver
      }));

      var inventoryBuffer = new Buffer(structs.StorageItem.size * 64);
      inventoryBuffer.fill(0);

      for(var i=0; i<64; i++){
        var item = inTradeClient.character.Inventory[i];
        if(item){
          new Buffer(structs.StorageItem.pack(item)).copy(inventoryBuffer, structs.StorageItem.size * i);
        }
      }

      inventoryBuffer.copy(buffer, 6);

      inTradeClient.write(buffer);

      delete inTradeClient.character.state.tradeOfferTable;
      delete inTradeClient.character.state.tradeOffer;
      delete inTradeClient.character.state.tradeOfferSilver;
      delete inTradeClient.character.state.tradeOfferStackedSilver;
      delete inTradeClient.character.state.tradeStatus;

      delete client.character.state.inTrade;
      delete client.character.state.tradeOfferTable;
      delete client.character.state.tradeOffer;
      delete client.character.state.tradeOfferSilver;
      delete client.character.state.tradeOfferStackedSilver;
      delete client.character.state.tradeStatus;
    }
  }
});
