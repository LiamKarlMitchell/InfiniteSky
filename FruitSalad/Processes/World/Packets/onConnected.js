World.send.InfoPacket = restruct.
    int8lu('packetID').
    string('encdata',16);

World.onConnected = function (socket) {
  console.log("On connected function");
	var packet = World.send.InfoPacket.pack({
		packetID: 0x00
	});

	socket.write(new Buffer(packet));
}
