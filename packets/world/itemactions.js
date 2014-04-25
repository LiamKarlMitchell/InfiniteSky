// ###############

// ###############


var NotImplemented = function(client, name, input) {
    var msg = 'Item Action: ' + name + ' is not implemented.';
    console.log(msg);
    client.sendInfoMessage(msg);
    client.write(new Buffer(packets.ItemActionReplyPacket2.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        ItemID: input.ItemID,
        Unknown3: input.Unknown3,
        Unknown4: input.Unknown4,
        Unknown5: input.Unknown5,
        Amount: input.Amount,
        InventoryIndex: input.InventoryIndex,
        RowDrop: input.RowDrop,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup,
        ColumnMove: input.ColumnMove,
        RowMove: input.RowMove,
        Failed: 1
    })));
};

function clientWriteItemActionFailed(client, input){
	client.write(new Buffer(packets.ItemActionReplyPacket2.pack({
		PacketID: 0x2B,
		ActionType: input.ActionType,
		ItemUniqueID: input.ItemUniqueID,
		ItemUniqueID2: input.ItemUniqueID2,
		ItemID: input.ItemID,
		Unknown3: input.Unknown3,
		Unknown4: input.Unknown4,
		Unknown5: input.Unknown5,
		Amount: input.Amount,
		InventoryIndex: input.InventoryIndex,
		RowDrop: input.RowDrop,
		ColumnPickup: input.ColumnPickup,
		RowPickup: input.RowPickup,
		ColumnMove: input.ColumnMove,
		RowMove: input.RowMove,
		Failed: 1
    })));
}

function clientWriteItemActionSuccess(client, input){
    client.write(new Buffer(packets.ItemActionReplyPacket2.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        ItemID: input.ItemID,
        Unknown3: input.Unknown3,
        Unknown4: input.Unknown4,
        Unknown5: input.Unknown5,
        Amount: input.Amount,
        InventoryIndex: input.InventoryIndex,
        RowDrop: input.RowDrop,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup,
        ColumnMove: input.ColumnMove,
        RowMove: input.RowMove,
        Failed: 0
    })));
}

function getSlotCount(itemType) {
    if (itemType === 2 || itemType === 7 || itemType === 11) {
        return 1;
    } else {
        return 4;
    }
}

function getStackingIventoryItemIndex(inventory, page, x1, y1, itemID){
    var stackedIndex;
    for (var i = 0; i < 32+(page*32); i++) {
        var index = i + (page * 32);
        var object = inventory[index];
        if (object !== undefined && object !== null) {
            var itemInfo = infos.Item[object.ID];
            if (itemInfo !== undefined) {
                var posX = object.Column;
                var posY = object.Row;

                if(stackedIndex === undefined && itemID === object.ID && posX === x1 && posY === y1){
                    stackedIndex = index;
                    break;
                }
            }
        }
    }

    return (stackedIndex === undefined ? false : stackedIndex);
}

ItemActions = [];
ItemActions[0x00] = function Recv_PickupItem(client, input) {
    NotImplemented(client, 'Recv_PickupItem', input);
};
ItemActions[0x01] = function Recv_DropItem(client, input) {
    NotImplemented(client, 'Recv_DropItem', input);
};
ItemActions[0x02] = function Recv_MoveToPillBar(client, input) { // COMPLETED
    var InventoryItem = client.character.Inventory[input.InventoryIndex];
    var Slot = input.RowPickup;
    var QuickItems = client.character.QuickUseItems;

    if(client.character.Inventory.length === 64 && QuickItems.length === 4){
        if(InventoryItem == undefined){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            var ItemID = input.ItemID;
            var ItemAmount = input.Amount;

            if(ItemID !== InventoryItem.ID || QuickItems[Slot] !== null){
                clientWriteItemActionFailed(client, input);
                return;
            }else if(QuickItems[Slot] === null){
                if(ItemAmount > InventoryItem.Amount || ItemAmount < 0){
                    clientWriteItemActionFailed(client, input);
                    return;
                }else if(ItemAmount === InventoryItem.Amount){
                    client.character.QuickUseItems[Slot] = structs.QuickUseItem.objectify();
                    client.character.QuickUseItems[Slot].ID = InventoryItem.ID;
                    client.character.QuickUseItems[Slot].Amount = InventoryItem.Amount;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    var Reminder = InventoryItem.Amount - input.Amount;
                    client.character.QuickUseItems[Slot] = structs.QuickUseItem.objectify();
                    client.character.QuickUseItems[Slot].ID = InventoryItem.ID;
                    client.character.QuickUseItems[Slot].Amount = InventoryItem.Amount;

                    client.character.Inventory[input.InventoryIndex].Amount = Reminder;
                }
            }

        }
    }

    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

    clientWriteItemActionSuccess(client, input);
};


