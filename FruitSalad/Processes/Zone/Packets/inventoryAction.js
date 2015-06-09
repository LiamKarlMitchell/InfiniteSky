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
        console.log("Amount higher than allowed");
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
            console.log("No item founded");
            return;
        }

        if(invItem.ID !== input.ItemID){
            console.log("Inventory item dont match");
            Zone.send.itemAction.call(this, 1, input);
            return;
        }

        var nextInventoryIndex = self.character.nextInventoryIndex();
        if(nextInventoryIndex === null){
            console.log("Theres no next inventoryIndex");
            Zone.send.itemAction.call(this, 1, input);
            return;
        }

        var intersected = self.character.inventoryIntersection(input.MoveRow, input.MoveColumn, item.getSlotSize());
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
            obj.Row = input.MoveRow,
            obj.Column = input.MoveColumn,
            obj.Amount = input.Amount
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
        console.log("Undefined item was tried to be removed of character");
        Zone.send.itemAction.call(self, 1, input);
        return;
    }

    var charItem = this.character[equipItem];
    if(!charItem && charItem.ID){
        console.log("Character does not wear this item");
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

        var intersected = self.character.inventoryIntersection(input.MoveRow, input.MoveColumn, item.getSlotSize());
        if(intersected){
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var nextInventoryIndex = self.character.nextInventoryIndex();

        if(nextInventoryIndex === null){
            console.log("No free space for item that has now being unequiped");
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
            self.character.infos.updateStat(equipItem, function(){
                self.character.state.setFromCharacter(self.character);
                Zone.send.itemAction.call(self, 0, input);
                Zone.sendToAllArea(self, false, self.character.state.getPacket(), config.network.viewable_action_distance);
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
            console.log("no such item in database");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(item.getInventoryItemType() !== equipItem){
            console.log("item has to fit the target type slot");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item.isAllowedByClan(self.character.Clan)){
            console.log("not allowed by clan");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(item.LevelRequirement > self.character.Level){
            console.log("cannot equip item with higher level than character");
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
            self.character.infos.updateStat(equipItem, function(){
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
        console.log("Node object does not exists");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    var self = this;
    if(invItem.ID === 1){
        console.log("Handling silver pickup");
        if( (this.character.Silver + invItem.Amount) >  Zone.maxSilver){
            console.log("Cannot pickup more silver than you can hold. Convert to gold.");
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
            console.log("Error in finding item in db");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(!item){
            console.log("No item in db");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        var isStackable = item.isStackable();
        var intersected = self.character.inventoryIntersection(input.PickupRow, input.PickupColumn, item.getSlotSize());
        var total = intersected ? intersected.Amount + invItem.Amount : 0;

        if(isStackable && intersected && intersected.ID !== invItem.ID){
            console.log("The intersected item is not the same");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        if(isStackable && intersected && total <= 99){
            intersected.Amount += invItem.Amount;
        }else if(!intersected){
            var nextInventoryIndex = self.character.nextInventoryIndex();
            if(nextInventoryIndex === null){
                console.log("Next inventory index was null");
                Zone.send.itemAction.call(self, 1, input);
                return;
            }
            invItem.Column = input.PickupColumn;
            invItem.Row = input.PickupRow;
            self.character.Inventory[nextInventoryIndex] = invItem;
        }else{
            console.log("Item intersected");
            Zone.send.itemAction.call(self, 1, input);
            return;
        }

        node.object.remove();
        Zone.QuadTree.removeNode(node);
        self.character.markModified('Inventory');
        self.character.save(function(err){
            if(err){
                console.log("error on saving on character");
                Zone.send.itemAction.call(self, 1, input);
                return;
            }

            Zone.send.itemAction.call(self, 0, input);
        });
    });
};

// Revised: 09/06/2015 11:14:09
ItemAction[1] = function inventoryDropItem(input){
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


ZonePC.Set(0x14, {
    Restruct: Zone.recv.itemAction,
    function: function handleItemActionPacket(client, input) {
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