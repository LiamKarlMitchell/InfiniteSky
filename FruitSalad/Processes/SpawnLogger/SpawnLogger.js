vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');

vms('Spawn Logger', [
	'Config/network.json',
	'Config/login.json',
], function(){
	var dgram = require("dgram");

	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');

	hexy = require('hexy').hexy;
	util = require('./Modules/util.js');
	util.setupUncaughtExceptionHandler();

	bunyan = require('bunyan');

	function Auth(authInt, rinfo) {
		this.authInt = authInt;
		this.rinfo = rinfo;
	}

	function SpawnLoggerInstance(){
		log = bunyan.createLogger({name: 'InfiniteSky/SpawnLogger',
		    streams: [{
		        stream: process.stderr
		    }]
		});

		this.recv = [];

		var self = this;
		
		server = dgram.createSocket("udp4");
		server.on("error", function (err) {
		  log.error(err, "Server Error");
		});

		server.on("message", function (msg, rinfo) {
		  log.info({ msg: msg, from: rinfo.address, port: rinfo.port },"recv" + msg + " from " + rinfo.address + ":" + rinfo.port);

		  self.onMessage(msg, rinfo);
		});

		server.on("listening", function () {
		  var address = server.address();
		  log.info("server listening " + address.address + ":" + address.port);
		});

		Database(config.login.database.connection_string, function(){
			console.log("Database connected @", config.login.database.connection_string);
			vmscript.watch('Database');
		});
		server.bind(config.network.ports.spawnlogger);
	}

	if(typeof AuthPrototype === 'undefined') {
		global.AuthPrototype = {};
	}
	Auth.__proto__ = AuthPrototype;

	AuthPrototype.check = function Auth__check(rinfo) {
		return rinfo.address == this.rinfo.address && rinfo.port == this.rinfo.port;
	}

	if(typeof SpawnLogger === 'undefined') {
		global.SpawnLogger = new SpawnLoggerInstance();
	} else {
		global.SpawnLogger.__proto__ = SpawnLoggerInstance.prototype;
	}

	SpawnLoggerInstance.prototype.onMessage = function SpawnLoggerInstance__onMessage(msg, rinfo) {
  	  try {
  	  	  if (msg.length < 5) { // Packet ID Byte and Auth Integer
  	  	  	log.info('Message received from '+rinfo.address+':'+rinfo.port+' that does not meet minimum length requirements.');
  	  	  	return;
  	  	  }

  	  	  var packet_id = msg.readUInt8(0);
  	  	  var allow = true;
  	  	  var auth = null;
  	  	  if (packet_id === 0) {
  	  	  	auth = new Auth(this.nextAuthID++, rinfo);
  	  	  	this.auths[auth.id] = auth;
  	  	  } else {
			var authInt = msg.readUInt32LE(1);
			auth = this.auths[authInt];
			allow = false;
			if (auth) {
				if (auth.check(rinfo)) {
					allow = true;
					auth.lastUsed = new Date();
				} else {
					log.warn('Attempted access from '+rinfo.address+':'+rinfo.port+' using auth code belonging to '+auth.rinfo.address+':'+auth.rinfo.port);
				}
			}
  	  	  }

  	  	  if (allow) {
		  	  var fn = this.recv[packet_id];
		  	  if (fn) {
		  	  	fn.call(this, msg.slice(5), auth, packet_id);
		  	  }
	  	  } else {
	  	  	// Send a 0 byte back to the client to let them know they are not authenticated.
	  	  	var reply = new Buffer(1);
	  	  	reply.writeUInt8(0, 0);
			this.sendTo(reply, rinfo.address, rinfo.port);
	  	  }
  	  } catch (e) {
  	  	log.error(e);
  	  }
	};

	SpawnLoggerInstance.prototype.sendTo = function SpawnLoggerInstance__sendTo(msg, address, port) {
		var client = dgram.createSocket('udp4');
		client.send(message, 0, message.length, port, address, function(err, bytes) {
		    if (err) {
		    	log.error(err);
		    	return;
		    }
		    log.info('UDP message sent to ' + address +':'+ port);
		    client.close();
		});
	}

	SpawnLoggerInstance.prototype.readSpawnMessage = function SpawnLoggerInstance__readSpawnMessage(msg) {
		if (msg.length < 32) { return null; }
        // Unique ID A
        // Unique ID B
        // ID
        // X
        // Y
        // Z
        // Direction
        // ZoneID
        var spawn = {
        	uniqueID1: msg.readUInt32LE(0),
        	uniqueID2: msg.readUInt32LE(4),
        	id: msg.readUInt32LE(8),
        	x: msg.readFloatLE(12),
        	y: msg.readFloatLE(16),
        	z: msg.readFloatLE(20),
        	direction: msg.readFloatLE(24),
        	zoneID: msg.readUInt32LE(32)
        };
        return spawn;
	};

	SpawnLogger.recv.length = 0;
	SpawnLogger.recv[0] = function initPacket(msg, auth) {
		console.log('init packet received:' + msg);
		// Send back an integer key to be used for basic auth.
		// Basic data that is optional.
		auth.username = 'Unknown';
		if (msg.length > 0) {
			var username = msg.toString();
			username = username.substr(0, Math.min(username.indexOf(0x00), 20));
			auth.username = username;
		}
	};

	function recvSpawnPacket(msg, auth, packet_id) {
		console.log('monster packet received:' + msg);
		var spawn = this.readSpawnMessage(msg)

		if (packet_id === 1) {
			spawn.type = 'mon';
		} else {
			spawn.type = 'npc';
		}

		spawn.username = auth.username;
		log.info(spawn, 'spawn recv');

		var s = new db.SpawnLog(spawn);
		s.save();
	};

	SpawnLogger.recv[1] = recvSpawnPacket; // Monster Spawn
	SpawnLogger.recv[2] = recvSpawnPacket; // NPC Spawn
});