ItemActions[0x03] = function Recv_EquipItem(client, input) { // COMPLETED
    var ItemInfo = infos.Item[input.ItemID];
    var itemType = ItemInfo.ItemType;
    var inventoryItem = client.character.Inventory[input.InventoryIndex];

    if(inventoryItem === undefined || inventoryItem === null || ItemInfo === undefined){
        console.log("Item that index does not exists!");
        clientWriteItemActionFailed(client, input);
        return;
    }

    switch(itemType){
        case 7: // Neck
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Amulet === null || client.character.Amulet === false || client.character.Amulet === undefined || client.character.Amulet.ID === 0){
                    client.character.Amulet = structs.Equipt.objectify();
                    client.character.Amulet.ID = inventoryItem.ID;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                    clientWriteItemActionFailed(client, input);
                    return;
                }
            }else{
                console.log("HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;  
            }
        break;

        case 8: // Cape
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Cape === null || client.character.Cape === false || client.character.Cape === undefined || client.character.Cape.ID === 0){
                    client.character.Cape = structs.Equipt.objectify();
                    client.character.Cape.ID = inventoryItem.ID;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;  
            }
        break;

        case 9: // Armor
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Armor === null || client.character.Armor === false || client.character.Armor === undefined || client.character.Armor.ID === 0){
                    client.character.Armor = structs.Equipt.objectify();
                    client.character.Armor.ID = inventoryItem.ID;
                    client.character.Armor.Enchant = inventoryItem.Enchant;
                    client.character.Armor.Combine = inventoryItem.Combine;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return; 
            }
        break;

        case 10: // Gloves
            if( ItemInfo.isAllowedByClan(client.character.Clan) && client.character.Level >= ItemInfo.LevelRequirement){
                if(client.character.Glove === null || client.character.Glove === false || client.character.Glove === undefined || client.character.Glove.ID === 0){
                    client.character.Glove = structs.Equipt.objectify();
                    client.character.Glove.ID = inventoryItem.ID;
                    client.character.Glove.Enchant = inventoryItem.Enchant;
                    client.character.Glove.Combine = inventoryItem.Combine;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                    clientWriteItemActionFailed(client, input);
                    return; 
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;  
            }
        break;

        case 11: // Ring
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Ring === null || client.character.Ring === false || client.character.Ring === undefined || client.character.Ring.ID === 0){
                    client.character.Ring = structs.Equipt.objectify();
                    client.character.Ring.ID = inventoryItem.ID;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                    clientWriteItemActionFailed(client, input);
                    return; 
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;   
            }
        break;

        case 12: // Boots
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Boot === null || client.character.Boot === false || client.character.Boot === undefined || client.character.Boot.ID === 0){
                    client.character.Boot = structs.Equipt.objectify();
                    client.character.Boot.ID = inventoryItem.ID;
                    client.character.Boot.Enchant = inventoryItem.Enchant;
                    client.character.Boot.Combine = inventoryItem.Combine;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;  
            }
        break;

        case 6: // Bootle
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.CalbashBottle === null || client.character.CalbashBottle === false || client.character.CalbashBottle === undefined || client.character.CalbashBottle.ID === 0){
                    client.character.CalbashBottle = structs.Equipt.objectify();
                    client.character.CalbashBottle.ID = inventoryItem.ID;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;  
            }
        break;

        case 13: //Sword
        case 14: //Blade
        case 15: //Marble
        case 16: //Katana
        case 17: //Double Blade
        case 18: //Lute
        case 19: //Light Blade
        case 20: //Long Spear
        case 21: //Scepter
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Weapon === null || client.character.Weapon === false || client.character.Weapon === undefined || client.character.Weapon.ID === 0){
                    client.character.Weapon = structs.Equipt.objectify();
                    client.character.Weapon.ID = inventoryItem.ID;
                    client.character.Weapon.Enchant = inventoryItem.Enchant;
                    client.character.Weapon.Combine = inventoryItem.Combine;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return; 
            }
        break;

        case 22: // Pet
            if( ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                if(client.character.Pet === null || client.character.Pet === false || client.character.Pet === undefined || client.character.Pet.ID === 0){
                    client.character.Pet = structs.Pet.objectify();
                    client.character.Pet.ID = inventoryItem.ID;
                    client.character.Pet.Activity = inventoryItem.Activity;
                    client.character.Pet.Growth = inventoryItem.Growth;

                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    console.log("There is already an equiped item!");
                }
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return;   
            }
        break;

        default:
            console.log(itemType + " is not defined to Equip a item!");
            clientWriteItemActionFailed(client, input);
            return; 
        break;
    }

    client.character.markModified('Inventory');
    client.character.save();

    clientWriteItemActionSuccess(client, input);
};
ItemActions[0x04] = function Recv_Move_Item(client, input) {
    var StorageItem = client.character.Storage[input.InventoryIndex];
    var ExistingItem = client.character.Storage[input.RowPickup];

    if(StorageItem === undefined || StorageItem === null){
        clientWriteItemActionFailed(client, input);
        return; 
    }else{
        if(input.Amount > 0 && StorageItem.Amount > 0 && StorageItem.Amount <= 99 && input.Amount <= 99 && input.ItemID === StorageItem.ID){
            var Reminder = StorageItem.Amount - input.Amount;
            if(ExistingItem === undefined || ExistingItem === null){
                client.character.Storage[input.RowPickup] = structs.SmallStorageItem.objectify();
                client.character.Storage[input.RowPickup].Amount = input.Amount;
                client.character.Storage[input.RowPickup].ID = input.ItemID;
            }else if(input.ItemID === ExistingItem.ID){
                if((ExistingItem.Amount+input.Amount) > 99 || (ExistingItem.Amount+input.Amount) < 0){
                    clientWriteItemActionFailed(client, input);
                    return; 
                }else{
                    client.character.Storage[input.RowPickup].Amount += input.Amount;
                }
            }

            if(Reminder === 0){
                client.character.Storage[input.InventoryIndex] = null;
            }else{
                client.character.Storage[input.InventoryIndex].Amount = Reminder;
            }
        }else{
            if(ExistingItem === undefined || ExistingItem === null){
                client.character.Storage[input.RowPickup] = StorageItem;
                client.character.Storage[input.InventoryIndex] = null;
            }else{
                clientWriteItemActionFailed(client, input);
                return; 
            }
        }
    }

    client.character.markModified('Storage');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};
