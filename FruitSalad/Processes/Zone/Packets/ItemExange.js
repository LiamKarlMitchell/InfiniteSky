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
int32lu('unk')

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

        //console.log(client.character.Inventory[input.ItemIndex]);
        console.log(input.ItemIndex)
        console.log(input.ItemSlot)
            // console.log(input.unk4)
            //console.log(input.unk5)

        //
        switch (input.ItemSlot) {

            case 0: // neck
                console.log('neck')
                if (client.character.Amulet != null) {
                    console.log('tem neck')


                } else {
                    console.log('tem neck')
                    client.character.Amulet = client.character.Inventory[input.ItemIndex];
                    client.character.Inventory[input.ItemIndex] = null;
                    client.character.markModified('Inventory');
                    client.character.save();
                    sendCharUpdate = true;
                    Zone.send.replyItemExangeReply(client, input.ItemIndex, input.ItemSlot);

                }
                break;
            case 1: // cape
                break;
            case 2: // armor
                console.log(client.character.Outfit)
                if (client.character.Outfit != null) {
                    console.log('tem Outfit')


                } else {
                    console.log('nao tem Outfit')
                    var IDItem = client.character.Inventory[input.ItemIndex].ID
                    var EnchItem = client.character.Inventory[input.ItemIndex].Enchant
                    var CSItem = client.character.Inventory[input.ItemIndex].Combine

                    client.character.Outfit = { ID: IDItem, Enchant: EnchItem, Combine: CSItem };
                    client.character.save();
                    sendCharUpdate = true;
                    client.character.Inventory[input.ItemIndex] = null;
                    client.character.markModified('Inventory');
                    client.character.save();

                   
                    client.character.do2FPacket = 1;
                    Zone.sendToAllArea(client,true,client.character.state.getPacket(),config.viewable_action_distance
                         Zone.send.replyItemExangeReply(client, input.ItemIndex, input.ItemSlot);
                }
                break;
            case 3: // gloves
                break;
            case 4: // ring
                break;
            case 5: //boots
                break;
            case 6: //botle
                break;
            case 7: //wep
                break;
            case 8: // pet
                break;
                // Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
        }
    }
});
