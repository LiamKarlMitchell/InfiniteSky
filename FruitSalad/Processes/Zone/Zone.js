process.log = function(){
	var array = [];
	for(var i=0; i<arguments.length; i++){
		array.push(arguments[i]);
	}
	array.unshift(process.argv[3]);
	process.api.log.apply(this, array);
};
process.exception = function() {
	var array = [];
	for(var i=0; i<arguments.length; i++){
		array.push(arguments[i]);
	}
	array.unshift('!' + process.argv[3]+' Exception\n\r');
	process.api.log.apply(this, array);
}
// TODO: Maybe a debug option to enable this wrapper, so we can debug stuff on runtime.
// This method is used when all vms console logs are dumped on runtime, we dont want copies of that.
console.log = process.log;

vmscript.watch('Config/world.json');
vmscript.watch('Config/network.json');

var Command = function(Name, Level, Execute) {
    this.Name = Name;
    this.Level = Level;
    this.Execute = Execute;
    this.Alias = function(Name) {
        return new Command(Name, this.Level, this.Execute);
    }
}

var GMCommandsHandler = function(){
    this.Commands = [];
};

GMCommandsHandler.prototype.AddCommand = function(name, level, execute){
	var command = new Command(name, level, execute);

    for(var i = 0; i < this.Commands.length; i++) {
        if(this.Commands[i].Name == command.Name) {
            this.Commands.splice(i, 1);
        }
    }
    this.Commands.push(command);
};

GMCommandsHandler.prototype.GetCommand = function(name){
    var command = null;
    for(var i = 0; i < this.Commands.length; i++) {
        if(this.Commands[i].Name == name) {
            command = this.Commands[i];
            break;
        }
    }
    return command;
};

GMCommandsHandler.prototype.Execute = function(string, client){
	if(string === "") return;

    var indexofSpace = string.indexOf(' ');
    var CommandName = indexofSpace > -1 ? string.substr(0, indexofSpace).toLowerCase() : string;
    var CommandText = indexofSpace > -1 ? string.substr(indexofSpace + 1) : "";
    var command = this.GetCommand(CommandName);

    if(command){
        try {
        	CommandText.__proto__.getArgs = function(){
        		var string = this.toString();
        		var args = string.split(' ');
        		for(var i=0, len=args.length; i < len; i++){
        			var a = args[i];
        			if(parseInt(a)){
        				args[i] = parseInt(a);
        			}
        		}

        		return args;
        	};

            command.Execute.call(this, CommandText, client);
        } catch(ex) {
            dumpError(ex);
        }
    }
};

if(typeof global.GMCommands === 'undefined')
	global.GMCommands = new GMCommandsHandler();
else global.GMCommands.__proto__ = GMCommandsHandler.prototype;

vmscript.watch('./Processes/Zone/Commands');

