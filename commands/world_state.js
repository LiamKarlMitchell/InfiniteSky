// WorldPC.onLoginWorldPacket
var testpacket = restruct.
int8lu('PacketID').
int8lu('U2').
int32lu('YongpokFormation').
int32lu('GuanyinStone').
int32lu('FujinStone').
int32lu('JinongStone').
int32lu('YoguaiStone').
int32lu('U8').
int32lu('U9').
int32lu('U10').
int32lu('U11').
int32lu('U12').
int32lu('U13').
int32lu('U14').
int32lu('U15').
int32lu('U16').
int32lu('U17').
int32lu('U18').
int32lu('U19').
int32lu('U20').
int32lu('U21').
int32lu('U22').
int32lu('U23').
int32lu('U24').
int32lu('U25').
int32lu('U26').
int32lu('U27').
int32lu('U28').
int32lu('U29').
int32lu('U30').
int32lu('U31').
int32lu('U32').
int32lu('U33').
int32lu('U34').
int32lu('U35').
int32lu('U36').
int32lu('U37').
int32lu('U38').
int32lu('U39').
int32lu('U40').
int32lu('U41').
int32lu('U42').
int32lu('U43').
int32lu('U44').
int32lu('U45').
int32lu('U46').
int32lu('U47').
int32lu('U48').
int32lu('U49').
int32lu('U50').
int32lu('U51').
int32lu('U52').
int32lu('U53').
int32lu('U54').
int32lu('U55').
int32lu('U56').
int32lu('U57').
int32lu('U58').
int32lu('U59').
int32lu('U60').
int32lu('U61').
int32lu('IntensiveTraining').
int32lu('U63').
int32lu('U64').
int32lu('U65').
int32lu('U66').
int32lu('U67').
int32lu('U68').
int32lu('U69').
int32lu('U70').
int32lu('U71').
int32lu('U72').
int32lu('U73').
int32lu('U74').
int32lu('U75').
int32lu('U76').
int32lu('U77').
int32lu('U78').
int32lu('U79').
int32lu('U80').
int32lu('U81').
int32lu('U82').
int32lu('U83').
int32lu('U84').
int32lu('U85').
int32lu('U86').
int32lu('U87').
int32lu('U88').
int32lu('U89').
int32lu('U90').
int32lu('U91').
int32lu('U92').
int32lu('U93').
int32lu('U94').
int32lu('U95').
int32lu('U96').
int32lu('U97').
int32lu('U98').
int32lu('U99').
int32lu('U100').
int32lu('U101').
int32lu('U102').
int32lu('U103');

GMCommands.AddCommand(new Command('world',0,function command_send(string,client){
	var WorldDataPacket = new Buffer(testpacket.pack({
		PacketID: 0x17,
		YongpokFormation: 1,
		GuanyinStone: 1,
		FujinStone: 1,
		JinongStone: 1,
		YoguaiStone: 1,
		U2: 0,
		U8: 1,
		U9: 1,
		U10: 1,
		U11: 1,
		U12: 1,
		U13: 1,
		U14: 1,
		U15: 1,
		U16: 1,
		U17: 1,
		U18: 1,
		U19: 1,
		U20: 1,
		U21: 1,
		U22: 1,
		U23: 1,
		U24: 1,
		U25: 1,
		U26: 1,
		U27: 1,
		U28: 1,
		U29: 1,
		U30: 1,
		U31: 1,
		U32: 1,
		U33: 1,
		U34: 1,
		U35: 1,
		U36: 1,
		U37: 1,
		U38: 1,
		U39: 1,
		U40: 1,
		U41: 1,
		U42: 1,
		U43: 1,
		U44: 1,
		U45: 1,
		U46: 1,
		U47: 1,
		U48: 1,
		U49: 1,
		U50: 1,
		U51: 1,
		U52: 1,
		U53: 1,
		U54: 1,
		U55: 1,
		U56: 1,
		U57: 1,
		U58: 1,
		U59: 1,
		U60: 1,
		U61: 1,
		IntensiveTraining: 1,
		U63: 1,
		U64: 1,
		U65: 1,
		U66: 1,
		U67: 1,
		U68: 1,
		U69: 1,
		U70: 1,
		U71: 1,
		U72: 1,
		U73: 1,
		U74: 1,
		U75: 1,
		U76: 1,
		U77: 1,
		U78: 1,
		U79: 1,
		U80: 1,
		U81: 1,
		U82: 1,
		U83: 1,
		U84: 1,
		U85: 1,
		U86: 1,
		U87: 1,
		U88: 1,
		U89: 1,
		U90: 1,
		U91: 1,
		U92: 1,
		U93: 1,
		U94: 1,
		U95: 1,
		U96: 1,
		U97: 1,
		U98: 1,
		U99: 1,
		U100: 1,
		U101: 1,
		U102: 1,
		U103: 1
	}));

	client.write(WorldDataPacket);
}));