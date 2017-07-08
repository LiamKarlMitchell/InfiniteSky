// client file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Learn skill from skill book
// 

Zone.recv.LearnWargod = restruct.
int32lu('ItemIndex').
int32lu('WgID').
int32lu('unk3').
int32lu('unk4');



Zone.send.LearnWargod = restruct.
int32lu('ItemIndex').
int32lu('WgID').
int32lu('unk3').
int32lu('unk4');

Zone.send.LearnWargodReply = restruct.
int8lu('PacketID'). // 0x49
int8lu('Status').
int32lu('Value').
int32lu('WGNumber');

//pack to send the system infos about sucess/fail
Zone.send.replyLearnWargod = function replyLearnWargod(client, status, value, value1) {
    client.write(
        new Buffer(
            Zone.send.LearnWargodReply.pack({
                PacketID: 0x83,
                Status: status,
                Value: value,
                WGNumber: value1,
            })
        )
    );
}

ZonePC.Set(0x63, {
    Restruct: Zone.recv.LearnWargod,
    function: function onRecvLearnWargod(client, input) {




        var bookIDInInv = client.character.Inventory[input.ItemIndex].ID
        var SkillBookID = input.WgID
        var SkillId = 0;
        var BookId = 0;
        //TODO fix fuj wargod book , katana skill icon has doble blade name 
        //TODO and gives db skill , db icon has kata skill name and gives kata skill 
        //TODO i changed it in code but i should be changed in game too 
        //TODO not that many ppl will see that but just so we have the game working as itended

        switch (SkillBookID) {
            case 0:
                SkillId = 112;
                BookId = 99214;
                break; //sword
            case 1:
                SkillId = 113;
                BookId = 99214;
                break; // blade
            case 2:
                SkillId = 114;
                BookId = 99214;
                break; // marble
            case 3:
                SkillBookID = 4
                SkillId = 116;
                BookId = 99215;
                break; // doble blade
            case 4:
                SkillBookID = 3;
                SkillId = 116;
                BookId = 99215;
                break; // kata
            case 5:
                SkillId = 117;
                BookId = 99215;
                break; // lute
            case 6:
                SkillId = 118;
                BookId = 99216;
                break; // light blade
            case 7:
                SkillId = 119;
                BookId = 99216;
                break; // spear
            case 8:
                SkillId = 120;
                BookId = 99216;
                break; // scepter

        }
        //anti hax
        if (bookIDInInv != BookId) {
            client.sendInfoMessage('h4xor')
            return;
        }

        db.Skill.findById(SkillId, function(err, SkillName) {

            var index = 20;
            
            // gets the next free index in the skill book
            var freeIndex = null;
            //checks if skill book its full
            

            for (var i = index; i < (index + 10); i++) {
                var charSkill = client.character.SkillList[i];
               
                if ((freeIndex === null && (!charSkill || !charSkill.ID))) {
                    freeIndex = i;
                }
            }
            //Saves skill in db
            client.character.SkillList[freeIndex] = {
                ID: SkillId,
                Level: 120
            };
            client.character.markModified('SkillList');
            client.character.save()
            
            //deletes item in db
            client.character.Inventory[input.ItemIndex] = null;
            client.character.markModified('Inventory');
            client.character.save();
            
            //visualy add item to skill book, deletes item from inventory and sendes system msg
            Zone.send.replyLearnWargod(client, 0, 0, SkillBookID);

            //subtrats skill points from skill use
            client.character.SkillPoints= client.character.SkillPoints - 120;
            client.character.markModified('SkillPoints');
            client.character.save();
        });


    }
});
