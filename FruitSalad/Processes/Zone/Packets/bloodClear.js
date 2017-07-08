// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Blood clear at faction leader.
// Level 30 and under only.

Zone.recv.bloodClear = restruct.
int32lu('unk1').
int32lu('unk2');

Zone.send.bloodClear = restruct.
int8lu('PacketID'). // 0x56
int8lu('Status');

//pack to send the system infos about sucess/fail
Zone.send.bloodClearResponse = function bloodClearResponse(client, status) {
    client.write(
        new Buffer(
            Zone.send.bloodClear.pack({
                PacketID: 0x56,
                Status: status
            })
        )
    );
}

ZonePC.Set(0x3D, {
    Restruct: Zone.recv.bloodClear,
    function: function onRecvBloodClearRequest(client, input) {
        // TODO: Check level condition and respond to packet correctly.
        if (client.character.level > 30) {
            client.sendInfoMessage('Level too high.');

            // Send fail to client.
            //Zone.send.bloodClearResponse(client, 1);
            return;
        }

        // TODO: Check clan at NPC? Meh... What will it hurt if someone resets stats at another clans NPC?
        //client.character.Clan

        client.sendInfoMessage('BloodClear is a work in progress. unk1: ' + input.unk1+' unk2: ' + input.unk2);

        // client.character.Stat_Dexterity= 0;
        // client.character.markModified('Stat_Vitality');
        // client.character.Stat_Strength=0
        // client.character.markModified('Stat_Strength');
        // client.character.StatPoints=1480
        // client.character.markModified('StatPoints');

        // TODO: Sanity check of statpoints for level of character.
        client.character.StatPoints += client.character.Stat_Strength + client.character.Stat_Chi + client.character.Stat_Dexterity + client.character.Stat_Vitality - 4;
        client.character.Stat_Strength = 1;
        client.character.Stat_Chi = 1;
        client.character.Stat_Dexterity = 1;
        client.character.Stat_Vitality = 1;

        // TODO: Actually read the starting stats from newCharacter.json as to not go over if someone modifies it to be anything other than 1. (Adjust above as needed.) Will require client side mod as well.

        // Note: Not needed to mark modified for values. Only arrays I think.
        // client.character.markModified('Stat_Strength');
        // client.character.markModified('Stat_Chi');
        // client.character.markModified('Stat_Dexterity');
        // client.character.markModified('Stat_Vitality');
        // client.character.markModified('StatPoints');

        client.character.infos.updateAll(function(){
            // Save the changes.
            client.character.save();

            client.sendInfoMessage('Character Info updated.');
            
            // Send success to client.
            //Zone.send.bloodClearResponse(client, 0);
        });
    }
});
