// # This one is from db/character
//var itemEquip = {
//	ID: Number,
//	Enchant: Number,
//	Combine: Number
//};

// # This one from generic/structs
//structs.Equipt= restruct.
//		int32lu('ID').
//		int32lu('RequiredHonor').
//		int8lu('Enchant'). // 1 = 3%
//		int8lu('Combine').
//		int16lu('Unknown');
//

//struct SendEquipmentInformation
//{
//	char PacketID;
//	sEquipItem Equips[9];
//};

// OK so in js when using restruct to make our structures
// DWORD is int32lu
// We can even put it right in there if used only once for example

packets.EquipItem = restruct
		.int32lu('ID')
.int32lu('Combine')
.int32lu('Enchant'); // 12 in length
// Packet actually has data of 116 in length
// 12 * 9 give us a size of  108
// 116 - 108 is 8
// that means two DWORD prehaps left over :)


// I think it was like This
// restruct.struct('Equips',packets.EquipItem,9)
// same as
// sEquipItem Equips[9];


// You can tidy up later to have it formatted how you like but having each struct data type entry on new line helps a lot :)
WorldPC.Set(0x17, {
	Restruct: restruct.
			 struct('Equips',packets.EquipItem,9) // Size of 12 * 9
			.int32lu('Unknown1') //Size of 4
			.int32lu('Unknown2'), // Size of 4
	function: function NormalChatRecv(socket, input) {
		// In here input.Equips will be array of our struct
		// so input.Equips[0] would be first equip etc.
		socket.sendInfoMessage('Work in Progress!');
		console.log('TODO: Handle EquipmentCheck packet!');
		console.log(input);

		// we do not know reply yet?
//		socket.send(
//		new Buffer(
//		WorldPC.ChatPacketReply.pack({
//			PacketID: 0x2A,
//			Name: socket.character.Name,
//			Message: input.Message
//		})), socket.character.Clan);
	}
});
