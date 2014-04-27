// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.ChatPacketReply = restruct.
int8lu('PacketID').
string('Name', 13).
string('Message', 51);

WorldPC.ChatPacket = restruct.
string('Name', 13).
string('Message', 51).
int32lu('Unknown', 2);

WorldPC.GuildChatPacketReply = restruct.
string('Name', 13).
string('Guild', 13).
int32lu('Unknown0').
string('Message', 51);

WorldPC.FactionMessagePacket = restruct.
int8lu('PacketID').
int32lu('Unknown0').
string('Message', 51).
int32lu('Unknown123', 3);

WorldPC.WhisperChatPacket = restruct.
string('Name', 13).
string('NameTo', 13).
string('Message', 51);

WorldPC.WhisperChatStatus = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Status').
int32ls('ZoneID').
int32ls('Unknown2');

// Status:
// 0 nothing
// 1 disconnected
// 2 not same clan

// WorldPC.Set(0x06,{
// 	function: function(socket, data) {
// 		//console.log('Type: Faction Message');
// 	}
// });
WorldPC.Set(0x13, {
	Restruct: WorldPC.ChatPacket,

	function: function NormalChatRecv(socket, input) {

		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
			return;
		}
		console.log("[Normal] " + socket.character.Name + ": " + input.Message);

		socket.Zone.sendToAllClan(
		new Buffer(
		WorldPC.ChatPacketReply.pack({
			PacketID: 0x2A,
			Name: socket.character.Name,
			Message: input.Message
		})), socket.character.Clan);
	}
});

WorldPC.Set(0x3E, {
	Restruct: WorldPC.ChatPacket,

	function: function FactionChatRecv(socket, input) {

		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
			return;
		}
		console.log("[Faction] " + socket.character.Name + ": " + input.Message);

		socket.Zone.sendToAllClan(
		new Buffer(
		WorldPC.ChatPacketReply.pack({
			PacketID: 0x2A,
			Name: input.Name,
			Message: input.Message
		})), socket.character.Clan);
	}
});

WorldPC.Set(0x09, {
	Restruct: WorldPC.WhisperChatPacket,

	function: function WhisperChatRecv(socket, input) {

		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
			return;
		}
		console.log("[Whisper] " + socket.character.Name + ">" + input.NameTo + ": " + input.Message);

		var Other = world.findCharacterSocket(input.NameTo);
		if (Other) {
			if (
				(config.whisper_other_clan || false) == false &&
				Other.character.Clan != socket.character.Clan) {
				socket.write(new Buffer(WorldPC.WhisperChatStatus.pack({
					PacketID: 0x1D,
					Name: input.NameTo,
					Status: 2,
					ZoneID: -1,
					Unknown2: -1
				})));
			}
			Other.write(new Buffer(
			WorldPC.ChatPacketReply.pack({
				PacketID: 0x2A,
				Name: input.Name,
				Message: input.Message
			})));
		} else {
			socket.write(new Buffer(WorldPC.WhisperChatStatus.pack({
				PacketID: 0x1D,
				Name: input.NameTo,
				Status: 1,
				ZoneID: -1,
				Unknown2: -1
			})));
		}
	}
});

// Send guild chat to all in guild
// socket.Zone.sendToAllClan(
// 		new Buffer(
// 		WorldPC.GuildChatPacketReply.pack({
// 			PacketID: 0x22,
// 			Name: input.Name,
// 			Guild: socket.character.Clan,
// 			Message: input.Message
// 		})), socket.character.Clan);