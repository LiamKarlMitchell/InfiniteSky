vmscript.watch('Config/world.json');
vmscript.watch('Config/network.json');

Database = require('./Modules/db.js');
CachedBuffer = require('./Modules/CachedBuffer.js');
PacketCollection = require('./Modules/PacketCollection.js');
restruct = require('./Modules/restruct');
packets = require('./Helper/packets.js');
clone = require('clone');
fs = require('fs');
nav_mesh = require('./Modules/navtest-revised.js');
QuadTree = require('./Modules/QuadTree.js');
util = require('./Modules/util.js');

log = {};
log.info = function(){
	console.log(arguments);
}

log.err = function(){
	console.log(arguments);
}

global.ZoneInstance = function(){
	this.recv = {};
	this.send = {};
	this.singletone = false;
	this.databaseConnected = false;
	this.id = parseInt(process.argv[2]);
	this.name = process.argv[3];
	this.packetCollection = null;
	this.socketTransferQueue = {};
	this.QuadTree = null;
	this.AI = null;
}

var zonePrototype = global.ZoneInstance.prototype;

zonePrototype.init = function(){
	var self = this;

	if(!this.databaseConnected)
		Database(config.world.database.connection_string, function(){
			console.log("Zone database connected");
			self.databaseConnected = true;

			vmscript.watch('Database');
			vmscript.watch('Generic');

			vmscript.on([
					'Database',
					'Generic'
				], function(){
					vmscript.watch('./Processes/Zone/Packets');
			});
		});

	if(this.singletone) return;
	this.singletone = true;
	var self = this;

	var mesh_path = config.world.data_path + "navigation_mesh/" + this.name + '.obj';

	fs.stat(mesh_path, function(err){
		if(err){
			// TODO: Add excpetion handler if we have no mesh to set the dimensions for quadtree.
			return;
		}
		self.AI = new nav_mesh(mesh_path, function(mesh){
			var height = Math.abs(mesh.dimensions.bottom) + Math.abs(mesh.dimensions.top);
			var width = Math.abs(mesh.dimensions.right) + Math.abs(mesh.dimensions.left);

			self.QuadTree = new QuadTree({
				x: util.roundDivisable(mesh.dimensions.left, 2),
				y: util.roundDivisable(mesh.dimensions.top, 2),
				size: util.roundDivisable(Math.max(width, height), 2)
			});
		});
	});


	this.packetCollection = new PacketCollection('ZonePC');
	global.ZonePC = this.packetCollection;
	process.on('message', function(arg1, arg2){
		self.onProcessMessage(arg1, arg2);
	});
};

