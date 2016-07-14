// TODO: When character is not able to move, we just dont update the values.
// But we need to send the response back to the client.

var Buff = restruct.
	int16lu('Amount').
	int16lu('Time');

var BuffHS = restruct.
	int8lu('Amount').
	int8lu('Stacks').
	int16lu('Time');

Zone.CharName_Length = 12;
Zone.UsernameLength = 13;
Zone.PasswordLength = 64;
Zone.AccountSecurityPinLength = 4;
//Zone.VersionRequired 60221 a much older version dakk's client is this
Zone.VersionRequired = 60322;
Zone.AccountSecurityPinLength = 4;
Zone.UserIDLength = 8;// a max length of 8 meens they are using unsigned long long or unsignedint64 a standard database entry for primary key :)
Zone.AvatarNameLength = 12;
Zone.IPAddressLength = 15;
Zone.GuildName_Length = 12;
Zone.GuildTag_Length = 12;
Zone.MessageLength = 50;
Zone.GiftCodeLength = 32;

// Zone.MAX_SILVER = 2147483647;

Zone.send.PersonalShopItem = restruct.
	int32lu('ItemID').
	int32lu('InventoryIndex').
	int32lu('Amount').
	int32lu('Price').
	int8lu('Enchant').
	int8lu('Combine').
	pad(2);

Zone.send.Compress_Hairer = restruct.
  int8lu('packetID').
  int8lu('isCompressed');

Zone.send.Action = restruct.
  int32lu('CharacterID'). // 2
  int32lu('NodeID'). // 6
  string('Name', Zone.CharName_Length+1). // 10
  string('Demostrater', Zone.CharName_Length+1). // 23
  string('Child', Zone.CharName_Length+1). // 36
  int8lu(''). // 49
  int32lu('FactionCapeThing'). // 50
  int32lu(''). // 54
  int32lu('TraitorFlag'). // 58
  int32lu(''). // 62
  int32lu('decHead'). // 66
  int32lu('GlowItems'). // 70
	int8lu('').
	int8lu('').
	int8lu('').
  int8lu('').
  int32lu('decShoulders').
  int32lu('Clan').
  int32lu('Gender').
  int32lu('Hair').
  int32lu('Face').
  int32lu('Level'). // 92
  int32lu('Honor').
  struct('Necklace', structs.Equipt).
  struct('Cape', structs.Equipt).
  struct('Outfit', structs.Equipt).
  struct('Gloves', structs.Equipt).
  struct('Ring', structs.Equipt).
  struct('Boots', structs.Equipt).
  struct('CalbashBottle', structs.Bottle).
  struct('Weapon', structs.Equipt).
  struct('Pet', structs.Pet).
  int32lu('applyGlowItems').
  string('GuildName', Zone.GuildName_Length+1).
  int8lu('').
  int8lu('').
  int8lu('').
  int32lu('LeaderFlag').
  int8lu('LeaderSubFlag').
  int32lu('').
  int32lu('').
  int32lu('').
  int8lu('').
  int8lu('').
  int8lu('').
  int8lu('InParty').
  int32lu('').
  int32lu('').
  int32lu('').
  int8lu('').
  int8lu('').
  int8lu('').
  int32lu('Stance').
  int32lu('Skill').
  float32l('Frame').
  struct('Location',structs.CVec3).
  struct('LocationTo',structs.CVec3).
  float32l('Direction').
  int32lu('TargetNodeID').
  int32lu('TargetID').
  int32lu('TargetUnk').
  int32lu('TargetUnk2').
  int32lu('SkillID').
  int32lu('SkillLevel').
  struct('LocationNew',structs.CVec3).
  float32l('FacingDirection').
  int32lu('MaxHP').
  int32lu('CurrentHP').
  int32lu('MaxChi').
  int32lu('CurrentChi'). // === 372
  struct('Buffs', Buff, 14). //22
  struct('BuffHS', BuffHS).
  struct('Buffs2', Buff, 7).

  int32lu('MonsterDisguise'). // The ID of a monster to disguise as

  int32lu('').
  int32lu('').

  int8lu('InDuel').
  int8lu('InDuelChallenger'). // 0 blue 1 gold
  int8lu('').
  int8lu('Store'). // 0 none 1 open 2 open but empty

  string('StoreName', 28).
  struct('StoreItems', Zone.send.PersonalShopItem, 25).
  int32lu('').
  int32lu('').
  int32lu('').
  int32lu('').
  int32lu(''). // 130
  int32lu('').
  int32lu('').
  int32lu('').
  int32lu('').
  int32lu(''). // 135
  int32lu('').
  int32lu('').
  int32lu('');

