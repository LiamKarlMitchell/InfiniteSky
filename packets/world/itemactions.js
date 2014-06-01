// ###############

// ###############

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

WorldPC.ItemActionPacket = restruct.
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
int32lu('Unk6').
int32lu('Unk7').
int32lu('Unk8');

var NotImplemented = function(client, name, input) {
    var msg = 'Item Action: ' + name + ' is not implemented.';
    console.log(msg);
    client.sendInfoMessage(msg);
    client.write(new Buffer(ItemActionReplyPacket.pack({
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
        EquipIndex: input.EquipIndex,
        MoveColumn: input.MoveColumn,
        MoveRow: input.MoveRow,
        Result: 1
    })));
};

function clientWriteItemActionFailed(client, input){
    client.write(new Buffer(ItemActionReplyPacket.pack({
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
        EquipIndex: input.EquipIndex,
        MoveColumn: input.MoveColumn,
        MoveRow: input.MoveRow,
        Result: 1
    })));
}

function clientWriteItemActionSuccess(client, input){
    client.write(new Buffer(ItemActionReplyPacket.pack({
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
        EquipIndex: input.EquipIndex,
        MoveColumn: input.MoveColumn,
        MoveRow: input.MoveRow,
        Result: 0
    })));
}

function getSlotCount(itemType) {
    if (itemType === 2 || itemType === 7 || itemType === 11) {
        return 1;
    } else {
        return 4;
    }
}

