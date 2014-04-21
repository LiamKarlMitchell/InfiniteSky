
vms.depends({name: 'Zone.js', depends: [
    'infos.Npc',
    'infos.Item',
    'infos.Skill',
    'db.Character',
    'packets',
    'QuadTree'
]
}, function(){

if(typeof(Zone) === 'undefined') {
    Zone = function Zone(ID) {
        this.ID = ID;
        this.Init();
    };
    Zone.prototype = {};
}


// NPC Definition
packets.NPCObject = restruct.
    //int8lu('Status').
    int32lu('UniqueID').
    int32lu('ID').
    int32lu('NPCID').
    int32lu('Life').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    int32lu('Unknown3',3).
    float32l('Direction').
    float32l('TargetDirection').
    int32ls('TargetObjectIndex').
    int32lu('Unknown3',4).
    struct('LocationTo',structs.CVec3).
    float32l('FacingDirection').
    int32lu('HP');

// TODO: Convert NPC Definition to a better layout for vmscript
var NPC = function(ID) {
	//AIModule.AIObject.call(this);
	AIObject.call(this);
	//var Attackers = new AIModule.AttackerCollection();
	var Attackers = new AttackerCollection();
	this.UniqueID = 0;
	this._ID = 0; // Faction ID?
	this.NPCID = ID;

	this.Life = 1;
	this.Stance = 0;
	this.Skill = 0;
	this.Frame = 0;
	Location = new CVec3();
	LocationTo = new CVec3();
	this.Direction = 0;
	this.TargetDirection = 0;
	this.TargetObjectIndex = -1;
	//'Unknown3',7
	this.FacingDirection = 0;
	this.HP = 1;


	// Get info from NPCInfo
	//this.info = NPCInfo.getByID(this.NPCID);
	// Set up health and stats etc	
	this.getPacket = function() {
		var packet = packets.makeCompressedPacket(0x19, new Buffer(packets.NPCObject.pack(this)));
		return packet;
	};

	this.onDelete = function() {
		// Remove timers and intervals to free up references
		clearInterval(this.updateInterval);
		//clearTimeout(this.monsterDeathTimer);
	};

	this.setLocationRandomOffset = function(Location, Radius) {
		// Set the location to random spot in a circle? :D
	};
};

// END OF NPC Definition
Zone.prototype.step = function(delta) {
	if (this.Loaded) {
		this.QuadTree.update(delta);
	}
}

Zone.prototype.Init = function() {
    this.Loaded = false;
    // TODO: Implement Quadtree for these objects
    this.NPC = [];
    this.NPCNextID = 1;
	this.NPCMaxLength = 10000;
    this.Monster = [];
    this.Item = [];
    this.Player = [];
    this.Clients = [];

    this.zone_script = {};

    MonsterAICollection = new AICollection();
    NpcAICollection     = new AICollection();
	ZoneAICollection    = new AICollection();

}

Zone.prototype.clientNodeUpdate = function(node, delta) {
	//if (this.character && this.character.state) {
		return { x: this.character.state.Location.X, y: this.character.state.Location.Z, size: this.character.state.Level };
	//}
	//return null;
}
Zone.prototype.npcUpdate = function(node, delta) {
	return  { x: this.Location.X, y: this.Location.Z, size: 1 };
}

Zone.prototype.addSocket = function(socket) {
    // Should check to make sure it dosnt exist already etc.
    this.Clients.push(socket);
    var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: socket, update: this.clientNodeUpdate, type: 'client' }));
    socket.node = node;

    if(this.zone_script.onClientJoin) this.zone_script.onClientJoin(socket);
    // Create character state object for this socket
    // Send character state object to all with it being compressed
    // Setup any timers needed and shit here
    //socket.character.Talk('Hello World!');
    this.sendToAllAreaLocation(socket.character.state.Location, packets.makeCompressedPacket(
    0x18, new Buffer(
    packets.ActionReplyPacket.pack(
    socket.character.state))), config.viewable_action_distance);
}
Zone.prototype.findCharacterSocket = function(Name) {
    var socket = null;
    // Search connected clients
    //console.log('There are this many clients in zone ' + this.Clients.length);
    for(var i = 0; i < this.Clients.length; ++i) {
        if(this.Clients[i].character.Name == Name && this.Clients[i]._handle) {
            socket = this.Clients[i];
            break;
        }
    }
    return socket;
}
Zone.prototype.findSocketByCharacterID = function(CharacterID) {
    var socket = null;
    // Search connected clients
    //console.log('There are this many clients in zone ' + this.Clients.length);
    for(var i = 0; i < this.Clients.length; ++i) {
        if(this.Clients[i].character._id == CharacterID && this.Clients[i]._handle) {
            socket = this.Clients[i];
            break;
        }
    }
    return socket;
}
Zone.prototype.removeSocket = function(socket) {
    // Remove it from any other updates needed here eg Duel, Monster AI, NPC Talking Too?, Faction Count on Zone etc
    // Remove any zone timers and such
    this.QuadTree.removeNode(socket.node);
    if(this.zone_script.onClientLeave) this.zone_script.onClientLeave(socket);
    //this.Clients = this.Clients.splice(this.Clients.indexOf(socket), 1);
    this.Clients.slice(this.Clients.indexOf(socket), 1);
}
Zone.prototype.forEachClient = function(func) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false) return;
        return func.call(client);
    });
}
Zone.prototype.sendToAll = function(buffer) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        client.write(buffer);
    });
}
Zone.prototype.sendToAllArea = function(origional, sendtoself, buffer, distance) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        if(sendtoself == false && client == origional) return;
        if(client.character.state.Location.getDistance(origional.character.state.Location) <= distance) {
            client.write(buffer);
        }
    });
}
Zone.prototype.sendToAllAreaLocation = function(location, buffer, distance, self) {
	var found = this.QuadTree.query({ CVec3: location, radius: distance, type: 'client' });

	for (var i=0;i<found.length;i++) {
		if (self && self === found[i].object) continue; // Skip self if required too
		if (found[i].authenticated === false) continue; // Skip not authenticated clients
		
		found[i].object.write(buffer);
	}
}
Zone.prototype.sendToAllClan = function(buffer, clan) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        if(client.character.Clan == clan) {
            client.write(buffer);
        }
    });
}
Zone.prototype.getPortal = function(ZoneID) {
    console.log('getPortal ' + ZoneID);
    var portal = null
    for(var i = 0; i < this.MoveRegions.length; ++i) {
        console.log(i, this.MoveRegions[i].ZoneID, i % 2);
        if(i % 2 == 0 && this.MoveRegions[i].ZoneID === ZoneID) {
            portal = this.MoveRegions[i];
            break;
        }
    }
    return portal;
}
Zone.prototype.getPortalEndPoint = function(ZoneID) {
    console.log('getPortalEndPoint ' + ZoneID);
    var portal = null;
    for(var i = 0; i < this.MoveRegions.length; ++i) {
        if(i % 2 == 1 && this.MoveRegions[i].ZoneID === ZoneID) {
            portal = this.MoveRegions[i];
            break;
        }
    }
    return portal;
}

