Login.IPAddressLength = 15;

Login.recv.GameStart = restruct.
	int32lu('MapID').
	int8lu('Slot').
	pad(8); // Probably a user id, but we dont really care about it.

Login.send.MapLoadReply = restruct.
	int8lu('packetID').
	int8lu("Status").
	string("IP", Login.IPAddressLength + 1).
	int32lu("Port");

LoginPC.Set(0x09, {
	Restruct: Login.recv.GameStart,
	function: function(socket, input){
		if(!socket.authenticated || socket.handleGameStart || socket.zoneTransfer) return;
			socket.handleGameStart = true;
		console.log('Game Start');
		//TODO: IP cleaning & translations
		if(!socket.characters[input.Slot]){
			console.log('Hack attempt, character slot not full with data.');
			socket.destroy();
			return;
		}

		socket.character = socket.characters[input.Slot];

		// TODO: Make sure that we send the player to right map if disconnected w/e.
		var transferObj = {
			username: socket.account.Username,
			accountID: socket.account._id,
			character: socket.character._id
		};


		// Get clients ip, check if it is on lan with server,
		// if so send it servers lan ip and port
		// otherwise send it real world ip and port
		var theIP = '';
		var socketIP = util.cleanIP(socket.remoteAddress);
		console.log('socket ip: '+socketIP);
		if (socketIP.indexOf('127') == 0) {
			theIP = '127.0.0.1'
		}

		if (theIP === '') {
			// Check local adapters
			var networkInterfaces = os.networkInterfaces();
			for (var name in networkInterfaces) {
				var n = networkInterfaces[name];
				for (var i = 0; i<n.length; i++) {
					var _if = n[i];
					if (_if.family === 'IPv4') {
						// If connecting on this interface then just set theIP to tell client to goto to be this one.
						if (socketIP === _if.address) {
							theIP = _if.address;
							break;
						}

						var netmask = new Netmask(_if.address+'/'+_if.netmask);
						if (netmask.contains(socketIP)) {
							theIP = _if.address;
							break;
						}
					}
				}
			}
		}

		if (theIP === '') {
			var natTranslations = config.network.natTranslations;
			for (var i = 0; i < natTranslations.length; i++) {
				var netmask = new Netmask(natTranslations[i].mask);
				if (netmask.contains(socketIP)) {
					theIP = natTranslations[i].ip;
					break;
				}
			}
		}

		if (theIP === '') {
			theIP = config.externalIP;
		}
		
		process.api.call('World', 'sendSocketToTransferQueue', transferObj);
		socket.zoneTransfer = true;
		console.log('Sending client to '+theIP);
		// Send the transfer to zone packet.
		Login.characterTransfer[socket.account.Username] = function() {
			socket.write(new Buffer(Login.send.MapLoadReply.pack({
					packetID: 0x0A,
					Status: 0,
					IP: theIP,
					Port: config.network.ports.world
			})));
		}
	}
});