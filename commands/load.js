// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: save
// Command to force save of character
GMCommands.AddCommand(new Command('load',0,function command_load(string,client){
	client.sendInfoMessage('Loading your character from DB');


db.Character.find({
				//ServerName: config.server_name,
				_id: client.character._id
			}, function(error, characters) {
				if (error) {
					// Handle error here
					dumpError(error);
					return;
				}

				var charactersLength = typeof(characters) !== "undefined" ? characters.length : 0;
				if (charactersLength > 3) {
					console.log("Too many characters!~!!!");
					charactersLength = 3;
				}

				var s = client.character.state;
				client.character = characters[0];
				client.character.state = s;
				// client.character.updateInfos(true);
				client.character.infos = new generic.characterStatsInfoObj(client);
				client.character.infos.updateAll();
				client.character.state.setFromCharacter(client.character);

				clearTimeout(client.character.statsInterval);
				client.character.statsIntervalFunction = function(){
					var needUpdate = false;
					if(client.character.infos.MaxHP > client.character.state.CurrentHP){
						var HPTick = Math.round(client.character.infos.MaxHP / 100);
						client.character.state.CurrentHP = (client.character.state.CurrentHP+HPTick) > client.character.infos.MaxHP ? client.character.infos.MaxHP : (client.character.state.CurrentHP+HPTick);
						needUpdate = true;
					}

					if(client.character.infos.MaxChi > client.character.state.CurrentChi){
						var ChiTick = Math.round(client.character.infos.MaxChi / 100);
						client.character.state.CurrentChi = (client.character.state.CurrentChi+ChiTick) > client.character.infos.MaxChi ? client.character.infos.MaxChi : (client.character.state.CurrentChi+ChiTick);
						needUpdate = true;
					}

					if(needUpdate){
						client.send2FUpdate();
						client.character.save();
					}

					client.character.statsInterval = setTimeout(client.character.statsIntervalFunction, 5000);
				};

				client.character.statsInterval = setTimeout(client.character.statsIntervalFunction, 5000);

				// Send packet to client
				console.log('Sending WorldCharacterInfoPacket');

				var serverName = client.character.ServerName;

				if(client.account.CharacterIndividuals == undefined){
					client.account.CharacterIndividuals = {};
					client.account.markModified('CharacterIndividuals');
					client.account.save();
				}

				if(client.account.CharacterIndividuals[serverName] == undefined){
					client.account.CharacterIndividuals[serverName] = {};
					client.account.markModified('CharacterIndividuals');
					client.account.save();
				}

				if(client.account.CharacterIndividuals[serverName].Bank == undefined){
					var tempArray = [];
					for(var i=0; i< 56; i++){
						tempArray.push(null);
					}
					client.account.CharacterIndividuals[serverName].Bank = tempArray;
					client.account.markModified('CharacterIndividuals');
					client.account.save();

				}

				if(client.account.CharacterIndividuals[serverName].BankSilver == undefined){
					client.account.CharacterIndividuals[serverName].BankSilver = 0;
					client.account.markModified('CharacterIndividuals');
					client.account.save();
				}

				client.character.Bank = client.account.CharacterIndividuals[serverName].Bank;
				client.character.BankSilver = client.account.CharacterIndividuals[serverName].BankSilver;

				client.character.saveBank = function(){
					client.account.CharacterIndividuals[serverName].Bank = this.Bank;

					client.account.markModified('CharacterIndividuals');
					client.account.save();
				};

				client.character.saveBankSilver = function(){
					console.log(this.BankSilver);
					client.account.CharacterIndividuals[serverName].BankSilver = this.BankSilver;

					client.account.markModified('CharacterIndividuals');
					client.account.save();
				};

				//TODO: Make init function to initialize DB for character and fill the empty spaces if needed
				var storage = client.character.Storage;
				if(storage.length === 0){
					for(var i = 0; i < 28; i++){
						client.character.Storage.push(null);
					}

					client.character.markModified('Storage');
					client.character.save();
				}else if(storage.length > 28){
					var tempArray = [];
					for(var i = 0; i < 28; i++){
						tempArray.push(client.character.Storage[i]);
					}
					client.character.Storage = tempArray;
					client.character.markModified('Storage');
					client.character.save();
				}

				var prepareInventoryBuffer = structs.setInventoryStorageOnOffsets(
							new Buffer(WorldCharacterInfoPacket.pack({
								PacketID: 0x16,
								Status: 0,
								character: client.character,
								Unknown: 0x00
							})),
							350,
							client.character.Inventory,
							1666,
							client.character.Storage,
							3350,
							client.character.Bank
						);
				client.write(
					prepareInventoryBuffer
				);

				// TODO: Clean up this function, it should not need to define things like client.cahracter.saveBankSilver ?

				client.character.infos.updateAll();
				client.character.state.setFromCharacter(client.character);
				client.Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
			});
}));