Zone.recv.Action = restruct.
  int32lu('Stance').
  int32lu('Skill').
  float32l('Frame').
  struct('Location', structs.CVec3).
  struct('LocationTo', structs.CVec3).
  float32l('Direction').
  int32lu('TargetNodeID').
  int32lu('TargetID').
	int32lu('TargetUnk').
	int32lu('TargetUnk2').
	int32lu('SkillID').
	int32lu('SkillLevel').
  struct('LocationNew', structs.CVec3).
  float32l('FacingDirection').
  pad(8);

Zone.send.attack = restruct.
  int32lu('Action'). // 0 your attacking
  int32ls('CharacterID').
  int32ls('NodeID').
  int32ls('tUniqueID').
  int32ls('tNodeID').
  int32lu('A'). // Skill ID?
  int32lu('B').
  int32lu('C').
  int32lu('D').
  int32lu('Successful'). // Depends on attacker or defender | hit or miss, block or not |
  int32lu('Damage').
  int16lu('isDeadly').
  int16lu('ElementalDamage', 3).
  int32ls('DamageHP');


Zone.recv.attack = restruct.
    int8lu('PacketID').
    int8lu('Status').
    int32lu('Action').
    int32lu('CharID1').
    int32lu('CharID2').
    int32lu('TargetID').
    int32lu('nodeID').
    int32lu('skillID').
    int8lu('Unk', 40);

ZonePC.Set(0x03, {
  Restruct: Zone.recv.Action,
  function: function ActionHearthBeatHandler(client, input) {
    client.character.RealX = input.Location.X;
    client.character.RealY = input.Location.Y;
    client.character.RealZ = input.Location.Z;

		// client.character.save();

    // TODO: Simulate serverside movement and comparison.
  }
});

ZonePC.Set(0x04, {
  Restruct: Zone.recv.Action,
  function: function HandleDuringAction(client, input) {
		// console.log("DIfference:", new Date().getTime() - global.time, "ms");
		// global.time = new Date().getTime();

    client.character.state.Frame = input.Frame;
    client.character.state.Stance = input.Stance;
    client.character.state.Skill = input.Skill;
    client.character.state.FacingDirection = input.FacingDirection;
    client.character.state.Direction = input.Direction;

    client.character.RealX = input.Location.X;
    client.character.RealY = input.Location.Y;
    client.character.RealZ = input.Location.Z;

    client.character.state.Location.X = input.Location.X;
    client.character.state.Location.Y = input.Location.Y;
    client.character.state.Location.Z = input.Location.Z;

    // TODO: Send out updates for things that come into focus.
    // If walking running or jumping action
    // check time since this was last done against some configured value.(maybe 1 sec?)
    // get what is around the character (excluding the character)
    // send their update packets to the client
    // store time this was done

    // client.node.update();
    // Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);

		client.character.save();
  }
});

