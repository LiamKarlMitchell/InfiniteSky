// These packets must contain some info about quests.
// LastQuestID
// CurrentQuestID
// QuestPart
// Quest Monster Kill Count
// 
// 
// Quest Part Enum / Quest Status
// 0 = Not Started
// 1 = Started / Part 1
// 2 = Part 2 etc.
// 
// Mandatory / isMandatory (1 if mandatory)
// 0 = Can give up / Option.
// 1 = Mandatory
// 2 = Can Give Up the quest (Quest is optional)

// 0x45
// 00000000 01000000 01000000 00000000 00000000 8ee871c4 b6cf89c4 
Zone.recv.quest = restruct.
int32lu('QuestPrevious'). // Part of quest?
int32lu('QuestCurrent'). // Quest ID
int32lu('QuestPart'). // NPC ID ?
int32lu('QuestCounter'). // 0
int32lu('QuestOther'). // 0
float32l('y'). // 2D coords of player
float32l('x'); // 2D coords of player


// 0x60
// 00000000 01000000 01000000 00000000 00000000
Zone.send.quest = restruct.
int8lu("PacketID").
int32lu('QuestPrevious'). // Part of quest?
int32lu('QuestCurrent'). // Quest ID
int32lu('QuestPart'). // NPC ID ?
int32lu('QuestCounter'). // 0
int32lu('QuestOther'); // 0



var reward = restruct.
int32lu('type').
int32lu('value');

Zone.send.questRewards = restruct.
int8lu("PacketID"). // 0x62
struct("Rewards", reward, 3);

// 0x47
// 85030000 fd030000 00000000 5efdffff 00dccc3d 366b40c4
Zone.recv.quest2 = restruct.
int32lu('MonsterID'). // Part of quest?
int32lu('QuestCurrent'). // Quest ID
int32lu('QuestPart'). // NPC ID ?
int32lu('QuestCounter'). // 0
int32lu('QuestOther'). // 0
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

function sendClientQuestReply(client) {
    client.character.save();
    client.write(new Buffer(Zone.send.quest.pack({
      PacketID: 0x60,
      QuestPrevious: client.character.QuestPrevious,
      QuestCurrent: client.character.QuestCurrent,
      QuestPart: client.character.QuestPart,
      QuestCounter: client.character.QuestCounter,
      QuestOther: client.character.QuestOther
    })));
}

// 0x 7C
// 00000000 4d656761 42797465 00000000 00004442 01004cc4 0180 

ZonePC.Set(0x45, {
  Restruct: Zone.recv.quest,
  function: function(client, input) {
    console.log('0x45', input);

    // TODO: Check if player is in close proximity to the start NPC

    // TODO: If quest previous is not set then blank everything. (We should do this on character create or defaults in DB :).
    // This block of code can be removed eventually.
    if (client.character.QuestPrevious === undefined) {
      client.character.QuestPrevious = 0;
      client.character.QuestCurrent = 0;
      client.character.QuestPart = 0;
      client.character.QuestCounter = 0;
      client.character.QuestOther = 0;
    }

    // if the character has no current quest.
    if (client.character.QuestCurrent === 0 && client.character.QuestPart === 0) {

      // Handle the case where it is the characters first quest.
      if (client.character.QuestPrevious === 0) {
        // Get the first quest for the clan.
        db.Quest.findOne({ QuestNumber: 1, Clan: client.character.Clan+1 }, function(err, quest) {
          if (err) {
            console.error(err);
            return;
          }

          if (!quest) {
            console.log('There is no quest 1 for clan '+(client.character.Clan+1));
            return false;
          }

          client.character.QuestCurrent = quest.id;
          client.character.QuestPart = 1;
          client.character.QuestCounter = 0;
          client.character.QuestOther = 0;
          sendClientQuestReply(client);

        });

        return;
      }
      // Increase QuestCurrent to the next available quest.
      db.Quest.findById(client.character.QuestPrevious, function(err, quest) {
        if (err) {
          console.error(err);
          return;
        }

        if (!quest) {
          console.log('Quest not found for '+client.character.QuestPrevious);
          return;
        }
        // TODO: refactor this into a get quest callback method or something and handle skipping non mandatory quests.
        if (quest.NextQuest === 0) {
          console.error('No next quest set.');
          return;
        }

        var newQuestID = quest.NextQuest;
        db.Quest.findById(newQuestID, function(err, quest) {
          if (err) {
            console.error(err);
            return;
          }

          if (!quest) {
            console.log('Quest not found for '+newQuestID);
            return;
          }

          if (quest.Level > client.character.Level) {
            console.error('Character not high enough level to take this quest.');
            return;
          }

          client.character.QuestCurrent = newQuestID;

          // If part would be 1 we want to give any items they need to deliver.
          switch (client.character.QuestPart++) {
            case 1:
              console.log('Starting quest.');
            break;
          }

          sendClientQuestReply(client);

         });

      });
    } else {
      console.log('Unhandled Quest Packet request 0x45', input);
    }
  }


});


