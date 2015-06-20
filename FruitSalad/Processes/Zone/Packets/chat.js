// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

Zone.send.chat = restruct.
int8lu('PacketID').
string('Name', 13).
string('Message', 51);

Zone.recv.chat = restruct.
string('Name', 13).
string('Message', 51).
int32lu('Unknown', 2);

Zone.recv.whisperChat = restruct.
string('Name', 13).
string('NameTo', 13).
string('Message', 51).
int32ls('Unknown1').
int32ls('Unknown2');

Zone.send.whisperStatus = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Status').
int32ls('ZoneID').
int32ls('Unknown2');

Zone.send.whisperChat = restruct.
int8lu('PacketID').
string('NameFrom', 13).
string('NameTo', 13).
string('Message', 51).
int32ls('Unknown1');

// Status:
// 0 nothing
// 1 disconnected
// 2 not same clan

// ZonePC.Set(0x06,{
// 	function: function(socket, data) {
// 		//console.log('Type: Faction Message');
// 	}
// });
ZonePC.sendMessageToSocket = function(socket,name,message) {
	socket.write(
		new Buffer(
			Zone.send.chat.pack({
				PacketID: 0x2A,
				Name: name,
				Message: message
			})
		)
	);
}

ZonePC.Set(0x13, {
	Restruct: Zone.recv.chat,

	function: function NormalChatRecv(socket, input) {
		log.trace('NormalChatRecv');
		try{
			if (input.Message.indexOf('/') === 0) {
				GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
				return;
			}
		}
		catch (e) {
			console.log(e.toString())
		}

		console.log("[Normal] " + socket.character.Name + ": " + input.Message);
		socket.sendInfoMessage('sup');

		Zone.sendToAllAreaClan(socket, true,
			new Buffer(
				Zone.send.chat.pack({
					PacketID: 0x2A,
					Name: socket.character.Name,
					Message: input.Message
				})
			), 400
		);
	}
});

ZonePC.Set(0x3E, {
	Restruct: Zone.recv.whisperChat,

	function: function FactionChatRecv(socket, input) {

		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
			return;
		}
		console.log("[Faction] " + socket.character.Name + ": " + input.Message);

		socket.Zone.sendToAllClan(
		new Buffer(
		Zone.send.chat.pack({
			PacketID: 0x2A,
			Name: input.Name,
			Message: input.Message
		})), socket.character.Clan);
	}
});

ZonePC.Set(0x09, {
	Restruct: ZonePC.WhisperChatPacket,

	function: function WhisperChatRecv(socket, input) {
        console.log("[Whisper] " + socket.character.Name + ">" + input.NameTo + ": " + input.Message);

		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
			return;
		}

		var other = world.findCharactersocket(input.NameTo);
		if (other) {
			if (
				(config.whisper_other_clan || false) === false &&
				other.character.Clan != socket.character.Clan) {
				socket.write(new Buffer(Zone.send.whisperStatus.pack({
					PacketID: 0x1D,
					Name: input.NameTo,
					Status: 2,
					ZoneID: -1,
					Unknown2: -1
				})));
			    return;
			}

			other.write(new Buffer(
			Zone.send.whisperChat.pack({
				PacketID: 0x20,
				NameFrom: socket.character.Name,
				NameTo: other.character.name,
				Message: input.Message
			})));

		} else {
			socket.write(new Buffer(Zone.send.whisperStatus.pack({
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
// 		ZonePC.GuildChatPacketReply.pack({
// 			PacketID: 0x22,
// 			Name: input.Name,
// 			Guild: socket.character.Clan,
// 			Message: input.Message
// 		})), socket.character.Clan);



// On packet id 0x13 size 72
// ZonePC.PossiblePartyChatMessage = restruct.
// string('Name', 13).
// string('Message', 51).
// int32lu('Unknown0').
// int32lu('Unknown1');