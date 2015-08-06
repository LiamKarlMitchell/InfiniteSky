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

console.log(Zone.send.tradeItemList.size);

GMCommands.AddCommand(new Command('trade',60,function command_test(string, client){
  console.log("Sending trade list");
  var buffer = new Buffer(Zone.send.tradeItemList.pack({
    PacketID: 0x44,
    Silver: client.character.Silver,
    stackedSilver: client.character.StackedSilver,

    tradeSilver: 0,
    tradeStackedSilver: 0,
    tradeItems: [
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      },
      {
        id: 2,
        amount: 2,
        enchant: 2,
        combine: 2
      }
    ],
    side: 1
  }));

  var inventoryBuffer = new Buffer(structs.StorageItem.size * 64);
  inventoryBuffer.fill(0);

  for(var i=0; i<64; i++){
    var item = client.character.Inventory[i];
    if(item){
      new Buffer(structs.StorageItem.pack(item)).copy(inventoryBuffer, structs.StorageItem.size * i);
    }
  }

  inventoryBuffer.copy(buffer, 101);

  client.write(buffer);
}));