ZonePC.Set(0x05, {
  Restruct: Zone.recv.Action,

  function: function ActionHandler(client, input) {
		console.log("New action ("+input.Skill+")");

		// TODO: Check if target exists and able to confirm the action against it.
		client.character.state.TargetNodeID = input.TargetNodeID;
		client.character.state.TargetID = input.TargetID;
		client.character.state.TargetUnk = input.TargetUnk;
		client.character.state.TargetUnk2 = input.TargetUnk2;

    client.character.state.Frame = input.Frame;
    client.character.state.Stance = input.Stance;
    client.character.state.Skill = input.Skill;
    client.character.state.FacingDirection = input.FacingDirection;
    client.character.state.Direction = input.Direction;

    client.character.RealX = input.Location.X;
    client.character.RealY = input.Location.Y;
    client.character.RealZ = input.Location.Z;

    client.character.state.Location.X = input.Location.X;
    client.character.state.Location.Y = input.Location.Y;
    client.character.state.Location.Z = input.Location.Z;

    client.character.state.LocationTo.X = input.Location.X;
    client.character.state.LocationTo.Y = input.Location.Y;
    client.character.state.LocationTo.Z = input.Location.Z;

    client.character.state.LocationNew.X = input.LocationNew.X;
    client.character.state.LocationNew.Y = input.LocationNew.Y;
    client.character.state.LocationNew.Z = input.LocationNew.Z;

		client.character.state.ActionTimeStamp = new Date().getTime();
		client.node.update();
		
		client.character.state.set(STATE.isRunning, false);

    switch(input.Skill){
        // case 66:
        // case 61:
        // case 68:
        // case 75:
        // case 67:
        // case 62:
				// client.character.state.skillUsed = true;
        // break;
				//
				// Fujin general skills
				// case 32: // Traceless Steps - Running skill
				// case 60:
				// client.character.state.SkillUsed = true;
				// break;
				//
				// // Fujin general buffs
				// case 40:
				// case 41:
				// Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				// break;
				//
				// // Fujin katana skills
				// case 42:
				// case 43:
				// case 44:
				// Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				// break;

				// Fujin skills
				case 41: // Hurricane Winds - Shadow damage buff
				case 32: // Traceless Steps - Running skill
				if(client.character.Clan !== 1){
					console.log("The character was not fujin when using the skill");
					return;
				}

				client.character.state.SkillUsed = true;
				break;

				// Fujin katana skills
				case 42:
				case 43: // Assasin's Blade - Basic Multihit
				if(client.character.Clan !== 1){
					console.log("The character was not fujin when using the skill");
					return;
				}

				if(client.character.infos.Weapon.ItemType !== 'Katana'){
					console.log("Using skill requires Katana");
					return;
				}

				client.character.state.SkillUsed = true;
				break;

				// Weapon basic attacks.
				// Attack when animation has finished.
				case 5:
				case 6:
				case 7:
				console.log(input);
				console.log("Target node:", input.TargetNodeID);
				Zone.QuadTree.findNodeById(input.TargetNodeID, function(node){
					console.log("Found target node", node.id);
					client.character.DamageDealer.attack(node);
					Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				});
				break;

        // Spawning or /return
        case 0:
        Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
        break;


				// Character stops when theres lack of chi to continue running.
				case 1:
				Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				break;

				case 3:
				// NOTE: Your character walk and run slower.
				console.log("Weapon Out");
				Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				break;

				case 4:
				console.log("Weapon In");
				Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				break;

				// Walking
				case 2:
				// var x = input.Location.X - input.LocationNew.X;
				// var y = input.Location.Z - input.LocationNew.Z;

				// var distance = Math.sqrt(x * x + y * y);
				// console.log(input);
				// var walkingSpeed = 60;
				// console.log("Distance:", distance);
				// var time = (distance / walkingSpeed) * 1000;
				// console.log("Time:", time);
				// setTimeout(function(){
				// 	console.log("Reached");
				// }, time);
				// console.log(config.motion[client.character.Clan][input.Skill][input.Stance])
				Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
				break;


        default:
				console.log("Unknown Action "+client.character.Name + ' '+input.Skill);
        Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
        break;
    }

		clearInterval(client.character.state.Intervals.BroadcastState);
		client.character.state.Intervals.BroadcastState = setInterval(Zone.broadcastState.bind(Zone, client), 5000);
  }
});

Zone.recv.onHit = restruct.
	int32lu('unk').
	int32lu('CharacterID').
	int32lu('NodeID').
	int32lu('TargetID').
	int32lu('TargetNodeID').
	pad(44);

ZonePC.Set(0x15, {
	Restruct: Zone.recv.onHit,
	function: function(client, input){
		// TODO: Confirming if I actually was able to hit the target. Input contains attacker and the target.
		console.log("onHit callback");
		// console.log(input);
	}
})

Zone.recv.useSkill = restruct.
	int32lu('ChiCost').
	int32lu('SkillID').
	int32lu('SkillLevel').
	int32lu('ChiCost2').
	pad(8);

