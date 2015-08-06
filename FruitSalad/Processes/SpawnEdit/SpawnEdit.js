vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');

vms('Spawn Logger', [
	'Config/network.json',
	'Config/login.json',
], function(){
	express = require('express');
	socketio = require('socket.io');

	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');

	util = require('./Modules/util.js');
	util.setupUncaughtExceptionHandler();

	bunyan = require('bunyan');

	function SpawnEditInstance(){
		log = bunyan.createLogger({name: 'InfiniteSky/SpawnEdit',
		    streams: [{
		        stream: process.stderr
		    }]
		});

		var self = this;

		global.app = this.app = express();
		this.io = socketio.listen(app.listen(config.network.ports.spawnedit || 8473));

		this.io.sockets.on('connection', function (socket) {
		  self.onConnection(socket);
		});

		Database(config.login.database.connection_string, function(){
			vmscript.watch('Database');
		});

		// I really want this to be its own function on prototype and prototype functions to be reloadable but its not letting me.. :(
		this.app.get('/count', function(req, res){ 
			//self.getSpawnCount(req, res);
			var search = {};
			if (req.query.username) {
				search.username = req.query.username;
			}
			if (req.query.zoneID) {
				search.zoneID = req.query.zoneID;
			}
			log.info(req.query);
			db.SpawnLog.count(search, function(err,count) {
				if (err) {
					res.send(err);
					return;
				}

				res.send('Collected amount: '+count);
			});
		});

		this.app.use(express.static(path.join(process.directory, 'public')));
	}

	if (global.SpawnEditPrototype === undefined) {
		global.SpawnEditPrototype = {};
		process.SpawnEdit = new SpawnEditInstance();
		global.SocketFunctions = {};
	}	
	SpawnEditInstance.prototype = SpawnEditPrototype;

	SpawnEditInstance.prototype.onConnection = function SpawnEdit__onConnection(socket) {
		log.info('Connection');
		socket.zoneID = 0;
		this.join('Z000');
		socket.on('zone', SocketFunctions.zone.bind(socket));
	}

	SpawnEditInstance.prototype.getSpawnCount = function SpawnEdit__getSpawnCount(req, res) {
		// var search = {};
		// if (req.query.username) {
		// 	search.username = req.query.username;
		// }
		// if (req.query.zoneID) {
		// 	search.zoneID = req.query.zoneID;
		// }
		// log.info(req.query);
		// db.SpawnLog.count(search, function(err,count) {
		// 	if (err) {
		// 		res.send(err);
		// 		return;
		// 	}

		// 	res.send('Collected amount: '+count);
		// });
	}

	// this is a socket
	// This function is resopnsable for when a client asks for information on a zone.
	// The socket will join a room for that zone to be notified of other events.
	// And would leave any existing zone room.
	SocketFunctions.zone = function Socket__zone(id) {
		// Leave the previous room
		//this.zoneID
		this.leave('Z' + util.padLeft(this.zoneID,'0', 3));
		this.join('Z' + util.padLeft(id,'0', 3));
		this.zoneID = id;
		SocketFunctions.sendLogs.call(this);
	}

	SocketFunctions.sendLogs = function Socket__refresh() {
		// Get spawn logs from db that are unique
		// Send them to the client
		if (this.zoneID === 0) return;
		var socket = this;
		db.SpawnLog.find({ zoneID: this.zoneID }, function foundSpawnLogs(err, docs) {
			if (err) {
				log.error(err);
				return;
			}

			socket.send('spawnlogs', docs);
		});

		db.SpawnGroup.find({ zoneID: this.zoneID }, function foundSpawnGroups(err, docs) {
			if (err) {
				log.error(err);
				return;
			}

			socket.send('spawngroups', docs);
		});

		db.SpawnPoints.find({ zoneID: this.zoneID }, function foundSpawnPoints(err, docs) {
			if (err) {
				log.error(err);
				return;
			}

			socket.send('spawnpoints', docs);
		});
	}

});

// Each socket should be able to join a room eg Z001
// RPC will notify SpawnEdit from SpawnLogger when there is new information.