// NPC Functions
// NPC
Zone.prototype.createNPC = function(spawninfo) {
//console.log('creating monster with spawninfo: ',spawninfo);
var npc = new NPC(spawninfo.ID);

npc.spawninfo = spawninfo;
//npc.UniqueID = spawninfo.UniqueID;
npc.UniqueID = 3;

npc.ID = this.NPCNextID;

this.NPCNextID++;

if (this.NPCNextID > this.NPCMaxLength) {
	this.NPCNextID = 0; // Could find next free slot and if none free overwrite older items?
	// Quick sort ftw.
}

npc.Location = spawninfo.Location;
npc.FacingDirection = spawninfo.Direction;

this.NPC[npc.ID] = npc;

//if (npc.NPCID == 50) console.log(npc.ID, npc.UniqueID, npc.NPCID);
return npc;
}

Zone.prototype.addNPC = function(npc) {
var zone = this;
npc.zone = this;

var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: npc, update: this.npcUpdate, type: 'npc' }));
npc.node = node;


npc.updateInterval = setInterval(function() {
	// Update and send to all in area
	if (zone.Clients.length > 0) {
		zone.sendToAllAreaLocation(npc.Location, npc.getPacket(), config.viewable_action_distance);
	}
}, 4000);
this.NPC[npc.UniqueID] = npc;

// Send it to clients
zone.sendToAllAreaLocation(npc.Location, npc.getPacket(), config.viewable_action_distance);
npc.JustSpawned = 0;
npc.Skill = 0;
}
// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone.prototype.getNPC = function(index) {
var npc = null;
console.log('Get npc ' + index);
if (this.NPC[index]) {
	console.log('npc Found');
	npc = this.NPC[index]; // Check for valid shit later eg distance.
}
return npc;
}

Zone.prototype.getNPCWhereID = function(id) {
var NPC = [];

// Could also just iterate forward.
for (var index = 0; index != this.NPC.length; index++) {
	if (this.NPC[index] && this.NPC[index].NPCID == id) NPC.push(this.NPC[index]);
}

return NPC;
}

Zone.prototype.removeNPC = function(index) {
if (this.NPC[index]) {
	// Send packet to all saying it got picked up / destroyed
	console.log('Removing npc ' + index);
	var npc = this.NPC[index];
	npc.onDelete();
	this.QuadTree.removeNode(npc.node);

	npc.JustSpawned = 3;
	npc.unknown1 = 1;
	npc.unknown2 = 1;
	npc.Rotation[0] = 1;
	npc.Rotation[1] = 1;

	this.sendToAllAreaLocation(npc.Location, npc.getPacket(), config.viewable_action_distance);
	///delete this.NPC[index];
	this.NPC.splice(index, 1);
}
}

Zone.prototype.clearNPC = function() {
var zone = this;
this.NPC.forEach(function(npc, index) {
	if (npc) {
		zone.removeNPC(npc.UniqueID); // Could use index
	}
});
}
// End of NPC Functions

