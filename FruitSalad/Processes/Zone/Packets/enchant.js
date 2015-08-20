Zone.recv.enchanting = restruct.
  int32lu('MaterialIndex').
  int32lu('InventoryIndex').
  int32lu('unk').
  int32lu('unk2');
Zone.send.enchant = restruct.
  int8lu('PacketID').
  int8lu('Result').
  int32lu('MaterialIndex').
  int32lu('InventoryIndex').
  int32lu('Price').
  int32lu('Enchant'); // 1 = 3 so 4 = 12% add

ZonePC.Set(0x3A, {
  Restruct: Zone.recv.enchanting,
  function: function(client, input){
    console.log(input);

    var material = client.character.Inventory[input.MaterialIndex];
    var invItem = client.character.Inventory[input.InventoryIndex];

    if(!material || !invItem){
      return;
    }

    client.write(new Buffer(Zone.send.enchant.pack({
      PacketID: 0x52,
      Result: 0,
      InventoryItemIndex: input.MaterialIndex,
      InventoryEnchantIndex: input.InventoryIndex,
      Price: 100000,
      Enchant: 4
    })));

    console.log(input);
  }
});
