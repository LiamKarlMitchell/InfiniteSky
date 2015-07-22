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

	if(typeof SpawnLogger === 'undefined') {
		global.SpawnLogger = new SpawnLoggerInstance();
	} else {
		global.SpawnLogger.__proto__ = SpawnLoggerInstance.prototype;
	}

	SpawnLoggerInstance.prototype.onMessage = function SpawnLogger__onMessage(msg, rinfo) {
  	  try {
  	  	  if (msg.length < 1) {
  	  	  	return;
  	  	  }

  	  	  var packet_id = msg.readUInt8(0);
	  	  var fn = this.recv[packet_id];
	  	  if (fn) {
	  	  	fn.call(this, msg, rinfo);
	  	  }
  	  } catch (e) {
  	  	log.error(e);
  	  }
	}

	SpawnLogger.recv.length = 0;
	SpawnLogger.recv[0] = function initPacket(msg, rinfo) {
		console.log('init packet received:' + msg, rinfo);
	};
});
