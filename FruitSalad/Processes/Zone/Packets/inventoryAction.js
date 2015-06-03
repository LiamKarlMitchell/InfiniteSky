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
    int32lu('PickupRow').
    int32lu('PickupColumn').
    int32lu('PickupIndex').
    int32lu('MoveRow').
    int32lu('MoveColumn').
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
    int32lu('MoveRow').
    int32lu('MoveColumn').
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
        MoveColumn: input.MoveColumn,
        MoveRow: input.MoveRow,
        Result: result
    })));
}

var ItemAction = {};
ItemAction[20] = function inventoryMoveItem(input){
    console.log(input);

    if(input.Amount > 99){
        console.log("Amount higher than allowed");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    if(input.LevelRequired > 145 || input.LevelRequired === 0){
        console.log("Level required is higher than allowed");
        Zone.send.itemAction.call(this, 1, input);
        return;
    }

    console.log(this.character.nextInventoryIndex())

    Zone.send.itemAction.call(this, 1, input);
};

ItemAction[1] = function inventoryDropItem(input){
    console.log(input);

    Zone.send.itemAction.call(this, 1, input);
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
