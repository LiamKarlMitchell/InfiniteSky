
vms.depends({name: 'Zone.js', depends: [
    'infos.Npc',
    'infos.Item',
    'infos.Skill',
    'db.Character',
    'packets',
    'QuadTree',
    'packets',
    'Npc',
    'Monster',
    'Item'
]
}, function(){

if(typeof(Zone_Prototype) === 'undefined') {
    Zone_Prototype = {};
}

Zone = function Zone(ID) {
    this.ID = ID;
    this.Init();
};
Zone.prototype = Zone_Prototype;


// END OF NPC Definition
Zone_Prototype.step = function(delta) {
	if (this.Loaded) {
		this.QuadTree.update(delta);
	}
};

Zone_Prototype.Init = function() {
    this.Loaded = false;
    // TODO: Implement Quadtree for these objects
    this.NPC = [];
    this.NPCNextID = 1;
	this.NPCMaxLength = 10000;
    this.Monster = [];
    this.Item = [];
    this.Player = [];
    this.Clients = [];

    this.MoveRegions = [];
	this.SafeRegions = [];

    this.zone_script = {};

    MonsterAICollection = new AICollection();
    NpcAICollection     = new AICollection();
	ZoneAICollection    = new AICollection();

};

Zone_Prototype.clientNodeUpdate = function(node, delta) {
	//if (this.character && this.character.state) {
		return { x: this.character.state.Location.X, y: this.character.state.Location.Z, size: this.character.state.Level };
	//}
	//return null;
};

Zone_Prototype.npcUpdate = function(node, delta) {
	return  { x: this.Location.X, y: this.Location.Z, size: 1 };
};

Zone_Prototype.addSocket = function(socket) {
    // Should check to make sure it dosnt exist already etc.
    this.Clients.push(socket);
    var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: socket, update: this.clientNodeUpdate, type: 'client' }));
    socket.node = node;
    socket.character.state.UniqueID = node.id;

    if(this.zone_script.onClientJoin) this.zone_script.onClientJoin(socket);
    // Create character state object for this socket
    // Send character state object to all with it being compressed
    // Setup any timers needed and shit here
    //socket.character.Talk('Hello World!');
    this.sendToAllAreaLocation(socket.character.state.Location, socket.character.state.getPacket(), config.viewable_action_distance);
};

Zone_Prototype.findCharacterSocket = function(Name) {
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
};

Zone_Prototype.findSocketByCharacterID = function(CharacterID) {
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
};

Zone_Prototype.removeSocket = function(socket) {
    // Remove it from any other updates needed here eg Duel, Monster AI, NPC Talking Too?, Faction Count on Zone etc
    // Remove any zone timers and such
    console.log('Removing Socket');
    this.QuadTree.removeNode(socket.node.id);
    if(this.zone_script.onClientLeave) this.zone_script.onClientLeave(socket);
    //this.Clients = this.Clients.splice(this.Clients.indexOf(socket), 1);
    this.Clients.slice(this.Clients.indexOf(socket), 1);
};

Zone_Prototype.forEachClient = function(func) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false) return;
        return func.call(client);
    });
};

Zone_Prototype.sendToAll = function(buffer) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        client.write(buffer);
    });
};

Zone_Prototype.sendToAllArea = function(origional, sendtoself, buffer, distance) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        if(sendtoself == false && client == origional) return;
        if(client.character.state.Location.getDistance(origional.character.state.Location) <= distance) {
            client.write(buffer);
        }
    });
};

Zone_Prototype.sendToAllAreaLocation = function(location, buffer, distance, self) {
	var found = this.QuadTree.query({ CVec3: location, radius: distance, type: 'client' });

	for (var i=0;i<found.length;i++) {
		if (self && self === found[i].object) continue; // Skip self if required too
		if (found[i].authenticated === false) continue; // Skip not authenticated clients
		
		found[i].object.write(buffer);
	}
};

Zone_Prototype.sendToAllClan = function(buffer, clan) {
    this.Clients.forEach(function(client) {
        if(client.authenticated == false || !client._handle) return;
        if(client.character.Clan == clan) {
            client.write(buffer);
        }
    });
};

