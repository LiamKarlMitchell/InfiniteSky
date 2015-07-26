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
Zone.UserIDLength = 8 ;// a max length of 8 meens they are using unsigned long long or unsignedint64 a standard database entry for primary key :)
Zone.AvatarNameLength = 12;
Zone.IPAddressLength = 15;
Zone.GuildName_Length = 12;
Zone.GuildTag_Length = 12;
Zone.MessageLength = 50;
Zone.GiftCodeLength = 32;

// Zone.MAX_SILVER = 2147483647;

Zone.send.PersonalShopItem = restruct.
	int32lu('ID').
	int32lu('Unk').
	int32lu('Amount').
	int32lu('Price').
	int8lu('Enchant').
	int8lu('Combine').
	int16lu('Unknown');

Zone.send.Compress_Hairer = restruct.
    int8lu('packetID').
    int8lu('isCompressed');

Zone.send.Action = restruct.
    int32lu('CharacterID').
    int32lu('UniqueID').
    string('Name', Zone.CharName_Length+1).
    string('Demostrater', Zone.CharName_Length+1).
    string('Child', Zone.CharName_Length+1).
    int8lu('Unk').
    int32lu('FactionCapeThing').
    int32lu('Unk').
    int32lu('TraitorFlag').
    int32lu('Unk').
    int32lu('decHead').
    int32lu('GlowItems').
    int32lu('decBody').
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
    int8lu('Unk').
    int8lu('Unk').
    int8lu('Unk').
    int32lu('LeaderFlag').
    int8lu('LeaderSubFlag').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int8lu('Unk').
    int8lu('Unk').
    int8lu('Unk').
    int8lu('InParty').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int8lu('Unk').
    int8lu('Unk').
    int8lu('Unk').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    struct('LocationTo',structs.CVec3).
    float32l('Direction').
    int32lu('nodeID').
    int32lu('TargetID').
    int32lu('Unk').
    int32lu('unk').
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

    int32lu('Unk').
    int32lu('Unk').

    int8lu('dueling').
    int8lu('duel_challenger'). // 0 blue 1 gold
    int8lu('Unk').
    int8lu('Store'). // 0 none 1 open 2 open but empty

    string('StoreName', 28).
    struct('StoreItems', Zone.send.PersonalShopItem, 25).
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk'). // 130
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk'). // 135
    int32lu('Unk').
    int32lu('Unk').
    int32lu('Unk');

Zone.recv.Action = restruct.
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location', structs.CVec3).
    struct('LocationTo', structs.CVec3).
    float32l('Direction').
    int32lu('nodeID').
    int32lu('TargetID').
    float32l('UNK3', 4).
    struct('LocationNew', structs.CVec3).
    float32l('FacingDirection').
    float32l('Health').
    int32lu('Unknown10');

ZonePC.Set(0x03, {
    Restruct: Zone.recv.Action,

    function: function ActionHearthBeatHandler(client, input) {
        client.character.RealX = input.Location.X;
        client.character.RealY = input.Location.Y;
        client.character.RealZ = input.Location.Z;

				client.character.save(function(){
					// console.log("Saved");
				});


        // TODO: Simulate serverside movement and compare.
    }
});

ZonePC.Set(0x04, {
    Restruct: Zone.recv.Action,

    function: function HandleDuringAction(client, input) {
        // console.log(input);
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

        client.node.update();
        Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);
				client.character.save(function(){
					// console.log("Saved");
				});
    }
});

ZonePC.Set(0x05, {
    Restruct: Zone.recv.Action,

    function: function ActionHandler(client, input) {
        if(client.character.state.onSkillUseState){
            return;
        }
        // console.log(input);
        // Zone.AI.findPath({x: input.Location.X, y: input.Location.Y, z: input.Location.Z}, {x: input.LocationNew.X, y: input.LocationNew.Y, z: input.LocationNew.Z}, 2, function(points){
				//
        // });

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

        switch(input.Skill){
            case 41:
            case 32:
            case 60:
            case 66:
            case 44:
            case 40:
            case 61:
            case 68:
            case 75:
            case 67:
            case 62:
            client.character.state.onSkillUseState = true;
            break;

            default:
            client.node.update();
            Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
            break;
        }

				// client.character.save(function(){
				// 	// console.log("Saved");
				// });
    }
});

ZonePC.Set(0x8B, {
    function: function(client){
        Zone.broadcastStates(client);
    }
});


// TODO (Ane): Blah
