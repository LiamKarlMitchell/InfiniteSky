vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');
vmscript.watch('Config/zones.json');

vms('Spawn Logger', [
	'Config/network.json',
	'Config/login.json',
	'Config/zones.json'
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

		this.app.use(express.static(path.join(process.directory, 'public')));
		this.app.get('/zones.json', function(req, res) {
			res.send(config.zones);
		});
	}

	var SpawnEditPrototype = SpawnEditInstance.prototype;

	SpawnEditPrototype.onConnection = function SpawnEdit__onConnection(socket) {
		log.info('Connection');
		socket.zoneID = 0;
		socket.join('Z000');
		socket.on('zone', function(id){ SocketFunctions.zone(socket, id) });
	}

	SpawnEditPrototype.getSpawnCount = function SpawnEdit__getSpawnCount(req, res) {
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
	}

	if (typeof global.SocketFunctions === 'undefined') {
		global.SocketFunctions = {};
	} 

	// this is a socket
	// This function is resopnsable for when a client asks for information on a zone.
	// The socket will join a room for that zone to be notified of other events.
	// And would leave any existing zone room.
	SocketFunctions.zone = function Socket__zone(socket, id) {
		// Leave the previous room
		//this.zoneID
		socket.leave('Z' + util.padLeft(socket.zoneID,'0', 3));
		socket.join('Z' + util.padLeft(id,'0', 3));
		socket.zoneID = id;
		SocketFunctions.refresh(socket);
	}

	SocketFunctions.refresh = function Socket__refresh(socket) {
		// Get spawn logs from db that are unique
		// Send them to the client
		if (socket.zoneID === 0) return;
		log.info('Getting zone info for '+socket.zoneID);
		db.SpawnLog.find({ zoneID: socket.zoneID }, function foundSpawnLogs(err, docs) {
			if (err) {
				log.error(err);
				return;
			}
			socket.emit('spawnlogs', docs);
		});

		db.SpawnGroup.find({ zoneID: socket.zoneID }, function foundSpawnGroups(err, docs) {
			if (err) {
				log.error(err);
				return;
			}
			socket.emit('spawngroups', docs);
		});

		db.SpawnPoint.find({ zoneID: socket.zoneID }, function foundSpawnPoints(err, docs) {
			if (err) {
				log.error(err);
				return;
			}
			socket.emit('spawnpoints', docs);
		});
	}

	if (typeof process.SpawnEdit === 'undefined') {
		process.SpawnEdit = new SpawnEditInstance();
	} else {
		process.SpawnEdit.__proto__ = SpawnEditPrototype;
	}

	process.SpawnEdit.app.get('/count', function(req, res){ process.SpawnEdit.getSpawnCount(req, res); });
});

// Each socket should be able to join a room eg Z001
// RPC will notify SpawnEdit from SpawnLogger when there is new information.