ZonePC.Set(0x19, {
	Restruct: Zone.recv.useSkill,
	function: function useSkill(client, input){
		if(client.character.state.get(STATE.isRunning)){
			client.character.state.SkillUsed = true;
		}

		if(!client.character.state.SkillUsed){
			console.log("Failed to use the skill. Action was not permitted.");
			return;
		}
		client.character.state.SkillUsed = false;

		var skillIndex = -1;
    for (var i=0;i<30;i++) {
      var s = client.character.SkillList[i];
      if (s && s.ID === input.SkillID && s.Level >= input.SkillLevel) {
        skillIndex = i;
      }
    }

    if (skillIndex === -1) {
      console.log('Character does not have the skill.');
      return;
    }

		console.log("useSkill callback");

		console.log(input);
		db.Skill.findById(input.SkillID, function(err, skill){
			if(err){
				console.log('Error occoured on finding skill', input.SkillID, 'for', client.character.Name);
				return;
			}

			if(!skill){
				console.log('Skill info', input.SkillID, 'not found for', client.character.Name);
				return;
			}

			if(!skill.isUsedByClan(client.character.Clan)){
				console.log("This clan cannot use the skill");
				return;
			}

			if(!skill.isUsedByWeapon(client.character.infos.Weapon.ItemType)){
				console.log("This clan cannot use the skill");
				return;
			}

			var modifiers = skill.getSkillMods(input.SkillLevel);
			if(input.ChiCost !== modifiers.ChiCost){
				console.log("Failed to use the skill. Unexpected difference in chi cost.");
				return;
			}

			if(client.character.state.CurrentChi < modifiers.ChiCost){
				console.log("Failed to use the skill due to lack of required chi.");
				return;
			}


			client.character.state.CurrentChi -= modifiers.ChiCost;
			client.character.state.SkillID = input.SkillID;
	    client.character.state.SkillLevel = input.SkillLevel;
			client.node.update();

			Zone.sendToAllArea(client, !client.character.state.get(STATE.isRunning), client.character.state.getPacket(), config.network.viewable_action_distance);

			switch(input.SkillID){
				case 21: // Fujin running skill
				client.character.state.set(STATE.isRunning, true);
				break;
			}
		});

		// TODO: Calculate chi usage.
		//
		// console.log("Using skill: " + client.character.state.Skill + " ID: "+input.SkillID + " Level: " + input.SkillLevel);
    // console.log(input);
		//
    // // TODO Check if caching works with the mongoose plugin Ane found, or cache this our selves on character login and on skill bar change.
    // // We might only have to cache the skill mods per level that the character has on their bars :D
		//
    // // Ensure character has skill and the >= level requesting.
    // var skillIndex = -1;
    // for (var i=0;i<30;i++) {
    //   var s = client.character.SkillList[i];
    //   if (s && s.ID === input.SkillID && s.Level >= input.SkillLevel) {
    //     skillIndex = i;
    //   }
    // }
		//
    // if (skillIndex === -1) {
    //   console.log('Character does not have the skill.');
    //   return;
    // }
		//
    // db.Skill.findById(input.SkillID, function(err, skill){
    //   if (err) {
    //     console.error('Error looking up skill for character '+client.character.Name+' SkillID: '+input.SkillID);
    //     return;
    //   }
		//
    //   var mods = skill.getSkillMods(input.SkillLevel);
    //   console.log(mods);
    //   if (mods.ChiCost !== input.ChiUsage) {
    //     console.warn('CHI USAGE MISSMATCH Server: '+mods.ChiCost +' Client: '+ input.ChiUsage);
    //   }
		//
    //   var skillUsedSuccessfully = false;
    //   if (client.character.state.CurrentChi >= mods.ChiCost) {
    //     client.character.state.CurrentChi -= mods.ChiCost;
    //     client.sendInfoMessage('Chi at '+client.character.state.CurrentChi);
    //     skillUsedSuccessfully = true;
    //   } else {
    //     // Error not enough Chi to use skill.
    //     console.error('Unable to use Skill out of Chi: ' + client.character.state.CurrentChi +' requires '+mods.ChiCost);
    //     client.sendInfoMessage('Unable to use Skill out of Chi.');
    //     return false;
    //   }
		//
		//
		//
    //   client.character.state.SkillID = input.SkillID;
    //   client.character.state.SkillLevel = input.SkillLevel;
		//
    //   if(skillUsedSuccessfully) {
		// 		characterUseSkill.call(client, input, skill, mods);
    //   } else {
    //     client.character.state.SkillID = 0;
    //     client.character.state.SkillLevel = 0;
    //     client.character.state.Skill = 1;
		// 		client.character.state.Frame = 0;
    //   }
		//
		// 	// Call the buffer before node update. We are gonna do the cos sin magic in getPacket
		// 	// then updating node will actually update it nice :D
    //   if (client.character.state.skillUsed) {
		// 		client.character.state.Frame = 0;
    //     Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
    //     client.character.state.skillUsed = false;
    //   	client.node.update();
    //   }
    // });
	}
});

function characterUseSkill(input, skill, mods){
	// switch(this.character.Skill){
	// 	// case 2:
	// 	// case 21:
	// 	// // Consider actionTimeStamp to have lag compensation?
	// 	// // and also looking if hes updating to fast, warning about speed hack?
	// 	// var actionInterval = new Date().getTime() - this.character.state.getActionTimeStamp();
	// 	// if(actionInterval > 1100){
	// 	// 	console.warn("We've got too slow skill use updates, for character: ("+this.character.Name+")");
	// 	// }
	// 	//
	// 	//
	// 	// console.log(actionInterval);
	// 	// break;
	//
	// 	case 60:
	// 	var motion = config.motion[this.character.Clan][this.character.state.Stance][this.character.state.Skill];
	// 	console.log(motion);
	// 	setTimeout(function(){
	// 		console.log("Apply now");
	// 	}, motion.length);
	// 	break;
	// }
}

ZonePC.Set(0x18, {
	function: function confirmState(client){
		// console.log("test");
	  // Fired when character deequipes a weapon. This might be used to remove character applied buffs as weapon is removed from character state.
	}
});


ZonePC.Set(0x8B, {
    function: function(client){
			// This was used to pull states for client
		}
});