Zone_Prototype.getPortal = function(ZoneID) {
    console.log('getPortal ' + ZoneID);
    var portal = null;
    for(var i = 0; i < this.MoveRegions.length; ++i) {
        console.log(i, this.MoveRegions[i].ZoneID, i % 2);
        if(i % 2 == 0 && this.MoveRegions[i].ZoneID === ZoneID) {
            portal = this.MoveRegions[i];
            break;
        }
    }
    return portal;
};

Zone_Prototype.getPortalEndPoint = function(ZoneID) {
    console.log('getPortalEndPoint ' + ZoneID);
    var portal = null;
    for(var i = 0; i < this.MoveRegions.length; ++i) {
        if(i % 2 == 1 && this.MoveRegions[i].ZoneID === ZoneID) {
            portal = this.MoveRegions[i];
            break;
        }
    }
    return portal;
};


// Item
Zone_Prototype.createItem = function(spawninfo) {
	var item = new Item(spawninfo);

	if (typeof(spawninfo) === 'object' && item.Location) {
		item.Location.set(spawninfo.Location);
		if (spawninfo.Direction) {
			item.FacingDirection = spawninfo.Direction;
		}
	}

	return item;
};

Zone_Prototype.addItem = function(item) {
	var zone = this;

	var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: item, update: this.npcUpdate, type: 'item' }));
	item.node = node;
	item.UniqueID = node.id;

	item.updateInterval = setInterval(function() {
		//console.log('Updating information of item.');
		// Send the packet to everyone
		// Send item to all area
		// send the packet to all in area. item.getPacket()
		zone.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance)
	}, 4000);
	item.itemDeathTimer = setTimeout(function() {
		zone.removeItem(item.UniqueID);
	}, 180000); // 3 min 180000 ms

	if (item.OwnerName != '') {
		item.itemOwnerTimer = setTimeout(function() {
			item.OwnerName = '';			
		}, 5000); // 5 sec
	}

	// Send it to clients
	this.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance);
	item.JustSpawned = 0;
};

// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone_Prototype.getItem = function(index) {
	var item = null;
	console.log('Get item ' + index);
	//if (typeof(this.Items[index]) != 'undefined')
	var node = this.QuadTree.nodesHash[index];
	if (node && node.type === 'item') {
		console.log('Item Found');
		item = node.object;
	}
	return item;
};


// See http://codepen.io/LiamKarlMitchell/pen/LCBnH
// Need to make similar functions below. And to make the class objects for each.
Zone_Prototype.removeItem = function(nodeID) {
	//if (typeof(this.Items[id]) != 'undefined')
	// TODO: Find a way to tell client item has gone.
		// Send packet to all saying it got picked up / destroyed
		console.log('Removing item ' + nodeID);
		var node = this.QuadTree.nodesHash[nodeID];
		if (node && node.type === 'item') {
			var item = node.object;
			item.onDelete();
			this.QuadTree.removeNode(nodeID);

			item.JustSpawned = 3;
			item.Life = 0;
			item.ItemID = 0;

			this.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance);
		}
};

Zone_Prototype.clearItems = function() {
	console.log('Clear all items not yet implemented.');
};

// Monster
Zone_Prototype.createMonster = function(spawninfo) {
	//console.log('creating monster with spawninfo: ',spawninfo);
	var mi = infos.Monster[spawninfo.ID];
	if (mi == null) return null;
	var monster = new Monster(mi);
	if (monster == null) return null;
	monster.spawninfo = spawninfo;
	//monster.UniqueID = spawninfo.UniqueID;
	monster.UniqueID = 2;
	monster.ID = this.MonstersNextID;

	this.MonstersNextID++;
	if (this.MonstersNextID > this.MonstersMaxLength) {
		this.MonstersNextID = 0; // Could find next free slot and if none free overwrite older items?
		// Quick sort ftw.
	}

	monster.Location.set(spawninfo.Location);
	monster.LocationTo.set(spawninfo.Location);
	//monster.Velocity.setN(5);
	monster.FacingDirection = spawninfo.Direction;

	//this.Monsters[monster.ID] = monster;
	//Objects.CreateNode(monster);
	//console.log(monster);
	return monster;
};

