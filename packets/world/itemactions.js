// ###############
//TODO: On item move, check their type and save the values in DB if needed, like Pet Growth or Activity! And switch on their types and types of storage
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

//TODO: Move it to ItemInfo Prototype
function getSlotCount(itemType) {
    if (itemType === 0 || itemType === 2 || itemType === 1 || itemType === 6 || itemType === 10) {
        return 1;
    } else {
        return 4;
    }
}

//TODO: Move it to db/character.js, and use this.inventory to pass inventory argument
function checkInventoryItemCollision(inventory, page, x1, y1, s1) {
    if(x1 < 0 || y1 < 0) return false;

    var reservedSlots = [];

    var pageSize = 8;
    for(var initArraySize8 = 0; initArraySize8 < pageSize; initArraySize8++){
        reservedSlots[initArraySize8] = [];
        for(var initArraySize8Row = 0; initArraySize8Row < pageSize; initArraySize8Row++){
            reservedSlots[initArraySize8][initArraySize8Row] = false;
        }
    }
    var freeInventoryIndex;
    for (var i = 0; i < 32+(page*32); i++) {
        var object = inventory[i + (page * 32)];
        if (object !== undefined && object !== null) {
            var itemInfo = infos.Item[object.ID];
            if (itemInfo !== undefined) {
                var size = itemInfo.getSlotCount();
                var posX = object.Column;
                var posY = object.Row;

                reservedSlots[posX][posY] = true;
                if(size===4){
                    reservedSlots[posX][posY+1] = true;
                    reservedSlots[posX+1][posY] = true;
                    reservedSlots[posX+1][posY+1] = true;
                }
            }

        }else if(freeInventoryIndex === undefined && object === null){
            freeInventoryIndex = i;
        }
    }

    if(s1 === 1 && reservedSlots[x1][y1]) return false;
    if(s1 === 4 && (reservedSlots[x1][y1] === undefined || reservedSlots[x1+1][y1] === undefined || reservedSlots[x1][y1+1] === undefined || reservedSlots[x1+1][y1+1] === undefined)) return false;
    if(s1 === 4 && (reservedSlots[x1][y1] || reservedSlots[x1+1][y1] || reservedSlots[x1][y1+1] || reservedSlots[x1+1][y1+1])) return false;


    return {index: freeInventoryIndex, x: x1, y: y1, page: page};
}

//TODO: Similliar to the ItemCollision check function
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
    //NotImplemented(client, 'Recv_MoveToPillBar', input);
    var InventoryItem = client.character.Inventory[input.InventoryIndex];
    var Slot = input.RowPickup;
    var QuickItems = client.character.QuickUseItems;

    if(client.character.Inventory.length === 64 && QuickItems.length === 4){
        if(InventoryItem === undefined){

        }else{
            var ItemID = input.ItemID;
            var ItemAmount = input.Amount;

            if(ItemID !== InventoryItem.ID || QuickItems[Slot] !== null){
                clientWriteItemActionFailed(client, input);
                return true;
            }else if(QuickItems[Slot] === null){
                if(ItemAmount > InventoryItem.Amount || ItemAmount < 0){
                    clientWriteItemActionFailed(client, input);
                    return true;
                }else if(ItemAmount === InventoryItem.Amount){
                    client.character.QuickUseItems[Slot] = structs.QuickUseItem.unpack(structs.QuickUseItem.pack({
                        "ID": InventoryItem.ID,
                        "Amount": InventoryItem.Amount
                    }));
                    client.character.Inventory[input.InventoryIndex] = null;
                }else{
                    var Reminder = InventoryItem.Amount - input.Amount;
                    client.character.QuickUseItems[Slot] = structs.QuickUseItem.unpack(structs.QuickUseItem.pack({
                        "ID": InventoryItem.ID,
                        "Amount": input.Amount
                    }));
                    client.character.Inventory[input.InventoryIndex].Amount = Reminder;
                }
            }

        }
    }

    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

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
};


