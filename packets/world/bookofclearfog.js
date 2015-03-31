var onUseBOOF = restruct.
int32lu('ItemIndex').
int32lu('SkillBookIndex').
int32lu('Unk3').
int32lu('Unk4');

var onUseBOOFRespond = restruct.
int8lu('PacketID').
int8lu('Result').
int32lu('ItemIndex').
int32lu('SkillBookIndex');

WorldPC.Set(0x3C, {
	Restruct: onUseBOOF,
	function: function(client, input){
		console.log(input);
		client.write(new Buffer(onUseBOOFRespond.pack({
			PacketID: 0x55,
			Result: 0,
			ItemIndex: input.ItemIndex,
			Honor: input.SkillBookIndex
		})));
	}
});