Zone_Prototype.createMonster = function(spawninfo) {
	var monster = new Monster(spawninfo.ID);
	if (!monster) return null;

	monster.spawninfo = spawninfo;

	monster.ID = this.NPCNextID;

	this.MonsterNextID++;

	if (this.MonsterNextID > this.MonsterMaxLength) {
		this.MonsterNextID = 0; // Could find next free slot and if none free overwrite older items?
		// Quick sort ftw.
	}

	monster.Location.set(spawninfo.Location);
	monster.FacingDirection = spawninfo.Direction;

	//this.Monsters[monster.ID] = monster;

	return monster;
};

Zone_Prototype.addMonster = function(monster) {
	var zone = this;
	monster.zone = this;

	var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: monster, update: this.npcUpdate, type: 'monster' }));
	if (!node) {
		dumpError('Problem adding monster it is outside bounds of quadtree no doubt.');
		return;
	}
	monster.node = node;
	monster.UniqueID = node.id;


	monster.updateInterval = setInterval(function() {
		// Update and send to all in area
		if (zone.Clients.length > 0) {
			zone.sendToAllAreaLocation(monster.Location, monster.getPacket(), config.viewable_action_distance);
		}
	}, 4000);

	// Send it to clients
	zone.sendToAllAreaLocation(monster.Location, monster.getPacket(), config.viewable_action_distance);
	monster.JustSpawned = 0;
	monster.Skill = 1;
	// Should be set to spawn?
	//monster.SetAI(MonsterAIs.Get('Stand'));
};
// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone_Prototype.getMonster = function(index) {
	var monster = null;
	console.log('Get monster ' + index);
	if (this.Monsters[index]) {
		console.log('monster Found');
		monster = this.Monsters[index]; // Check for valid shit later eg distance.
	}
	return monster;
};

Zone_Prototype.removeMonster = function(index) {
	console.log('! CODE removeMonster');
	if (this.Monsters[index]) {
		// Send packet to all saying it got picked up / destroyed
		console.log('Removing monster ' + index);
		var monster = this.Monsters[index];
		monster.onDelete();
		this.QuadTree.removeNode(monster.node);

		monster.JustSpawned = 3;
		monster.unknown1 = 1;
		monster.unknown2 = 1;
		monster.Rotation[0] = 1;
		monster.Rotation[1] = 1;

		this.sendToAllAreaLocation(monster.Location, monster.getPacket(), config.viewable_action_distance);
		//delete this.Monsters[index];
		this.Monsters.splice(index, 1);
	}
};

Zone_Prototype.clearMonsters = function() {
	var zone = this;
	this.Monsters.forEach(function(monster, index) {
		if (item) {
			zone.removeMonster(monster.UniqueID); // Could use index
		}
	});
};


// NPC Functions
// NPC
Zone_Prototype.createNPC = function(spawninfo) {
//console.log('creating monster with spawninfo: ',spawninfo);
var npc = new Npc(spawninfo.ID);
if (!npc) return null;

npc.spawninfo = spawninfo;

npc.ID = this.NPCNextID;

this.NPCNextID++;

if (this.NPCNextID > this.NPCMaxLength) {
	this.NPCNextID = 0; // Could find next free slot and if none free overwrite older items?
	// Quick sort ftw.
}

npc.Location.set(spawninfo.Location);
npc.FacingDirection = spawninfo.Direction;

this.NPC[npc.ID] = npc;

//if (npc.NPCID == 50) console.log(npc.ID, npc.UniqueID, npc.NPCID);
return npc;
};

Zone_Prototype.addNPC = function(npc) {
	var zone = this;
	npc.zone = this;

	var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: npc, update: this.npcUpdate, type: 'npc' }));
	if (!node) {
		dumpError('Problem adding npc it is outside bounds of quadtree no doubt.');
		return;
	}
	npc.node = node;
	npc.UniqueID = node.id;


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
//npc.Skill = 0;
};

// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone_Prototype.getNPC = function(index) {
var npc = null;
console.log('Get npc ' + index);
if (this.NPC[index]) {
	console.log('npc Found');
	// return this.QuadTree.nodes[index]?? Lets use Quad Tree
	npc = this.NPC[index]; // Check for valid shit later eg distance.
}
return npc;
};

Zone_Prototype.getNPCWhereID = function(id) {
var NPC = [];

// Could also just iterate forward.
for (var index = 0; index != this.NPC.length; index++) {
	if (this.NPC[index] && this.NPC[index].NPCID == id) NPC.push(this.NPC[index]);
}

return NPC;
};

Zone_Prototype.removeNPC = function(index) {
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
};

Zone_Prototype.clearNPC = function() {
var zone = this;
this.NPC.forEach(function(npc, index) {
	if (npc) {
		zone.removeNPC(npc.UniqueID); // Could use index
	}
});
};
// End of NPC Functions

// TODO: Prevent zones being loaded duplicate times whilst one is still loading.
Zone_Prototype.Load = function(callback) {
    if(this.Loaded) {
        callback('Already Loaded');
        console.log('Zone ' + this.ID + ' is already loaded.');
        return;
    }    
    // Start Loading world mesh
    // Get width and height and offset from world data

    // Create QuadTree
    this.QuadTree = new QuadTree({
    	x: -50000, y: -50000, size: 100000,
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

		function LoadMonsterSpawns(callback) {
			console.log('Loading Monster Spawns for ' + zone.ID);
			fs.readFile('data/spawninfo/' + _util.padLeft(zone.ID,'0', 3) + '.MOB', function(err, data) {
				if (err) {
					// Meh
				} else {
					var RecordCount = data.readUInt32LE(0);

					var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
					data = null;
					var length = spawndata.info.length,
						element = null;
					for (var i = 0; i < length; i++) {
						element = spawndata.info[i];

						var monster = zone.createMonster(element);
						if (monster) {
							zone.addMonster(monster);
						}
						if (monster == null) {
							console.log('Failed to load monster '+element.ID+' for zone '+zone.getID());
						}
					}
				}

				callback(null, true);
			});
		},
		function LoadNpcspawns(callback) {
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
		},

		function LoadPortals(callback) {
			console.log('Loading Portals for ' + zone.ID);
			fs.readFile('data/world/Z' + _util.padLeft(zone.ID,'0', 3) + '_ZONEMOVEREGION.WREGION', function(err, data) {
				if (err) {
					//console.log(err);
				} else {

					var RecordCount = data.readUInt32LE(0);

					//console.log(RecordCount);
					var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
					data = null;
					var length = wregion.info.length,
						element = null;

					for (var i = 0; i < length; i++) {
						element = wregion.info[i];
						zone.MoveRegions.push(element);
					}
				}

				callback(null, true);
			});
		},

		function LoadSaferegion(callback) {
			console.log('Loading Safe Region for ' + zone.ID);
			fs.readFile('data/world/Z' + _util.padLeft(zone.ID,'0', 3) + '_ZONESAFEREGION.WREGION', function(err, data) {
				if (err) {
					//error loading
					//console.log(err);
				} else {
					var RecordCount = data.readUInt32LE(0);

					var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
					data = null;
					var length = wregion.info.length,
						element = null;
					for (var i = 0; i < length; i++) {
						element = wregion.info[i];
						if (element.Unknown1 != 0) console.log(element, i, zone.ID, 'id not 0');
						if (element.Unknown2 != 0) console.log(element, i, zone.ID, 'id not 0');
						if (element.Unknown3 != 0) console.log(element, i, zone.ID, 'id not 0');

						zone.SafeRegions.push(element);
					}
				}

				callback(null, true);
			});
		}
		], function(err, results) {
			//console.log('Outputing Anim8or File for '+zone.ID);
			//zone.OutputAnim8orFile();
			zone.Loaded = true;
			callback(null, {
				ID: zone.ID,
				Loaded: true
			});
		});


	//}

	
    //callback(null, true);
};
// TODO: Figure out a way to get prototypal inheritance working with node vm...
if (typeof(zones) !== 'undefined') {
	for (var zone in zones) {
		zone.__proto__ = Zone_Prototype;
	}
}

});