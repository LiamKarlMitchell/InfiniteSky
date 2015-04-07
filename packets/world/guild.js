// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder


// } // 116 Guild Info Packet/Request/Create);
// 	handleGuildPacket.call(this, data.slice(8));
// break;
// PacketCollection.Set(0x8F,{
// 	function: function(socket, data) {

// 	}
// } // 143 Guild Info Request packet);
// 	handleGuildInfoRequestPacket.call(this, data.slice(8));
// break;


// PacketCollection.Set(0x1F,{
// 	function: function(socket, data) {

// 	}
// } // Guild Invite);
// 	handleGuildInvitePacket.call(this, data.slice(8));
// break;

// GuildCreated = restruct.
// int8lu('PacketID'). // 0x54
// int32lu('Status').  // 0x09
// string('Name',packets.CharName_Length+1).
// string('ClanName',packets.CharName_Length+1).
// pad(74);

// GuildCreatePacket = restruct.


// PacketCollection.Set(0x74,{
// 	Restruct: ,
// function: function RequestCreateGuild(socket, data) {
  
// }
// });

var RestructCreateGuildRequest = restruct.
int8lu('Action').
string('Name', 13).
string('GuildName', 13).
int32lu('Unk', 70).
int8lu('Unk2', 2);

var CreateRespond = restruct.
int8lu('PacketID').
int8lu('Result').
string('GuildName', 13).
int8lu('Unk').
int8lu('Unk1').
int8lu('Unk2').
int32lu('GuildLevel').
int32lu('Reputation').
string('LeaderName', 13).
pad(26).
string('MemberName', 13, 50).
int32bs('Privileges', 50).
int8lu('test', 455);

var res8f = restruct.
string('Name', 13).
int32lu('Unk').
int32lu('Unk2');

var be_packet = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Result').
int32lu('MapID').
int32lu('Unk2').
int32lu('Unk3').
int32lu('Unk4');

var onFlagPress = restruct.
int32lu('Action').
int32lu('Unk').
int32lu('Unk2').
int32lu('Unk3');

var onUseAccessoryOrInsignia = restruct.
int16lu('Unk2', 2).
int8lu('Unk1').
int32lu('Unk3').
int32lu('LevelRequired').
int32lu('Unk5').
int32lu('Unk6').
int32lu('Unk7').
int32lu('Unk8').
int32lu('Unk9');

// pad(33);\

// console.log(onUseAccessoryOrInsignia.size);
var accessoryReply = restruct.
int8lu('PacketID').
int32lu('ItemID').
int32lu().
int32lu();

var InventoryTopDot = restruct.
int32lu('Unk').
int32lu('Unk2').
int32lu('Unk3');

WorldPC.Set(0x51, {
	Restruct: InventoryTopDot,
	function: function(client, input){
		console.log(input);
	}
});

// Also sent when activating a costume to bind it to the character

//5E 33 00 11 00 00 00 E9 78 33 01 00 00 00 00 D1
//07 00 00 00 00 00 00 00 00 00 00               

// Dressing in clothes
// 91 0300 0000 0000 0000
var clothingRequest = restruct.
int32lu('Key').
int32lu('Value');

WorldPC.Set(0x91, {
	Restruct: clothingRequest,
	function: function(client, input) {
		console.log('Clothing Request:',input);

		switch (input.Key) {
			case 2:
			console.log('Select');
			break;
			case 3:
			console.log('Dress');
			break;
			default: 
			console.log('Unknown Key: '+input.Key);
			break;
		}

	}
})

// Registered Clothes
// 5E 33 00 11 00 00 00 E9 78 33 01 00 00 00 00 D1
// 07 00 00 00 00 00 00 00 00 00 00
// PacketID
// Type
// 

// Fortune Cookie used
// 5E 35 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00 00 00 00 00 00 00


// Obtained silver coins Date is the amount :(
// 5E 01 00 00 00 00 00 D9 27 00 00 00 00 00 00 D1
// 07 00 00 00 00 00 00 00 00 00 00i 


