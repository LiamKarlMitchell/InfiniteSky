vmscript.watch('Config/world.json');
vmscript.watch('Config/network.json');

vms('Zone', [
			'Config/world.json',
			'Config/network.json'
		], function() {


function ZoneInstance() {
	console.log('ZoneInstance Constructor called');
	fs = require('fs');
	util = require('./Modules/util.js');
	CachedBuffer = require('./Modules/CachedBuffer.js');
	PacketCollection = require('./Modules/PacketCollection.js');
	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');
	packets = require('./Helper/packets.js');
	nav_mesh = require('./Modules/navtest-revised.js');
	QuadTree = require('./Modules/QuadTree.js');
	Random = require("random-js");
	random = new Random(Random.engines.mt19937().autoSeed());
	clone = require('clone');
	bunyan = require('bunyan');

	vmscript.watch('./Generic');
	vmscript.watch('./Helper/GMCommands.js');

	this.initialized = false;
	this.packetCollection = null;
	this.socketTransferQueue = {};
	this.send = {};
	this.recv = {};
	this.id = parseInt(process.argv[2]);
	this.name = process.argv[3];
	this.display_name = process.argv[4] || ''+this.id;
	this.clean_name = this.display_name.replace(/[\s#@]/gi, '');
	this.AI = null;
	this.QuadTree = null;
	this.Clients = [];
	this.Npc = [];
	this.Items = [];
	this.NpcNodesHash = {};

	global.log = bunyan.createLogger({
		name: 'InfiniteSky/Zone.' + parseInt(process.argv[2]),
		streams: [{
			stream: process.stderr
		}]
	});

	util.setupUncaughtExceptionHandler(function(err){ log.error(err); });

}

if (!global.zonePrototype) {
	zonePrototype = ZoneInstance.prototype;
};

zonePrototype.init = function Zone__init() {
	var self = this;	
	// Only allow init once.
	if (this.inited) return;
	this.inited = true;
	this.packetCollection = new PacketCollection('ZonePC');
	global.ZonePC = this.packetCollection;
	Database(config.world.database.connection_string, function() {
		console.log("Zone database connected");
		self.databaseConnected = true;

		vmscript.watch('Database');
		vmscript.watch('Generic');

		vmscript.on([
			'Database',
			'Generic'
		], function() {
			function vmscript_WatchIfExists(path) {			
				fs.stat(path, function(err, stat) {
					if (err) {
						// Safe to ignore errors for this sometimes they wont exist.
						return;
					}

					vmscript.watch(path);
				})
			}

			vmscript_WatchIfExists('./Commands');
			vmscript_WatchIfExists('./Processes/Zone/Packets');
			vmscript_WatchIfExists('./Processes/Zone/Packets/'+self.id);
			vmscript_WatchIfExists('./Processes/Zone/Packets/'+self.clean_name);
			vmscript_WatchIfExists('./Processes/Zone/Commands');
			vmscript_WatchIfExists('./Processes/Zone/Commands/'+self.id);
			vmscript_WatchIfExists('./Processes/Zone/Commands/'+self.clean_name);
			vmscript_WatchIfExists('./Processes/Zone/Scripts/'+self.id);
			vmscript_WatchIfExists('./Processes/Zone/Scripts/'+self.clean_name);

		});
	});

	// Load Navigation Mesh
	var mesh_path = config.world.data_path + "navigation_mesh/" + this.name + '.obj';
	fs.stat(mesh_path, function(err) {
		if (err) {
			// TODO: Add excpetion handler if we have no mesh to set the dimensions for quadtree.
			self.QuadTree = new QuadTree({
				x: -10000,
				y: -10000,
				size: 10000
			});
			return;
		}
		self.AI = new nav_mesh(mesh_path, function(mesh) {
			var height = Math.abs(mesh.dimensions.bottom) + Math.abs(mesh.dimensions.top);
			var width = Math.abs(mesh.dimensions.right) + Math.abs(mesh.dimensions.left);

			self.QuadTree = new QuadTree({
				x: util.roundDivisable(mesh.dimensions.left, 2),
				y: util.roundDivisable(mesh.dimensions.top, 2),
				size: util.roundDivisable(Math.max(width, height), 2)
			});
		});
	});

	// Setup listener for process messages
	process.on('message', function(arg1, arg2) {
		self.onProcessMessage(arg1, arg2);
	});
};

zonePrototype.addSocket = function(socket) {
	if (!this.QuadTree) {
		console.log("QuadTree is not initialized");
		return false;
	} else {
		// this.Clients.push(socket);

		// Attach functions to the socket here
		// TODO: See if we can get this to work prototype like.
		socket.sendInfoMessage = function(type, message) {
			if (arguments.length === 1) {
				message = type;
				type = ':INFO';
			}
			ZonePC.sendMessageToSocket(this, type, message);
		};
		
		socket.unhandledPacket = function(message) {
			ZonePC.sendMessageToSocket(this, ':WARN', 'Unhandled Packet: '+message);
		}

		socket.node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({
			object: socket,
			update: function(node, delta) {
				return {
					x: this.character.state.Location.X,
					y: this.character.state.Location.Z,
					size: this.character.state.Level
				};
			},
			type: 'client'
		}));
		socket.character.state.NodeID = socket.node.id;
		return true;
	}
};

zonePrototype.broadcastStates = function(client) {
	var found = Zone.QuadTree.query({
		CVec3: client.character.state.Location,
		radius: config.network.viewable_action_distance,
		type: ['npc', 'item']
	});
	for (var i = 0; i < found.length; i++) {
		var f = found[i];
		client.write(f.object.getPacket());
	}
};

zonePrototype.sendToAllArea = function(client, self, buffer, distance) {
	var found = this.QuadTree.query({
		CVec3: client.character.state.Location,
		radius: distance,
		type: ['client']
	});
	for (var i = 0; i < found.length; i++) {
		var f = found[i];
		if (!self && f.object === client) continue;
		if (f.object.write) f.object.write(buffer);
	}
};

zonePrototype.sendToAllAreaClan = function(client, self, buffer, distance, clan){
	if (clan === undefined) {
		clan = client.character.Clan;
	}
    var found = this.QuadTree.query({ CVec3: client.character.state.Location, radius: distance, type: ['client'] });
    for(var i=0; i<found.length; i++){
        var f = found[i];
        if(!self && f.object === client) continue;
        if (f.object.character.Clan !== clan) continue;
        if(f.object.write) f.object.write(buffer);
    }
};

zonePrototype.onFindAccount = function(socket, err, account) {
	socket.account = account;
}


zonePrototype.onProcessMessage = function(type, socket) {
	if (socket) switch (type) {
		case 'socket':
			// console.log(socket);
			socket.on('close', function(err) {});
			socket.on('error', function(err) {});
			socket.on('timeout', function() {});

			var hash = socket.remoteAddress + ":" + socket.remotePort;
			var characterData = this.socketTransferQueue[hash];
			if (!characterData) {
				console.log("could not retrive character data.");
				socket.destroy();
				return;
			}

			delete this.socketTransferQueue[hash];

			var self = this;
			db.Character.findOne({
				_id: characterData.id,
				AccountID: characterData.accountID
			}, function(err, character) {
				console.log("got character");
				if (err) {
					// console.log(err);
					// TODO: Consider socket.disconnect 
					socket.destroy();
					return;
				}

				if (!character) {
					// console.log("Character not found");
					socket.destroy();
					return;
				}

				// Get account details
				db.Account.findOne({_id: characterData.accountID},function(err, account) {
					return self.onFindAccount(socket, err, account);
				});
				
				socket.character = character;
				socket.character.infos = new CharacterInfos(socket);
				socket.character.infos.updateAll(function() {
					socket.character.state = new CharacterState();
					socket.character.state.setAccountID(socket.character.AccountID);
					socket.character.state.setCharacterID(socket.character._id);
					socket.character.state.setFromCharacter(socket.character);

					self.addSocket(socket);


					CachedBuffer.call(socket, self.packetCollection);
					Zone.sendToAllArea(socket, true, socket.character.state.getPacket(), config.network.viewable_action_distance);
				});
			});

			break;
	} else switch (type.type) {
		case 'character':
			this.socketTransferQueue[type.data.hash] = type.data;
			break;
	}
};

if (!global.Zone) {
	global.Zone = new ZoneInstance();
	Zone.init();
}
});
