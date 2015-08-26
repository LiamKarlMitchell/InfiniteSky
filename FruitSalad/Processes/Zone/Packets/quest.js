// These packets must contain some info about quests.
// LastQuestID
// CurrentQuestID
// QuestPart
// Quest Monster Kill Count

// 0x45
// 00000000 01000000 01000000 00000000 00000000 8ee871c4 b6cf89c4 
Zone.recv.quest = restruct.
int32lu('questChain'). // Part of quest?
int32lu('questID'). // Quest ID
int32lu('c'). // NPC ID ?
int32lu('d'). // 0
int32lu('e'). // 0
float32l('y'). // 2D coords of player
float32l('x'); // 2D coords of player

// 0x60
// 00000000 01000000 01000000 00000000 00000000
Zone.send.quest = restruct.
int8lu("PacketID").
int32lu('questChain'). // Part of quest?
int32lu('questID'). // Quest ID
int32lu('c'). // NPC ID ?
int32lu('d'). // 0
int32lu('e'); // 0


// 0x47
// 85030000 fd030000 00000000 5efdffff 00dccc3d 366b40c4
Zone.recv.quest2 = restruct.
int32lu('monsterID'). // Part of quest?
int32lu('questNumber'). // Quest ID
int32lu('c'). // NPC ID ?
int32lu('d'). // 0
int32lu('e'). // 0
float32l('f'); // Who knows



// 0x49 Size: 32 Quest Completed?
// 01000000 00000000 00000000 00000000 
// 00000000 00000000 25199bc4 a183e2b8
Zone.recv.questCompleted = restruct.
int32lu('a'). // Unknown4a
int32lu('b'). // QuestID
int32lu('c'). // Exp
int32lu('d').
int32lu('e').
int32lu('f').
float32l('y'). // 2D coords of player
float32l('x'); // 2D coords of player


// 0x 7C
// 00000000 4d656761 42797465 00000000 00004442 01004cc4 0180 


ZonePC.Set(0x45, {
  Restruct: Zone.recv.quest,
  function: function(client, input) {
    console.log('0x45', input);


    // { a: 1,
    //   b: 2,
    //   c: 1,
    //   d: 0,
    //   e: 0,
    //   y: 246.46063232421875,
    //   x: -975.2449340820312 }

    db.Quest.findById(input.questID, function(err, quest) {
      if (err) {
        console.error(err);
      }
      if (quest) {
        console.log(quest);
      }
    });
    client.character.QuestCurrent = input.questID;
    client.character.QuestPart = input.c;

    // QuestPrevious
    // QuestCurrent
    // QuestPart
    // QuestCounter

    client.character.save();
    input.PacketID = 0x60;
    client.write(new Buffer(Zone.send.quest.pack(input)));
  }
});


ZonePC.Set(0x47, {
  Restruct: Zone.recv.quest2,
  function: function(client, input) {
    console.log('0x47', input);
    console.log('Spawning quest monster not yet implemented.');
    client.sendInfoMessage('Spawning quest monster is not yet implemented.');
    //if (questNumber === input.questNumber)
    //var questID = input.b;
    //client.character.QuestID = questID;
    //UnknownQuestStuff
    //QuestStart
    //QuestComplete
    //client.character.save();
    //input.PacketID = 0x60;
    //client.write(new Buffer(Zone.send.quest.pack(input)));

    // Quest 1 monster is spawned with this packet.
    // 
    client.write(new Buffer("1A012F00000078DABBC9CEC060FDE6097B2B3303031F031A70A87701D30D1A471870822F4E20F23F1060935DA4C6C0000085CB0BF2", "hex"));
    // 1A 01 2F 00 00 00 78 DA BB C9 CE C0 60 FD E6 09
    // 7B 2B 33 03 03 1F 03 1A 70 A8 77 01 D3 0D 1A 47
    // 18 70 82 2F 4E 20 F2 3F 10 60 93 5D A4 C6 C0 00
    // 00 85 CB 0B F2

  }
});


ZonePC.Set(0x49, {
  Restruct: Zone.recv.questCompleted,
  function: function(client, input) {
    console.log('0x49', input);

    client.sendInfoMessage('Quest completion is not yet implemented.');

    db.Quest.findById(client.character.QuestCurrent, function(err, quest) {
      if (err) {
        console.error(err);
      }
      if (quest) {
        console.log(quest);

        // TODO: Check if player meets conditions for quest completion.

        client.character.QuestPrevious = client.character.QuestCurrent;
        client.character.QuestCurrent = 0;
        client.character.QuestPart = 0;
        client.character.QuestCounter = 0;

        // TODO: Send packet to client to remove the quest ?
        var reply = {
          PacketID: 0x60,
          questChain: 0,
          questID: 0,
          c: 0,
          d: 0,
          e: 0
        };
        client.write(new Buffer(Zone.send.quest.pack(reply)));

        // TODO: Give quest rewards
        client.sendInfoMessage('Need to code giving quest rewards.');
        for (var i = 0; i < 3; i++) {
          var reward = quest.Rewards[i];
          switch (reward.type) {
            case 0: // Nothing
              break;
            case 1: // Nothing
              break;
            case 2: // ???
              break;
            case 3: // ???
              break;
            case 4: // Experience
              Zone.giveEXP(client, reward.value);
              break;
            case 5: // Skill Point
              Zone.giveSkillPoint(client, reward.value);
              break;
            case 6: // Item
              Zone.giveItem(client, reward.value);
              break;
          }
        }

      }
    });

  }
});