var itemRegisterUse = restruct.
int8lu('PacketID').
int8lu('Type'). // 51 is Register Clothes
int8lu('Unknown1').
int32lu('Unknown2').
int32lu('Duration'). // Game has a custom date format here Example: 20150201 YYYYMMDD but stored as an unsigned int
int32lu('Unknown3').
int32lu('ItemID').
int32lu('Unknown4').
int32lu('Unknown5');

WorldPC.Set(0x43, {
	Restruct: onUseAccessoryOrInsignia,
	function: function(client, input){
		console.log("Starting debug of Accessory use or Guild Insignia");
		console.log(input);
		// client.write(new Buffer(accessoryReply.pack({
		// 	PacketID: 0x7E,
		// 	ItemID: 99180
		// })));
	}
});

var ResultFail = function(client, input){
	client.write(new Buffer(CreateRespond.pack({
		PacketID: 0x9D,
		GuildName: input.CharacterName,
		Result: 1
	})));
}

WorldPC.Set(0x74, {
	Restruct: packets.GuildPacket,
	function: function RequestCreateGuild(client, input){
		switch(input.Action){

			// Create guild request
			case 1:
			if(world.findGuildByName(input.GuildName)){
				console.log("Guild exists");
				ResultFail(client, input);
				return;
			}

			var newGuild = new db.Guild();

			newGuild.Name = input.GuildName;
			newGuild.Level = 1;
			newGuild.hasGuildEmblem = false; // Consider changing this field to `hasEmblem`
			newGuild.Members = [
				{
					Name: client.character.Name,
					LeaderFlag: 2 // 2 = master, 1 = Assistant, 0 = Member
				}
			];

			newGuild.save()

			var gObj = newGuild;
            world.guilds[gObj.Name] = gObj;

            world.guildBindFunctionsOnCreate(world.guilds[gObj.Name]);

			client.write(new Buffer(CreateRespond.pack({
				PacketID: 0x9D,
				GuildName: input.CharacterName
			})));


		    client.character.state.GuildName = input.GuildName;
		    client.character.state.LeaderFlag = 0;
		    client.character.state.LeaderSubFlag = 0;

			client.character.GuildName = input.GuildName;
		    client.character.Guild = newGuild;
		    client.character.GuildMemberObj = newGuild.Members[0]; // To consideration

			client.character.save();
			break;





			// On "G" press, aka Request Guild Window
			case 2:
			console.log("Opening guild window is not yet implemented");
			// be, response for sending guildies

			if(!client.character.GuildName || !world.findGuildByName(client.character.GuildName) || !world.findGuildByName(client.character.GuildName).isMember(client) || !client.character.Guild || !client.character.GuildMemberObj){
				ResultFail(client, input);
				return;
			}

			
			var memberArray = [];
			var privilegesArray = [];
			var leaderName = null;

			for(var i=0; i < client.character.Guild.Members.length; i++){
				var member = client.character.Guild.Members[i];
				if(!member) continue;

				if(member.LeaderFlag === 2){
					leaderName = member.Name;
				}

				memberArray[i] = member.Name;
				privilegesArray[i] = member.LeaderFlag === 0 ? 2 : member.LeaderFlag === 2 ? 0 : 1;
			}


			var buf = new Buffer(CreateRespond.pack({
				PacketID: 0x9D,
				Result: 0, // 0 For Success
				GuildName: client.character.GuildName,
				LeaderName: leaderName,
				GuildLevel: client.character.Guild.Level,
				Reputation: 0,
				MemberName: memberArray,
				Privileges: privilegesArray
			}));

			client.write(buf);
			break;

			case 6:
			console.log("Disband the guild");
			break;
		}
	}
});


WorldPC.Set(0x3F, {
	Restruct: restruct.string('Name', 13).pad(8),
	function: function(client, input){
		console.log("Inviter: "+client.character.Name);
		var findPlayer = world.findCharacterSocket(input.Name);
		if(!findPlayer){

			return;
		}

		var response = restruct.
		int8lu('PacketID').
		string('InvitedBy', 13);

		findPlayer.write(new Buffer(response.pack({
			PacketID: 0x58,
			InvitedBy: client.character.GuildName
		})));
	}
});

