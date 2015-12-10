Zone.recv.on43ItemUse = restruct.
  int8lu('Action').
  int32lu('InventoryIndex').
  int32lu('SkillIndex').
  int32lu('unk4').
  int32lu('unk5').
  int32lu('unk6').
  int32lu('unk7').
  int32lu('unk8').
  int32lu('unk9');

Zone.send.on43ItemUse = restruct.
  int8lu("PacketID").
  int8lu("Action").
  int8lu("Result").
  int32lu('InventoryIndex').
  int32lu('v1').
  int32lu('v2').
  int32lu('v3').
  int32lu('v4').
  int8lu('v5').
  int8lu('v6').
  int16lu('unk');

Zone.send.use43 = function(input, result){
  this.write(new Buffer(Zone.send.on43ItemUse.pack({
    PacketID: 0x5E,
    Action: input.Action,
    Result: result,
    InventoryIndex: input.InventoryIndex,
    v1: input.v1,
    v2: input.v2,
    v3: input.v3,
    v4: input.v4,
    v5: input.v5,
    v6: input.v6
  })));
}

ZonePC.Set(0x43, {
  Restruct: Zone.recv.on43ItemUse,
  function: function(client, input){
    console.log(input);

    var invItem = client.character.Inventory[input.InventoryIndex];
    if(!invItem){
      console.log("Inventory item on item use didnt existed");
      return;
    }

    switch(input.Action){
      case 1: // Ticket
        if(invItem.ID !== 497){
          return;
        }

        // TODO: Get to know the ranges of silver.
        input.v1 = 1;
        client.character.Silver += input.v1;
        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 2: // Gift Box.
        // TODO: Figure out what we could award player with.
        Zone.send.use43.call(client, input, 1);
        return;
        if(client.character.Level < 70 || client.character.Level > 89){
          return;
        }

        input.v1 = 30040; // Item ID
        input.v2 = 5; // Column
        input.v3 = 2; // Row
        input.v4 = 1; // Amount
        input.v5 = 12; // Enchant
        input.v6 = 12; // Combine
        Zone.send.use43.call(client, input, 0);
      break;

      case 3: // Superior Tablet. Dissapearing upon kill.
        //TODO: Find state value after using this item.
        Zone.send.use43.call(client, input, 1);
        return;
        if(invItem.ID !== 499){
          return;
        }

        if(client.character.Level < 30 || client.character.Level > 49){
          return;
        }

        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 4: // Superior Pill.
        // TODO: Find out the character state value for this.
        Zone.send.use43.call(client, input, 1);
        return;

        if(invItem.ID !== 500){
          return;
        }

        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 5: // Blood clear.
        if(invItem.ID !== 723){
          return;
        }

        if(!invItem.Amount){
          return;
        }

        var restoredPoints = 0;
        restoredPoints += client.character.StatVitality - 1;
        client.character.StatVitality = 1;
        restoredPoints += client.character.StatDexterity - 1;
        client.character.StatDexterity = 1;
        restoredPoints += client.character.StatChi - 1;
        client.character.StatChi = 1;
        restoredPoints += client.character.StatStrength - 1;
        client.character.StatStrength = 1;

        client.character.StatPoints += restoredPoints;

        if(--invItem.Amount === 0){
          client.character.Inventory[input.InventoryIndex] = null;
        }

        client.character.markModified('Inventory');
        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 7: // Using protection charm. Max stack of those is 12.
        if(invItem.ID !== 99148){
          return;
        }

        client.character.Usable_ProtectionCharm++;

        if(--invItem.Amount === 0){
          console.log("Removing the item on use");
          client.character.Inventory[input.InventoryIndex] = null;
        }

        client.character.markModified('Inventory');

        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 8: // Extra storage
      Zone.send.use43.call(client, input, 0);
      break;

      case 9: // Extra player storage
      Zone.send.use43.call(client, input, 0);
      break;

      case 10: // Partial Restoration
        if(invItem.ID !== 99149){
          return;
        }

        var recoveredSkillPoints = 0;
        for(var i=0; i<client.character.SkillList.length; i++){
          var skill = client.character.SkillList[i];
          if(!skill) continue;
          recoveredSkillPoints += skill.Level - 1;
          skill.Level = 1;
        }

        for(var i=0; i<client.character.SkillBar.length; i++){
          client.character.SkillBar[i] = null;
        }

        client.character.SkillPoints += recoveredSkillPoints;
        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.markModified('SkillList');
        client.character.markModified('SkillBar');


        client.character.save(function(err){
          if(err){
            return;
          }

          input.v1 = client.character.SkillPoints;
          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 11: // Full Restoration
        if(invItem.ID !== 99150){
          return;
        }

        var skill = client.character.SkillList[input.SkillIndex];
        if(!skill){
          return;
        }

        client.character.SkillPoints += skill.Level - 1;
        skill.Level = 1;

        client.character.Inventory[input.InventoryIndex] = null;

        client.character.markModified('Inventory');
        client.character.markModified('SkillList');

        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 15: // Using guild insignia
        if(invItem.ID !== 99158){
          return;
        }

        if(!client.character.state.Guild){
          return;
        }

        if(client.character.state.Guild.leader !== client.character.Name){
          return;
        }

        client.character.Usable_GuildInsignia++;
        client.character.Inventory[input.InventoryIndex] = null;
        client.character.markModified('Inventory');
        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.send.use43.call(client, input, 0);
        });
      break;

      case 39: // Lucky Enchanting
      if(invItem.ID !== 99243){
        return;
      }

      client.character.Usable_LuckyEnchanting++;
      client.character.Inventory[input.InventoryIndex] = null;
      client.character.markModified('Inventory');
      client.character.save(function(err){
        if(err){
          return;
        }

        Zone.send.use43.call(client, input, 0);
      });
      break;

      case 40: // Lucky Upgrading
      if(invItem.ID !== 99245){
        return;
      }

      client.character.Usable_LuckyUpgrading++;
      client.character.Inventory[input.InventoryIndex] = null;
      client.character.markModified('Inventory');
      client.character.save(function(err){
        if(err){
          return;
        }

        Zone.send.use43.call(client, input, 0);
      });
      break;

      case 41: // Lucky Combining
      if(invItem.ID !== 99244){
        return;
      }

      client.character.Usable_LuckyCombining++;
      client.character.Inventory[input.InventoryIndex] = null;
      client.character.markModified('Inventory');
      client.character.save(function(err){
        if(err){
          return;
        }

        Zone.send.use43.call(client, input, 0);
      });
      break;

      case 50: // Tresure box
      // Zone.send.use43.call(client, input, 0);
      break;

      // case 115: // Blue buff?
      // Zone.send.use43.call(client, input, 0);
      // break;
    }

  }
});


