
// WorldPC.onLoginWorldPacket

var testpacket = restruct.
int8lu('PacketID').
int8lu('unk').
int32lu('YongpokFormation').
int32lu('GuanyinStone').
int32lu('FujinStone').
int32lu('JinongStone').
int32lu('YoguaiStone').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('IntensiveTraining').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk').
int32lu('unk');

console.log(testpacket.size);

GMCommands.AddCommand(new Command('world',0,function command_send(string,client){
	var WorldDataPacket = new Buffer(testpacket.pack({
		PacketID: 0x17,
		YongpokFormation: 0,
		GuanyinStone: 0,
		FujinStone: 0,
		JinongStone: 0,
		YoguaiStone: 0,
		unk: 0,
		unk2: fillBuff,
		IntensiveTraining: 0
	}));

	client.write(WorldDataPacket);
}));