vms('Zone', [
	'Config/world.json',
	'Config/network.json'
], function(){
	util = require('./Modules/util.js');
	util.setupUncaughtExceptionHandler(process.exception);
	CachedBuffer = require('./Modules/CachedBuffer.js');
	PacketCollection = require('./Modules/PacketCollection.js');
	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');
	packets = require('./Helper/packets.js');
	nav_mesh = require('./Modules/navtest-revised.js');
	QuadTree = require('./Modules/QuadTree.js');
	clone = require('clone');

	vmscript.watch('./Generic');

	function ZoneInstance(){
		console.log('Zone Instance Created');
		this.initialized = false;
		this.packetCollection = null;
		this.socketTransferQueue = {};
		this.send = {};
		this.recv = {};
		this.id = parseInt(process.argv[2]);
		this.name = process.argv[3];
		this.AI = null;
		this.QuadTree = null;
		this.Clients = [];
		this.Npc = [];
		this.Items = [];
		this.NpcNodesHash = {};
	}

	ZoneInstance.prototype.addSocket = function(socket){
		if(!this.QuadTree){
			process.log("QuadTree is not initialized");
			return false;
		}else{
			this.Clients.push(socket);
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

	ZoneInstance.prototype.sendToAllArea = function(client, self, buffer, distance){
        var found = this.QuadTree.query({ CVec3: client.character.state.Location, radius: distance, type: ['client'] });
        for(var i=0; i<found.length; i++){
            var f = found[i];
            if(!self && f.object === client) continue;
            if(f.object.write) f.object.write(buffer);
        }
	};

	ZoneInstance.prototype.findPath = function(){
		process.log("Navigation not initialized");
		return null;
	};

	ZoneInstance.prototype.onDisconnect = function(socket){
		this.QuadTree.removeNode(socket.node);
		var index = this.Clients.indexOf(socket);
		if(index > -1){
			this.Clients.splice(this.Clients.indexOf(socket), 1);
			socket.character.save();
			process.log(socket.character.Name, "disconnected");
		}
	};

	ZoneInstance.prototype.onError = function(err, socket){
		process.log(socket.character.Name, "disconnected with error");
	};

	ZoneInstance.prototype.onFindCharacter = function(socket, err, character){
		if(err) {
			process.log(err);
			socket.destroy();
			return;
		}

		if(!character){
			process.log("Character not found");
			socket.destroy();
			return;
		}

	
		socket.character = character;
		socket.character.infos = new CharacterInfos(socket);
		var self = this;
		socket.character.infos.updateAll(function(){
			socket.character.state = new CharacterState();
			socket.character.state.setAccountID(socket.character.AccountID);
			socket.character.state.setCharacterID(socket.character._id);
			socket.character.state.setFromCharacter(socket.character);

			self.addSocket(socket);
			

			CachedBuffer.call(socket, self.packetCollection);
			Zone.sendToAllArea(socket, true, socket.character.state.getPacket(), config.network.viewable_action_distance);
			process.log(character.Name, "connected");
		});
	};

	ZoneInstance.prototype.onMessage = function(type, socket){
		var self = this;
		if(socket)
		switch(type){
			case 'world socket':
			socket.on('end', function() {
				return self.onDisconnect(socket);
			});

			socket.on('close', function() {
				return self.onDisconnect(socket);
			});

			socket.on('disconnect', function() {
				return self.onDisconnect(socket);
			});

			socket.on('error', function(err) {
				return self.onError(err, socket);
			});

			var hash = socket.remoteAddress + ":" + socket.remotePort;
			var characterData = this.socketTransferQueue[hash];
			if(!characterData){
				process.log("could not retrive character data.");
				socket.destroy();
				return;
			}

			delete this.socketTransferQueue[hash]; 

			db.Character.findOne({
				_id: characterData.id,
				AccountID: characterData.accountID
			}, function(err, character) {
				return self.onFindCharacter(socket, err, character);
			});
			break;
		}
		else switch(type.type){
			case 'character data':
			this.socketTransferQueue[type.data.hash] = type.data;
			break;
		}
	};

	ZoneInstance.prototype.addNPC = function(element){
		var npc = new Npc(element);
		npc.setNode(this.QuadTree.addNode(new QuadTree.QuadTreeNode({
			object: npc,
			update: function(node, delta) {
				return {
					x: this.Location.X,
					y: this.Location.Z,
					size: 1
				};
			},
			type: 'npc'
		})), this);
		this.Npc.push(npc);
	};

	ZoneInstance.prototype.addItem = function(owner, item){
	    var obj = new ItemObj();
	    obj.setLocation(owner.character.state.Location);
	    obj.setOwner(owner.character.Name);
	    obj.setObj(item);

	    var node = new QuadTree.QuadTreeNode({
	        object: obj,
	        update: function(node, delta) {
	            return {
	                x: this.Location.X,
	                y: this.Location.Z,
	                size: 1
	            };
	        },
	        type: 'item'
	    });
	    obj.setNode(this.QuadTree.addNode(node));
		console.log(owner.character.Name, 'dropped item #' + obj.NodeID);
		console.log(obj.obj);
	    this.sendToAllArea(owner, true, obj.getPacket(), config.network.viewable_action_distance);
	};

	ZoneInstance.prototype.broadcastStates = function(client){
        var found = Zone.QuadTree.query({ CVec3: client.character.state.Location, radius: config.network.viewable_action_distance, type: ['npc', 'item'] });
        for(var i=0; i<found.length; i++){
            var f = found[i];
            client.write(f.object.getPacket());
        }
	};

	ZoneInstance.prototype.init = function(){
		if(this.initialized) return;
		this.initialized = true;

		var startTime = new Date().getTime();
		
		this.packetCollection = new PacketCollection('ZonePC');

		var self = this;
		process.on('message', function(type, socket){return global.Zone.onMessage(type, socket);});
		var mesh_path = config.world.data_path + "navigation_mesh/" + this.name + '.obj';
		this.AI = new nav_mesh(mesh_path, function(mesh){
			// process.log("Navigation mesh loaded for", self.name);
			// ZoneInstance.prototype.findPath = mesh.findPath;
			// findPath(from, to, actor_radius, callback)
			// from			- object, format: {x, y, z}
			// to			- object, format: {x, y, z}
			// actor_radius	- float
			// callback		- function, returning waypoints

			// mesh.dimensions.top += 1000;
			// mesh.dimensions.bottom -= 1000;
			// mesh.dimensions.left += 1000;
			// mesh.dimensions.right -= 1000;

			var height = Math.abs(mesh.dimensions.bottom) + Math.abs(mesh.dimensions.top);
			var width = Math.abs(mesh.dimensions.right) + Math.abs(mesh.dimensions.left);

			self.QuadTree = new QuadTree({
				x: util.roundDivisable(mesh.dimensions.left, 2),
				y: util.roundDivisable(mesh.dimensions.top, 2),
				size: util.roundDivisable(Math.max(width, height), 2)
			});
			Database(config.world.database.connection_string, function(){
				vmscript.watch('Database');
				vmscript.watch('./Processes/Zone/Packets').on([
						'Packets',
						'Database',
						'Generic'
					], function(){
						fs.readFile(config.world.data_path + 'spawninfo/' + util.padLeft(self.id,'0', 3) + '.NPC', function(err, data) {
							if (err) {
								//console.log(err);
							} else {
								var RecordCount = data.readUInt32LE(0);

								var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
								var length = spawndata.info.length,
									element = null;
								for (var i = 0; i < length; i++) {
									element = spawndata.info[i];
									if (element.ID) {
										self.addNPC(element);
									}
								}
							}
						});


						process.log("Initialized in", (new Date().getTime() - startTime), "ms");
						self.acceptConnections = true;
						process.api.run();
						process.api.zoneInitResponse();
						console.log = process.log;
				});
			});
		});
	}

	// TODO: If error loading zone call process.api.zoneInitResponse(error);
	// Errors loading zones should not stop server from loading just display the error and warning like in old server code :)

	if(typeof Zone === 'undefined') {
		global.Zone = new ZoneInstance();
		global.Zone.init();
	} else {
		global.Zone.__proto__ = ZoneInstance.prototype;
	}
	process.api.invalidateAPI(process.pid);
});