// Fortune Pouch 99149
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 1900 0000 0000 0000 005c f918 0000 0000  .........\y.....
// 00000010: 0021 0000 0098 f818 00bd d505 07a4 9b03  .!....x..=U..$..
// 00000020: 23                                       #

// Partial restoration 99150
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0b01 0000 0001 0000 005c f918 0000 0000  .........\y.....
// 00000010: 0021 0000 0098 f818 00e2 d305 2fa4 9b03  .!....x..bS./$..
// 00000020: 4b                                       K

// When using 99146 Storage vault to increase storage at guild director for 30 days
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0800 0000 0000 0000 005c f918 0000 0000  .........\y.....
// 00000010: 0021 0000 0098 f818 005b 9005 08a4 9b03  .!....x..[...$..
// 00000020: 24                                       $

// When using hermits chest, 99147 to increase inventory size for 30 days
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0900 0000 0000 0000 005c f918 0000 0000  .........\y.....
// 00000010: 0021 0000 0098 f818 003a 9905 0da4 9b03  .!....x..:...$..
// 00000020: 29                                       )



// When using item 99157 to change gender to female.
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0d00 0000 0001 0000 0003 0000 0001 0000  ................
// 00000010: 0021 0000 0098 f818 00e5 9305 1ca4 9b03  .!....x..e...$..
// 00000020: 38                                       8


// Chance appearance
// When using item 99162
// Hair
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0d01 0000 0000 0000 0007 0000 0004 0000  ................
// 00000010: 0021 0000 0098 f818 0020 da05 2aa4 9b03  .!....x...Z.*$..
// 00000020: 46                                       F

// When using item 99163
// Face
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0d02 0000 0000 0000 0005 0000 0000 0000  ................
// 00000010: 0021 0000 0098 f818 0000 48c2 6600 0000  .!....x...HBf...
// 00000020: 66                                       f

// When using item 99164
// Hair and Face
// Unreconized PacketID: 0x43 Size: 33
// 00000000: 0d00 0000 0000 0000 0001 0000 0002 0000  ................
// 00000010: 0021 0000 0098 f818 00aa 9405 12a4 9b03  .!....x..*...$..
// 00000020: 2e                                       .

//9 bytes then
//Head int
//Hair int

Zone.recv.on3CItemUse = restruct.
  int32lu('unk1').
  int32lu('unk2').
  int32lu('unk3').
  int32lu('unk4');

ZonePC.Set(0x3C, {
  Restruct: Zone.recv.on3CItemUse,
  function: function(client, input){
      console.log("test", input);
  }
});

Zone.recv.on42ItemUse = restruct.
  int32lu('unk1').
  int32lu('unk2').
  int32lu('unk3').
  int32lu('unk4');

ZonePC.Set(0x42, {
  Restruct: Zone.recv.on42ItemUse,
  function: function(client, input){
      console.log(input);
  }
});
