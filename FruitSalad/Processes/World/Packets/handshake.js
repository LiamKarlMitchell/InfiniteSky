// World.recv.Handshake = restruct.
	// string('AccountName', 13).
	// pad(5);
// int8lu('Slot').
// int32lu('MapID');

WorldPC.Set(0x01, {
	Size: 27,
	function: function(socket, buffer){
		// TODO: Add IP validation?
		var hash = buffer.slice(0, 14);
		var key = util.toHexString(hash);
		var transferObj = World.characterTransfer[key];
		if(!transferObj){
			console.log("No transfer obj for:", key);
			return;
		}

		delete World.characterTransfer[key];

		db.Character.findOne({
			_id: transferObj.character,
			AccountID: transferObj.accountID
		}, function(err, character) {
			if(err) {
				console.log(err);
				// Login.send.onLoginReply.call(socket, Login.LoginStatus.CannotAuthenticate);
				return;
			}

			if(!character){
				console.log("Character not found");
				return;
			}
			// socket.account.
			socket.character = character;
			socket.write('\x15');
		});
	}
});

World.recv.Auth = restruct.
	string('Username', 14).
	string('CharacterName', 13).
	int32lu('MapID').
	int32lu('Slot').
	int32lu('Unknown3').
	int32lu('Unknown4').
	int32lu('Unknown5').
	int32lu('Unknown6').
	int32lu('Unknown7').
	int32lu('Unknown8').
	int32lu('Unknown9').
	int32lu('Unknown10').
	int32lu('Unknown11').
	int32lu('Unknown12').
	int32lu('Unknown13').
	int32lu('Unknown14').
	int32lu('Unknown15').
	int32lu('Unknown16').
	int32lu('Unknown17').
	int32lu('Unknown18').
	int32lu('Unknown19').
	int32lu('Unknown20').
	int32lu('Unknown21').
	string('Unknown22', 3).
	int32lu('Unknown23').
	int8lu('UnknownByte', 1);

World.send.Auth = restruct.
	int8lu('PacketID').
	int8lu('unk').
	int32lu('YongpokFormation').
	int32lu('GuanyinStone').
	int32lu('FujinStone').
	int32lu('JinongStone').
	int32lu('YoguaiStone').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('IntensiveTraining').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk').
	int32lu('unk');

World.send.CharacterInfo = restruct.
	int8lu('PacketID').
	int8lu('Status').
	struct('character', structs.Character).
	int8lu('Unknown');

var Buff = restruct.
	int16lu('Amount').
	int16lu('Time');

var BuffHS = restruct.
	int8lu('Amount').
	int8lu('Stacks').
	int16lu('Time');


//Structs for all the World!
World.CharName_Length = 12;
World.UsernameLength = 13;
World.PasswordLength = 64;
World.AccountSecurityPinLength = 4;
//World.VersionRequired 60221 a much older version dakk's client is this
World.VersionRequired = 60322;
World.AccountSecurityPinLength = 4;
World.UserIDLength = 8 ;// a max length of 8 meens they are using unsigned long long or unsignedint64 a standard database entry for primary key :)
World.AvatarNameLength = 12;
World.IPAddressLength = 15;
World.GuildName_Length = 12;
World.GuildTag_Length = 12;
World.MessageLength = 50;
World.GiftCodeLength = 32;

World.MAX_SILVER = 2147483647;

World.send.PersonalShopItem = restruct.
	int32lu('ID').
	int32lu('Unk').
	int32lu('Amount').
	int32lu('Price').
	int8lu('Enchant').
	int8lu('Combine').
	int16lu('Unknown');

World.send.Compress_Hairer = restruct.
    int8lu('packetID').
    int8lu('isCompressed');

World.send.Action = restruct.
    int32lu('CharacterID').
    int32lu('UniqueID').
    string('Name', World.CharName_Length+1).
    string('Demostrater', World.CharName_Length+1).
    string('Child', World.CharName_Length+1).
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
    string('GuildName', World.GuildName_Length+1).
    int8lu('', 3).
    int32lu('LeaderFlag').
    int8lu('LeaderSubFlag').
    int8lu('', 15).
    // string('GuildName2',World.GuildName_Length+1).

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
    struct('StoreItems', World.send.PersonalShopItem, 25).
    int8lu('Unk1', 8).
    int32lu('').
    int32lu('Unk1', 1).
    int32lu('Unk1', 1). // 130
    int32lu('Unk1', 1).
    int32lu('Unk1', 1).
    int32lu('Unk1', 1).
    int32lu('Unk1', 1).
    int32lu('Unk1', 1). // 135
    int32lu('Unk1', 1).
    int32lu('Unk1', 1).
    int32lu('Unk1', 1);

WorldPC.Set(0x02, {
	Restruct: World.recv.Auth,
	function: function World_Login(socket, input) {
		console.log("World login", input);

		socket.character.state = new CharacterState();
		socket.character.infos = new CharacterInfos(socket);
		// socket.character.state.setAccountID(socket.account._id);
		socket.character.state.setCharacterID(socket.character._id);
		socket.character.state.setFromCharacter(socket.character);
		socket.character.state.ToLocation = socket.character.state.Location;

		var CharacterData = new Buffer(World.send.CharacterInfo.pack({
			PacketID: 0x16,
			Status: 0,
			character: socket.character,
			Unknown: 0x00
		}));

		socket.write(CharacterData);

		var WorldAuthData = new Buffer(World.send.Auth.pack({
			PacketID: 0x17
		}));

		socket.write(WorldAuthData);
		socket.write(socket.character.state.getPacket());
	}	
});