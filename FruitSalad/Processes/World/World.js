vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');
vmscript.watch('Config/world.json');
vmscript.watch('Config/zones.json');

async = require('async');

vms('World Server', [
	'Config/network.json',
	'Config/world.json',
	'Config/zones.json'
], function(){
	net = require('net');
	CachedBuffer = require('./Modules/CachedBuffer.js');
	PacketCollection = require('./Modules/PacketCollection.js');
	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');
	util = require('./Modules/util.js');
	util.setupUncaughtExceptionHandler();
	// packets = require('./Helper/packets.js');
	os = require('os');
	Netmask = require('Netmask').Netmask;

	global.api.sendSocketToTransferQueue = function(obj){
		//var key = util.toHexString(obj.hash);
		console.log(obj);
		World.characterTransfer[obj.username] = obj;
		process.api.call('Login', 'sendSocketAfterTransferQueue', obj.username);
		console.log("Login sendSocketAfterTransferQueue");
	};

	function WorldInstance(){
		/*
			Array of current connected clients.
		*/
		this.clients = [];
		this.nextID = 0;

		/*
			Boolean indicating that the server is running
			and listening for incoming connections.
		*/
		this.listening = false;

		/*
			Used Later to see if config has to offer a new port to listen to.
			If is different than currently listening, re-listen the tcp server,
			to listen for the new port.
		*/
		this.listeningPort = null;

		/*
			A boolean variable to decide if we want to accept incoming connections.
		*/
		this.acceptConnections = false;

		/*
			A object of packet collection for this current instance.
		*/
		this.packetCollection = null;

		var self = this;
		/*
			A TCP server instance.
		*/
		this.instance = net.createServer(function (socket) { self.onConnection(socket); });
		this.recv = {};
		this.send = {};

		this.databaseConnected = false;

		this.characterTransfer = {};
	}

	WorldInstance.prototype.onConnection = function(socket){
		if(!this.acceptConnections) {
			// TODO: Send packet back to client denying its connection.
			// There is a packet 00 with status for this kind of thing.
			console.log('World had connection but it is not ready.');
			return;
		}
		socket.paused = false;

		var self = this;
		socket.clientID = this.nextID;
		this.nextID++;
		socket.authenticated = false;

		this.clients.push(socket);
		CachedBuffer.call(socket, this.packetCollection);

		console.log("[World] new Connection #" + socket.clientID);

		try {
			this.onConnected(socket);
		} catch (e) {
			console.log(e);
		}

		socket.on('end', function() {
			return self.onDisconnect(socket);
		});

		// Need to find out which functions to use and make this tidyer....
		// Need to check for memory leaks and make sure we actually delete the un needed socket.
		// Need to make sure using splice won't be slower than deleting the index.
		// Should maybe look at using room or list rather than array of socket object.
		socket.on('close', function() {
			return self.onDisconnect(socket);
		});

		socket.on('disconnect', function() {
			return self.onDisconnect(socket);
		});

		socket.on('error', function(err) {
			return self.onError(err, socket);
		});
	};

	WorldInstance.prototype.onDisconnect = function(socket){
		var index = this.clients.indexOf(socket);
		if(index !== -1){
			console.log("[World] connection closed #" + socket.clientID);
			this.clients.splice(this.clients.indexOf(socket), 1);
			socket.destroy();
		}
	};

	WorldInstance.prototype.onError = function(err, socket){
		console.log(err);
		this.clients.splice(this.clients.indexOf(socket), 1);
		socket.destroy();
	};
	WorldInstance.prototype.loadZone = function World__loadZone(id, done) {
		console.log("Spawning Child Process for Zone: " + id + ' ' + config.zones[id.toString()].Name);
		this.zoneSpawner.spawnChild({
			name: parseInt(id),
			pipeError: false,
			script: './Processes/Zone/Zone.js'
		}, null, [id, config.zones[id.toString()].Name]);

		done();
	};

	WorldInstance.prototype.zoneSpawned = function zoneSpawned(id) {
	};

	WorldInstance.prototype.zoneInitResponse = function World__zoneInitResponse(err) {
		console.log('zoneLoaded');
		console.log(arguments);
	};


	WorldInstance.prototype.init = function(){
		console.log('World Instance Init.');
		if(this.listening) return;

		var self = this;
		this.instance.listen(config.network.ports.world, function(){
			self.listening = true;
			self.listeningPort = config.network.ports.world;
			console.log("World Server Instance listening on:", self.listeningPort);
		});

		this.packetCollection = new PacketCollection('WorldPC');


		this.zoneSpawner = new ChildSpawner.Spawner({
			// Exposes a function to be called when a zone is loaded
			// or if there was a significant error loading a zone.
			zoneInitResponse: self.zoneInitResponse.bind(self),

			// Exposes log function to the child processe zones which should use process.log
			log: function(){
				console.log.apply(this, arguments);
			},
		});

        if(config.zones) {
            var mapLoadQueue = async.queue(this.loadZone.bind(self), config.AsyncZoneLoadLimit || 4);
            mapLoadQueue.drain = function() {
                console.log('Zones all queued to load.');
            }

            for(var id in config.zones) {
                if(config.zones.hasOwnProperty(id) && !isNaN(id) && config.zones[id].Load == true) {
                    mapLoadQueue.push(id, this.zoneSpawned.bind(self));
                }
            }
        } else {
            console.error('\x1B[31mPlease define Zones object in your config.json\x1B[0m');
        }

		// TODO: Make zones reloadable.
		// TODO: Make sure that we save to DB when disconnecting characters from removed zone.

		process.zones = this.zoneSpawner.childrens;

		Database(config.world.database.connection_string, function World__onDatabaseConnected(){
			console.log("Database connected @", config.world.database.connection_string);
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
						process.api.run();
				});
			});
		});
	}

	if(typeof World === 'undefined') {
		global.World = new WorldInstance();
		global.World.init();
	} else {
		global.World.__proto__ = WorldInstance.prototype;
	}
	process.api.invalidateAPI(process.pid);
});


console.log(global.api);