Zone.recv.ChatPacket = restruct.
	string('Name', 13).
	string('Message', 51).
	pad(8);


Zone.send.ChatPacket = restruct.
	int8lu('PacketID').
	string('Name', 13).
	string('Message', 51);

ZonePC.Set(0x13, {
	Restruct: Zone.recv.ChatPacket,
	function: function onNormalChat(client, input){
		if (input.Message.indexOf('/') === 0) {
			GMCommands.Execute(input.Message.substr(1), client); // Need to remove the / so everything after it.
			return;
		}

		var buffer = new Buffer(Zone.send.ChatPacket.pack({
			PacketID: 0x2A,
			Name: client.character.Name,
			Message: input.Message
		}));

        var found = Zone.QuadTree.query({ CVec3: client.character.state.Location, radius: config.network.viewable_action_distance, type: ['client'] });
        for(var i=0; i<found.length; i++){
            var f = found[i];
            if(f.object.write) f.object.write(buffer);
        }
	}
});