// TODO: Prevent zones being loaded duplicate times whilst one is still loading.
Zone.prototype.Load = function(callback) {
    if(this.Loaded) {
        callback('Already Loaded');
        console.log('Zone ' + this.ID + ' is already loaded.');
        return;
    }    
    // Start Loading world mesh
    // Get width and height and offset from world data

    // Create QuadTree
    this.QuadTree = new QuadTree({x: -10000, y: -10000, size: 20000,
		depth: config.quadtree_depth || 6,
		limit: config.quadtree_limit || 10
	});
    var zone = this;
    // Monster Spawns
    // NPC Spawns
    // Map Scripts
    // Finally

    // TODO: Implement zone loading info
	async.series([

	// 	function LoadTerrain(callback) {
	// 		TerrainLoad.call(zone, zoneinfo.Name, function(err) {
	// 			callback(null, true);
	// 			//console.log('Map Y at 0,0 is '+zone.GetY(0, 0));
	// 		});
	// 	},

		// function LoadMonsterSpawns(callback) {
		// 	console.log('Loading Monster Spawns for ' + zone.Name);
		// 	fs.readFile('data/spawninfo/' + _util.padLeft(zone.ID,'0', 3) + '.MOB', function(err, data) {
		// 		if (err) {
		// 			// Meh
		// 		} else {
		// 			var RecordCount = data.readUInt32LE(0);

		// 			var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
		// 			data = null;
		// 			var length = spawndata.info.length,
		// 				element = null;
		// 			for (var i = 0; i < length; i++) {
		// 				element = spawndata.info[i];

		// 				var monster = zone.createMonster(element);
		// 				if (monster) {

		// 					zone.addMonster(monster);

		// 				}
		// 				if (monster == null) {
		// 					//console.log('Failed to load monster '+element.ID+' for zone '+zone.getID());
		// 				}
		// 			}
		// 		}

		// 		callback(null, true);
		// 	});
		// },
		function LoadNPCpawns(callback) {
			console.log('Loading NPC Spawns for zone ' + zone.ID);
			fs.readFile('data/spawninfo/' + _util.padLeft(zone.ID,'0', 3) + '.NPC', function(err, data) {
				if (err) {
					//console.log(err);
				} else {
					var RecordCount = data.readUInt32LE(0);

					//console.log(RecordCount);
					var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
					data = null;
					var length = spawndata.info.length,
						element = null;
					for (var i = 0; i < length; i++) {
						element = spawndata.info[i];
						//eyes.inspect(element);
						if (element.ID) {
							var npc = zone.createNPC(element);
							zone.addNPC(npc);
						}
					}
				}

				callback(null, true);
			});
		}
		// ,

		// function LoadPortals(callback) {
		// 	console.log('Loading Portals for ' + zone.Name);
		// 	fs.readFile('data/world/' + zone.Name + '_ZONEMOVEREGION.WREGION', function(err, data) {
		// 		if (err) {
		// 			//console.log(err);
		// 		} else {

		// 			var RecordCount = data.readUInt32LE(0);

		// 			//console.log(RecordCount);
		// 			var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
		// 			data = null;
		// 			var length = wregion.info.length,
		// 				element = null;

		// 			for (var i = 0; i < length; i++) {
		// 				element = wregion.info[i];
		// 				zone.MoveRegions.push(element);
		// 			}
		// 		}

		// 		callback(null, true);
		// 	});
		// },

		// function LoadSaferegion(callback) {
		// 	console.log('Loading Safe Region for ' + zone.Name);
		// 	fs.readFile('data/world/' + zone.Name + '_ZONESAFEREGION.WREGION', function(err, data) {
		// 		if (err) {
		// 			//error loading
		// 			//console.log(err);
		// 		} else {
		// 			var RecordCount = data.readUInt32LE(0);

		// 			var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
		// 			data = null;
		// 			var length = wregion.info.length,
		// 				element = null;
		// 			for (var i = 0; i < length; i++) {
		// 				element = wregion.info[i];
		// 				if (element.Unknown1 != 0) console.log(element, i, zone.ID, 'id not 0');
		// 				if (element.Unknown2 != 0) console.log(element, i, zone.ID, 'id not 0');
		// 				if (element.Unknown3 != 0) console.log(element, i, zone.ID, 'id not 0');

		// 				zone.SafeRegions.push(element);
		// 			}
		// 		}

		// 		callback(null, true);
		// 	});
		// }
		], function(err, results) {
			//console.log('Outputing Anim8or File for '+zone.Name);
			//zone.OutputAnim8orFile();
			zone.Loaded = true;
			callback(null, {
				ID: zone.ID,
				Loaded: true
			});
		});


	//}

	
    //callback(null, true);
}
// TODO: Figure out a way to get prototypal inheritance working with node vm...
if (typeof(zones) !== 'undefined') {
	for (var zone in zones) {
		zone.__proto__ = Zone.prototype;
	}
}

});