var inviteGuildRespond = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Result');

// console.log(inviteGuildRespond.size);

var inviteClientRespond = restruct.
int8lu('PacketID').
int32lu('Switch').
string('Inviter', 13).
string('GuildName', 13).
pad(74);

// console.log(inviteClientRespond.size);

WorldPC.Set(0x41, {
	Restruct: restruct.string('GuildName', 13).int8lu('Result').pad(8),
	function: function(client, input){
		var guildObj = world.findGuildByName(input.GuildName);
		var leaderObj = guildObj.getLeader();
		var inviter = world.findCharacterSocket(leaderObj.Name);

		if(!guildObj){
			inviter.write(new Buffer(inviteGuildRespond.pack({
				PacketID: 0x5A,
				Name: client.character.Name,
				Result: 1
			})));
			return;
		}

		if(input.Result){
			inviter.write(new Buffer(inviteGuildRespond.pack({
				PacketID: 0x5A,
				Name: client.character.Name,
				Result: 1
			})));
			return;
		}

		if(!leaderObj){
			inviter.write(new Buffer(inviteGuildRespond.pack({
				PacketID: 0x5A,
				Name: client.character.Name,
				Result: 1
			})));
			return;
		}

		inviter.character.Guild.addMember(client);

		inviter.write(new Buffer(inviteGuildRespond.pack({
			PacketID: 0x5A,
			Name: client.character.Name,
			Result: 0
		})));

        client.character.state.LeaderFlag = 1;
        client.character.state.LeaderSubFlag = 3;

        client.character.GuildName = inviter.character.GuildName;


        client.character.state.setFromCharacter(client.character);

		client.write(new Buffer(inviteClientRespond.pack({
			PacketID: 0x54,
			Switch: 10,
			Inviter: inviter.character.Name,
			GuildName: inviter.character.GuildName
		})));


		var buf = new Buffer(CreateRespond.pack({
			PacketID: 0x9D,
			Result: 0, // 0 For Success
			GuildName: inviter.character.GuildName,
			LeaderName: inviter.character.Name,
			GuildLevel: inviter.character.Guild.Level,
			Reputation: 0,
			MemberName: [],
			Privileges: []
		}));

		inviter.write(buf);

		// console.log("Inviter: "+client.character.Name);
		// var findPlayer = world.findCharacterSocket(input.Name);
		// if(!findPlayer){

		// 	return;
		// }

		// var response = restruct.
		// int8lu('PacketID').
		// string('InvitedBy', 13);

		// findPlayer.write(new Buffer(response.pack({
		// 	PacketID: 0x58,
		// 	InvitedBy: client.character.GuildName
		// })));
	}
});

WorldPC.Set(0x5E, {
	Restruct: onFlagPress,
	function: function(client, input){
		console.log(input);
	}
});

var onChiefBox = restruct.
string('GuildName', 13).
int32lu('Unk').
int32lu('Unk1');

var onClanBox = restruct.
string('GuildName', 13).
int32lu('Unk').
int32lu('Unk1');

WorldPC.Set(0x88, {
	Restruct: onChiefBox,
	function: function(client, input){
		console.log(input);
	}
});

WorldPC.Set(0x89, {
	Restruct: onClanBox,
	function: function(client, input){
		console.log(input);
	}
});

WorldPC.Set(0x8F, {
	Restruct: res8f,
	function: function(client, input){
		var findPlayer = world.findCharacterSocket(input.Name);

		var buf2 = new Buffer(be_packet.pack({
			PacketID: 0xBE,
			Name: input.Name,
			Result: findPlayer ? 0 : 1,
			MapID: findPlayer ? findPlayer.character.MapID : 0,
			Unk2: 0,
			Unk3: 0,
			Unk4: 0
		}));

		client.write(buf2);
	}
});