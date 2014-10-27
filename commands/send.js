// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: send
// Sends a packet to the client if it exists in data/packets/ extension of .pac not needed
GMCommands.AddCommand(new Command('send',0,function command_send(string,client){
	console.log('send packet used');
	if (string=='') string='t';
	fs.readFile('./data/packets/'+string+'.pac', function (err, data) {
		if (err)
		{
			//client.sendInfoMessage(err.message);
			if (string.length === 2) {
				var packetID = parseInt(string,16);
				if (!isNaN(packetID)) {
					client.write(new Buffer(1).writeUInt8(packetID,0));
					return;
				}
			}
			client.sendInfoMessage('Unable to send '+string+'.pac');
			return;
		}

		// Repeat for an optional third paramater of times to send?
		client.write(data);
		}
	);
}));

/////////////////////////////////////////////////////////////
// Command: send alias
GMCommands.AddCommand(GMCommands.getCommand('send').Alias('s'));