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

		// TODO: Add loading zones in async and listen for invalidation before we set
		// this.singletone for better code flow?
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

//
// async = require('async');
//
// 	net = require('net');
// 	CachedBuffer = require('./Modules/CachedBuffer.js');
// 	PacketCollection = require('./Modules/PacketCollection.js');
// 	restruct = require('./Modules/restruct');
// 	Database = require('./Modules/db.js');
// 	util = require('./Modules/util.js');
// 	util.setupUncaughtExceptionHandler();
// 	// packets = require('./Helper/packets.js');
// 	os = require('os');
// 	Netmask = require('netmask').Netmask;
// 	bunyan = require('bunyan');
//
// 	global.api.sendSocketToTransferQueue = function(obj){
// 		//var key = util.toHexString(obj.hash);
// 		console.log(obj);
// 		World.characterTransfer[obj.username] = obj;
// 		global.rpc.api.call('Login', 'sendSocketAfterTransferQueue', obj.username);
// 		console.log("Login sendSocketAfterTransferQueue");
// 	};
//
// 	function WorldInstance(){
// 		global.log = bunyan.createLogger({name: 'InfiniteSky/World',
// 		    streams: [{
// 		        stream: process.stderr
// 		    }]
// 		});
//
// 		console.log('Started');
//
// 		/*
// 			Array of current connected clients.
// 		*/
// 		this.clients = [];
// 		this.nextID = 0;
//
// 		/*
// 			Boolean indicating that the server is running
// 			and listening for incoming connections.
// 		*/
// 		this.listening = false;
//
// 		/*
// 			Used Later to see if config has to offer a new port to listen to.
// 			If is different than currently listening, re-listen the tcp server,
// 			to listen for the new port.
// 		*/
// 		this.listeningPort = null;
//
// 		/*
// 			A boolean variable to decide if we want to accept incoming connections.
// 		*/
// 		this.acceptConnections = false;
//
// 		/*
// 			A object of packet collection for this current instance.
// 		*/
// 		this.packetCollection = null;
//
// 		var self = this;
// 		/*
// 			A TCP server instance.
// 		*/
// 		this.instance = net.createServer(function (socket) { self.onConnection(socket); });
// 		this.recv = {};
// 		this.send = {};
//
// 		this.databaseConnected = false;
//
// 		this.characterTransfer = {};
// 		process.zones = {};
// 	}
//
// 	WorldInstance.prototype.onConnection = function(socket){
// 		if(!this.acceptConnections) {
// 			// TODO: Send packet back to client denying its connection.
// 			// There is a packet 00 with status for this kind of thing.
// 			console.log('World had connection but it is not ready.');
// 			return;
// 		}
// 		// socket.paused = false;
//
// 		var self = this;
// 		socket.clientID = this.nextID;
// 		this.nextID++;
// 		socket.authenticated = false;
//
// 		this.clients.push(socket);
// 		CachedBuffer.call(socket, this.packetCollection);
//
// 		console.log("[World] new Connection #" + socket.clientID);
//
// 		try {
// 			this.onConnected(socket);
// 		} catch (e) {
// 			console.log(e);
// 		}
//
// 		socket.on('end', function() {
// 			return self.onDisconnect(socket);
// 		});
//
// 		// Need to find out which functions to use and make this tidyer....
// 		// Need to check for memory leaks and make sure we actually delete the un needed socket.
// 		// Need to make sure using splice won't be slower than deleting the index.
// 		// Should maybe look at using room or list rather than array of socket object.
// 		socket.on('close', function() {
// 			return self.onDisconnect(socket);
// 		});
//
// 		socket.on('disconnect', function() {
// 			return self.onDisconnect(socket);
// 		});
//
// 		socket.on('error', function(err) {
// 			return self.onError(err, socket);
// 		});
// 	};
//
// 	WorldInstance.prototype.onDisconnect = function(socket){
// 		var index = this.clients.indexOf(socket);
// 		if(index !== -1){
// 			console.log("[World] connection closed #" + socket.clientID);
// 			this.clients.splice(this.clients.indexOf(socket), 1);
// 			socket.destroy();
// 		}
// 	};
//
// 	WorldInstance.prototype.onError = function(err, socket){
// 		console.log(err);
// 		this.clients.splice(this.clients.indexOf(socket), 1);
// 		socket.destroy();
// 	};
// 	WorldInstance.prototype.loadZone = function World__loadZone(id, done) {
// 		console.log("Spawning Child Process for Zone: " + id + ' ' + config.zones[id.toString()].Name);
// 		global.rpc.join(parseInt(id), './Processes/process.js', [
// 			parseInt(id),
// 			config.zones[id.toString()].Name
// 		]);
// 		process.zones[parseInt(id)] = global.rpc.children[parseInt(id)];
// 		// this.zoneSpawner.spawnChild({
// 		// 	name: parseInt(id),
// 		// 	pipeError: true,
// 		// 	script: './Processes/Zone/Zone.js'
// 		// }, null, [id, config.zones[id.toString()].Name, config.zones[id.toString()].DisplayName || id]);
//
// 		done();
// 	};
//
// 	WorldInstance.prototype.zoneSpawned = function zoneSpawned(id) {
// 	};
//
// 	WorldInstance.prototype.zoneInitResponse = function World__zoneInitResponse(err) {
// 	};
//
// 	WorldInstance.prototype.init = function(){
// 		console.log('World Instance Init.');
// 		if(this.listening) return;
//
// 		var self = this;
// 		this.instance.listen(config.network.ports.world, function(){
// 			self.listening = true;
// 			self.listeningPort = config.network.ports.world;
// 			console.log("World Server Instance listening on:", self.listeningPort);
// 		});
//
// 		this.packetCollection = new PacketCollection('WorldPC');
//
// 		//TODO: Make a better way to keep zones in a array.
//
// 		var zones = {};
// 		var zoneAPI = {};
// 		zoneAPI.zoneInitResponse = self.zoneInitResponse.bind(self);
//
// 		if(config.zones){
// 	    var mapLoadQueue = async.queue(this.loadZone.bind(self), config.AsyncZoneLoadLimit || 4);
// 	    mapLoadQueue.drain = function() {
// 	        console.log('Zones all queued to load.');
// 	    }
//
// 	    for(var id in config.zones) {
// 	        if(config.zones.hasOwnProperty(id) && !isNaN(id) && config.zones[id].Load == true) {
// 	            mapLoadQueue.push(id, this.zoneSpawned.bind(self));
// 	        }
// 	    }
// 		}
//
// 		global.rpc.on('invalidated', function(zone){
// 			// console.log(child);
// 			if(zone !== null && !process.zones[zone].running){
// 				process.zones[zone].running = true;
// 				process.zones[zone].api.spawnScript('./Processes/Zone/Zone.js');
// 			}
// 		});
//
//
//
//
//
// 		// this.zoneSpawner = new ChildSpawner.Spawner({
// 		// 	// Exposes a function to be called when a zone is loaded
// 		// 	// or if there was a significant error loading a zone.
// 		// 	zoneInitResponse: self.zoneInitResponse.bind(self),
// 		// 	// TODO find a way to expose these functions outside of constructor/init.
// 		// 	// Exposes log function to the child processe zones which should use process.log
// 		// 	log: function(){
// 		// 		console.log.apply(this, arguments);
// 		// 	}
// 		// });
// 		//
//     //     if(config.zones) {
//     //         var mapLoadQueue = async.queue(this.loadZone.bind(self), config.AsyncZoneLoadLimit || 4);
//     //         mapLoadQueue.drain = function() {
//     //             console.log('Zones all queued to load.');
//     //         }
// 		//
//     //         for(var id in config.zones) {
//     //             if(config.zones.hasOwnProperty(id) && !isNaN(id) && config.zones[id].Load == true) {
//     //                 mapLoadQueue.push(id, this.zoneSpawned.bind(self));
//     //             }
//     //         }
//     //     } else {
//     //         console.error('\x1B[31mPlease define Zones object in your config.json\x1B[0m');
//     //     }
//
// 		// TODO: Make zones reloadable.
// 		// TODO: Make sure that we save to DB when disconnecting characters from removed zone.
//
// 		// process.zones = this.zoneSpawner.children;
//
// 		Database(config.world.database.connection_string, function World__onDatabaseConnected(){
// 			console.log("Database connected @", config.world.database.connection_string);
// 			vmscript.watch('Database');
// 			vmscript.watch('Generic');
//
// 			vmscript.on([
// 				'Database',
// 				'Generic'
// 			], function(){
// 				vmscript.watch('./Processes/World/Packets').on([
// 						'Packets'
// 					], function(){
// 						console.log("You can now login to the server");
// 						self.acceptConnections = true;
// 				});
// 			});
// 		});
//
// 	}
//
// 	if(typeof World === 'undefined') {
// 		global.World = new WorldInstance();
// 		global.World.init();
// 	} else {
// 		global.World.__proto__ = WorldInstance.prototype;
// 	}
// 	global.rpc.invalidateAPI(global.api);
// });
