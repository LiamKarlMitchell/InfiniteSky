Zone.recv.combine = restruct.
  int32lu('InventoryIndex').
  int32lu('MaterialIndex').
  int32lu('unk').
  int32lu('unk2');

Zone.send.combine = restruct.
  int8lu("PacketID").
  int8lu('Result').
  int32lu('InventoryIndex').
  int32lu('MaterialIndex').
  int32lu('Price').
  pad(4);

Zone.send.combineItemInfo = function(info, input, invItem){
  if(info.item.Rareness < 2){
    console.log("Cannot combine items that are lower than unique.");
    return;
  }
  var combine = !invItem.Combine ? 0 : invItem.Combine;

  var materialRequirement = {Level: info.item.Level, Rareness: info.item.Rareness};
  if(info.item.Rareness === 4){
    materialRequirement.Level = info.item.Level - 1;
    materialRequirement.Rareness = 3;
  }

  if(materialRequirement.Level !== info.material.Level){
    console.log("Material requirements didnt match (Level)");
    return;
  }

  if(materialRequirement.Rareness !== info.material.Rareness){
    console.log("Material requirements didnt match (Rareness)");
    return;
  }

  var chance = Math.round((100 - (combine * 6)) + (this.character.infos.Luck * 0.005));
  if(this.character.Usable_LuckyCombining){
    this.character.Usable_LuckyCombining--;
    this.write(new Buffer(Zone.send.enchantUsableApplied.pack({
      PacketID: 0x71,
      Switch: 5,
      Value: this.character.Usable_LuckyCombining
    })));
    chance += 5;
  }


  if(chance > 100) chance = 100;

  console.log("The chance:", chance);
  var roll = random.bool(chance, 100);
  if(!roll){
    this.write(new Buffer(Zone.send.combine.pack({
      PacketID: 0x7F,
      InventoryIndex: input.InventoryIndex,
      MaterialIndex: input.MaterialIndex,
      Result: 1
    })));
    return;
  }

  combine++;

  invItem.Combine = combine;
  this.character.Inventory[input.MaterialIndex] = null;

  this.character.markModified('Inventory');
  var self = this;
  this.character.save(function(err){
    if(err){
      return;
    }

    self.write(new Buffer(Zone.send.combine.pack({
      PacketID: 0x7F,
      InventoryIndex: input.InventoryIndex,
      MaterialIndex: input.MaterialIndex,
      Result: 0
    })));
  });
}

ZonePC.Set(0x61, {
  Restruct: Zone.recv.combine,
  function: function(client, input){
    var material = client.character.Inventory[input.MaterialIndex];
    var invItem = client.character.Inventory[input.InventoryIndex];

    if(!material || !invItem){
      console.log("No material or inv item");
      return;
    }

    var materialCombine = material.Combine ? material.Combine : 0;
    var invItemCombine = invItem.Combine ? invItem.Combine : 0;

    if((material.Enchant || materialCombine) && (materialCombine > invItemCombine)){
      console.log("Material is not clean");
      return;
    }

    if(invItem.Combine+1 > 12){
      console.log("Cannot combine any further");
      return;
    }

    var info = {};
    var self = this;
    db.Item.findById(invItem.ID, function(err, item){
      if(err){
        return;
      }

      if(!item){
        return;
      }

      info.item = item;

      db.Item.findById(material.ID, function(err, item_material){
        if(err){
          return;
        }

        if(!item_material){
          return;
        }

        info.material = item_material;

        Zone.send.combineItemInfo.call(client, info, input, invItem);
      })
    });
  }
});