ItemActions = [];
ItemActions[0x00] = function Recv_PickupItem(client, input) {
    console.log(input);

    var item = client.Zone.getItem(input.NodeID);
    if (item) {
        console.log(item.info.Name);

        // TODO: Check Owner name if not our own name then we cannot pick up
        if (item.OwnerName !== '' && item.OwnerName !== client.character.Name) {
            console.log('Cant pickup another persons item.');
            client.sendInfoMessage('Cant pickup another persons item.');
            clientWriteItemActionFailed(client, input);
            return;
        }

        // If money.
        if (item.ItemID === 1) {
            // TODO: Handle too much silver etc turn to gold?
            client.character.Silver += item.Amount;
            client.Zone.removeItem(input.NodeID);
            client.character.save();
            clientWriteItemActionSuccess(client, input);
            return;
        }
        
        if (input.InventoryIndex>32) {
            console.log('Inventory Index is outside bounds of array. '+input.InventoryIndex);
            clientWriteItemActionFailed(client, input);
            return;
        }

        var invitem = client.character.Inventory[input.InventoryIndex];

        console.log('Inventory Item: ', invitem);
        // Already exists in slot
        if (invitem) {
            console.log('Already in inventory at that slot attempting update.');

            if (invitem.ID !== item.ItemID) {
                console.log('Inventory ID not match ItemID');
                clientWriteItemActionFailed(client, input);
                return;
            }

            // Check if stackable
            if (!item.info.isStackable()) {
                console.log('Item not stackable...');
                clientWriteItemActionFailed(client, input);
                return;
            }

            // TODO: Check row and columns match for pickup

            // Check stack limit
            if (item.Amount + invitem.Amount > 99) {
                // TODO: Test if we can pick up item that would put a stack over its limit.
                // What happens? Does it make use of multiple slots?
                // Does it drop the remainder?
                console.log('Over Stackable Amount.');
                clientWriteItemActionFailed(client, input);
                return;
            }

            invitem.Amount += item.Amount;
        } else {
            console.log('Putting item in inventory.');
            // TODO: Check row and columns within bounds
            invitem = { ID: item.ItemID, Amount: item.Amount, Enchant: item.Enchant, Combine: item.Combine, Column: input.ColumnPickup,Row: input.RowPickup };
            client.character.Inventory[input.InventoryIndex] = invitem;
        }

        client.Zone.removeItem(input.NodeID);
        clientWriteItemActionSuccess(client, input);
    } else {
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    client.character.markModified('Inventory');
    client.character.save();

};
ItemActions[0x01] = function Recv_DropItem(client, input) {
    if(input.ItemID == 1) {
        // Dropping silver
        if(client.character.Silver >= input.Amount) {
            client.Zone.addItem(client.Zone.createItem({ ID: 1, Amount: input.Amount, Owner: client.character.Name, Location: client.character.state.Location  }));
            client.character.Silver -= input.Amount;
        } else {
            client.sendInfoMessage('You dont have that amount of silver in your inventory');
            clientWriteItemActionFailed(client, input);
            return;
        }
    } else {
        // Dropping Item
        var theItem = null;
        theItem = client.character.Inventory[input.InventoryIndex];

        if (theItem) {
            // Check that this specific item can be dropped? Some items might be bound to the character.
            if(theItem.Amount >= input.Amount) {
                client.Zone.addItem(client.Zone.createItem({ ID: theItem.ID, Amount: input.Amount, Enchant: theItem.Enchant, Combine: theItem.Combine, Owner: client.character.Name, Location: client.character.state.Location  }));
                theItem.Amount -= input.Amount;
                if((input.Amount == 0 && theItem.Amount == 1) || theItem.Amount <= 0) delete client.character.Inventory[input.InventoryIndex];
            } else {
                clientWriteItemActionFailed(client, input);
                client.sendInfoMessage('You dont have that amount of items in your inventory');// just for debug..
                return;
            }
        } else {
            clientWriteItemActionFailed(client, input);
            client.sendInfoMessage('Debug: Internal error item null');
            return;
        }
    }

    client.character.markModified('Inventory');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 3:33 AM 5/30/2014
ItemActions[0x02] = function Recv_MoveItemIntoQuickUseBar(client, input) {
    if(input.InventoryIndex > 63 || input.InventoryIndex < 0 || input.EquipIndex > 3 || input.EquipIndex < 0){
        console.log("Input inventory index is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;
    
    var qItem = client.character.QuickUseItems[input.EquipIndex];
    var invItem = inventory[input.InventoryIndex];
    
    if(!invItem || !invItem.ID || input.ItemID !== invItem.ID){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    //TODO: Make sure that the items that are moved onto bar are the items that should be moved.
    
    var itemInfo = infos.Item[invItem.ID];
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(input.Amount > 99 || input.Amount < 0 || input.Amount > invItem.Amount){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var reminder = invItem.Amount - input.Amount;
    var amount;
    if(reminder === 0){
        inventory[input.InventoryIndex] = null;
        amount = invItem.Amount;
    }else{
        inventory[input.InventoryIndex].Amount = reminder;
        amount = input.Amount;
    }
    
    if(!qItem){
        client.character.QuickUseItems[input.EquipIndex] = {ID: invItem.ID, Amount: amount};
    }else if(qItem && qItem.ID && qItem.ID === invItem.ID){
        if((qItem.Amount + amount) > 99 || (qItem.Amount + amount) < 0){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            client.character.QuickUseItems[input.EquipIndex].Amount += amount;
        }
    }
    
    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 1:11 AM 5/30/2014
ItemActions[0x03] = function Recv_EquipItemOnCharacter(client, input) {
    if(input.InventoryIndex > 63 || input.InventoryIndex < 0){
        console.log("Input inventory index is incorrect or there is no pages yet implemented");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;
    var invItem = inventory[input.InventoryIndex];
    
    if(!invItem){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(client.character.Level < itemInfo.LevelRequirement || ! itemInfo.isAllowedByClan(client.character.Clan)){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.ItemType !== input.ItemType){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var equipItem = itemInfo.InventoryItemType();    
    if(equipItem){
        var characterEquipItem = client.character[equipItem];
        if(!characterEquipItem || !characterEquipItem.ID){
            if(itemInfo.ItemType === 22)
                client.character[equipItem] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth};
            else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
                client.character[equipItem] = {ID: invItem.ID};
            else
                client.character[equipItem] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine};
        }else{
            console.log("Theres already equiped item");
            clientWriteItemActionFailed(client, input);
            return;
        }
    }else{
        console.log("The equip item is not defined!");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    inventory[input.InventoryIndex] = null;
    
    client.character.markModified('Inventory');
    client.character.save();
    
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 1:27 AM 5/31/2014
ItemActions[0x04] = function Recv_MoveStoredItem(client, input) {
    if(input.InventoryIndex > 27 || input.InventoryIndex < 0 || input.EquipIndex > 27 || input.EquipIndex < 0){
        console.log("Incorrect Inventory Index or Equip Index");
        return;
    }
    
    var storage = client.character.Storage;
    
    if(input.Amount < 0 || input.Amount > 99){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var invItem = storage[input.InventoryIndex];
    if(!invItem){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var existingItem = storage[input.EquipIndex];
    
    if(existingItem){
        var existingInfo = infos.Item[existingItem.ID];
        if(!existingInfo){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        if(!existingInfo.isStackable() || !itemInfo.isStackable() || invItem.ID !== existingItem.ID){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        var reminder = invItem.Amount - input.Amount;
        
        var amount;
        if(reminder === 0){
            amount = invItem.Amount;
            storage[input.InventoryIndex] = null;
        }else{
            amount = input.Amount;
            storage[input.InventoryIndex].Amount = reminder;
        }
        
        if((existingItem.Amount+amount) > 99 || (existingItem.Amount+amount) < 0){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        storage[input.EquipIndex].Amount += input.Amount;
    }else{
        if(!itemInfo.isStackable()){
            storage[input.EquipIndex] = invItem;
            storage[input.InventoryIndex] = null;
        }else{
            var reminder = invItem.Amount - input.Amount;
            var amount;
            if(reminder === 0){
                amount = invItem.Amount;
                storage[input.InventoryIndex] = null;
            }else{
                amount = input.Amount;
                storage[input.InventoryIndex].Amount = reminder;
            }
            
            if((existingItem.Amount+amount) > 99 || (existingItem.Amount+amount) < 0){
                clientWriteItemActionFailed(client, input);
                return;
            }
            invItem.Amount = input.Amount;
            storage[input.EquipIndex] = invItem;
        }
    }
    
    client.character.markModified('Storage');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};
// Revision Date: 9:09 AM 5/31/2014
// Revision: 2
ItemActions[0x05] = function Recv_StoreItemInCharacterPrivateStorage(client, input) {
    if(input.EquipIndex > 27 || input.EquipIndex < 0 || input.InventoryIndex > 63 || input.InventoryIndex < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;
    var invItem = inventory[input.InventoryIndex];
    
    if(!invItem){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(invItem.ID !== input.ItemID){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var storage = client.character.Storage;
    var eqItem = storage[input.EquipIndex];
    
    var reminder = (!invItem.Amount ? 0 : invItem.Amount) - input.Amount;
    
    var amount;
    if(reminder === 0){
        amount = !invItem.Amount ? 0 : invItem.Amount;
        inventory[input.InventoryIndex] = null;
    }else{
        amount = input.Amount;
        inventory[input.InventoryIndex].Amount = reminder;
    }
    
    if(itemInfo.isStackable() && input.Amount === 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    
    if(eqItem && eqItem.ID !== invItem.ID){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.isStackable() && eqItem){
        if(!eqItem.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }
        if((amount + eqItem.Amount) > 99 || (amount + eqItem.Amount) < 1){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        if(input.Amount > invItem.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        storage[input.EquipIndex].Amount += amount;
    }else{
        if(itemInfo.isStackable())
            storage[input.EquipIndex] = {ID: invItem.ID, Amount: amount};
        else if(itemInfo.ItemType === 22)
            storage[input.EquipIndex] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth};
        else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
            storage[input.EquipIndex] = {ID: invItem.ID};
        else
            storage[input.EquipIndex] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine};
    }
    
    client.character.markModified('Inventory');
    client.character.markModified('Storage');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 11:19 AM 5/31/2014
ItemActions[0x06] = function Recv_StoreItemInGateMaster(client, input) {
    if(input.EquipIndex > 55 || input.EquipIndex < 0 || input.InventoryIndex > 63 || input.InventoryIndex < 0){
        clientWriteItemActionFailed(client, input);
        console.log("Index is incorrect");
        return;
    }
    
    if(input.Amount > 99 || input.Amount < 0){
        console.log("Amount is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;
    var invItem = inventory[input.InventoryIndex];
    
    if(!invItem || invItem.ID !== input.ItemID){
        console.log("The input id does not match");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    if(!itemInfo){
        console.log("Theres is no item info on that item ID");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var bank = client.character.Bank;    
    if(bank[input.EquipIndex]){
        console.log("Theres an item in bank already");
        clientWriteItemActionFailed(client, input);
        return;
    }

    input.Amount = itemInfo.isStackable() && input.Amount === 0 ? 1 : input.Amount;
    input.Amount = itemInfo.isStackable() ? input.Amount : 0;
    
    var reminder = (!invItem.Amount || !itemInfo.isStackable() ? 0 : invItem.Amount) - input.Amount;
    
    if(reminder){
        console.log("Reminder left behind");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.isStackable() && invItem.Amount < input.Amount){
        console.log("Item is stackable and the item amount is less than input amount");
        clientWriteItemActionFailed(client, input);
        return;
    }

    if(itemInfo.isStackable())
        bank[input.EquipIndex] = {ID: invItem.ID, Amount: input.Amount};
    else if(itemInfo.ItemType === 22)
        bank[input.EquipIndex] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth};
    else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
        bank[input.EquipIndex] = {ID: invItem.ID};
    else
        bank[input.EquipIndex] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine};
    
    for(var i = 0; i < 56; i++){
        if(bank[i] === undefined)
            bank[i] = null;
    }
    
    inventory[input.InventoryIndex] = null;
    
    client.character.markModified('Inventory');
    client.character.save();
    client.character.saveBank();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 12:06 PM 5/31/2014
ItemActions[0x08] = function Recv_CoinsToGold(client, input) {
    if(client.character.Silver >= 1000000000){
        client.character.Silver -= 1000000000;
        client.character.SilverBig++;
        client.character.save();

        clientWriteItemActionSuccess(client, input);
    }else{
        clientWriteItemActionFailed(client, input);
    }
};

// Revision Date: 12:06 PM 5/31/2014
ItemActions[0x09] = function Recv_GoldToCoins(client, input) {
    var MAX_SILVER = packets.MAX_SILVER;

    if(client.character.SilverBig >= 1){
        if( (client.character.Silver+1000000000) <= MAX_SILVER  ) {
            client.character.Silver += 1000000000;
            client.character.SilverBig--;
        }else{
            clientWriteItemActionFailed(client, input);
            return;
        }
    }else{
        clientWriteItemActionFailed(client, input);
        return;
    }


    client.character.save();
    clientWriteItemActionSuccess(client, input);
};
ItemActions[0xA] = function Recv_Discard_Item(client, input) { // 10
    NotImplemented(client, 'Recv_Discard_Item', input);
};

// Revision Date: 5:17 AM 5/30/2014
ItemActions[0xB] = function Recv_MoveFromPillBar(client, input) {
    if(input.InventoryIndex > 3 || input.InventoryIndex < 0 || input.EquipIndex > 63 || input.EquipIndex < 0){
        console.log("Input inventory index is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var qItem = client.character.QuickUseItems[input.InventoryIndex];
    var inventory = client.character.Inventory;
    
    if(!qItem || !qItem.ID || qItem.ID !== input.ItemID){
        console.log("The matching is not accepted");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[input.ItemID];
    
    if(!itemInfo){
        console.log("No item info");
        return;
    }
    
    var invItem = client.character.Inventory[input.EquipIndex];
    
    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, getSlotCount(itemInfo.ItemType));

    if(input.Amount > 99 || input.Amount < 0 || input.Amount > qItem.Amount){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var reminder = qItem.Amount - input.Amount;

    var amount;
    if(reminder === 0){
        client.character.QuickUseItems[input.InventoryIndex] = null;
        amount = qItem.Amount;
    }else{
        client.character.QuickUseItems[input.InventoryIndex].Amount = reminder;
        amount = input.Amount;
    }
    
    if(!invItem && collision){
        inventory[collision.InventoryIndex] = {ID: qItem.ID, Amount: amount, Column: collision.MoveRow, Row: collision.MoveColumn};
    }else{
        if(invItem.ID === qItem.ID){
            if((invItem.Amount+amount) > 99 || (invItem.Amount+amount) < 0){
                clientWriteItemActionFailed(client, input);
                return;
            }else{
                client.character.Inventory[input.EquipIndex].Amount += amount;
            }
        }else{
            clientWriteItemActionFailed(client, input);
            return;
        }
    }

    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 12:05 PM 5/31/2014
// TODO: Check if has pills, get the amount to be recovered
// TODO: Recovery and state update
ItemActions[0x0C] = function Recv_Use_item(client, input) {
    console.log(input);
    clientWriteItemActionFailed(client, input);
    // var UsedItem = client.character.QuickUseItems[input.InventoryIndex];
    // console.log('asd');
    // if(UsedItem === null || UsedItem === undefined){
    //     clientWriteItemActionFailed(client, input);
    //     console.log('1');
    //     return;
    // }else{
    //     console.log('2');
    //     if(!UsedItem || UsedItem.ID !== input.ItemID){
    //         console.log('3');
    //         clientWriteItemActionFailed(client, input);
    //         return;
    //     }else{
    //         console.log('4');
    //         var ii = infos.Item[UsedItem.ID];
    //         if (!ii) {
    //             console.log('Item '+UsedItem.ID+' DOES NOT EXIST when used...');
    //             clientWriteItemActionFailed(client, input);
    //             return;
    //         }

    //         console.log('5');

    //         ii.use(client);

    //         if(UsedItem.Amount-1===0) {
    //             client.character.QuickUseItems[input.InventoryIndex] = null;
    //         }
    //         else {
    //             client.character.QuickUseItems[input.InventoryIndex].Amount--;
    //         }

    //         client.character.markModified('QuickUseItems');
    //         client.character.save();
    //         clientWriteItemActionSuccess(client, input);
    //     }
    // }
};
ItemActions[0x0D] = function Recv_Discard_Uniform_Items(client, input) {
    NotImplemented(client, 'Recv_Discard_Uniform_Items', input);
};

// Revision Date: 2:44 AM 5/30/2014
// Revision: 2
ItemActions[0x0E] = function Recv_UnequipItemFromCharacter(client, input) {
    if(input.InventoryIndex > 8 || input.InventoryIndex < 0){
        console.log("Input inventory index");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var equipItem;
    switch(input.InventoryIndex){
        case 0: equipItem = 'Amulet'; break; // Amulet
        case 1: equipItem = 'Cape'; break; // Cape
        case 2: equipItem = 'Armor'; break; // Armor
        case 3: equipItem = 'Glove'; break; // Gloves
        case 4: equipItem = 'Ring'; break; // Ring
        case 5: equipItem = 'Boot'; break; // Boots
        case 6: equipItem = 'CalbashBottle'; break; // Bootle
        case 7: equipItem = 'Weapon'; break; // Weapon
        case 8: equipItem = 'Pet'; break; // Pet
        default: break;
    }

    var inventory = client.character.Inventory;
    var invItem = client.character[equipItem];

    if(!invItem || !invItem.ID){
        console.log("No inventory item");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    
    if(!itemInfo){
        console.log("No item info");
        clientWriteItemActionFailed(client, input);
        return;
    }

    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, getSlotCount(itemInfo.ItemType));

    if(!collision){
        console.log("Collision detected");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.ItemType === 22)
        inventory[collision.InventoryIndex] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth, Column: collision.MoveRow, Row: collision.MoveColumn};
    else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
        inventory[collision.InventoryIndex] = {ID: invItem.ID, Column: collision.MoveRow, Row: collision.MoveColumn};
    else
        inventory[collision.InventoryIndex] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine, Column: collision.MoveRow, Row: collision.MoveColumn};
    
    client.character[equipItem] = null;
    
    client.character.markModified('Inventory');
    client.character.save();
    
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 10:07 AM 5/31/2014
ItemActions[0x0F] = function Recv_MoveItemFromStorage(client, input) {
    if(input.EquipIndex > 63 || input.EquipIndex < 0 || input.InventoryIndex > 27 || input.InventoryIndex < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var storage = client.character.Storage;
    var invItem = storage[input.InventoryIndex];
    
    if(!invItem){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(invItem.ID !== input.ItemID){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;
    var eqItem = inventory[input.EquipIndex];

    var reminder = (!invItem.Amount ? 0 : invItem.Amount) - input.Amount;
    
    var amount;
    if(reminder === 0){
        amount = !invItem.Amount ? 0 : invItem.Amount;
        storage[input.InventoryIndex] = null;
    }else{
        amount = input.Amount;
        storage[input.InventoryIndex].Amount = reminder;
    }
    
    if(itemInfo.isStackable() && input.Amount === 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    
    if(eqItem && eqItem.ID !== invItem.ID){
        clientWriteItemActionFailed(client, input);
        return;
    }
    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, getSlotCount(itemInfo.ItemType));

    if(!eqItem && !collision){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.isStackable() && eqItem){
        if(!eqItem.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }
        if((amount + eqItem.Amount) > 99 || (amount + eqItem.Amount) < 1){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        if(input.Amount > invItem.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }
        
        inventory[input.EquipIndex].Amount += amount;
    }else{
        if(itemInfo.isStackable())
            inventory[collision.InventoryIndex] = {ID: invItem.ID, Column: collision.MoveRow, Row: collision.MoveColumn, Amount: amount};
        else if(itemInfo.ItemType === 22)
            inventory[collision.InventoryIndex] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth, Column: collision.MoveRow, Row: collision.MoveColumn};
        else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
            inventory[collision.InventoryIndex] = {ID: invItem.ID, Column: collision.MoveRow, Row: collision.MoveColumn};
        else
            inventory[collision.InventoryIndex] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine, Column: collision.MoveRow, Row: collision.MoveColumn};
    }
    
    client.character.markModified('Inventory');
    client.character.markModified('Storage');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 11:56 AM 5/31/2014
ItemActions[0x10] = function Recv_GetItemFromGateMasterStorage(client, input) {
    if(input.EquipIndex > 63 || input.EquipIndex < 0 || input.InventoryIndex > 55 || input.InventoryIndex < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    var bank = client.character.Bank;
    var invItem = bank[input.InventoryIndex];
    
    if(!invItem){
        console.log("Item does not exists");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var inventory = client.character.Inventory;

    if(input.Amount < 0 || input.Amount > 99){
        console.log("Incorect amount of the item");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    if(!itemInfo){
        console.log("Item info not founded");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, getSlotCount(itemInfo.ItemType));

    if(!collision){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    input.Amount = itemInfo.isStackable() && input.Amount === 0 ? 1 : input.Amount;
    input.Amount = itemInfo.isStackable() ? input.Amount : 0;
    
    var reminder = (!invItem.Amount || !itemInfo.isStackable() ? 0 : invItem.Amount) - input.Amount;
    
    if(reminder){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(itemInfo.isStackable() && invItem.Amount < input.Amount){
        console.log("Item is stackable and the item amount is less than input amount");
        clientWriteItemActionFailed(client, input);
        return;
    }
    

    if(itemInfo.isStackable())
        inventory[input.EquipIndex] = {ID: invItem.ID, Amount: input.Amount, Column: collision.MoveRow, Row: collision.MoveColumn};
    else if(itemInfo.ItemType === 22)
        inventory[input.EquipIndex] = {ID: invItem.ID, Activity: invItem.Activity, Growth: invItem.Growth, Column: collision.MoveRow, Row: collision.MoveColumn};
    else if(itemInfo.ItemType === 11 || itemInfo.ItemType === 8 || itemInfo.ItemType === 7 || itemInfo.ItemType === 6)
        inventory[input.EquipIndex] = {ID: invItem.ID, Column: collision.MoveRow, Row: collision.MoveColumn};
    else
        inventory[input.EquipIndex] = {ID: invItem.ID, Enchant: invItem.Enchant, Combine: invItem.Combine, Column: collision.MoveRow, Row: collision.MoveColumn};
    
    bank[input.InventoryIndex] = null;
    
    client.character.markModified('Inventory');
    client.character.save();
    client.character.saveBank();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 5:54 AM 5/30/2014
// TODO: Check the distance between client and npc to make sure hes standing near
ItemActions[0x11] = function Recv_BuyItemFromNpc(client, input) {
    if(input.EquipIndex > 63 || input.EquipIndex < 0){
        console.log("Input inventory index is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var NpcInfo = infos.Npc[input.NodeID];
    if(!NpcInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[input.ItemID];
    
    if(!itemInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    // Does the npc sell the required item
    if(NpcInfo.Items.indexOf(input.ItemID) < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(input.Amount > 99 || input.Amount < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, itemInfo.getSlotCount());

    if(!collision){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(client.character.Inventory[input.EquipIndex]){
        clientWriteItemActionFailed(client, input);
        return;
    }

    var itemPrice = itemInfo.PurchasePrice*(input.Amount === 0 ? 1 : input.Amount);
    
    if((client.character.Silver - itemPrice) < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    client.character.Silver -= itemPrice;
    
    client.character.Inventory[collision.InventoryIndex] = {
        ID: input.ItemID,
        Amount: input.Amount,
        Column: collision.MoveRow,
        Row: collision.MoveColumn
    };
    
    client.character.markModified("Inventory");
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 6:19 AM 5/30/2014
// TODO: Check the distance between client and npc to make sure hes standing near
ItemActions[0x07] = function Recv_SellItemToNpc(client, input) {
    if(input.InventoryIndex > 63 || input.InventoryIndex < 0){
        console.log("Input inventory index is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[input.ItemID];
    
    if(!itemInfo){
        console.log("Item info does not exists");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(input.Amount > 99 || input.Amount < 0){
        console.log("Input amount is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var invItem = client.character.Inventory[input.InventoryIndex];
    console.log(invItem);
    if(!invItem || invItem.ID !== input.ItemID){
        console.log("The item in inventory has not been found");
        clientWriteItemActionFailed(client, input);
        return;
    }

    var sellPrice = itemInfo.SalePrice * (input.Amount === 0 ? 1 : input.Amount);
    
    
    if((sellPrice+client.character.Silver) > packets.MAX_SILVER){
        console.log("This buy will exceed the maximum amount of clients silver");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    client.character.Silver += sellPrice;
    
    var reminder = invItem.Amount - input.Amount;
    if(reminder < 0 || reminder > 99){
        console.log("The reminder is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(reminder === 0){
        client.character.Inventory[input.InventoryIndex] = null;
    }else{
        client.character.Inventory[input.InventoryIndex].Amount = reminder;
    }
    
    
    client.character.markModified("Inventory");
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

ItemActions[0x12] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};

// Revision Date: 4:09 AM 5/30/2014
ItemActions[0x13] = function Recv_MoveActionOnPillbar(client, input) {
    if(input.InventoryIndex > 3 || input.InventoryIndex < 0 || input.EquipIndex > 3 || input.EquipIndex < 0){
        console.log("Input inventory index is incorrect");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var qItem = client.character.QuickUseItems[input.InventoryIndex];
    
    if(!qItem){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var dItem = client.character.QuickUseItems[input.EquipIndex];
    
    if(input.Amount > 99 || input.Amount < 0 || input.Amount > qItem.Amount){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var reminder = qItem.Amount - input.Amount;

    var amount;
    if(reminder === 0){
        client.character.QuickUseItems[input.InventoryIndex] = null;
        amount = qItem.Amount;
    }else{
        client.character.QuickUseItems[input.InventoryIndex].Amount = reminder;
        amount = input.Amount;
    }
    
    if(!dItem){
        client.character.QuickUseItems[input.EquipIndex] = {ID: qItem.ID, Amount: amount};
    }else if(dItem && dItem.ID && qItem.ID === dItem.ID){
        if((dItem.Amount + amount) > 99 || (dItem.Amount + amount) < 0){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            client.character.QuickUseItems[input.EquipIndex].Amount += amount;
        }
    }
    
    client.character.markModified('QuickUseItems');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 1:25 PM 5/29/2014
ItemActions[0x14] = function MoveItem_InInventory(client, input) {
    if(input.InventoryIndex > 63 || input.InventoryIndex < 0){
        console.log("Input inventory index is incorrect or there is no pages yet implemented");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var invItem = client.character.Inventory[input.InventoryIndex];
    
    if(!invItem){
        console.log("Item does not exists");
        clientWriteItemActionFailed(client, input);
        return;
    }

    if(input.Amount < 0 || input.Amount > 99){
        console.log("Incorect amount of the item");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var itemInfo = infos.Item[invItem.ID];
    if(!itemInfo){
        console.log("Item info not founded");
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var collision = client.character.checkInventoryItemCollision(input.MoveColumn, input.MoveRow, getSlotCount(itemInfo.ItemType));

    var inventory = client.character.Inventory;
    if(itemInfo.isStackable() && input.Amount >= 1){
        var reminder = invItem.Amount - input.Amount;
        if(!collision){
            var stackingItem = inventory[input.EquipIndex];
            if(invItem.ID !== input.ItemID || (!stackingItem || stackingItem.ID !== invItem.ID)){
                console.log("The stacking items does not mach");
                clientWriteItemActionFailed(client, input);
                return;
            }
            
            if( (input.Amount + invItem.Amount) > 99){
                console.log("The stack amount exceeds the limits");
                clientWriteItemActionFailed(client, input);
                return;
            }
            
            if(reminder === 0){
                stackingItem.Amount += invItem.Amount;
                inventory[input.InventoryIndex] = null;
            }else{            
                stackingItem.Amount += input.Amount;
                invItem.Amount -= input.Amount;
            }
        }else{
            if(reminder === 0){
                invItem.Column = collision.MoveRow;
                invItem.Row = collision.MoveColumn;
                inventory[collision.InventoryIndex] = invItem;
                
                inventory[input.InventoryIndex] = null;
            }else{            
                inventory[collision.InventoryIndex] = {ID: invItem.ID, Column: collision.MoveRow, Row: collision.MoveColumn, Amount: input.Amount};
                
                invItem.Amount = reminder;
            }
        }
    }else if(collision){
        invItem.Column = collision.MoveRow;
        invItem.Row = collision.MoveColumn;
        inventory[collision.InventoryIndex] = invItem;
        
        inventory[input.InventoryIndex] = null;
    }

    client.character.markModified('Inventory');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 12:01 PM 5/31/2014
ItemActions[0x15] = function PlaceSilverToStorage(client, input) {
    var MAX_SILVER = packets.MAX_SILVER;

    if((client.character.StorageSilver + input.Amount) > MAX_SILVER || input.Amount < 0 || input.Amount > MAX_SILVER){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        client.character.StorageSilver += input.Amount;
        client.character.Silver -= input.Amount;
        client.character.save();
        clientWriteItemActionSuccess(client, input);
    }
};
ItemActions[0x17] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};

// Revision Date: 12:01 PM 5/31/2014
ItemActions[0x18] = function GetSilverFromStorage(client, input) {
    var MAX_SILVER = packets.MAX_SILVER;

    if((client.character.Silver + input.Amount) > MAX_SILVER || input.Amount < 0 || input.Amount > MAX_SILVER){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        client.character.Silver += input.Amount;
        client.character.StorageSilver -= input.Amount;
        client.character.save();
        clientWriteItemActionSuccess(client, input);
    }
};
// Revision Date: 12:01 PM 5/31/2014
ItemActions[0x16] = function Recv_GateMasterBankSilver(client, input) {
    var clientSilver = client.character.Silver;
    var MAX_SILVER = packets.MAX_SILVER;

    if(input.Amount > MAX_SILVER || input.Amount <= 0 || (clientSilver-input.Amount) < 0 || (client.character.StorageSilver+input.Amount) > MAX_SILVER){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        client.character.Silver -= input.Amount;
        client.character.BankSilver += input.Amount;
        client.character.save();
        client.character.saveBankSilver();

        clientWriteItemActionSuccess(client, input);
        return;
    }
};
// Revision Date: 12:01 PM 5/31/2014
ItemActions[0x19] = function Recv_GateMasterBankGetSilver(client, input) {
    var clientSilver = client.character.Silver;
    var MAX_SILVER = packets.MAX_SILVER;

    if(input.Amount > MAX_SILVER || input.Amount <= 0 || (clientSilver+input.Amount) > MAX_SILVER || (client.character.BankSilver-input.Amount) < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        client.character.Silver += input.Amount;
        client.character.BankSilver -= input.Amount;
        client.character.save();
        client.character.saveBankSilver();

        clientWriteItemActionSuccess(client, input);
        return;
    }
};

ItemActions[0x1A] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};

// Revision Date: 10:58 PM 5/30/2014
ItemActions[0x1B] = function Recv_SkillToBar(client, input) {
    if(input.EquipIndex > 24 || input.EquipIndex < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var skill = client.character.SkillList[input.InventoryIndex];
    if(!skill || !skill.ID || !skill.Level){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(skill.Level < input.Amount){
        clientWriteItemActionFailed(client, input);
        return;
    }

    client.character.SkillBar[input.EquipIndex] = {ID: skill.ID, Level: input.Amount};
    client.character.markModified('SkillBar');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 6:22 AM 5/30/2014
ItemActions[0x1C] = function Recv_RemoveSkillFromBar(client, input) {
    if(input.InventoryIndex > 24 || input.InventoryIndex < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var skill = client.character.SkillBar[input.InventoryIndex];
    
    if(!skill || !skill.Level){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    client.character.SkillBar[input.InventoryIndex] = null;
    client.character.markModified('SkillBar');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 6:27 AM 5/30/2014
ItemActions[0x1D] = function Recv_SkillUp(client, input) {
    var skill = client.character.SkillList[input.InventoryIndex];
    if(!skill || !client.character.Level || !client.character.SkillPoints){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var skillInfo = infos.Skill[skill.ID];
    
    if(!skillInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(client.character.SkillPoints < 1 || skill.Level === skillInfo.MaxSkillLevel){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    client.character.SkillPoints -= 1;
    client.character.SkillList[input.InventoryIndex].Level += 1;
    client.character.markModified('SkillList');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

// Revision Date: 10:50 PM 5/30/2014
ItemActions[0x1F] = function Recv_LearnSkill(client, input) {
    var skill = infos.Skill[input.ItemID];
    
    if(!skill){
        clientWriteItemActionFailed(client, input);
        return;
    }

    var npcInfo = infos.Npc[input.NodeID];
    
    if(!npcInfo){
        clientWriteItemActionFailed(client, input);
        return;
    }

    if(npcInfo.Items.indexOf(input.ItemID) < 0){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    var alreadyLearned;
    var freeIndex;
    var startIndexFrom;
    switch(skill.Category){
        case 1:
        startIndexFrom = 0;
        break;
        
        case 2:
        startIndexFrom = 20;
        break;
        
        case 3:
        case 4:
        startIndexFrom = 10;
        break;
    }
    for(var i = startIndexFrom; i < (startIndexFrom+10); i++){
        if(client.character.SkillList[i] && client.character.SkillList[i].ID === input.ItemID){
            alreadyLearned = true;
            break;
        }

        if(freeIndex === undefined && !client.character.SkillList[i]){
            freeIndex = i;
        }
    }
    
    if(alreadyLearned || freeIndex === undefined){
        clientWriteItemActionFailed(client, input);
        return;
    }

    if(!skill.Clan || skill.Clan !== (client.character.Clan+2)){
        clientWriteItemActionFailed(client, input);
        return;
    }
    
    if(client.character.SkillPoints < skill.PointsToLearn){
        clientWriteItemActionFailed(client, input);
        return;
    }

    client.character.SkillPoints -= skill.PointsToLearn;
    client.character.SkillList[freeIndex] = {ID: input.ItemID, Level: skill.PointsToLearn};

    client.character.markModified('SkillList');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};

ItemActions[0x1E] = function sub_462A60(client, input) {
    NotImplemented(client, 'sub_462A60', input);
};


ItemActions[0x20] = function sub_462C20(client, input) {
    NotImplemented(client, 'sub_462C20', input);
};
ItemActions[0x21] = function Recv_BindAutoBuffSkill(client, input) {
    NotImplemented(client, 'Recv_BindAutoBuffSkill', input);
};
ItemActions[0x22] = function sub_462CE0(client, input) {
    NotImplemented(client, 'sub_462CE0', input);
};
ItemActions[0x23] = function sub_462D50(client, input) {
    NotImplemented(client, 'sub_462D50', input);
};
ItemActions[0x24] = function sub_462FD0(client, input) {
    NotImplemented(client, 'sub_462FD0', input);
};
ItemActions[0x25] = function sub_4631E0(client, input) {
    NotImplemented(client, 'sub_4631E0', input);
};
ItemActions[0x26] = function sub_463460(client, input) {
    NotImplemented(client, 'sub_463460', input);
};
ItemActions[0x27] = function Recv_MoveItem5GiveSilver(client, input) {
    NotImplemented(client, 'Recv_MoveItem5GiveSilver', input);
};
ItemActions[0x28] = function Recv_MoveItem4TakeSilver(client, input) {
    NotImplemented(client, 'Recv_MoveItem4TakeSilver', input);
};
ItemActions[0x29] = function Recv_MoveItem3GiveSilver(client, input) {
    NotImplemented(client, 'Recv_MoveItem3GiveSilver', input);
};
ItemActions[0x2A] = function Recv_MoveItem2TakeSilver(client, input) {
    NotImplemented(client, 'Recv_MoveItem2TakeSilver', input);
};

WorldPC.Set(0x14, {
    Restruct: WorldPC.ItemActionPacket,
    function: function handleItemActionPacket(client, input) {
        if (!client.authenticated) return;
        if (client.debug) { client.sendInfoMessage('Handling Item Action: ' + input.ActionType); }
        if (ItemActions[input.ActionType]) {
            try {
                ItemActions[input.ActionType](client, input);
            } catch (ex) {
                dumpError(ex);
                clientWriteItemActionFailed(client, input);
            }
        } else {
            console.log('Unhandled Item Action: ' + input.ActionType);
            NotImplemented(input.ActionType);
            client.sendInfoMessage('The inventory action ' + input.ActionType + ' has not been coded into the server. Please report this to a developer and tell them what you were doing at the time.');
        }
    }
}); 
