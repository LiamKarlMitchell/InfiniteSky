// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// DUel invite pills allowed
//5175 6963 6f00 0000 0000 0000 0002 7bc4
//b4d9 0d42 e7df
// Can be used for Duel or party or guild etc
WorldPC.RequestPlayer = restruct.
string('Name', 13).
int32lu('Value1').
int32lu('Value2');

// Packet ID 30 0x1E
// Request Party
// 1e41 3364 0000 0000
// 0000 0000 0000 9c88 c4cd 290e 420e
// Use RequestPlayer packet
//Unhandled Packet ID 14
//00000000: 1e00 0000 1600 0000 0e54 6573 7465 7200  .........Tester.
//00000010: 0000 0000 0000 801d c40a 0048 420a       ......?.?..HB.
// Packet ID 32
// Duel Request pill use Avaliable
// 2054 6573 7465 7231
// 3233 0000 0000 0287 c418 280e 4242 2d
WorldPC.DuelRequestPillAvaliable = restruct.
int8lu('PacketID').
string('Name', 13).
int8lu('Mode');

// Packet ID 33
// Duel Request pill use Unavaliable
// 2154 6573 7465 7231
// 3233 0000 0000 5787 c42a 5f0e 4200
WorldPC.DuelAcceptDeny = restruct.
string('Name', 13).
int8lu('Denied').
int8lu('Value').
int32lu('').
int32lu('');

WorldPC.DuelAccept = restruct.
int8lu('PacketID').
string('Name',13).
int32lu('Denied').
int32lu('Value');

function handleDuelInvitePacket(socket, data) {
	socket.sendInfoMessage('Duel Invite too ' + data.Name);
	var other = socket.Zone.findCharacterSocket(data.Name);
	if (other) {
		// Check that the receipent is net.Socket(options);ot already in a duel
		// If they are not then send the request.
		//socket.sendInfoMessage('Other char ' + data.Name + ' found');
		socket.sendInfoMessage(socket.character.Name + ' trying to duel but its not coded yet.');
		other.sendInfoMessage(socket.character.Name + ' trying to duel you but its not coded yet.');
		// other.write(
		// new buffer(
		// WorldPC.DuelAccept.pack({

		// 	PacketID: 0x36,
		// 	Name: socket.character.Name,
		// 	Mode: data.Value1
		// }

		// )));

		// Request accepted
		//38 45 73 69 6D 75 00 00 00 00 00 00 00 00 00 02
		// Denied
		// 36
	} else {
		//socket.sendInfoMessage('Other char ' + data.Name + ' not found');
	}
};


function handleDuelAcceptDeny(socket, data) {
	socket.sendInfoMessage('Duel Accept/Deny too ' + data.Name);
	var other = socket.Zone.findCharacterSocket(data.Name);
	if (other) {
		other.sendInfoMessage('Duel Accept/Deny from ' + socket.character.Name);
		other.write(
		new buffer(WorldPC.DuelAcceptDeny.pack({
			PacketID: 0x38,
			Name: other.character.Name,
			Denied: data.Denied // 1 denied else accepted
		})));
	}
}

WorldPC.Set(0x20, { // Duel Invite Pills Allowed);
	Restruct: WorldPC.RequestPlayer,

	function: handleDuelInvitePacket
});

WorldPC.Set(0x21, { // Duel Invite Pills Disabled);
	Restruct: WorldPC.RequestPlayer,

	function: handleDuelInvitePacket
});

WorldPC.Set(0x22, { // Duel accept/deny
	Restruct: WorldPC.DuelAcceptDeny,

	function: handleDuelAcceptDeny
});


// WorldPC.ChatPacketReply = restruct.
// int8lu('PacketID').
// string('Name', 13).
// string('Message', 51);
// WorldPC.ChatPacket = restruct.
// string('Name', 13).
// string('Message', 51).
// int32lu('Unknown', 2);
// WorldPC.Set(0x13, {
// 	Restruct: WorldPC.ChatPacket,
// 	function: function(socket, input) {
// 		if (input.Message.indexOf('/') == 0) {
// 			GMCommand.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
// 			return;
// 		}
// 		console.log("[Normal] " + socket.character.Name + ": " + input.Message);
// 		socket.Zone.sendToAllClan(
// 		new buffer(
// 		WorldPC.ChatPacketReply.pack({
// 			PacketID: 0x2A,
// 			Name: input.Name,
// 			Message: input.Message
// 		})), socket.character.Clan);
// 	}
// });
// WorldPC.Set(0x3E, {
// 	Restruct: WorldPC.ChatPacket,
// 	function: function(socket, input) {
// 		if (input.Message.indexOf('/') == 0) {
// 			GMCommand.Execute(input.Message.substr(1), socket); // Need to remove the / so everything after it.
// 			return;
// 		}
// 		console.log("[Faction] " + socket.character.Name + ": " + input.Message);
// 		socket.Zone.sendToAllClan(
// 		new buffer(
// 		WorldPC.ChatPacketReply.pack({
// 			PacketID: 0x2A,
// 			Name: input.Name,
// 			Message: input.Message
// 		})), socket.character.Clan);
// 	}
// });