Zone.recv.ItemExange = restruct.
int32lu('ItemIndex').
int32lu('ItemSlot').
int32lu('ItemLvl').
int32lu('unk4').
int32lu('unk5');

Zone.send.ItemExange = restruct.
int32lu('ItemIndex').
int32lu('ItemSlot').
int32lu('ItemLvl').
int32lu('unk4').
int32lu('unk5');

Zone.send.ItemExangeReply = restruct.
int8lu('PacketID'). // 0x49
int32lu('itemIndex').
int32lu('ItemSlot').
int32lu('unk');




//pack to send the system infos about sucess/fail
Zone.send.replyItemExangeReply = function replyItemExangeReply(client, IndexItem, SlotItem) {
    client.write(
        new Buffer(
            Zone.send.ItemExangeReply.pack({
                PacketID: 0x7E,
                itemIndex: IndexItem,
                ItemSlot: SlotItem,
                unk: 0

            })
        )
    );
}




ZonePC.Set(0x60, {
    Restruct: Zone.recv.ItemExange,
    function: function onRecvItemExange(client, input) {

        var equipItem;
        var SlotName
        switch (input.ItemSlot) {
            case 0:
                equipItem = client.character.Amulet;
                SlotName = 'Amulet';
                break; // Amulet
            case 1:
                equipItem = client.character.Cape;
                SlotName = 'Cape';
                break; // Cape
            case 2:
                equipItem = client.character.Outfit;
                SlotName = 'Outfit';
                break; // Outfit
            case 3:
                equipItem = client.character.Gloves;
                SlotName = 'Gloves';
                break; // Gloves
            case 4:
                equipItem = client.character.Ring;
                SlotName = 'Ring';
                break; // Ring
            case 5:
                equipItem = client.character.Boots;
                SlotName = 'Boots';
                break; // Boots
            case 6:
                equipItem = client.character.Bottle;
                SlotName = 'Bootsle';
                break; // Bootsle
            case 7:
                equipItem = client.character.Weapon;
                SlotName = 'Weapon';
                break; // Weapon
            case 8:
                equipItem = client.character.Pet;
                SlotName = 'Pet';
                break; // Pet
            default:
                break;
        }


        if (equipItem != null && input.ItemSlot != 8) {

            console.log('item com item')
            var IDItem = client.character.Inventory[input.ItemIndex].ID;
            var EnchItem = client.character.Inventory[input.ItemIndex].Enchant;
            var CSItem = client.character.Inventory[input.ItemIndex].Combine;
            var ColItem = client.character.Inventory[input.ItemIndex].Column
            var RowItem = client.character.Inventory[input.ItemIndex].Row

            client.character.Inventory[input.ItemIndex] = { ID: equipItem.ID, Enchant: equipItem.Enchant, Combine: equipItem.Combine, Row: RowItem, Column: ColItem };
            equipItem = { ID: IDItem, Enchant: EnchItem, Combine: CSItem };            

        } else if (equipItem === null && input.ItemSlot != 8) {
            
            var IDItem = client.character.Inventory[input.ItemIndex].ID;
            var EnchItem = client.character.Inventory[input.ItemIndex].Enchant;
            var CSItem = client.character.Inventory[input.ItemIndex].Combine;

            equipItem = { ID: IDItem, Enchant: EnchItem, Combine: CSItem };
            client.character.Inventory[input.ItemIndex] = null;            

        } else if (equipItem == null && input.ItemSlot === 8) {
            
            var IDItem = client.character.Inventory[input.ItemIndex].ID;
            var PetGrowth = client.character.Inventory[input.ItemIndex].Growth;
            var PetActivity = client.character.Inventory[input.ItemIndex].Activity;

            equipItem = { ID: IDItem, Growth: PetGrowth, Activity: PetActivity };
            client.character.Inventory[input.ItemIndex] = null;            

        } else if (equipItem != null && input.ItemSlot === 8) {

            var IDItem = client.character.Inventory[input.ItemIndex].ID;
            var PetGrowth = client.character.Inventory[input.ItemIndex].Growth;
            var PetActivity = client.character.Inventory[input.ItemIndex].Activity;
            var ColItem = client.character.Inventory[input.ItemIndex].Column
            var RowItem = client.character.Inventory[input.ItemIndex].Row

            client.character.Inventory[input.ItemIndex] = { ID: equipItem.ID, Growth: equipItem.Growth, Activity: equipItem.Activity, Row: RowItem, Column: ColItem };
            equipItem = { ID: IDItem, Growth: PetGrowth, Activity: PetActivity };
            
        }

       
        client.character[SlotName]=equipItem;
        client.character.markModified('Inventory');
        client.character.save();        
        sendCharUpdate = true;
        
        client.character.state.update(equipItem);
        client.character.state.setFromCharacter(client.character);
        Zone.send.replyItemExangeReply(client, input.ItemIndex, input.ItemSlot);
        Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);


    }
});