ItemActions[0x05] = function Recv_StoreItemInCharacterPrivateStorage(client, input) {
    var InventoryItem = client.character.Inventory[input.InventoryIndex];
    var ExistingItem = client.character.Storage[input.RowPickup];

    if(ExistingItem != undefined || InventoryItem === null || InventoryItem === undefined || InventoryItem.ID !== input.ItemID){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        var item = infos.Item[InventoryItem.ID];
        if(item.ItemType !== 22 && input.Amount > 0 && InventoryItem.Amount !== input.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }else if(item.ItemType !== 22 && input.Amount > 1 && (InventoryItem.Amount == undefined || InventoryItem.Amount < 1)){
            clientWriteItemActionFailed(client, input);
            return;
        }else if(item.ItemType === 22 && input.Amount !== InventoryItem.Activity){
            clientWriteItemActionFailed(client, input);
            return;
        }


        if(item.ItemType === 22){
            client.character.Storage[input.RowPickup] = structs.SmallStorageItemPet.objectify();
            client.character.Storage[input.RowPickup].ID = InventoryItem.ID;
            client.character.Storage[input.RowPickup].Growth = InventoryItem.Growth;
            client.character.Storage[input.RowPickup].Activity = InventoryItem.Activity;
        }else{
            client.character.Storage[input.RowPickup] = structs.SmallStorageItem.objectify();
            client.character.Storage[input.RowPickup].ID = InventoryItem.ID;
            client.character.Storage[input.RowPickup].Amount = InventoryItem.Amount;
            client.character.Storage[input.RowPickup].Enchant = InventoryItem.Enchant;
            client.character.Storage[input.RowPickup].Combine = InventoryItem.Combine;
        }


        var Storage = client.character.Storage;
        for(var i = 0; i < 28; i++){
            if(Storage[i] == undefined)
                client.character.Storage[i] = null;
        }

        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.markModified('Storage');
        client.character.save();
        clientWriteItemActionSuccess(client, input);
    }
};
ItemActions[0x06] = function Recv_StoreItemInGateMaster(client, input) { // COMPLETED
    var InventoryItem = client.character.Inventory[input.InventoryIndex];
    var ExistingItem = client.character.Bank[input.RowPickup];

    if(ExistingItem != undefined || InventoryItem === null || InventoryItem === undefined){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        var item = infos.Item[InventoryItem.ID];
        if(item.ItemType !== 22 && input.Amount > 0 && InventoryItem.Amount !== input.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }else if(item.ItemType !== 22 && input.Amount === 0 && InventoryItem.Amount !== input.Amount){
            clientWriteItemActionFailed(client, input);
            return;
        }else if(item.ItemType === 22 && input.Amount !== InventoryItem.Activity){
            clientWriteItemActionFailed(client, input);
            return;
        }


        if(item.ItemType === 22){
            client.character.Bank[input.RowPickup] = structs.SmallStorageItemPet.objectify();
            client.character.Bank[input.RowPickup].ID = InventoryItem.ID;
            client.character.Bank[input.RowPickup].Growth = InventoryItem.Growth;
            client.character.Bank[input.RowPickup].Activity = InventoryItem.Activity;
        }else{
            client.character.Bank[input.RowPickup] = structs.SmallStorageItem.objectify();
            client.character.Bank[input.RowPickup].ID = InventoryItem.ID;
            client.character.Bank[input.RowPickup].Amount = InventoryItem.Amount;
            client.character.Bank[input.RowPickup].Enchant = InventoryItem.Enchant;
            client.character.Bank[input.RowPickup].Combine = InventoryItem.Combine;
        }


        var Bank = client.character.Bank;
        for(var i = 0; i < 56; i++){
            if(Bank[i] == undefined)
                client.character.Bank[i] = null;
        }

        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.save();
        client.character.saveBank();
        clientWriteItemActionSuccess(client, input);
    }

};
ItemActions[0x07] = function Recv_SellItem(client, input) { // COMPLETED TODO: Making sure the player is standing in range of NPC and NPC is visible
    var MAX_SILVER = packets.MAX_SILVER;

    var sellingItem = client.character.Inventory[input.InventoryIndex];
    if(sellingItem === undefined || sellingItem === null){
        clientWriteItemActionFailed(client, input);
        return; 
    }else{
        if(sellingItem.ID !== input.ItemID){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            if(sellingItem.Amount == undefined)
                input.Amount = 0;
            var sellPrice = input.Amount <= 99 && input.Amount > 0 ? infos.Item[input.ItemID].SalePrice * input.Amount : infos.Item[input.ItemID].SalePrice;

            if((client.character.Silver + sellPrice) > MAX_SILVER){
                clientWriteItemActionFailed(client, input);
                return;
            }

            var Reminder = sellingItem.Amount - input.Amount;

            if(Reminder === 0 || sellingItem.Amount == undefined || infos.Item[sellingItem.ID].Stackable === 0){
                client.character.Inventory[input.InventoryIndex] = null;
            }else if(Reminder > 0 && Reminder < 99){
                client.character.Inventory[input.InventoryIndex].Amount = Reminder;
            }else{
                clientWriteItemActionFailed(client, input);
                return;
            }

            client.character.Silver += sellPrice;
            client.character.markModified("Inventory");
            client.character.save();
            clientWriteItemActionSuccess(client, input);
        }
    }
};
ItemActions[0x08] = function Recv_CoinsToGold(client, input) { // COMPLETED
    if(client.character.Silver >= 1000000000){
        client.character.Silver -= 1000000000;
        client.character.SilverBig++;
        client.character.save();

        clientWriteItemActionSuccess(client, input);
    }else{
        clientWriteItemActionFailed(client, input);
    }
};
ItemActions[0x09] = function Recv_GoldToCoins(client, input) { // COMPLETED
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
ItemActions[0xB] = function Recv_MoveFromPillBar(client, input) { // COMPLETED
    var QuickItem = client.character.QuickUseItems[input.InventoryIndex];
    var ItemSlot = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, 1);

    if (!ItemSlot) {
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        if(QuickItem === undefined || QuickItem === null || QuickItem.ID === undefined){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            if(input.Amount > QuickItem.Amount || input.Amount < 0){
                clientWriteItemActionFailed(client, input);
                return;
            }else if(QuickItem.Amount === input.Amount){
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = QuickItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Amount = input.Amount;

                client.character.QuickUseItems[input.InventoryIndex] = null;
            }else{
                var Reminder = QuickItem.Amount - input.Amount;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = QuickItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Amount = input.Amount;

                client.character.QuickUseItems[input.InventoryIndex].Amount = Reminder;
            }
        }
    }

    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

    clientWriteItemActionSuccess(client, input);
};
ItemActions[0x0C] = function Recv_Use_item(client, input) { // TODO: Heal method on pills and etc. actuall usage of them and update of characters state.
    var UsedItem = client.character.QuickUseItems[input.InventoryIndex];
    console.log('asd');
    if(UsedItem === null || UsedItem === undefined){
        clientWriteItemActionFailed(client, input);
        console.log('1');
        return;
    }else{
        console.log('2');
        if(!UsedItem || UsedItem.ID !== input.ItemID){
            console.log('3');
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            console.log('4');
            var ii = infos.Item[UsedItem.ID];
            if (!ii) {
                console.log('Item '+UsedItem.ID+' DOES NOT EXIST when used...');
                clientWriteItemActionFailed(client, input);
                return;
            }

            console.log('5');

            ii.use(client);

            if(UsedItem.Amount-1===0) {
                client.character.QuickUseItems[input.InventoryIndex] = null;
            }
            else {
                client.character.QuickUseItems[input.InventoryIndex].Amount--;
            }

            client.character.markModified('QuickUseItems');
            client.character.save();
            clientWriteItemActionSuccess(client, input);
        }
    }
};
ItemActions[0x0D] = function Recv_Discard_Uniform_Items(client, input) {
    NotImplemented(client, 'Recv_Discard_Uniform_Items', input);
};

