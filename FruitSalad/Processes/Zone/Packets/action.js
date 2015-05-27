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

Zone.MAX_SILVER = 2147483647;

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
    int8lu('Unk', 1).
    int32lu('FactionCapeThing').
    int32lu('t').
    int32lu('TraitorFlag').
    int32lu('t').

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
    struct('Armor', structs.Equipt).
    struct('Glove', structs.Equipt).
    struct('Ring', structs.Equipt).
    struct('Boot', structs.Equipt).
    struct('CalbashBottle', structs.Bottle).
    struct('Weapon', structs.Equipt).
    struct('Pet', structs.Pet).
    int32lu('applyGlowItems').
    string('GuildName', Zone.GuildName_Length+1).
    int8lu('', 3).
    int32lu('LeaderFlag').
    int8lu('LeaderSubFlag').
    int8lu('', 15).
    // string('GuildName2',Zone.GuildName_Length+1).

    int8lu('InParty').
    int8lu('', 15).

    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    struct('LocationTo',structs.CVec3).
    float32l('Direction').
    int32lu('nodeID').
    int32lu('TargetID').
    int8lu('t', 4).
    int8lu('t', 4).
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

    int8lu('t', 4).
    int8lu('t', 4).

    int8lu('dueling').
    int8lu('duel_challenger'). // 0 blue 1 gold
    int8lu('Unk1', 1).
    int8lu('Store'). // 0 none 1 open 2 open but empty


    string('StoreName', 28).
    struct('StoreItems', Zone.send.PersonalShopItem, 25).
    int8lu('Unk1', 8).
    int32lu('').
    int32lu('Unk1').
    int32lu('Unk1'). // 130
    int32lu('Unk1').
    int32lu('Unk1').
    int32lu('Unk1').
    int32lu('Unk1').
    int32lu('Unk1'). // 135
    int32lu('Unk1').
    int32lu('Unk1').
    int32lu('Unk1');

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

        // TODO: Simulate serverside movement and compare.
    }
});

ZonePC.Set(0x04, {
    Restruct: Zone.recv.Action,

    function: function HandleDuringAction(client, input) {
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

        client.write(client.character.state.getPacket());
    }
});

ZonePC.Set(0x05, {
    Restruct: Zone.recv.Action,

    function: function ActionHandler(client, input) {
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

        client.write(client.character.state.getPacket());
    }
});

ZonePC.Set(0x8B, {
    function: function(client, input) {
        // console.log("test", input.length);
    }
});