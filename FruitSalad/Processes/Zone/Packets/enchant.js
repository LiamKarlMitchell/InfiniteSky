Zone.recv.enchanting = restruct.
  int32lu('InventoryIndex').
  int32lu('MaterialIndex').
  int32lu('unk').
  int32lu('unk2');

Zone.send.enchant = restruct.
  int8lu('PacketID').
  int8lu('Result').
  int32lu('InventoryIndex').
  int32lu('MaterialIndex').
  int32lu('Price').
  int32lu('Enchant'); // 1 = 3 so 4 = 12% add

Zone.send.enchantResult = function(input, result, price, value){
  this.write(new Buffer(Zone.send.enchant.pack({
    PacketID: 0x52,
    Result: result,
    MaterialIndex: input.MaterialIndex,
    InventoryIndex: input.InventoryIndex,
    Price: price,
    Enchant: value
  })));
}

Zone.send.enchantUsableApplied = restruct.
  int8lu('PacketID').
  int32lu('Switch').
  int32lu('Value');

ZonePC.Set(0x3A, {
  Restruct: Zone.recv.enchanting,
  function: function(client, input){
    var material = client.character.Inventory[input.MaterialIndex];
    var invItem = client.character.Inventory[input.InventoryIndex];

    if(!material || !invItem){
      Zone.send.enchantResult.call(client, input, 2, price, value);
      return;
    }

    if(invItem.Enchant === 120){
      Zone.send.enchantResult.call(client, input, 1, price, value);
      return;
    }

    var price, value;
    switch(material.ID){
      case 138: // 3%
      price = 20000;
      value = 1;
      break;

      case 139: // 6%
      price = 40000;
      value = 2;
      break;

      case 140: // 9%
      price = 70000;
      value = 3;
      break;

      case 141: // 12%
      price = 100000;
      value = 4;
      break;

      case 99251: // 15%
      price = 200000;
      value = 5;
      break;

      default:
      console.log("Trying to enchant with item that is not in material list.");
      Zone.send.enchantResult.call(client, input, 5, price, value);
      return;
      break;
    }

    var enchant = typeof invItem.Enchant === 'undefined' ? 0 : invItem.Enchant;

    if(client.character.Silver < price){
      Zone.send.enchantResult.call(client, input, 3, price, value);
      return;
    }

    client.character.Silver -= price;

    // var safeEnchant = false;
    // if((enchant * 3) + (value * 3) < 39){
    //   safeEnchant = true;
    // }

    if(enchant + value > 40){
      value = enchant - 40;
    }

    var status = 0;

    var chance = (103 - (enchant * 3) - value) + (client.character.infos.Luck * 0.01);

    if(chance > 100) chance = 100;
    else if(chance < 0) chance = 0;

    var breakingChance = Math.round(chance < 46 ? (46 - chance) + value : 0);
    if(breakingChance === 0) breakingChance = 1;

    chance += client.character.Usable_LuckyEnchanting ? 5 : 0;
    chance = Math.round(chance);

    var successRoll = random.bool(chance, 100);
    var breakRoll = random.bool(breakingChance, 100);

    console.log("Enchant chance:", chance, " Break chance:", breakingChance, "Enchanted?", successRoll, "Damaged?", breakRoll);

    if(!successRoll){
      value -= value;
      status = 5;
      enchant -= 1;
    }else{
      enchant += value;
    }

    if(!successRoll && breakRoll && !client.character.Usable_ProtectionCharm){
      client.character.Inventory[input.InventoryIndex] = null;
      status = 4;
    }else if(!successRoll && breakRoll){
      client.character.Usable_ProtectionCharm--;
      client.write(new Buffer(Zone.send.enchantUsableApplied.pack({
        PacketID: 0x71,
        Switch: 2,
        Value: client.character.Usable_ProtectionCharm
      })));
    }

    if(client.character.Usable_LuckyEnchanting){
      client.character.Usable_LuckyEnchanting--;
      client.write(new Buffer(Zone.send.enchantUsableApplied.pack({
        PacketID: 0x71,
        Switch: 3,
        Value: client.character.Usable_LuckyEnchanting
      })));
    }

    if(enchant < 0) enchant = 0;
    if(enchant > 120) enchant = 120;

    invItem.Enchant = enchant;
    client.character.Inventory[input.MaterialIndex] = null;

    client.character.markModified('Inventory');
    client.character.save(function(err){
      if(err){
        return;
      }

      Zone.send.enchantResult.call(client, input, status, price, value);
    });
  }
});

ZonePC.Set(0x06, {
  function: function(client, input){
    // When some1 maxes the enchant, send the message to everyone around of their HAPPYNEEEESS.
  }
});