ItemActions[0x0E] = function Recv_UnequipItem(client, input) { // COMPLETED
    // NotImplemented(client, 'Recv_UnequipItem', input);
    // ColumnMove = X Axis of incoming item de equipment
    // RowMove = Y Axis of incoming item de equipment

    var ItemSlot = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, getSlotCount(input.InventoryIndex));
    if (!ItemSlot) {
        clientWriteItemActionFailed(client, input);
        return;
    } else {
    	switch(input.InventoryIndex){
			case 0: // Neck
                var wearedItem = client.character.Amulet;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Amulet = null;
			break;

    		case 1: // Cape
                var wearedItem = client.character.Cape;

                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;

                client.character.Cape = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 2: // Armor
                var wearedItem = client.character.Armor;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Enchant = wearedItem.Enchant;
                client.character.Inventory[ItemSlot.index].Combine = wearedItem.Combine;

                client.character.Armor = null;
    		break;

    		case 3: // Gloves
				var wearedItem = client.character.Glove;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Enchant = wearedItem.Enchant;
                client.character.Inventory[ItemSlot.index].Combine = wearedItem.Combine;

    			client.character.Glove = null;
    		break;

    		case 4: // Ring
                var wearedItem = client.character.Ring;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;

                client.character.Ring = null;
    		break;

    		case 5: // Boots
                var wearedItem = client.character.Boot;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Enchant = wearedItem.Enchant;
                client.character.Inventory[ItemSlot.index].Combine = wearedItem.Combine;

                client.character.Boot = null;
    		break;

    		case 6: // Bootle
                var wearedItem = client.character.CalbashBottle;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;

                client.character.CalbashBottle = null;
    		break;

    		case 7: // Weapon
                var wearedItem = client.character.Weapon;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Enchant = wearedItem.Enchant;
                client.character.Inventory[ItemSlot.index].Combine = wearedItem.Combine;

                client.character.Weapon = null;
    		break;

    		case 8: // Pet
                var wearedItem = client.character.Pet;
                client.character.Inventory[ItemSlot.index] = structs.StorageItemPet.objectify();
                client.character.Inventory[ItemSlot.index].ID = wearedItem.ID;
                client.character.Inventory[ItemSlot.index].Row = ItemSlot.y;
                client.character.Inventory[ItemSlot.index].Column = ItemSlot.x;
                client.character.Inventory[ItemSlot.index].Growth = wearedItem.Growth;
                client.character.Inventory[ItemSlot.index].Activity = wearedItem.Activity;

                client.character.Pet = null;
    		break;

    		default:
    			console.log(input.InventoryIndex + " is not defined as Unequip item!");
                clientWriteItemActionFailed(client, input);
                return;
    		break;
    	}

        client.character.markModified('Inventory');
        client.character.save();

        clientWriteItemActionSuccess(client, input);
    }
};
ItemActions[0x0F] = function Recv_MoveItemFromStorage(client, input) {
    NotImplemented(client, 'Recv_MoveItemFromStorage', input);
    console.log(input);
    var existingItem = client.character.Storage[input.InventoryIndex];

    if(existingItem == undefined || input.ItemID !== existingItem.ID){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        var itemInfo = infos.Item[existingItem.ID];
        var getInventoryCollision = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, itemInfo.getSlotCount());
    
        if(!getInventoryCollision){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            client.character.Storage[input.InventoryIndex] = null;
            if(itemInfo.ItemType === 22){
                client.character.Inventory[getInventoryCollision.index] = structs.StorageItemPet.objectify();
                client.character.Inventory[getInventoryCollision.index].Growth = existingItem.Growth;
                client.character.Inventory[getInventoryCollision.index].Activity = existingItem.Activity;
            }else{
                client.character.Inventory[getInventoryCollision.index] = structs.StorageItem.objectify();

                if(existingItem.Amount > 0 && existingItem.Amount === input.Amount)
                client.character.Inventory[getInventoryCollision.index].Amount = existingItem.Amount;
                else client.character.Inventory[getInventoryCollision.index].Amount = 0;

                client.character.Inventory[getInventoryCollision.index].Enchant = existingItem.Enchant;
                client.character.Inventory[getInventoryCollision.index].Combine = existingItem.Combine;
            }


            client.character.Inventory[getInventoryCollision.index].Column = getInventoryCollision.x;
            client.character.Inventory[getInventoryCollision.index].Row = getInventoryCollision.y;
            client.character.Inventory[getInventoryCollision.index].ID = input.ItemID;
            client.character.markModified("Inventory");
            client.character.markModified("Storage");
            client.character.save();
            clientWriteItemActionSuccess(client, input);
        }
    }
};
ItemActions[0x10] = function Recv_GetItemFromGateMasterStorage(client, input) { // COMPLETED
    var existingItem = client.character.Bank[input.InventoryIndex];

    if(existingItem == undefined || input.ItemID !== existingItem.ID){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        var itemInfo = infos.Item[existingItem.ID];
        var getInventoryCollision = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, itemInfo.getSlotCount());
    
        if(!getInventoryCollision){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            client.character.Bank[input.InventoryIndex] = null;
            if(itemInfo.ItemType === 22){
                client.character.Inventory[getInventoryCollision.index] = structs.StorageItemPet.objectify();
                client.character.Inventory[getInventoryCollision.index].Growth = existingItem.Growth;
                client.character.Inventory[getInventoryCollision.index].Activity = existingItem.Activity;
            }else{
                client.character.Inventory[getInventoryCollision.index] = structs.StorageItem.objectify();

                if(existingItem.Amount > 0 && existingItem.Amount === input.Amount)
                client.character.Inventory[getInventoryCollision.index].Amount = existingItem.Amount;
                else client.character.Inventory[getInventoryCollision.index].Amount = 0;

                client.character.Inventory[getInventoryCollision.index].Enchant = existingItem.Enchant;
                client.character.Inventory[getInventoryCollision.index].Combine = existingItem.Combine;
            }


            client.character.Inventory[getInventoryCollision.index].Column = getInventoryCollision.x;
            client.character.Inventory[getInventoryCollision.index].Row = getInventoryCollision.y;
            client.character.Inventory[getInventoryCollision.index].ID = input.ItemID;
            client.character.markModified("Inventory");
            client.character.save();
            client.character.saveBank();
            clientWriteItemActionSuccess(client, input);
        }
    }
};
ItemActions[0x11] = function Recv_BuyItem(client, input) { // COMPLETED
    var itemInfo = infos.Item[input.ItemID];
    var NpcInfo = infos.Npc[input.ItemUniqueID];

    if(itemInfo !== undefined && NpcInfo !== undefined && NpcInfo.Items.indexOf(input.ItemID)){ // TODO: Check if the Npc has the item in their store
        if( itemInfo === undefined || itemInfo === null || input.Amount > 99 || input.Amount < 0){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            if( (client.character.Silver - (itemInfo.PurchasePrice*input.Amount)) >= 0){
                if(infos.Item[input.ItemID].Stackable === 0 && input.Amount > 0){
                    clientWriteItemActionFailed(client, input);
                    return;
                }else if(infos.Item[input.ItemID].Stackable > 0 && (input.Amount === 0 || input.Amount > 99 || input.Amount < 0)){
                    clientWriteItemActionFailed(client, input);
                    return;
                }

                var InventoryItem = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, itemInfo.getSlotCount());
                if(InventoryItem){
                    if(input.Amount === 0) input.Amount = 1;
                    client.character.Silver -= itemInfo.PurchasePrice*input.Amount;
                    client.character.Inventory[InventoryItem.index] = structs.StorageItem.objectify();
                    client.character.Inventory[InventoryItem.index].Column = InventoryItem.x;
                    client.character.Inventory[InventoryItem.index].Row = InventoryItem.y;
                    client.character.Inventory[InventoryItem.index].Amount = input.Amount;
                    client.character.Inventory[InventoryItem.index].ID = input.ItemID;
                    client.character.markModified("Inventory");
                    client.character.save();
                    clientWriteItemActionSuccess(client, input);
                    return;
                }else{
                    clientWriteItemActionFailed(client, input);
                    return;
                }
            }else{
                clientWriteItemActionFailed(client, input);
                return;
            }
        }
    }else{
        clientWriteItemActionFailed(client, input);
        return;
    }
};
ItemActions[0x12] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};

