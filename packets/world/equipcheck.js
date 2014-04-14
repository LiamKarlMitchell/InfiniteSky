packets.EquipItem = restruct //TODO: Move that into structs?
	.int32lu('ID')
	.int32lu('Combine')
	.int32lu('Enchant');



// Description: This packet is used when Equip or Unequip items. When character equips or Unequip it needs a confirmation
// to allow user wear that item. Otherwise client automatically disallow the item to be weared or unequiped causing when any other action is taken.
// Obvserved: As I equip the weapon and press space, the Item disappears from my hands, and in inventory is still equiped.
// If I unequip the Pet, it disappears but when I take another action, the item appears on character, but its not equiped in character inventory.
WorldPC.Set(0x17, {
	Restruct: restruct.
			 struct('Equips',packets.EquipItem,9) // Size of 12 * 9
			.int32lu('Unknown1') //Size of 4
			.int32lu('Unknown2'), // Size of 4
	function: function EquipCheckRecv(socket, input) {
	    //TODO: Check the character state vs packet.input

	    socket.character.state.setFromCharacter(socket.character);
	}
});





// Unrecognized packed ID 24
// Is when a character state hasnt been updated and the item on the character appears to be incorect!