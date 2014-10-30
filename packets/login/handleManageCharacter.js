// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

LoginPC.CharName_Length = 12;

LoginPC.CharacterDeletePacketReply = restruct.
int8lu('packetID').
int8lu("Status");

LoginPC.Value = restruct.
	int8lu('PacketID').
	int32ls('Value');

LoginPC.KeyValue = restruct.
	int8lu('PacketID').
	int32lu('Key').
	int32ls('Value');

LoginPC.CharacterCreateReplyPacket = restruct.
	int8lu('packetID').
	int8lu("Status").
	struct("Character",structs.Character).
	int8lu("Unknown");

LoginPC.Set(0x06, {
	Restruct: restruct.
	int8lu('Slot').
	int32lu('Clan').
	string('Name', LoginPC.CharName_Length + 1).
	int32lu('Gender').
	int32lu('Hair').
	int32lu('Face').
	int8lu('Ignore', 84).
	int32lu('WeaponID').
	int8lu('Ignore2', 52),
	function: function CharacterCreate(socket,create) {
	if (socket.authenticated == false || !socket._handle) return;
		var status = 0;
		// Status:
		// 0 - Success
		// 1 - Failed to create character
		// 2 - Character name in use
		// 3 - Cannot create a character of another clan

		// TODO: Send back error codes correctly when script malfunctions.
		// Wrap in try catch? Send Game Error packet??


		function sendCharacterCreateReply(status) {
			// send the reply
			var createdcharacter = {};
			// If everything went okay
			if (status == 0) {
				// Get the character.
				createdcharacter = socket.characters[create.Slot];
			}

			//console.log('Status is ' + status);
			//console.log(createdcharacter);

			socket.write(
			new Buffer(LoginPC.CharacterCreateReplyPacket.pack({
				packetID: 0x07,
				Status: status,
				Character: createdcharacter
			})));
		}

		console.log("Account %s wants to create a character named %s on slot %d", socket.account.Username, create.Name, create.Slot);

		if (create.Slot >= 3) {
			console.log('Invalid Slot');
			return;
		}

		// Make sure the slot is empty
		if (typeof(socket.characters[create.Slot]) != 'undefined') {
			console.log('Hack attempt trying to create character on slot with existing character in it');
			return;
		}

		// Could get all the vars and pass them in here.
		var newCharacter = new db.Character();

		// console.log('newCharacter.updateInfos: '+typeof(newCharacter.updateInfos));
		newCharacter.Name = create.Name;
		// Check create.Name for invalid characters here
		console.log('TODO: Code in checking name for invalid characters/words');
		newCharacter._id = 0;
		newCharacter.AccountID = socket.account._id;
		newCharacter.ServerName = config.server_name;

		// Checking if able to create character of this clan
		if (config.SingleClanOnly && socket.account.Level < 80) {
			for (var i = 0; i < socket.characters.length; ++i) {
				if (socket.characters[i].Clan != create.Clan) {
					status = 3;
					sendCharacterCreateReply(status);
					return;
				}
			}
		}
		//console.log('Checking if character name already in use');
		// Check if name already exists
		// If name already exists
		db.Character.findOne({
			Name: create.Name,
			ServerName: config.server_name
		}, function(err, character) {
			if (err) {
				console.log(err);
				return;
			}

			if (character) {
				// Character name already in use
				//console.log('Character name in use');
				status = 2;
				sendCharacterCreateReply(status);
				return;
			}

			console.log('Character name free to use')
			if (create.Clan >= 3) {
				//console.log('Invalid Clan');
				status = 1;
				sendCharacterCreateReply(status);
				return;
			}

			// Set clan
			newCharacter.Clan = create.Clan;

			// Get clan name, Because Ryan no likey using 0 1 2 to define the new character things in json :D
			var ClanName = config.Clans[create.Clan];
			console.log('Clan: '+ClanName);

			//console.log("Wants to create character of clan %s", ClanName);
			// Merge the newcharacter template info from json file into newCharacter
			// TODO: Move new character config setting into Character.js
			// Then we could do away with extend?
			// console.log('newCharacter.updateInfos: '+typeof(newCharacter.updateInfos));
			//newCharacter = extend(newCharacter, util.newcharacterconfig[ClanName]);
			
			var newcharcfg = infos.NewCharacter[ClanName];
			for (var thing in newcharcfg) {
				if (newcharcfg.hasOwnProperty(thing)) {
					// Check for invalid things that should not be copied over?
					// Accept characters value first?
					newCharacter[thing] = newcharcfg[thing];
				}
			}
			// console.log('newCharacter.updateInfos: '+typeof(newCharacter.updateInfos));

			// Set values that can not be overwritten here.
			// Check Hair and Face for each clan
			var HairMax = 0;
			var FaceMax = 0;
			var WeaponMin = 0;
			var WeaponMax = 0;
			switch (ClanName) {
			case 'Guanyin':
				HairMax = 15;
				FaceMax = 6;
				WeaponMin = 5;
				WeaponMax = 7;
				break;
			case 'Fujin':
				HairMax = 15;
				FaceMax = 6;
				WeaponMin = 11;
				WeaponMax = 13;
				break;
			case 'Jinong':
				HairMax = 13;
				FaceMax = 13;
				WeaponMin = 17;
				WeaponMax = 19;
				break;
			}

			// If hair and face are invalid choices
			if (create.Hair > HairMax && create.Face > FaceMax) {
				//console.log('Invalid Hair or Face');
				status = 4;
				sendCharacterCreateReply(status);
				return;
			}

			// If weapon does not match
			// console.log('WeaponMin: ' + WeaponMin + ' WeaponMax: ' + WeaponMax + 'WeaponID: ' + create.WeaponID);
			if (create.WeaponID < WeaponMin || create.WeaponID > WeaponMax) {
				//console.log('Invalid Weapon');
				status = 5;
				sendCharacterCreateReply(status);
				return;
			}

			// Set our values
			newCharacter.Hair = create.Hair;
			newCharacter.Face = create.Face;

			// console.log(newCharacter);

			newCharacter.Weapon = {
				ID: create.WeaponID,
				Enchant: 0,
				Combine: 0
			};

			if (create.Gender == 0) {
				//console.log("Male");
				newCharacter.Gender = 0;
			} else {
				//console.log("Female");
				newCharacter.Gender = 1;
			}

			// newCharacter.updateInfos(true);
			// newCharacter.Health = newCharacter.infos.HP;
			// newCharacter.Chi = newCharacter.infos.Chi;

			db.getNextSequence('characterid', function(id) {
				newCharacter._id = id;
				newCharacter.save();
				socket.characters[create.Slot] = newCharacter;
				sendCharacterCreateReply(status);
			});

		});

	}
});