ItemActions[0x03] = function Recv_EquipItem(client, input) { // COMPLETED

    var ItemInfo = infos.Item[input.ItemID];
    var itemType = ItemInfo.ItemType;
    var inventoryItem = client.character.Inventory[input.InventoryIndex];

    console.log("Inventory indexes: " + client.character.Inventory.length);

    if(inventoryItem === undefined && ItemInfo !== undefined){
        console.log("Item that index does not exists!");
        clientWriteItemActionFailed(client, input);
        return true;
    }

    switch(itemType){
        case 7: // Neck
            if(client.character.Amulet.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Amulet = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;  
            }
        break;

        case 8: // Cape
            if(client.character.Cape.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Cape = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;  
            }
        break;

        case 9: // Armor
            if(client.character.Armor.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Armor = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true; 
            }
        break;

        case 10: // Gloves
            if(client.character.Glove.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Glove = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;  
            }
        break;

        case 11: // Ring
            if(lient.character.Ring.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Ring = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;   
            }
        break;

        case 12: // Boots
            if(client.character.Boot.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Boot = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;  
            }
        break;

        case 6: // Bootle
            if(client.character.CalbashBottle.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.CalbashBottle = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;  
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
            if(client.character.Weapon.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Weapon = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true; 
            }
        break;

        case 22: // Pet
            if(client.character.Pet.ID === 0
                && ItemInfo.isAllowedByClan(client.character.Clan)
                && client.character.Level >= ItemInfo.LevelRequirement
                ){
                client.character.Pet = structs.Equipt.unpack(structs.Equipt.pack({
                    "ID": inventoryItem["ID"],
                    "Enchant": inventoryItem["Enchant"],
                    "Combine": inventoryItem["Combine"]
                }));
                client.character.Inventory[input.InventoryIndex] = null;
            }else{
                console.log(itemType + "HackAttemp! Item is not as required to be worn!");
                clientWriteItemActionFailed(client, input);
                return true;   
            }
        break;

        default:
            console.log(itemType + " is not defined to Equip a item!");
            clientWriteItemActionFailed(client, input);
            return true; 
        break;
    }

    client.character.markModified('Inventory');
    client.character.save();

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
};
ItemActions[0x04] = function Recv_Move_Item(client, input) {
    NotImplemented(client, 'Recv_Move_Item', input);
};
ItemActions[0x05] = function Recv_UnequipItem(client, input) {
    NotImplemented(client, 'Recv_UnequipItem', input);
};
ItemActions[0x06] = function Recv_StoreItem(client, input) {
    NotImplemented(client, 'Recv_StoreItem', input);
};
ItemActions[0x07] = function Recv_SellItem(client, input) {
    NotImplemented(client, 'Recv_SellItem', input);
};
ItemActions[0x08] = function Recv_CoinsToGold(client, input) { // COMPLETED
    if(client.character.Silver >= 1000000000){
        client.character.Silver -= 1000000000;
        client.character.SilverBig++;
        client.character.save();

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
    }else{
        clientWriteItemActionFailed(client, input);
    }
};
ItemActions[0x09] = function Recv_GoldToCoins(client, input) { // COMPLETED
    var MAX_SILVER = 2147483647; //TODO: Move this into a main definition file somewhere..

    if(client.character.SilverBig >= 1){
        if( (client.character.Silver+1000000000) <= MAX_SILVER  ) {
            client.character.Silver += 1000000000;
            client.character.SilverBig--;
        }else{
            clientWriteItemActionFailed(client, input);
            return true;
        }
    }else{
        clientWriteItemActionFailed(client, input);
        return true;
    }

    client.character.save();
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
};
ItemActions[0xA] = function Recv_Discard_Item(client, input) { // 10
    NotImplemented(client, 'Recv_Discard_Item', input);
};
ItemActions[0xB] = function Recv_MoveFromPillBar(client, input) { // COMPLETED
    var QuickItem = client.character.QuickUseItems[input.InventoryIndex];
    var ItemSlot = checkInventoryItemCollision(client.character.Inventory, 0, input.ColumnMove, input.RowMove, 1);

    if (!ItemSlot) {
        clientWriteItemActionFailed(client, input);
        console.log("No slot!");
        return true;
    }else{
        if(QuickItem === undefined || QuickItem === null || QuickItem.ID === undefined){
            clientWriteItemActionFailed(client, input);
            console.log("Quick item undefined?!");
            return true;
        }else{
            if(input.Amount > QuickItem.Amount || input.Amount < 0){
                clientWriteItemActionFailed(client, input);
                console.log("Input amount exceeds the needs!");
                return true;
            }else if(QuickItem.Amount === input.Amount){
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": QuickItem.ID,
                    "Row": ItemSlot.y,
                    "Column": ItemSlot.x,
                    "Amount": input.Amount
                }));
                client.character.QuickUseItems[input.InventoryIndex] = null;
            }else{
                var Reminder = QuickItem.Amount - input.Amount;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": QuickItem.ID,
                    "Row": ItemSlot.y,
                    "Column": ItemSlot.x,
                    "Amount": input.Amount
                }));
                client.character.QuickUseItems[input.InventoryIndex].Amount = Reminder;
            }
        }
    }

    client.character.markModified('QuickUseItems');
    client.character.markModified('Inventory');
    client.character.save();

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
};
ItemActions[0x0C] = function Recv_Use_item(client, input) { // TODO: Heal method on pills and etc. actuall usage of them and update of characters state.
    var UsedItem = client.character.QuickUseItems[input.InventoryIndex];
    if(UsedItem === null || UsedItem === undefined){
        clientWriteItemActionFailed(client, input);
        return true;
    }else{
        if(UsedItem.ID === undefined || UsedItem.ID !== input.ItemID){
            clientWriteItemActionFailed(client, input);
            return true;
        }else{
            var Reminder = UsedItem.Amount-1;
            if(Reminder === 0)
                client.character.QuickUseItems[input.InventoryIndex] = null;
            else client.character.QuickUseItems[input.InventoryIndex].Amount = Reminder;

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

    var ItemSlot = checkInventoryItemCollision(client.character.Inventory, 0, input.ColumnMove, input.RowMove, getSlotCount(input.InventoryIndex));
    if (!ItemSlot) {
        clientWriteItemActionFailed(client, input);
        return true;
    } else {
    	switch(input.InventoryIndex){
			case 0: // Neck
                var wearedItem = client.character.Amulet;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Amulet = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
			break;

    		case 1: // Cape
                var wearedItem = client.character.Cape;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Cape = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 2: // Armor
                var wearedItem = client.character.Armor;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Armor = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 3: // Gloves
				var wearedItem = client.character.Glove;
    			client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
    			client.character.Glove = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 4: // Ring
                var wearedItem = client.character.Ring;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Ring = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 5: // Boots
                var wearedItem = client.character.Boot;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Boot = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 6: // Bootle
                var wearedItem = client.character.CalbashBottle;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.CalbashBottle = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 7: // Weapon
                var wearedItem = client.character.Weapon;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Weapon = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		case 8: // Pet
                var wearedItem = client.character.Pet;
                client.character.Inventory[ItemSlot.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                    "ID": wearedItem["ID"],
                    "Column": ItemSlot.x,
                    "Row": ItemSlot.y,
                    "Amount" : 1,
                    "Enchant" : wearedItem["Enchant"]
                }));
                client.character.Pet = structs.Equipt.unpack(structs.Equipt.pack({"ID": 0}));
    		break;

    		default:
    			console.log(input.InventoryIndex + " is not defined as Unequip item!");
                clientWriteItemActionFailed(client, input);
                return;
    		break;
    	}

        client.character.markModified('Inventory');
        client.character.save();

        // Handle item placement and save it to inventory
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
};
ItemActions[0x0F] = function Recv_MoveItemFromStorage(client, input) {
    NotImplemented(client, 'Recv_MoveItemFromStorage', input);
};
ItemActions[0x10] = function sub_462140(client, input) {
    NotImplemented(client, 'sub_462140', input);
};
ItemActions[0x11] = function Recv_BuyItem(client, input) {
    NotImplemented(client, 'Recv_BuyItem', input);
};
ItemActions[0x12] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};