ItemActions[0x13] = function Recv_MoveOnPillbar(client, input) { // COMPLETED
    if(input.InventoryIndex > 3 || input.RowPickup > 3 || input.InventoryIndex < 0 || input.RowPickup < 0 ){
        clientWriteItemActionFailed(client, input);
        return;
    }

    var PickedItem = client.character.QuickUseItems[input.InventoryIndex];
    var DropOnItem = client.character.QuickUseItems[input.RowPickup];

    if(PickedItem === undefined || input.Amount <= 0 || input.Amount > 99){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        if(DropOnItem === null){
            var Reminder = PickedItem.Amount - input.Amount;
            if(Reminder === 0){
                client.character.QuickUseItems[input.InventoryIndex] = null;
                client.character.QuickUseItems[input.RowPickup] = PickedItem;
            }else{
                PickedItem.Amount -= input.Amount;

                client.character.QuickUseItems[input.RowPickup] = structs.QuickUseItem.objectify();
                client.character.QuickUseItems[input.RowPickup].ID = PickedItem.ID;
                client.character.QuickUseItems[input.RowPickup].Amount = input.Amount;
            }
        }else{
            if(DropOnItem.ID === undefined || PickedItem.ID === undefined){
                clientWriteItemActionFailed(client, input);
                return;
            }else if(DropOnItem.ID === PickedItem.ID){
                if(infos.Item[PickedItem.ID].Stackable === 0 || input.Amount > PickedItem.Amount){
                    clientWriteItemActionFailed(client, input);
                    return;
                }else{
                    switch(infos.Item[PickedItem.ID].Stackable){
                        case 0: // Not allowed to be stacked
                            clientWriteItemActionFailed(client, input);
                            return;
                        break;
                        case 1: // Stack up to 99
                            var StackLimit = 99;
                            if( (input.Amount + DropOnItem.Amount) > StackLimit || (input.Amount + DropOnItem.Amount) <= 0 ){
                                clientWriteItemActionFailed(client, input);
                                return;
                            }else{
                                var Reminder = PickedItem.Amount - input.Amount;
                                if(Reminder === 0)
                                client.character.QuickUseItems[input.InventoryIndex] = null;
                                else client.character.QuickUseItems[input.InventoryIndex].Amount = Reminder;
                                client.character.QuickUseItems[input.RowPickup].Amount += input.Amount;
                            }
                        break;

                        default:
                            console.log("Is that item should be stacked? ID: " + PickedItem.ID);
                            clientWriteItemActionFailed(client, input);
                            client.sendInfoMessage("If you think that is the right item to be stacked, plase tell developers the Maximum stack size and this ID: " + PickedItem.ID);
                            return;
                        break;
                    }
                }
            }
        }
    }

    client.character.markModified('QuickUseItems');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};