zonePrototype.addSocket = function(socket){
	if(!this.QuadTree){
		console.log("QuadTree is not initialized");
		return false;
	}else{
		// this.Clients.push(socket);

		// Attach functions to the socket here
		// TODO: See if we can get this to work prototype like.
		// socket.sendInfoMessage = function(type, message) {
		// 	if (arguments.length === 1) {
		// 		message = type;
		// 		type = ':INFO';
		// 	}
		// 	ZonePC.sendMessageToSocket(this, type, message);
		// };
		//
		// socket.unhandledPacket = function(message) {
		// 	ZonePC.sendMessageToSocket(this, ':WARN', 'Unhandled Packet: '+message);
		// }

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

zonePrototype.broadcastStates = function(client){
  var found = Zone.QuadTree.query({ CVec3: client.character.state.Location, radius: config.network.viewable_action_distance, type: ['npc', 'item'] });
  for(var i=0; i<found.length; i++){
      var f = found[i];
      client.write(f.object.getPacket());
  }
};

ZoneInstance.prototype.sendToAllArea = function(client, self, buffer, distance){
  var found = this.QuadTree.query({ CVec3: client.character.state.Location, radius: distance, type: ['client'] });
  for(var i=0; i<found.length; i++){
      var f = found[i];
      if(!self && f.object === client) continue;
      if(f.object.write) f.object.write(buffer);
  }
};

zonePrototype.onProcessMessage = function(type, socket){
	console.log("Got process message");
	if(socket) switch(type){
		case 'world socket':
		// console.log(socket);
		socket.on('close', function(err){});
		socket.on('error', function(err){});
		socket.on('timeout', function(){});

		var hash = socket.remoteAddress + ":" + socket.remotePort;
		var characterData = this.socketTransferQueue[hash];
		if(!characterData){
			console.log("could not retrive character data.");
			socket.destroy();
			return;
		}

		delete this.socketTransferQueue[hash];


		// TODO: Finding account and setting the reference to the socket.
		// db.Account.findOne({_id: characterData.accountID},function(err, account) {
		// 	return self.onFindAccount(socket, err, account);
		// });
		var self = this;

		db.Character.findOne({
			_id: characterData.id,
			AccountID: characterData.accountID
		}, function(err, character) {
			console.log("got character");
			if(err) {
				// console.log(err);
				// TODO: Consider socket.disconnect 
				socket.destroy();
				return;
			}

			if(!character){
				// console.log("Character not found");
				socket.destroy();
				return;
			}


			socket.character = character;
			socket.character.infos = new CharacterInfos(socket);
			socket.character.infos.updateAll(function(){
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
	}else switch(type.type){
		case 'character data':
		this.socketTransferQueue[type.data.hash] = type.data;
		break;
	}
};

vms('Zone', [
	'Config/world.json',
	'Config/network.json'
], function(){
	if(global.Zone === undefined){
		global.Zone = new ZoneInstance();
	}else{
		global.Zone.__proto__ = zonePrototype;
	}

	global.Zone.init();
});



// global.rpc.invalidateAPI(global.api);

// process.log = function(){
// 	var array = [];
// 	for(var i=0; i<arguments.length; i++){
// 		array.push(arguments[i]);
// 	}
// 	array.unshift(process.argv[3]);
// 	process.api.log.apply(this, array);
// };
// process.exception = function() {
// 	var array = [];
// 	for(var i=0; i<arguments.length; i++){
// 		array.push(arguments[i]);
// 	}
// 	array.unshift('!' + process.argv[3]+' Exception\n\r');
// 	process.api.log.apply(this, array);
// }
// TODO: Maybe a debug option to enable this wrapper, so we can debug stuff on runtime.
// This method is used when all vms console logs are dumped on runtime, we dont want copies of that.

// vmscript.watch('Config/world.json');
// vmscript.watch('Config/network.json');
//
// 	'Config/world.json',
// 	'Config/network.json'
// ], function(){
// 	util = require('./Modules/util.js');
// 	// util.setupUncaughtExceptionHandler(function(err){ console.log(err); });
// 	CachedBuffer = require('./Modules/CachedBuffer.js');
// 	PacketCollection = require('./Modules/PacketCollection.js');
// 	restruct = require('./Modules/restruct');
// 	Database = require('./Modules/db.js');
// 	packets = require('./Helper/packets.js');
// 	nav_mesh = require('./Modules/navtest-revised.js');
// 	QuadTree = require('./Modules/QuadTree.js');
// 	clone = require('clone');
// 	fs = require('fs');
//
// 	// bunyan = require('bunyan');
//
// 	vmscript.watch('./Generic');
// 	vmscript.watch('./Helper/GMCommands.js');
//
// 	function ZoneInstance(){
// 		this.initialized = false;
// 		this.packetCollection = null;
// 		this.socketTransferQueue = {};
// 		this.send = {};
// 		this.recv = {};
// 		this.id = parseInt(process.argv[2]);
// 		this.name = process.argv[3];
// 		// this.display_name = process.argv[4];
// 		// this.clean_name = this.display_name.replace(/[\s#@]/gi,'');
// 		this.AI = null;
// 		this.QuadTree = null;
// 		this.Clients = [];
// 		this.Npc = [];
// 		this.Items = [];
// 		this.NpcNodesHash = {};
//
// 		global.log = {
// 			info: function(){
// 				console.log('info');
// 				console.log(arguments);
// 			},
// 			error: function(){
// 				console.log('error');
// 				console.log(arguments);
// 			}
// 		};
//
// 		// global.log = bunyan.createLogger({name: 'InfiniteSky/Zone.'+parseInt(process.argv[2]),
// 		//     streams: [{
// 		//         stream: process.stderr
// 		//     }]
// 		// });
//
// 		function vmscript_WatchIfExists(path) {
// 			fs.stat(path, function(err, stat) {
// 				if (err) {
// 					// Safe to ignore errors for this sometimes they wont exist.
// 					return;
// 				}
//
// 				vmscript.watch(path);
// 			})
// 		}
//
// 		vmscript_WatchIfExists('./Commands');
// 		vmscript_WatchIfExists('./Processes/Zone/Commands');
// 		vmscript_WatchIfExists('./Processes/Zone/Commands/'+this.id);
// 		vmscript_WatchIfExists('./Processes/Zone/Commands/'+this.clean_name);
// 		vmscript_WatchIfExists('./Processes/Zone/Scripts/'+this.id);
// 		vmscript_WatchIfExists('./Processes/Zone/Scripts/'+this.clean_name);
//
// 		console.log('Started');
// 	}
//
// 	ZoneInstance.prototype.addSocket = function(socket){
// 		if(!this.QuadTree){
// 			console.log("QuadTree is not initialized");
// 			return false;
// 		}else{
// 			this.Clients.push(socket);
//
// 			// Attach functions to the socket here
// 			// TODO: See if we can get this to work prototype like.
// 			// socket.sendInfoMessage = function(type, message) {
// 			// 	if (arguments.length === 1) {
// 			// 		message = type;
// 			// 		type = ':INFO';
// 			// 	}
// 			// 	ZonePC.sendMessageToSocket(this, type, message);
// 			// };
// 			//
// 			// socket.unhandledPacket = function(message) {
// 			// 	ZonePC.sendMessageToSocket(this, ':WARN', 'Unhandled Packet: '+message);
// 			// }
//
// 			socket.node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({
// 				object: socket,
// 				update: function(node, delta) {
// 					return {
// 						x: this.character.state.Location.X,
// 						y: this.character.state.Location.Z,
// 						size: this.character.state.Level
// 					};
// 				},
// 				type: 'client'
// 			}));
// 			socket.character.state.NodeID = socket.node.id;
// 			return true;
// 		}
// 	};
//
// 	ZoneInstance.prototype.sendToAll= function(buffer) {
// 		for (var i=0; i< this.Clients.length; i++) {
// 			this.Clients.write(buffer);
// 		}
// 	};
//
// 	ZoneInstance.prototype.sendToAllArea = function(client, self, buffer, distance){
//         var found = this.QuadTree.query({ CVec3: client.character.state.Location, radius: distance, type: ['client'] });
//         for(var i=0; i<found.length; i++){
//             var f = found[i];
//             if(!self && f.object === client) continue;
//             if(f.object.write) f.object.write(buffer);
//         }
// 	};
//
// 	ZoneInstance.prototype.sendToAllAreaClan = function(client, self, buffer, distance, clan){
// 		if (clan === undefined) {
// 			clan = client.character.Clan;
// 		}
//         var found = this.QuadTree.query({ CVec3: client.character.state.Location, radius: distance, type: ['client'] });
//         for(var i=0; i<found.length; i++){
//             var f = found[i];
//             if(!self && f.object === client) continue;
//             if (f.object.character.Clan !== clan) continue;
//             if(f.object.write) f.object.write(buffer);
//         }
// 	};
//
// 	ZoneInstance.prototype.findPath = function(){
// 		console.log("Navigation not initialized");
// 		return null;
// 	};
//
// 	ZoneInstance.prototype.onDisconnect = function(socket){
// 		this.QuadTree.removeNode(socket.node);
// 		var index = this.Clients.indexOf(socket);
// 		if(index > -1){
// 			this.Clients.splice(this.Clients.indexOf(socket), 1);
// 			socket.character.save();
// 			console.log(socket.character.Name, "disconnected");
// 		}
// 	};
//
// 	ZoneInstance.prototype.onError = function(err, socket){
// 		console.log(socket.character.Name, "disconnected with error");
// 	};
//
// 	ZoneInstance.prototype.onFindAccount = function(socket, err, account) {
// 		if (err) {
// 			console.log(err);
// 			socket.destroy();
// 			return;
// 		}
//
// 		socket.account = account;
// 	}
//
// 	ZoneInstance.prototype.onFindCharacter = function(socket, err, character){
// 		if(err) {
// 			console.log(err);
// 			socket.destroy();
// 			return;
// 		}
//
// 		if(!character){
// 			console.log("Character not found");
// 			socket.destroy();
// 			return;
// 		}
//
//
// 		socket.character = character;
// 		socket.character.infos = new CharacterInfos(socket);
// 		var self = this;
// 		socket.character.infos.updateAll(function(){
// 			socket.character.state = new CharacterState();
// 			socket.character.state.setAccountID(socket.character.AccountID);
// 			socket.character.state.setCharacterID(socket.character._id);
// 			socket.character.state.setFromCharacter(socket.character);
//
// 			self.addSocket(socket);
//
//
// 			CachedBuffer.call(socket, self.packetCollection);
// 			Zone.sendToAllArea(socket, true, socket.character.state.getPacket(), config.network.viewable_action_distance);
// 			console.log(character.Name, "connected");
// 		});
// 	};
//
// 	ZoneInstance.prototype.onMessage = function(type, socket){
// 		// console.log("On socket message");
//
// 		// console.log(type);
// 		// console.log(socket);
//
// 		console.log('Zone Message');
// 		console.log(type);
// 		var self = this;
// 		if(socket)
// 		switch(type){
// 			case 'world socket':
// 			console.log('World socket received');
//
// 			socket.on('end', function() {
// 				self.onDisconnect(socket);
// 			});
//
// 			socket.on('close', function() {
// 				self.onDisconnect(socket);
// 			});
//
// 			var hash = socket.remoteAddress + ":" + socket.remotePort;
// 			var characterData = this.socketTransferQueue[hash];
// 			if(!characterData){
// 				console.log("could not retrive character data.");
// 				socket.destroy();
// 				return;
// 			}
//
// 			delete this.socketTransferQueue[hash];
//
// 			db.Account.findOne({_id: characterData.accountID},function(err, account) {
// 				return self.onFindAccount(socket, err, account);
// 			});
//
// 			db.Character.findOne({
// 				_id: characterData.id,
// 				AccountID: characterData.accountID
// 			}, function(err, character) {
// 				return self.onFindCharacter(socket, err, character);
// 			});
// 			break;
// 		}
// 		else switch(type.type){
// 			case 'character data':
// 			this.socketTransferQueue[type.data.hash] = type.data;
// 			break;
// 		}
// 	};
//
// 	ZoneInstance.prototype.addNPC = function(element){
// 		var npc = new Npc(element);
// 		npc.setNode(this.QuadTree.addNode(new QuadTree.QuadTreeNode({
// 			object: npc,
// 			update: function(node, delta) {
// 				return {
// 					x: this.Location.X,
// 					y: this.Location.Z,
// 					size: 1
// 				};
// 			},
// 			type: 'npc'
// 		})), this);
// 		this.Npc.push(npc);
// 	};
//
// 	ZoneInstance.prototype.addItem = function(owner, item){
// 	    var obj = new ItemObj();
// 	    obj.setLocation(owner.character.state.Location);
// 	    obj.setOwner(owner.character.Name);
// 	    obj.setObj(item);
//
// 	    var node = new QuadTree.QuadTreeNode({
// 	        object: obj,
// 	        update: function(node, delta) {
// 	            return {
// 	                x: this.Location.X,
// 	                y: this.Location.Z,
// 	                size: 1
// 	            };
// 	        },
// 	        type: 'item'
// 	    });
// 	    obj.setNode(this.QuadTree.addNode(node));
// 		console.log(owner.character.Name, 'dropped item #' + obj.NodeID);
// 		console.log(obj.obj);
// 	    this.sendToAllArea(owner, true, obj.getPacket(), config.network.viewable_action_distance);
// 	};
//
// 	ZoneInstance.prototype.broadcastStates = function(client){
//         var found = Zone.QuadTree.query({ CVec3: client.character.state.Location, radius: config.network.viewable_action_distance, type: ['npc', 'item'] });
//         for(var i=0; i<found.length; i++){
//             var f = found[i];
//             client.write(f.object.getPacket());
//         }
// 	};
//
// 	ZoneInstance.prototype.init = function(){
// 		if(this.initialized) return;
// 		this.initialized = true;
//
// 		var startTime = new Date().getTime();
//
// 		this.packetCollection = new PacketCollection('ZonePC');
// 		global.ZonePC = this.packetCollection;
//
// 		var self = this;
// 		process.on('message', function(type, socket){
// 			console.log(socket);
// 			try{
// 				if(socket && socket.write && socket.writable) socket.write(new Buffer([]));
// 			}catch(e){
//
// 			}
// 			// global.Zone.onMessage(type, socket);
// 		});
// 		var mesh_path = config.world.data_path + "navigation_mesh/" + this.name + '.obj';
// 		this.AI = new nav_mesh(mesh_path, function(mesh){
// 			// console.log("Navigation mesh loaded for", self.name);
// 			// ZoneInstance.prototype.findPath = mesh.findPath;
// 			// findPath(from, to, actor_radius, callback)
// 			// from			- object, format: {x, y, z}
// 			// to			- object, format: {x, y, z}
// 			// actor_radius	- float
// 			// callback		- function, returning waypoints
//
// 			// mesh.dimensions.top += 1000;
// 			// mesh.dimensions.bottom -= 1000;
// 			// mesh.dimensions.left += 1000;
// 			// mesh.dimensions.right -= 1000;
//
// 			var height = Math.abs(mesh.dimensions.bottom) + Math.abs(mesh.dimensions.top);
// 			var width = Math.abs(mesh.dimensions.right) + Math.abs(mesh.dimensions.left);
//
// 			self.QuadTree = new QuadTree({
// 				x: util.roundDivisable(mesh.dimensions.left, 2),
// 				y: util.roundDivisable(mesh.dimensions.top, 2),
// 				size: util.roundDivisable(Math.max(width, height), 2)
// 			});
// 			Database(config.world.database.connection_string, function(){
// 				vmscript.watch('Database');
// 				vmscript.watch('./Processes/Zone/Packets').on([
// 						'Packets',
// 						'Database',
// 						'Generic'
// 					], function(){
// 						fs.readFile(config.world.data_path + 'spawninfo/' + util.padLeft(self.id,'0', 3) + '.NPC', function(err, data) {
// 							if (err) {
// 								//console.log(err);
// 							} else {
// 								var RecordCount = data.readUInt32LE(0);
//
// 								var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
// 								var length = spawndata.info.length,
// 									element = null;
// 								for (var i = 0; i < length; i++) {
// 									element = spawndata.info[i];
// 									if (element.ID) {
// 										self.addNPC(element);
// 									}
// 								}
// 							}
// 						});
//
//
// 						console.log("Initialized in " + (new Date().getTime() - startTime) + "ms");
// 						self.acceptConnections = true;
// 						// process.api.run();
// 						// global.rpc.api.zoneInitResponse();
// 				});
// 			});
// 		});
// 	}
//
// 	// TODO: If error loading zone call process.api.zoneInitResponse(error);
// 	// Errors loading zones should not stop server from loading just display the error and warning like in old server code :)
//
// 	if(typeof Zone === 'undefined') {
// 		global.Zone = new ZoneInstance();
// 		global.Zone.init();
// 	} else {
// 		global.Zone.__proto__ = ZoneInstance.prototype;
// 	}
//
// 	api.sendToAll = function exposedSendToAll(buffer) {
// 		Zone.sendToAll(buffer);
// 	};
//
// 	// global.rpc.api.invalidateAPI(global.api);
// });
