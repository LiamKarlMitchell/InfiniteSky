var LoginServerInfo_List = restruct.
int8lu('Unk').
int32lu('PlayerCount');

var LoginServerListInfoPacket = restruct.
int8lu('PacketID').
struct('Servers', LoginServerInfo_List, 4);

Login.onConnected = function (socket) {
	// var LoginServerInfo = new Buffer(21);
	// LoginServerInfo.fill(0);
	// LoginServerInfo.writeUInt32LE(5, 17); // Online Count.
	var srvs = [];
	srvs[0] = {
		Unk: 0,
		PlayerCount: 1000
	};
	var packet = LoginServerListInfoPacket.pack({
		PacketID: 0x00,
		Servers: srvs
	});
	socket.write(new Buffer(packet));
}