LoginPC.Set(0x07, {
	Restruct: restruct.
	int8lu('Slot').
	int32lu('Clan').
	string('Namepart', LoginPC.CharName_Length - 8),

	function: function CharacterDelete(socket,packet) {
		if (socket.authenticated == false || !socket._handle) return;
		var status = 0;
		if (packet.Slot < 3) {

			if (packet.Slot + 1 <= socket.characters.length) {
				if (typeof(socket.characters[packet.Slot]) == 'undefined') {
					console.log("ERROR: !!!! Character not defined");
					return; // shit bricks
				}

				var tempchar = socket.characters[packet.Slot];

				//console.log("Account %s wants to delete character %s on slot %d", socket.account.name, tempchar.Name, packet.Slot);

				// Also remove it from Clans and shit...
				tempchar.remove();

				// Removed from db
				delete socket.characters[packet.Slot];
				// TODO: Is this saving straight away? does not seem like it please make it do so.
				//delete tempchar; // Delete the tempchar to help the garbage collector here
				//console.log('deleted');

				//Reply to client saying character deleted
				socket.write(
				new Buffer(LoginPC.CharacterDeletePacketReply.pack({
					packetID: 0x08,
					Status: status
				})));
			}

		}
	}
});

// Still need to find rename or change gender things and server transfer