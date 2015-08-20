Zone.maxSilver = 2147483647;

Zone.recv.itemAction = restruct.
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
  int32lu('PickupIndex').
  int32lu('MoveColumn').
  int32lu('MoveRow').
  int32lu('Unk6').
  int32lu('Unk7').
  int32lu('Unk8');


Zone.send.itemActionResult = restruct.
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
  int32lu('PickupIndex').
  int32lu('MoveColumn').
  int32lu('MoveRow').
  int32lu('Result');

Zone.send.itemAction = function(result, input){
  this.write(new Buffer(Zone.send.itemActionResult.pack({
    PacketID: 0x2B,
    ActionType: input.ActionType,
    NodeID: input.NodeID,
    Unk1: input.Unk1,
    ItemID: input.ItemID,
    LevelRequired: input.LevelRequired,
    ItemType: input.ItemType,
    ItemQuality: input.ItemQuality,
    Amount: input.Amount,
    InventoryIndex: input.InventoryIndex,
    PickupColumn: input.PickupColumn,
    PickupRow: input.PickupRow,
    PickupIndex: input.PickupIndex,
    MoveRow: input.MoveRow,
    MoveColumn: input.MoveColumn,
    Result: result
  })));
}

// Revised: 09/06/2015 11:20:39
var ItemAction = {};
ItemAction[20] = function inventoryMoveItem(input){
  if(input.Amount > 99){
      Zone.send.itemAction.call(this, 1, input);
      return;
  }

  var invItem = this.character.Inventory[input.InventoryIndex];
  if(!invItem){
      console.log("Item has is not in inventory");
      Zone.send.itemAction.call(this, 1, input);
      return;
  }

  var self = this;
  db.Item.getById(input.ItemID, function(err, item){
    if(err){
      console.log(err);
      return;
    }

    if(!item){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(invItem.ID !== input.ItemID){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    var nextInventoryIndex = self.character.nextInventoryIndex();
    if(nextInventoryIndex === null){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.MoveRow, input.MoveColumn, item.getSlotSize());
    var stackable = item.isStackable();
    var reminder = invItem.Amount - input.Amount;

    if(stackable && input.Amount === 0){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(stackable && intersected && reminder){
      // If the item can be stacked on another, same item. Eg Pills.
      // And also if the item we are taking x amount, remains in inventory.
      invItem.Amount = reminder;
      intersected.Amount -= input.Amount;
    }else if(stackable && intersected && !reminder){
      // If item is stackable and parent item is removed from inventory.
      intersected.Amount += input.Amount;
      self.character.Inventory[input.InventoryIndex] = null;
    }else if(stackable && !intersected && reminder){
      // If item is stackable, and targeted place is allowed for placing.
      // Parent item remains in inventory.
      self.character.Inventory[input.InventoryIndex].Amount = reminder;
      var obj = clone(invItem, false);
      obj.Row = input.MoveRow;
      obj.Column = input.MoveColumn;
      obj.Amount = input.Amount;
      self.character.Inventory[nextInventoryIndex] = obj;
    }else if(!intersected && !reminder){
      invItem.Row = input.MoveRow;
      invItem.Column = input.MoveColumn;
      self.character.Inventory[nextInventoryIndex] = invItem;
      self.character.Inventory[input.InventoryIndex] = null;
    }else{
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    self.character.markModified('Inventory');
    self.character.save();
    Zone.send.itemAction.call(self, 0, input);
  });
};

// Revised: 09/06/2015 11:24:30
ItemAction[14] = function CharacterItem_Unequip(input){
  var equipItem;
  switch(input.InventoryIndex){
      case 0: equipItem = 'Amulet'; break; // Amulet
      case 1: equipItem = 'Cape'; break; // Cape
      case 2: equipItem = 'Outfit'; break; // Outfit
      case 3: equipItem = 'Gloves'; break; // Gloves
      case 4: equipItem = 'Ring'; break; // Ring
      case 5: equipItem = 'Boots'; break; // Boots
      case 6: equipItem = 'Bottle'; break; // Bootsle
      case 7: equipItem = 'Weapon'; break; // Weapon
      case 8: equipItem = 'Pet'; break; // Pet
      default: break;
  }

  if(!equipItem){
      Zone.send.itemAction.call(self, 1, input);
      return;
  }

  var charItem = this.character[equipItem];
  if(!charItem && charItem.ID){
      Zone.send.itemAction.call(self, 1, input);
      return;
  }

  var self = this;
  db.Item.getById(charItem.ID, function(err, item){
    if(err){
        Zone.send.itemAction.call(self, 1, input);
        return;
    }

    if(!item){
        Zone.send.itemAction.call(self, 1, input);
        return;
    }

    var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.MoveRow, input.MoveColumn, item.getSlotSize());
    if(intersected){
        Zone.send.itemAction.call(self, 1, input);
        return;
    }

    var nextInventoryIndex = self.character.nextInventoryIndex();

    if(nextInventoryIndex === null){
        Zone.send.itemAction.call(self, 1, input);
        return;
    }

    var obj = clone(charItem, false);
    obj.Column = input.MoveColumn;
    obj.Row = input.MoveRow;

    self.character[equipItem] = null;
    self.character.Inventory[nextInventoryIndex] = obj;
    self.character.markModified('Inventory');
    self.character.save(function(err){
      if(err){

          return;
      }
      self.character.infos.update(equipItem, function(){
        self.character.state.setFromCharacter(self.character);
        Zone.send.itemAction.call(self, 0, input);
        Zone.sendToAllArea(self, false, self.character.state.getPacket(), config.network.viewable_action_distance);
        self.character.infos.print();
      });
    });
  });
};

// Revised: 09/06/2015 11:24:27
ItemAction[3] = function CharacterItem_Equip(input){
    var equipItem;
    switch(input.PickupIndex){
        case 0: equipItem = 'Amulet'; break; // Amulet
        case 1: equipItem = 'Cape'; break; // Cape
        case 2: equipItem = 'Outfit'; break; // Outfit
        case 3: equipItem = 'Gloves'; break; // Gloves
        case 4: equipItem = 'Ring'; break; // Ring
        case 5: equipItem = 'Boots'; break; // Boots
        case 6: equipItem = 'Bottle'; break; // Bootsle
        case 7: equipItem = 'Weapon'; break; // Weapon
        case 8: equipItem = 'Pet'; break; // Pet
        default: break;
    }

    var invItem = this.character.Inventory[input.InventoryIndex];
    if(!invItem){
        console.log("We got no such item");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.getById(invItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(item.getInventoryItemType() !== equipItem){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item.isAllowedByClan(self.character.Clan)){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(item.LevelRequirement > self.character.Level){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        delete invItem.Column;
        delete invItem.Row;

        self.character[equipItem] = invItem;
        self.character.Inventory[input.InventoryIndex] = null;
        self.character.markModified('Inventory');
        self.character.save(function(err){
            if(err){

                return;
            }
            self.character.infos.update(equipItem, function(){
                self.character.state.setFromCharacter(self.character);
                Zone.send.itemAction.call(self, 0, input);
                Zone.sendToAllArea(self, false, self.character.state.getPacket(), config.network.viewable_action_distance);
            });
        });
    });
};

// Revised: 09/06/2015 11:14:06
ItemAction[0] = function inventoryPickupItem(input){
    var node = Zone.QuadTree.getNodeByID(input.NodeID);
    if(!node){
        console.log("Theres no item with this node id");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var invItem = node.object.obj;
    if(!invItem){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    if(invItem.ID === 1){
        if( (this.character.Silver + invItem.Amount) >  Zone.maxSilver){
            Zone.send.itemAction.call(this, 1, input);
            return;
        }
        this.character.Silver += invItem.Amount;
        node.object.remove();
        Zone.QuadTree.removeNode(node);
        this.character.save(function(err){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
        return;
    }

    db.Item.findById(invItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var isStackable = item.isStackable();
        var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.PickupRow, input.PickupColumn, item.getSlotSize());
        var total = intersected ? intersected.Amount + invItem.Amount : 0;

        if(isStackable && intersected && intersected.ID !== invItem.ID){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(isStackable && intersected && total <= 99){
            intersected.Amount += invItem.Amount;
        }else if(!intersected){
            var nextInventoryIndex = self.character.nextInventoryIndex();
            if(nextInventoryIndex === null){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }
            invItem.Column = input.PickupColumn;
            invItem.Row = input.PickupRow;
            self.character.Inventory[nextInventoryIndex] = invItem;
        }else{
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        node.object.remove();
        Zone.QuadTree.removeNode(node);
        self.character.markModified('Inventory');
        self.character.save(function(err){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 09/06/2015 11:14:09
ItemAction[1] = function inventoryDropItem(input){
  if(Zone.addItem === undefined){
  Zone.send.itemAction.call(this, 1, input);
  return;
  }

  if(input.ItemID === 1){
    if(input.Amount > this.character.Silver){
      Zone.send.itemAction.call(this, 1, input);
      return;
    }

    var obj = {ID: 1, Amount: input.Amount};
    Zone.addItem(this, obj);

    this.character.Silver -= input.Amount;
    this.character.save();

    Zone.send.itemAction.call(this, 0, input);
    return;
  }

  if(input.Amount > 99){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  var invItem = this.character.Inventory[input.InventoryIndex];
  if(!invItem){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }


  var self = this;
  db.Item.findById(invItem.ID, function(err, item){
    if(err){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(!item){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(!item.isDroppable()){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    var reminder = invItem.Amount - input.Amount;
    var isStackable = item.isStackable();

    if(isStackable && input.Amount > invItem.Amount){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(isStackable && !reminder){
      self.character.Inventory[input.InventoryIndex] = null;
    }else if(isStackable && reminder){
      invItem.Amount = reminder;
    }else{
      self.character.Inventory[input.InventoryIndex] = null;
    }

    var dropItem = clone(invItem, false);
    dropItem.Amount = input.Amount;

    self.character.markModified('Inventory');
    self.character.save(function(err){
      if(err){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      Zone.addItem(self, dropItem);
      Zone.send.itemAction.call(self, 0, input);
    });
  });
};

// Revised: 09/06/2015 21:55:50
ItemAction[5] = function StorageStoreItem(input){
    if(input.Amount > 99){
        console.log("Amount is higher than allowed");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.PickupIndex > 27){
        console.log("The storage index is higher than allowed");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var intersected = this.character.Storage[input.PickupIndex];
    var invItem = this.character.Inventory[input.InventoryIndex];
    if(!invItem){
        console.log("Theres no item on specified index in inventory");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.findById(invItem.ID, function(err, item){
        if(err){
            console.log("Error on finding item of id");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            console.log("Theres no such info on this item");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var isStackable = item.isStackable();
        var reminder = invItem.Amount - input.Amount;

        if(intersected && isStackable && invItem.ID !== intersected.ID){
            console.log("The stacking item is not the same");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(intersected && isStackable && (input.Amount + intersected.Amount) > 99){
            console.log("The stacking amount is higher than allowed");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(intersected && isStackable && !reminder){
            intersected.Amount += input.Amount;
            self.character.Inventory[input.InventoryIndex] = null;
        }else if(intersected && isStackable && reminder){
            invItem.Amount = reminder;
            intersected.Amount += input.Amount;
        }else if(!intersected && isStackable && reminder){
            invItem.Amount = reminder;
            var obj = clone(invItem, false);
            obj.Row = input.MoveRow;
            obj.Column = input.MoveColumn;
            obj.Amount = input.Amount;
            self.character.Storage[input.PickupIndex] = obj;
        }else if(!intersected){
            delete invItem.Column;
            delete invItem.Row;
            self.character.Storage[input.PickupIndex] = invItem;
            self.character.Inventory[input.InventoryIndex] = null;
        }else{
            console.log("Intersection on storage inventory");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        self.character.markModified('Storage');
        self.character.markModified('Inventory');
        self.character.save(function(err){
            if(err){
                console.log("Error on saving");
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 09/06/2015 23:18:47
ItemAction[15] = function StorageTakeItem(input){
    if(input.Amount > 99){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.InventoryIndex > 27){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.PickupIndex > 63){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var storageItem = this.character.Storage[input.InventoryIndex];
    // TODO: For security purpose, clone the objects to be worked on instead on referenced objects.
    if(!storageItem){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.findById(storageItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.MoveRow, input.MoveColumn, item.getSlotSize());
        if(intersected && storageItem.ID !== intersected.ID){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var nextInventoryIndex = self.character.nextInventoryIndex();
        if(!intersected && nextInventoryIndex === null){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(intersected && (intersected.Amount + input.Amount) > 99){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(intersected && storageItem.ID !== intersected.ID){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var reminder = storageItem.Amount - input.Amount;
        var isStackable = item.isStackable();

        if(isStackable && intersected && reminder){
            storageItem.Amount = reminder;
            intersected.Amount += input.Amount;
        }else if(isStackable && intersected && !reminder){
            intersected.Amount += input.Amount;
            self.character.Storage[input.InventoryIndex] = null;
        }else if(isStackable && !intersected && reminder){
            storageItem.Amount = reminder;
            var obj = clone(storageItem, false);
            obj.Row = input.MoveRow;
            obj.Column = input.MoveColumn;
            obj.Amount = input.Amount;
            self.character.Inventory[nextInventoryIndex] = obj;
        }else if(!intersected && !reminder){
            storageItem.Row = input.MoveRow;
            storageItem.Column = input.MoveColumn;
            self.character.Inventory[nextInventoryIndex] = storageItem;
            self.character.Storage[input.InventoryIndex] = null;
        }else{
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        self.character.markModified('Storage');
        self.character.markModified('Inventory');

        self.character.save(function(err){
            if(err){
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 10/06/2015 11:12:07
ItemAction[4] = function StorageMoveItem(input){
    if(input.Amount > 99){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.InventoryIndex > 27 || input.PickupIndex > 27){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var storageItem = this.character.Storage[input.InventoryIndex];
    if(!storageItem){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.findById(storageItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var intersected = self.character.Storage[input.PickupIndex];
        var isStackable = item.isStackable();
        var reminder = storageItem.Amount - input.Amount;

        if(intersected && intersected.ID !== storageItem.ID){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(intersected && (intersected.Amount + input.Amount) > 99){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(isStackable && intersected && reminder){
            storageItem.Amount = reminder;
            intersected.Amount += input.Amount;
        }else if(isStackable && intersected && !reminder){
            intersected.Amount += input.Amount;
            self.character.Storage[input.InventoryIndex] = null;
        }else if(isStackable && !intersected && reminder){
            storageItem.Amount = reminder;
            var obj = clone(storageItem, false);
            obj.Row = input.MoveRow;
            obj.Column = input.MoveColumn;
            obj.Amount = input.Amount;
            self.character.Storage[input.PickupIndex] = obj;
        }else if(!intersected && !reminder){
            storageItem.Row = input.MoveRow;
            storageItem.Column = input.MoveColumn;
            self.character.Storage[input.PickupIndex] = storageItem;
            self.character.Storage[input.InventoryIndex] = null;
        }else{
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        self.character.markModified('Storage');
        self.character.save(function(err){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 10/06/2015 11:12:12
ItemAction[9] = function ConvertSilverStack(input){
    if(this.character.Level < 100){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(this.character.StackedSilver < 1){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(this.character.Silver + 1000000000 > Zone.maxSilver){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    this.character.Silver += 1000000000;
    this.character.StackedSilver--;
    var self = this;
    this.character.save(function(err){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        Zone.send.itemAction.call(self, 0, input);
    });
};

// Revised: 10/06/2015 11:12:17
ItemAction[8] = function ConvertSilverToStack(input){
    if(this.character.Level < 100){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(this.character.Silver < 1000000000){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    this.character.Silver -= 1000000000;
    this.character.StackedSilver++;

    var self = this;
    this.character.save(function(err){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        Zone.send.itemAction.call(self, 0, input);
    });
};

//TODO: Items for contribution points.
// Revised: 11/06/2015 21:49:12
ItemAction[17] = function ShopBuyItem(input){
    console.log(input);
    if(input.Amount > 99){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.NPC.getById(input.NodeID, function(err, npc){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!npc){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var node = Zone.NpcNodesHashTable[input.NodeID];
        if(!node){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var distance = node.object.Location.getDistance(self.character.state.Location);
        if(distance > 50){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(npc.Items.indexOf(input.ItemID) === -1){
            console.log("Shop does not have this item");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(npc.Clan !== self.character.Clan+2){
            console.log("This shop buy was from restricted clan");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        db.Item.findById(input.ItemID, function(err, item){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            if(!item){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            var isStackable = item.isStackable();

            var price = isStackable ? item.PurchasePrice * input.Amount : item.PurchasePrice;
            if(price > self.character.Silver){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.MoveRow, input.MoveColumn, item.getSlotSize());

            if(intersected && (intersected.Amount + input.Amount) > 99){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            var nextInventoryIndex = self.character.nextInventoryIndex();
            if(!intersected && nextInventoryIndex === null){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            if(isStackable && intersected){
                intersected.Amount += input.Amount;
            }else if(!intersected){
                var obj = {};
                if(isStackable) obj.Amount = input.Amount;
                obj.Column = input.MoveColumn;
                obj.Row = input.MoveRow;
                obj.ID = input.ItemID;
                self.character.Inventory[nextInventoryIndex] = obj;
            }else{
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            self.character.Silver -= price;

            self.character.markModified('Inventory');
            self.character.save(function(err){
                if(err){
                    Zone.send.itemAction.call(self, 1, input);
                    return;
                }

                Zone.send.itemAction.call(self, 0, input);
            });
        });
    });
};

// Revised: 11/06/2015 21:49:48
ItemAction[7] = function ShopSellItem(input){
    console.log(input);
    if(input.Amount > 99){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var invItem = this.character.Inventory[input.InventoryIndex];
    if(!invItem){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.findById(invItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var isStackable = item.isStackable();
        var reminder = invItem.Amount - input.Amount;
        var price = isStackable ? input.Amount * item.SalePrice : item.SalePrice;

        self.character.Silver += price;

        if(isStackable && reminder){
            invItem.Amount = reminder;
        }else{
            self.character.Inventory[input.InventoryIndex] = null;
        }

        self.character.markModified('Inventory');
        self.character.save(function(err){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 12/06/2015 00:21:02
ItemAction[2] = function MoveItemToHotbar(input){
    console.log(input);
    if(input.Amount > 99){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.PickupIndex > 3){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var invItem = this.character.Inventory[input.InventoryIndex];
    if(!invItem){
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    db.Item.findById(invItem.ID, function(err, item){
        if(err){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item.isStackable()){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var intersected = self.character.QuickUseItems[input.PickupIndex];
        if(intersected && intersected.ID !== invItem.ID){
            return;
        }

        if(intersected && (intersected.Amount + input.Amount) > 99){
            return;
        }

        var reminder = invItem.Amount - input.Amount;
        if(!reminder) self.character.Inventory[input.InventoryIndex] = null;
        if(reminder) invItem.Amount = reminder;
        if(intersected) intersected.Amount += input.Amount;
        else {
            var obj = clone(invItem, false);
            delete obj.Column;
            delete obj.Row;
            obj.Amount = input.Amount;

            self.character.QuickUseItems[input.PickupIndex] = obj;
        }

        self.character.markModified('Inventory');
        self.character.markModified('QuickUseItems');
        self.character.save(function(err){
            if(err){
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};


// Revised: 12/06/2015 00:20:54
ItemAction[11] = function moveItemsFromHotbar(input){
    console.log(input);
    if(input.Amount > 99){
      Zone.send.itemAction.call(this, 1, input);
      return;
    }

    var invItem = this.character.QuickUseItems[input.InventoryIndex];
    if(!invItem){
      Zone.send.itemAction.call(this, 1, input);
      return;
    }

    if(invItem.ID !== input.ItemID){
      Zone.send.itemAction.call(this, 1, input);
      return;
    }

    var self = this;
    db.Item.findById(invItem.ID, function(err, item){
      if(err){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      if(!item){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      if(!item.isStackable()){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      var intersected = self.character.inventoryIntersection(Zone.itemSlotSizes, input.MoveRow, input.MoveColumn, item.getSlotSize());
      if(intersected && intersected.ID !== invItem.ID){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      if(intersected && (intersected.Amount + input.Amount) > 99){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      var nextInventoryIndex = self.character.nextInventoryIndex();
      if(!intersected && nextInventoryIndex === null){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      var reminder = invItem.Amount - input.Amount;
      if(intersected && reminder){
        invItem.Amount = reminder;
        intersected.Amount += input.Amount;
      }else if(intersected && !reminder){
        intersected += input.Amount;
        self.character.QuickUseItems[input.InventoryIndex] = null;
      }else if(!intersected && reminder){
        var obj = clone(invItem, false);
        obj.Column = input.MoveColumn;
        obj.Row = input.MoveRow;
        obj.Amount = input.Amount;

        self.character.Inventory[nextInventoryIndex] = obj;
        invItem.Amount = reminder;
      }else{
        var obj = clone(invItem, false);
        obj.Column = input.MoveColumn;
        obj.Row = input.MoveRow;
        obj.Amount = input.Amount;

        self.character.Inventory[nextInventoryIndex] = obj;
        self.character.QuickUseItems[input.InventoryIndex] = null;
      }

      self.character.markModified('QuickUseItems');
      self.character.markModified('Inventory');

      self.character.save(function(err){
        if(err){
          Zone.send.itemAction.call(self, 1, input);
          return;
        }

        Zone.send.itemAction.call(self, 0, input);
      })
    });
};


ItemAction[27] = function attachSkillToSkillBar(input){
  console.log(input);
  var charSkill = this.character.SkillList[input.InventoryIndex];
  if(!charSkill){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  var barSkill = this.character.SkillBar[input.PickupIndex];
  if(barSkill){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  if(input.Amount > charSkill.Level){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  this.character.SkillBar[input.PickupIndex] = {
    Level: input.Amount,
    ID: charSkill.ID
  };

  this.character.markModified('SkillBar');
  var self = this;
  this.character.save(function(err){
    if(err){
      return;
    }

    Zone.send.itemAction.call(self, 0, input);
  });
};

ItemAction[28] = function removeSkillFromSkillBar(input){
  var barSkill = this.character.SkillBar[input.InventoryIndex];
  if(!barSkill){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  this.character.SkillBar[input.InventoryIndex] = null;
  this.character.markModified('SkillBar');
  var self = this;
  this.character.save(function(err){
    if(err){
      return;
    }

    Zone.send.itemAction.call(self, 0, input);
  });
};

ItemAction[31] = function learnSkill(input){
  // Categories
  // 1 = General
  // 3 and 4 = Support
  // 2 = Attack

  console.log("Learning skill");
  console.log(input);
  var self = this;
  db.Skill.findById(input.ItemID, function(err, skill){
    if(err){
      console.log("Error on finding skills")
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(!skill){
      console.log("Skill not founded")
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(!skill.isUsedByClan(self.character.Clan)){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(skill.PointsToLearn > self.character.SkillPoints){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    var index = 0;
    var alreadyLearned;
    var freeIndex = null;

    switch(skill.Category){
      case 2:
      index = 20;
      break;

      case 3:
      case 4:
      index = 10;
      break;
    }

    for(var i=index; i<(index+10); i++){
      var charSkill = self.character.SkillList[i];
      if(charSkill && charSkill.ID === input.ItemID){
        alreadyLearned = true;
        break;
      }

      if(freeIndex === null && !charSkill){
        freeIndex = i;
      }
    }

    console.log(freeIndex);

    if(!freeIndex){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(alreadyLearned){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    self.character.SkillPoints -= skill.PointsToLearn;

    self.character.SkillList[freeIndex] = {
      ID: input.ItemID,
      Level: skill.PointsToLearn
    };

    self.character.markModified('SkillList');
    self.character.save(function(err){
      if(err){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      Zone.send.itemAction.call(self, 0, input);
    });
  });
};

ItemAction[12] = function useQuickItem(input){
  console.log(input);

  var invItem = this.character.QuickUseItems[input.InventoryIndex];
  if(!invItem){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  if(invItem.ID !== input.ItemID){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  if(!invItem.Amount){
    Zone.send.itemAction.call(this, 1, input);
    return;
  }

  var self = this;
  db.Item.findById(invItem.ID, function(err, item){
    if(err){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(!item){
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    var recovered;
    switch(item.ValueType){
      case 1: // Recovering Hp by fixed value
      recovered = self.character.state.CurrentHP + item.Value1;
      if(recovered > self.character.infos.MaxHP) recovered = self.character.infos.MaxHP;

      self.character.state.CurrentHP = recovered;
      self.character.HP = self.character.state.CurrentHP;
      break;

      case 2: // Recovering Hp by % value
      recovered = self.character.state.CurrentHP + (item.Value1 * (self.character.infos.MaxHP / 100));
      if(recovered > self.character.infos.MaxHP) recovered = self.character.infos.MaxHP;

      self.character.state.CurrentHP = recovered;
      self.character.HP = self.character.state.CurrentHP;
      break;

      case 3: // Recovering Chi by fixed value
      recovered = self.character.state.CurrentChi + item.Value1;
      if(recovered > self.character.infos.MaxChi) recovered = self.character.infos.MaxChi;

      self.character.state.CurrentChi = recovered;
      self.character.Chi = self.character.state.CurrentChi;
      break;

      case 4: // Recovering Chi by % value
      recovered = self.character.state.CurrentChi + (item.Value1 * (self.character.infos.MaxChi / 100));
      if(recovered > self.character.infos.MaxChi) recovered = self.character.infos.MaxChi;

      self.character.state.CurrentChi = recovered;
      self.character.Chi = self.character.state.CurrentChi;
      break;

      case 5:
      recovered = self.character.state.CurrentChi + (item.Value1 * (self.character.infos.MaxChi / 100));
      if(recovered > self.character.infos.MaxChi) recovered = self.character.infos.MaxChi;

      self.character.state.CurrentChi = recovered;
      self.character.Chi = self.character.state.CurrentChi;

      recovered = self.character.state.CurrentHP + (item.Value1 * (self.character.infos.MaxHP / 100));
      if(recovered > self.character.infos.MaxHP) recovered = self.character.infos.MaxHP;

      self.character.state.CurrentHP = recovered;
      self.character.HP = self.character.state.CurrentHP;
      break;

      case 6:
      if(!self.character.Pet){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      if(self.character.Pet.Activity >= 100){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      self.character.Pet.Activity += 50;
      if(self.character.Pet.Activity > 100)
        self.character.Pet.Activity = 100;
      break;

      default:
      console.log(item.ValueType, "of item not supported in ItemAction quick bar usable");
      Zone.send.itemAction.call(self, 1, input);
      return;
    }

    if(--invItem.Amount === 0){
      self.character.QuickUseItems[input.InventoryIndex] = null;
    }

    self.character.markModified('QuickUseItems');
    self.character.save(function(err){
      if(err){
        Zone.send.itemAction.call(self, 1, input);
        return;
      }

      Zone.send.itemAction.call(self, 0, input);
      Zone.sendToAllArea(self, false, self.character.state.getPacket(), config.network.viewable_action_distance);
    });
  });
};

ZonePC.Set(0x14, {
    Restruct: Zone.recv.itemAction,
    function: function handleItemActionPacket(client, input) {
        if(input.Amount === 0) input.Amount = 1;

        if(!ItemAction[input.ActionType]){
            console.log("Inventory action:", input.ActionType, "is not supported");
            Zone.send.itemAction.call(client, 1, input);
            return;
        }

        try{
            ItemAction[input.ActionType].call(client, input);
        }catch(e){
            console.log(e);
            Zone.send.itemAction.call(client, 1, input);
        }
    }
});

ZonePC.Set(0x17, {
    function: function onStateUpdateRequest(client){
        // Confirming that we have actually removed item from a character, and resends the state of character, maybe char data also if we really removed the item.
        // Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);
    }
});


ZonePC.Set(0x18, {
    function: function onResetWeaponBuffs(client){
        // Fired when character deequipes a weapon. This might be used to remove character applied buffs as weapon is removed from character state.
    }
});