ItemActions[0x14] = function Recv_MoveItem(client, input) { // COMPLETED
    var InventoryItem = client.character.Inventory[input.InventoryIndex];

    if (InventoryItem === undefined
        || InventoryItem === null
        || InventoryItem.ID === 0
        || InventoryItem.ID === undefined
        || infos.Item[InventoryItem.ID] === undefined
        ) {
        console.log("Something went wrong! InventoryIndex: " + input.InventoryIndex);
        clientWriteItemActionFailed(client, input);
        return;
    } else {
        var InventoryItemCollision = client.character.checkInventoryItemCollision(0, input.ColumnMove, input.RowMove, getSlotCount(infos.Item[InventoryItem.ID].ItemType));

        if(!InventoryItemCollision){
            if(InventoryItem.Amount >= 1){
                if(infos.Item[InventoryItem.ID].Stackable === 0 || input.Amount <= 0 || input.Amount > InventoryItem.Amount){
                    clientWriteItemActionFailed(client, input);
                    return;
                }else{
                    var stackingIndex = getStackingIventoryItemIndex(client.character.Inventory, 0, input.ColumnMove, input.RowMove, InventoryItem.ID);
                    var stackingItem = client.character.Inventory[stackingIndex];
                    switch(infos.Item[InventoryItem.ID].Stackable){
                        case 0: // Not allowed to be stacked
                            clientWriteItemActionFailed(client, input);
                            return;
                        break;
                        case 1: // Stack up to 99
                            var StackLimit = 99;
                            if( (input.Amount + stackingItem.Amount) > StackLimit || (input.Amount + stackingItem.Amount) <= 0 ){
                                clientWriteItemActionFailed(client, input);
                                return;
                            }else{
                                if(stackingIndex === false){
                                    clientWriteItemActionFailed(client, input);
                                    return;
                                }else{
                                    if( (client.character.Inventory[stackingIndex]+input.Amount) > StackLimit ){
                                        clientWriteItemActionFailed(client, input);
                                        return;
                                    }else{
                                        var Reminder = InventoryItem.Amount - input.Amount;
                                        if(Reminder === 0)
                                        client.character.Inventory[input.InventoryIndex] = null;
                                        else client.character.Inventory[input.InventoryIndex].Amount = Reminder;
                                        client.character.Inventory[stackingIndex].Amount = client.character.Inventory[stackingIndex].Amount + input.Amount;
                                    }
                                }
                            }
                        break;

                        default:
                            console.log("Is that item should be stacked? ID: " + InventoryItem.ID);
                            clientWriteItemActionFailed(client, input);
                            client.sendInfoMessage("If you think that is the right item to be stacked, plase tell developers the Maximum stack size and this ID: " + InventoryItem.ID);
                            return;
                        break;
                    }
                }

                client.character.markModified('Inventory');
                client.character.save();

                clientWriteItemActionSuccess(client, input);
            }else{
                clientWriteItemActionFailed(client, input);
                return;
            }
        }else{
            if(input.Amount > 0){
                if(input.Amount > InventoryItem.Amount || input.Amount <= 0){
                    console.log("Hack attempt! User defined amount of moving item which is Equal to 0 or more than stored amount!");
                    clientWriteItemActionFailed(client, input);
                    return;  
                }else if(input.Amount === InventoryItem.Amount){
                    client.character.Inventory[InventoryItemCollision.index] = InventoryItem;
                    client.character.Inventory[input.InventoryIndex] = null;
                    client.character.Inventory[InventoryItemCollision.index].Row = input.RowMove;
                    client.character.Inventory[InventoryItemCollision.index].Column = input.ColumnMove;
                    client.character.Inventory[InventoryItemCollision.index].ID = InventoryItem.ID;
                }else{
                    var Reminder = InventoryItem.Amount - input.Amount;
                    client.character.Inventory[input.InventoryIndex].Amount = Reminder;
                    client.character.Inventory[InventoryItemCollision.index] = structs.StorageItem.objectify();
                    client.character.Inventory[InventoryItemCollision.index].ID = InventoryItem.ID;
                    client.character.Inventory[InventoryItemCollision.index].Column = InventoryItemCollision.x;
                    client.character.Inventory[InventoryItemCollision.index].Row = InventoryItemCollision.y;
                    client.character.Inventory[InventoryItemCollision.index].Amount = InventoryItem.Amount;
                }
            }else{
                client.character.Inventory[InventoryItemCollision.index] = InventoryItem;
                client.character.Inventory[input.InventoryIndex] = null;
                client.character.Inventory[InventoryItemCollision.index].Row = input.RowMove;
                client.character.Inventory[InventoryItemCollision.index].Column = input.ColumnMove;
                client.character.Inventory[InventoryItemCollision.index].ID = InventoryItem.ID;
            }

            client.character.markModified('Inventory');
            client.character.save();
            clientWriteItemActionSuccess(client, input);
        }
    }
};
ItemActions[0x15] = function PlaceSilverToStorage(client, input) { // COMPLETED
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
ItemActions[0x16] = function Recv_GateMasterBankSilver(client, input) { // COMPLETED
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
ItemActions[0x17] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};
ItemActions[0x18] = function GetSilverFromStorage(client, input) { // COMPLETED
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
ItemActions[0x19] = function Recv_GateMasterBankGetSilver(client, input) { // COMPLETED
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
ItemActions[0x1B] = function Recv_SkillToBar(client, input) { // COMPLETED
    var SelectedSkill = client.character.SkillList[input.InventoryIndex];

    if(SelectedSkill === undefined || SelectedSkill === null){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        if(SelectedSkill.ID === undefined || SelectedSkill.Level === undefined ){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            if(input.Amount <= SelectedSkill.Level && input.Amount > 0 && client.character.SkillBar[input.RowPickup] === null){
                client.character.SkillBar[input.RowPickup] = structs.QuickUseSkill.objectify();
                client.character.SkillBar[input.RowPickup].ID = SelectedSkill.ID;
                client.character.SkillBar[input.RowPickup].Level = input.Amount;

                client.character.markModified('SkillBar');
                client.character.save();
                clientWriteItemActionSuccess(client, input);
            }else{
                clientWriteItemActionFailed(client, input);
            }
        }
    }
};
ItemActions[0x1C] = function Recv_RemoveSkillFromBar(client, input) { // COMPLETED
    if(client.character.SkillBar[input.InventoryIndex] !== null && client.character.SkillBar[input.InventoryIndex].ID !== undefined && client.character.SkillBar[input.InventoryIndex].Level !== undefined){
        client.character.SkillBar[input.InventoryIndex] = null;
        client.character.markModified('SkillBar');
        client.character.save();
        clientWriteItemActionSuccess(client, input);
    }else{
        clientWriteItemActionFailed(client, input);
    }
};
ItemActions[0x1D] = function Recv_SkillUp(client, input) { // COMPLETED
    var SelectedSkill = client.character.SkillList[input.InventoryIndex];

    if(SelectedSkill === undefined || SelectedSkill === null){
        clientWriteItemActionFailed(client, input);
        return;
    }else{
        if(client.character.SkillPoints === undefined || client.character.Level === undefined){
            clientWriteItemActionFailed(client, input);
            return;
        }else{
            if(client.character.SkillPoints >= 1 && SelectedSkill.Level < infos.Skill[SelectedSkill.ID].MaxSkillLevel && SelectedSkill.Level >= 1){
                client.character.SkillPoints -= 1;
                client.character.SkillList[input.InventoryIndex].Level += 1;
                client.character.markModified('SkillList');
                client.character.save();
                clientWriteItemActionSuccess(client, input);
                return;
            }else{
                clientWriteItemActionFailed(client, input);
                return;
            }
        }
    }
};
ItemActions[0x1E] = function sub_462A60(client, input) {
    NotImplemented(client, 'sub_462A60', input);
};
ItemActions[0x1F] = function Recv_LearnSkill(client, input) { // Completed
    if(client.character.SkillList.length === 30){
        var alreadyLearned = false;
        var freeIndex;
        for(var i = 0; i < client.character.SkillList.length; i++){
            if(client.character.SkillList[i] !== null && client.character.SkillList[i].ID === input.ItemID){
                alreadyLearned = true;
                break;
            }

            if(freeIndex === undefined && client.character.SkillList[i] === null){
                freeIndex = i;
            }
        }

        if(alreadyLearned){
            clientWriteItemActionFailed(client, input);
            return;
        }

        if((infos.Skill[input.ItemID].Clan !== 1 && infos.Skill[input.ItemID].Clan) !== (client.character.Clan+2) || infos.Skill[input.ItemID].PointsToLearn > client.character.SkillPoints){
            clientWriteItemActionFailed(client, input);
            return;
        }

        client.character.SkillPoints -= infos.Skill[input.ItemID].PointsToLearn;

        client.character.SkillList[freeIndex] = structs.QuickUseSkill.objectify();
        client.character.SkillList[freeIndex].ID = input.ItemID;
        client.character.SkillList[freeIndex].Level = infos.Skill[input.ItemID].PointsToLearn;

        client.character.markModified('SkillList');
        client.character.save();

        clientWriteItemActionSuccess(client, input);
        return;
    }else{
        clientWriteItemActionFailed(client, input);
        return;
    }
};
ItemActions[0x20] = function sub_462C20(client, input) {
    NotImplemented(client, 'sub_462C20', input);
};
ItemActions[0x21] = function sub_462C60(client, input) {
    NotImplemented(client, 'sub_462C60', input);
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
WorldPC.ItemActionPacket = restruct.
int32lu('ActionType').
int32lu('ItemUniqueID').
int32lu('ItemUniqueID2').
int32lu('ItemID').
int32lu('Unknown3').
int32lu('Unknown4').
int32lu('Unknown5').
int32lu('Amount').
int32lu('InventoryIndex').
int32lu('RowDrop').
int32lu('ColumnPickup').
int32lu('RowPickup').
int32lu('ColumnMove').
int32lu('RowMove').
int32lu('Enchant').
int32lu('Unknown10').
int32lu('Unknown11');

WorldPC.Set(0x14, {
    Restruct: WorldPC.ItemActionPacket,
    function: function handleItemActionPacket(client, input) {
        if (!client.authenticated) return;
        client.sendInfoMessage('Handling Item Action: ' + input.ActionType);
        if (ItemActions[input.ActionType]) {
            ItemActions[input.ActionType](client, input);
        } else {
            console.log('Unhandled Item Action: ' + input.ActionType);
            NotImplemented(input.ActionType);
            client.sendInfoMessage('The inventory action ' + input.ActionType + ' has not been coded into the server. Please report this to a developer and tell them what you were doing at the time.');
        }
    }
});