ZonePC.Set(0x47, {
  Restruct: Zone.recv.quest2,
  function: function(client, input) {
    console.log('0x47', input);
    
    // A will be the monster id to spawn.
    db.Quest.findById(client.character.QuestCurrent, function(err, quest) {
      if (err) {
        console.error(err);
        return;
      }

      if (!quest) {
        console.log('No quest info found for quest: '+client.character.QuestCurrent+'.');
        return;
      }
      
      // Quest type would allow for summoning a monster.
      // The zone is correct.
      // The character is within 100 units of the quest coords.
      var questPoint = new CVec3(quest.X, quest.Y, quest.Z);
      var distance = client.character.state.Location.getDistance(questPoint);

      if (quest.Type !== 5) {
        console.error('Quest '+quest.id+' '+quest.Name+' is not a type that would spawn a monster so need to figure out why its getting this packet from the cilent.');
        return;
      }
      console.log(Zone.id+'  '+quest.Zone+'  '+distance);
      if (Zone.id === quest.Zone) { // && distance <= 500
        var monster_id = quest.A;
        if (monster_id !== input.MonsterID) {
          console.error('Game client is sending us a different MonsterID to what the Quest specifies.');
        }



         db.Monster.findById(monster_id, function(err, info){
              if(err){
                console.error(err);
                return;
              }

              if(!info){
                return;
              }
              
              // TODO: Get all of the monsters with this id in a surrounding area of say 1000 units.
              //       If none of them contain the client.character.State.NodeID allow spawning another one.
              //       Otherwise simply teleport the old one and reset its timer.

              var mObj = new MonsterObj(monster_id);
              // TODO: If people can party do quests of same level we add them here.
              // The idea behind monster object's questTargets is that other characters won't be able to hurt it.
              // And that the killer must be someone undertaking the quest that spawned that one.
              // Then they get the monster count and can finish the quest.
              
              mObj.questTargets = [ client.character.state.NodeID ];

              // TODO: Set a timer to despawn the monster if it is not killed in time.

              var nObj = new QuadTree.QuadTreeNode({
                object: mObj,
                update: function() {
                  this.x = this.translateX(this.object.Location.X);
                  this.y = this.translateY(this.object.Location.Z);
                },
                type: 'monster'
              });

              var node = Zone.QuadTree.addNode(nObj);
              mObj.setInfos(info);
              mObj.setNode(node);
              mObj.spawn(questPoint);

              Zone.Monsters.push(mObj);

              // TODO: Figure out why the monster spawned in the way shown above does not play sound/notice.
              // Quest 1 monster is spawned with this packet.
              // 
              //client.write(new Buffer("1A012F00000078DABBC9CEC060FDE6097B2B3303031F031A70A87701D30D1A471870822F4E20F23F1060935DA4C6C0000085CB0BF2", "hex"));
              // 1A 01 2F 00 00 00 78 DA BB C9 CE C0 60 FD E6 09
              // 7B 2B 33 03 03 1F 03 1A 70 A8 77 01 D3 0D 1A 47
              // 18 70 82 2F 4E 20 F2 3F 10 60 93 5D A4 C6 C0 00
              // 00 85 CB 0B F2

            });

      }

    });

  }
});

// Finished quest.
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
        // TODO: Check if player is in close proximity to the end NPC

        client.character.QuestPrevious = client.character.QuestCurrent;
        client.character.QuestCurrent = 0;
        client.character.QuestPart = 0;
        client.character.QuestCounter = 0;
        client.character.QuestOther = 0;

        sendClientQuestReply(client);

        // TODO: Give quest rewards
        client.sendInfoMessage('Need to code giving quest rewards.');
        for (var i = 0; i < 3; i++) {
          var reward = quest.Rewards[i];
          switch (reward.type) {
            case 0: // Nothing
              break;
            case 1: // Nothing
                client.sendInfoMessage('Quest Reward of 1 value '+reward.value+' is not implemented.');
              break;
            case 2: // ???
                client.sendInfoMessage('Quest Reward of 2 value '+reward.value+' is not implemented.');
              break;
            case 3: // ???
                client.sendInfoMessage('Quest Reward of 3 value '+reward.value+' is not implemented.');
              break;
            case 4: // Experience
              Zone.giveEXP(client, reward.value);
              break;
            case 5: // Skill Point
              client.sendInfoMessage('Pretend you got '+reward.value+' SkillPoint.');
              Zone.giveSkillPoints(client, reward.value);
              break;
            case 6: // Item
              Zone.giveItem(client, reward.value);
              break;
          }
        }

        // Sent to client with rewards
        // 62 05 00 00 00 01 00 00 00 04 00 00 00 03 10 00
        client.write(new Buffer(Zone.send.questRewards.pack({
          PacketID: 0x62,
          Rewards: quest.Rewards
        })));

        // These were also set but I have no idea why.. the client does it already maybe it is just a precaution or from older clients and was never taken out.
        // 60 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        // 00 00 00 00 00
        sendClientQuestReply(client);

        // No idea what 2E is for yet.
        // 2E 03 00 00 00 CA 3E 5F 0A 01
        // 2F is sent because Honor Points could be changed although I have not seen a quest with a reward of Honor Points or Silver Coins.
        // 2F 11 00 00 00 F5 3F 01 00 00 00 00 00 3F 05 00
        // 00 7F 00 00 00 00 00 00 00 00 00 00 00
        // Maybe this code will help but im not sure...
        // client.character.do2FPacket = 1;
        // client.character.infos.updateAll();
        // client.Zone.sendToAllArea(client,true,client.character.state.getPacket(),config.viewable_action_distance
      }
    });

  }
});

