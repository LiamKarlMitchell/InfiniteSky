vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');
vmscript.watch('Config/world.json');
vmscript.watch('Config/zones.json');

Database = require('./Modules/db.js');
restruct = require('./Modules/restruct');
net = require('net');
PacketCollection = require('./Modules/PacketCollection.js');
CachedBuffer = require('./Modules/CachedBuffer.js');
util = require('./Modules/util.js');
fs = require('fs');

if(typeof process.zones === 'undefined') process.zones = {};

global.api.sendSocketToTransferQueue = function(obj){
	console.log("Sending socket to transfer queue");
	World.characterTransferArray[obj.username] = obj;
	var isZone = process.zones[obj.to];
	if(isZone) isZone.api.sendSocketAfterTransferQueue(obj.username);
	else global.rpc.api.call(obj.to, 'sendSocketAfterTransferQueue', obj.username);
};

global.api.isZoneAlive = function(id, zone, client, callback){
	console.log("Checking if zone", id, "is alive");
	var alive = process.zones[id];
	var p = process.zones[zone];
	if(alive && p){
		p.api.zoneAlive(callback, client);
	}
};

global.api.getMoveRegions = function(id, zone, client, callback){
	var moveTo = rpc.children[zone];
	var fromZone = rpc.children[id];

	if(!moveTo || !fromZone){
		return;
	}

	var moveRegions = World.moveRegions[moveTo.name];
	if(!moveRegions){
		log.info("Could not locate move regions for zone id", zone.name);
		return;
	}

	fromZone.api.onMoveRegions(callback, client, moveRegions);
};

global.api.call = function(processName, functionName){
	var args = [];
	for(var i=2; i<arguments.length; i++) args.push(arguments[i]);

	var process = rpc.children[processName];
	if(!process){
		log.info('Calling process that does not exist.');
		return;
	}

	var func = process.api[functionName];
	if(!func){
		log.info('Calling process api with undefined functionName');
		return;
	}
	try{
		func.apply(this, args);
	}catch(e){
		// TODO: Logging
	}
};

global.api.getCharacterZone = function(character_name, user_hash, zone_id, callback){
	var client = World.clientNameTable[character_name];
	if(!client){
		// TODO: Handle errors.
		console.log("No character");
		return;
	}

	var fromZone = process.zones[zone_id];
	if(!fromZone){
		console.log("No zone");
		return;
	}

	fromZone.api.onCharacterZone(user_hash, client.ZoneID, character_name, callback);
};

global.api.sendToAll = function(client, buffer){
	if(Array.isArray(client)){
		for(var i=0; i<client.length; i++){
			var c = World.clientNameTable[client[i]];
			if(c && c.ZoneID){
				var p = process.zones[c.ZoneID];
				if(p){
					p.api.sendBufferToClient(client[i], buffer);
				}
			}
		}
	}
};

global.api.sendToClient = function(client, buffer){
	var c = World.clientNameTable[client];
	if(c && c.ZoneID){
		var p = process.zones[c.ZoneID];
		if(p){
			p.api.sendBufferToClient(client, buffer);
		}
	}
};

global.api.invalidateGuildForClient = function(client){
	if(Array.isArray(client)){
		for(var i=0; i<client.length; i++){
			var c = World.clientNameTable[client[i]];
			if(c && c.ZoneID){
				var p = process.zones[c.ZoneID];
				if(p){
					p.api.invalidateGuildForClient(client[i]);
				}
			}
		}
	}
};

global.api.expelFromGuild = function(name, buffer){
	var c = World.clientNameTable[name];
	if(c && c.ZoneID){
		var p = process.zones[c.ZoneID];
		if(p){
			p.api.expelFromGuild(name, buffer);
		}
	}
};

global.rpc.add(global.api);

log = {};
log.info = function(){
	console.log(arguments);
}

log.err = function(){
	console.log(arguments);
}


global.WorldInstance = function(){
	this.recv = {};
	this.send = {};
	var self = this;
	this.server = net.createServer(function(socket){
		self.onConnection(socket);
	});
	this.listening = false;
	this.singletone = false;
	this.databaseConnected = false;
	this.characterTransferArray = {};
	this.packetCollection = null;
	this.moveRegions = {};
	this.GuildNameTable = {};
	this.clientNameTable = {};
}


var worldPrototype = global.WorldInstance.prototype;

worldPrototype.onConnection = function(socket){
	console.log("New connection");

	CachedBuffer.call(socket, this.packetCollection);

	this.onConnected(socket);

	socket.on('close', function(){});
	socket.on('error', function(){});
	socket.on('timeout', function(){});
};

worldPrototype.init = function(){
	var self = this;
	if(!this.listening)
		this.server.listen(config.network.ports.world, function(){
			console.log("World listening");
			self.listening = true;
		});


	if(!this.databaseConnected)
		Database(config.world.database.connection_string, function World__onDatabaseConnected(){
			console.log("Database connected @", config.world.database.connection_string);
			self.databaseConnected = true;
			vmscript.watch('Database');
			vmscript.watch('Generic');

			vmscript.on([
				'Database',
				'Generic'
			], function(){
				vmscript.watch('./Processes/World/Packets').on([
						'Packets'
					], function(){
						console.log("You can now login to the server");
						self.acceptConnections = true;
				});
			});
		});

	// TODO: Add loading zones in async.
	//
	if(!this.onInvalidatedZone){
		this.onInvalidatedZone = true;
		global.rpc.on('invalidated', function(zone){
			if(zone === null) return;

			global.rpc.children[zone].api.spawnScript('./Processes/Zone/Zone.js');
			global.rpc.children[zone].spawned = true;
			process.zones[zone] = global.rpc.children[zone];

			fs.readFile(config.world.data_path + '/wregion/Z' + util.padLeft(zone,'0', 3) + '_ZONEMOVEREGION.WREGION', function(err, data) {
				if (err) {
					console.log(err);
					return;
				}

				var RecordCount = data.readUInt32LE(0);

				var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
				var length = wregion.info.length,
					element = null;

				self.moveRegions[zone] = [];

				for (var i = 0; i < length; i++) {
					element = wregion.info[i];
					self.moveRegions[zone].push(element);
				}
			});
		});
	}


	if(config.zones){
		for(var id in config.zones){
			var zone = config.zones[id];
			var parsedId = parseInt(id);
			if(zone.Load && (!global.rpc.children[parsedId] || !global.rpc.children[parsedId].spawned) ){
				global.rpc.join(parsedId, './Processes/process.js', [parsedId, zone.Name]);
			}
		}
	}

	if(this.singletone) return;
	this.singletone = true;
	this.packetCollection = new PacketCollection('WorldPC');
};

vms('World Server', [
	'Config/network.json',
	'Config/world.json',
	'Config/zones.json',
	'Config/login.json'
], function(){
	if(global.World === undefined){
		global.World = new WorldInstance();
	}else{
		global.World.__proto__ = worldPrototype;
	}

	global.World.init();
});
