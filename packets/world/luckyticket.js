var onUseLuckyTicket = restruct.
int32lu('ItemIndex').
int32lu('SkillBookIndex').
int32lu('Unk3').
int32lu('Unk4');

var onLuckyTicketRespond = restruct.
int8lu('PacketID').
int8lu('Result').
int32lu('InvIndex').
int32lu('ItemID').
int32lu('Row').
int32lu('Column').
int32lu('Amount').
int32lu('Unk');

WorldPC.Set(0x42, {
	Restruct: onUseLuckyTicket,
	function: function(client, input){
		var item = client.character.Inventory[input.ItemIndex];


		// Todo: checks if usable and switch over a stuff

		client.write(new Buffer(onLuckyTicketRespond.pack({
			PacketID: 0x5B,
			Result: 0,
			InvIndex: input.ItemIndex,
			ItemID: 2,
			Row: item.Column,
			Column: item.Row,
			Amount: 11
		})));
	}
});