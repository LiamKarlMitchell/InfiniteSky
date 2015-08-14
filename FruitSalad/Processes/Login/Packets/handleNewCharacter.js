Login.CharacterNameLength = 12;

Login.recv.characterCreate = restruct.
	int8lu('Slot').
	int32lu('Clan').
	string('Name', Login.CharacterNameLength + 1).
	int32lu('Gender').
	int32lu('Hair').
	int32lu('Face').
	pad(84).
	int32lu('WeaponID').
	pad(52);

Login.send.characterCreate = restruct.
	int8lu('packetID').
	int8lu("Status").
	struct("Character", structs.Character).
	int8lu("Unknown");

Login.send.characterCreateReply = function(status, character){
	this.write(
	new Buffer(Login.send.characterCreate.pack({
		packetID: 0x07,
		Status: status,
		Character: character ? character : {}
	})));
};

LoginPC.Set(0x06, {
	Restruct: Login.recv.characterCreate,
	function: function(socket, input){
		if(socket.characters.length === 3){
			console.log("Cannot create more than 3 characters");
			Login.send.characterCreateReply.call(socket, 1); // Failed to create character
			return;
		}

		if(config.login.singleClanOnly){
			Login.send.characterCreateReply.call(socket, 3); // Cannot create character of another clan
			return;
		}

		if(input.Slot < 0 || input.Slot > 2){
			console.log("Slot out of bounds");
			Login.send.characterCreateReply.call(socket, 1); // Failed to create character
			return;
		}

		if(typeof socket.characters[input.Slot] !== 'undefined'){
			console.log('Hack attempt trying to create character on slot with existing character in it');
			Login.send.characterCreateReply.call(socket, 1); // Failed to create character
			return;
		}

		if(input.Clan < 0 || input.Clan > 2){
			console.log("Clan number doesnt exists");
			Login.send.characterCreateReply.call(socket, 1); // Failed to create character
			return;
		}

		if(input.Gender !== 0 && input.Gender !== 1){ // 0 - Male, 1 - Female
			console.log("Gender number doesnt exists");
			Login.send.characterCreateReply.call(socket, 1); // Failed to create character
			return;
		}

		db.Character.findOne({
			Name: input.Name,
			ServerName: config.world.server_name
		}, function(err, character) {
			if(err){
				console.log("Character create error");
				Login.send.characterCreateReply.call(socket, 1); // Failed to create character
				return;
			}

			if(character){
				console.log("Character that name already exists");
				Login.send.characterCreateReply.call(socket, 2); // Character name in use
				return;
			}

			var newCharacter = new db.Character();
			newCharacter.Name = input.Name;
			newCharacter.AccountID = socket.account._id;
			newCharacter.ServerName = config.world.server_name;
			newCharacter.Clan = input.Clan;
			newCharacter.Gender = input.Gender;

			var clanName = input.Clan === 0 ? 'Guanyin' : input.Clan === 1 ? 'Fujin' : 'Jinong';

			var newCharInfo = config.newCharacter[clanName];
			for (var info in newCharInfo) {
				newCharacter[info] = newCharInfo[info];
			}

			switch(input.Clan){
				case 0: // Guanyin
				if(input.Hair < 0 || input.Hair > 15){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Hair = input.Hair;

				if(input.Face < 0 || input.Face > 6){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Face = input.Face;

				if(input.WeaponID < 5 || input.WeaponID > 7){
					Login.send.characterCreateReply.call(socket, 5); // Failed to create character
					return;
				}

				newCharacter.Weapon = {
					ID: input.WeaponID
				};
				break;

				case 1: // Fujin
				if(input.Hair < 0 || input.Hair > 15){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Hair = input.Hair;

				if(input.Face < 0 || input.Face > 6){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Face = input.Face;

				if(input.WeaponID < 11 || input.WeaponID > 13){
					Login.send.characterCreateReply.call(socket, 5); // Failed to create character
					return;
				}

				newCharacter.Weapon = {
					ID: input.WeaponID
				};
				break;

				case 2: // Jinong
				if(input.Hair < 0 || input.Hair > 13){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Hair = input.Hair;

				if(input.Face < 0 || input.Face > 13){
					Login.send.characterCreateReply.call(socket, 4); // Failed to create character
					return;
				}

				newCharacter.Face = input.Face;

				if(input.WeaponID < 17 || input.WeaponID > 19){
					Login.send.characterCreateReply.call(socket, 5); // Failed to create character
					return;
				}

				newCharacter.Weapon = {
					ID: input.WeaponID
				};
				break;
			}


			// TODO (Ane): asd

			socket.character = newCharacter;

			var infos = new CharacterInfos(socket);
			infos.updateAll(function(){
				newCharacter.Health = infos.MaxHP;
				newCharacter.Chi = infos.MaxChi;

				db.getNextSequence('characterid', function(id){
					newCharacter._id = id;
					newCharacter.Slot = input.Slot;
					newCharacter.save(function(err){
						if(err){
							console.log(err);
							Login.send.characterCreateReply.call(socket, 1);
							return;
						}
						socket.characters[input.Slot] = newCharacter;
						Login.send.characterCreateReply.call(socket, 0, newCharacter); // Character created
					});
				});
			});
		});
	}
})