ItemActions[0x13] = function Recv_MoveOnPillbar(client, input) { // COMPLETED?
    console.log(input);

    if(input.InventoryIndex > 3 || input.RowPickup > 3 || input.InventoryIndex < 0 || input.RowPickup < 0 ){
        clientWriteItemActionFailed(client, input);
        return true;
    }

    var PickedItem = client.character.QuickUseItems[input.InventoryIndex];
    var DropOnItem = client.character.QuickUseItems[input.RowPickup];

    if(PickedItem === undefined || input.Amount <= 0 || input.Amount > 99){
        clientWriteItemActionFailed(client, input);
        return true;
    }else{
        console.log(DropOnItem);
        if(DropOnItem === null){
            var Reminder = PickedItem.Amount - input.Amount;
            console.log(Reminder);
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
                return true;
            }else if(DropOnItem.ID === PickedItem.ID){
                if(infos.Item[PickedItem.ID].Stackable === 0 || input.Amount > PickedItem.Amount){
                    console.log("Is not able to stack up");
                    clientWriteItemActionFailed(client, input);
                    return true;
                }else{
                    console.log("Stacking up");
                    switch(infos.Item[PickedItem.ID].Stackable){
                        case 0: // Not allowed to be stacked
                            clientWriteItemActionFailed(client, input);
                            return true;
                        break;
                        case 1: // Stack up to 99
                            var StackLimit = 99;
                            if( (input.Amount + DropOnItem.Amount) > StackLimit || (input.Amount + DropOnItem.Amount) <= 0 ){
                                clientWriteItemActionFailed(client, input);
                                return true;
                            }else{
                                console.log("Stacking 99");
                                var Reminder = PickedItem.Amount - input.Amount;
                                console.log(Reminder);
                                if(Reminder === 0)
                                client.character.QuickUseItems[input.InventoryIndex] = null;
                                else client.character.QuickUseItems[input.InventoryIndex].Amount = Reminder;
                                client.character.QuickUseItems[input.RowPickup].Amount += input.Amount;

                                console.log(client.character.QuickUseItems[input.InventoryIndex]);
                            }
                        break;

                        default:
                            console.log("Is that item should be stacked? ID: " + PickedItem.ID);
                            clientWriteItemActionFailed(client, input);
                            client.sendInfoMessage("If you think that is the right item to be stacked, plase tell developers the Maximum stack size and this ID: " + PickedItem.ID);
                            return true;
                        break;
                    }
                }
            }
        }
    }
    console.log("PASS");
    client.character.markModified('QuickUseItems');
    client.character.save();
    clientWriteItemActionSuccess(client, input);
};
ItemActions[0x14] = function Recv_MoveItem(client, input) { // COMPLETED
    //NotImplemented(client, 'Recv_MoveItem', input);
    //console.log(input);
    var InventoryItem = client.character.Inventory[input.InventoryIndex];
    if (
        InventoryItem === undefined
        || InventoryItem === null
        || InventoryItem.ID === 0
        || InventoryItem.ID === undefined
        ) {
        console.log("Something went wrong! InventoryIndex: " + input.InventoryIndex);
        clientWriteItemActionFailed(client, input);
        return true;
    } else {
        var InventoryItemCollision = checkInventoryItemCollision(client.character.Inventory, 0, input.ColumnMove, input.RowMove, getSlotCount(infos.Item[InventoryItem.ID].ItemType));
        if(!InventoryItemCollision){
            if(InventoryItem.Amount >= 1){
                if(infos.Item[InventoryItem.ID].Stackable === 0 || input.Amount <= 0 || input.Amount > InventoryItem.Amount){
                    clientWriteItemActionFailed(client, input);
                    return true;
                }else{
                    var stackingIndex = getStackingIventoryItemIndex(client.character.Inventory, 0, input.ColumnMove, input.RowMove, InventoryItem.ID);
                    var stackingItem = client.character.Inventory[stackingIndex];
                    switch(infos.Item[InventoryItem.ID].Stackable){
                        case 0: // Not allowed to be stacked
                            clientWriteItemActionFailed(client, input);
                            return true;
                        break;
                        case 1: // Stack up to 99
                            var StackLimit = 99;
                            if( (input.Amount + stackingItem.Amount) > StackLimit || (input.Amount + stackingItem.Amount) <= 0 ){
                                clientWriteItemActionFailed(client, input);
                                return true;
                            }else{
                                if(stackingIndex === false){
                                    clientWriteItemActionFailed(client, input);
                                    return true;
                                }else{
                                    if( (client.character.Inventory[stackingIndex]+input.Amount) > StackLimit ){
                                        clientWriteItemActionFailed(client, input);
                                        return true;
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
                            return true;
                        break;
                    }
                }

                client.character.markModified('Inventory');
                client.character.save();

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
            }else{
                clientWriteItemActionFailed(client, input);
                return true;
            }
        }else{
            //console.log(input);
            var PickedItemInventory = client.character.Inventory[input.InventoryIndex];
            //TODO: Stacking and unstacking items
            if(input.Amount > 0){
                if(input.Amount > PickedItemInventory.Amount || input.Amount <= 0){
                    console.log("Hack attempt! User defined amount of moving item which is Equal to 0 or more than stored amount!");
                    clientWriteItemActionFailed(client, input);
                    return true;  
                }else if(input.Amount === PickedItemInventory.Amount){
                    client.character.Inventory[InventoryItemCollision.index] = PickedItemInventory;
                    client.character.Inventory[input.InventoryIndex] = null;
                    client.character.Inventory[InventoryItemCollision.index].Row = input.RowMove;
                    client.character.Inventory[InventoryItemCollision.index].Column = input.ColumnMove;
                }else{
                    var Reminder = PickedItemInventory.Amount - input.Amount;
                    client.character.Inventory[input.InventoryIndex].Amount = Reminder;
                    client.character.Inventory[InventoryItemCollision.index] = structs.StorageItem.unpack(structs.StorageItem.pack({
                        "ID": PickedItemInventory.ID,
                        "Column": InventoryItemCollision.x,
                        "Row": InventoryItemCollision.y,
                        "Amount": input.Amount
                    }));
                }
            }else{
                client.character.Inventory[InventoryItemCollision.index] = PickedItemInventory;
                client.character.Inventory[input.InventoryIndex] = null;
                client.character.Inventory[InventoryItemCollision.index].Row = input.RowMove;
                client.character.Inventory[InventoryItemCollision.index].Column = input.ColumnMove;
            }

            client.character.markModified('Inventory');
            client.character.save();
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
    }
};
ItemActions[0x15] = function sub_462750(client, input) {
    NotImplemented(client, 'sub_462750', input);
};
ItemActions[0x16] = function Recv_GateMasterBankSilver(client, input) {
    NotImplemented(client, 'Recv_GateMasterBankSilver', input);
};
ItemActions[0x17] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};
ItemActions[0x18] = function sub_462840(client, input) {
    NotImplemented(client, 'sub_462840', input);
};
ItemActions[0x19] = function sub_4628A0(client, input) {
    NotImplemented(client, 'sub_4628A0', input);
};
ItemActions[0x1A] = function nullsub_4(client, input) {
    NotImplemented(client, 'nullsub_4', input);
};
ItemActions[0x1B] = function Recv_SkillToBar(client, input) { // COMPLETED
    var SelectedSkill = client.character.SkillList[input.InventoryIndex];

    if(SelectedSkill === undefined || SelectedSkill === null){
        clientWriteItemActionFailed(client, input);
        return true;
    }else{
        if(SelectedSkill.ID === undefined || SelectedSkill.Level === undefined ){
            clientWriteItemActionFailed(client, input);
            return true;
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
        return true;
    }else{
        if(client.character.SkillPoints === undefined || client.character.Level === undefined){
            clientWriteItemActionFailed(client, input);
            return true;
        }else{
            if(client.character.SkillPoints >= 1 && SelectedSkill.Level < 20 && SelectedSkill.Level >= 1){
                client.character.SkillPoints -= 1;
                client.character.SkillList[input.InventoryIndex].Level += 1;
                client.character.markModified('SkillList');
                client.character.save();
                clientWriteItemActionSuccess(client, input);
                return true;
            }else{
                clientWriteItemActionFailed(client, input);
                return true;
            }
        }
    }
};
ItemActions[0x1E] = function sub_462A60(client, input) {
    NotImplemented(client, 'sub_462A60', input);
};
ItemActions[0x1F] = function Recv_LearnSkill(client, input) {
    NotImplemented(client, 'Recv_LearnSkill', input);
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
