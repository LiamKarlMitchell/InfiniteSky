
vms.depends({name: 'Zone.js', depends: [
    'infos.Npc',
    'infos.Item',
    'infos.Skill',
    'db.Character',
    'packets',
    'QuadTree',
    'packets',
    'Npc'
]
}, function(){
console.log('Woo');
if(typeof(Zone) === 'undefined') {
    Zone = function Zone(ID) {
        this.ID = ID;
        this.Init();
    };
    Zone.prototype = {};
}

// MONSTER NPC ITEM
// Move me into new thing
var Item = function(info) {
	this.ItemUniqueID = 0;
	this.SomeID = 0;
	this.ItemID = info.ID || 1;
	this.Amount = info.Amount || 1;
	this.Life = 0;
	//this.unknown1
	this.Enchant = 0;
	//this.unknown2
	this.Location = new CVec3();
	this.Owner_Name = info.Owner || '';
	//this.unknown3
	//this.Direction
	this.JustSpawned = 1;

	this.getPacket = function() {
		var packet = packets.makeCompressedPacket(0x1B, new Buffer(packets.ItemObject.pack(this)));
		return packet;
	}

	this.onDelete = function() {
		// Remove timers and intervals to free up references
		clearInterval(this.updateInterval);
		clearTimeout(this.itemTimer);
	}

	this.setLocationRandomOffset = function(Location, Radius) {
		// Set the location to random spot in a circle? :D
	}
}

var Monster = function(MonsterInfo) {
	AIModule.AIObject.call(this);
	this.Attackers = new AIModule.AttackerCollection();
	this.WalkSpeed = MonsterInfo.WalkSpeed;

	this.RunSpeed = MonsterInfo.RunSpeed;
	//console.log(this);
	this.UniqueID = 0;
	this.AttackID = 2;
	this.MonsterID = MonsterInfo.ID;

	this.Life = 1;
	this.Stance = 0;
	this.Skill = 0;
	this.Frame = 0;
	this.Location = new CVec3();
	this.LocationTo = new CVec3();
	this.Direction = 0;
	this.TargetDirection = 0;
	this.TargetObjectIndex = -1;
	//'Unknown3',7
	this.FacingDirection = 0;
	this.MaxHP = MonsterInfo.Health;

	//Step
	this.TBlock = Math.floor((Math.random() * 500) + 1);;
	this.LBlock = 0;
	this.Velocity = new CVec3();

	this.getOnlineAliveAttackers = function() {
		var attackers = this.Attackers.sort();
		var tmp = [];
		var a = null;

		if (attackers.length) {
			for (var i in attackers) {
				a = zone.findSocketByCharacterID(attackers[i].ID);
				if (a) {
					if (a.character.state.CurrentHP > 0) {
						tmp.push({
							index: i,
							client: a,
							Damage: attackers[i].Damage,
							ID: attackers[i].ID
						});
					}
				}
			}
		}
		return tmp;
	}

	// Get info from MonsterInfo
	this.fullHeal = function() {
		this.HP = MonsterInfo.Health;
		//this.Chi = this.info.Chi;
	}

	this.fullHeal();
	// Need a stat setup here
	this.getPacket = function() {
		var packet = packets.makeCompressedPacket(0x1A, new Buffer(packets.MonsterObject.pack(this)));
		return packet;
	}

	this.getWSpeed = function() {
		return this.WalkSpeed;
	}

	this.getRSpeed = function() {
		return this.RunSpeed;
	}

	this.onDelete = function() {
		this.Clear();
		Attackers.Clear();
		this.delete();
	}

	this.setLocationRandomOffset = function(Location, Radius) {
		// Set the location to random spot in a circle? :D
	}

	this.onDeath = function(Killer) {
		if (Killer) {
			// Killed by player, monster, npc?
			switch (typeof(Killer.constructor.name)) {
			case "Monster":
				break;
			case "NPC":
				break;
			case "Socket":
				// Handle Item Drop and Giving EXP/Silver/CP
				break;
			case "World":
				break;
			}
		}
	}

	//this.setAI(MonAICollection.Get('Brain'));
	//this.setAI(MonAICollection.Get('Explore'));
}

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
    socket.character.state.UniqueID = node.id;

    if(this.zone_script.onClientJoin) this.zone_script.onClientJoin(socket);
    // Create character state object for this socket
    // Send character state object to all with it being compressed
    // Setup any timers needed and shit here
    //socket.character.Talk('Hello World!');
    this.sendToAllAreaLocation(socket.character.state.Location, socket.character.state.getPacket(), config.viewable_action_distance);
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

// Item
Zone.prototype.createItem = function(spawninfo) {
	var item = new Item(spawninfo);
	item.ItemUniqueID = this.ItemsNextID;
	this.ItemsNextID++;
	if (this.ItemsNextID > this.ItemsMaxLength) {
		this.ItemNextID = 0; // Could find next free slot and if none free overwrite older items?
		// Quick sort ftw.
	}
	//item.UniqueID = spawninfo.UniqueID;
	item.UniqueID = 2;

	item.Location.set(spawninfo.Location);
	//item.Velocity.setN(5);
	item.FacingDirection = spawninfo.Direction;

	return item;
}
Zone.prototype.addItem = function(item) {
	var zone = this;

	var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: item, update: this.npcUpdate, type: 'item' }));
	item.node = node;

	item.updateInterval = setInterval(function() {
		//console.log('Updating information of item.');
		// Send the packet to everyone
		// Send item to all area
		// send the packet to all in area. item.getPacket()
		zone.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance)
	}, 4000);
	item.itemDeathTimer = setTimeout(function() {
		console.log('Destroying item.');
		zone.removeItem(item.ItemUniqueID);
		// Send the packet to everyone
		// Send item to all area
		// send the packet to all in area. item.getPacket()
		// zone.SendToAllAreaLocation( item.Location,item.getPacket(),config.viewable_action_distance )
	}, 5000); // 3 min 180000
	this.Items[item.ItemUniqueID] = item;

	// Send it to clients
	this.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance);
	item.JustSpawned = 0;
},
// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone.prototype.getItem = function(index) {
	var item = null;
	console.log('Get item ' + index);
	//if (typeof(this.Items[index]) != 'undefined')
	if (this.Items[index]) {
		console.log('Item Found');
		item = this.Items[index]; // Check for valid shit later eg distance.
	}
	return item;
},

// See http://codepen.io/LiamKarlMitchell/pen/LCBnH
// Need to make similar functions below. And to make the class objects for each.
Zone.prototype.removeItem = function(index) {
	//if (typeof(this.Items[id]) != 'undefined')
	if (this.Items[index]) {
		// Send packet to all saying it got picked up / destroyed
		console.log('Removing item ' + index);
		var item = this.Items[index];
		item.onDelete();
		this.QuadTree.removeNode(item.node);

		item.JustSpawned = 3;
		item.unknown1 = 1;
		item.unknown2 = 1;
		//item.Rotation[0]=1;
		//item.Rotation[1]=1;
		this.sendToAllAreaLocation(item.Location, item.getPacket(), config.viewable_action_distance);
		//delete this.Items[index];
		//this.Items.splice(index,1);
		delete this.Items[index];
	}
}

Zone.prototype.clearItems = function() {
	var zone = this;
	this.Items.forEach(function(item, index) {
		if (item) {
			zone.removeItem(item.ItemUniqueID); // Could use index
		}
	});
}

// Monster
Zone.prototype.createMonster = function(spawninfo) {
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
}

Zone.prototype.addMonster = function(monster) {
	// monster.updateInterval = setInterval(function() {
	// 	//console.log('Updating information of monster.');
	// 	// Send the packet to everyone
	// 	// Send monster to all area
	// 	// send the packet to all in area. monster.getPacket()
	// 	zone.sendToAllAreaLocation(monster.Location, monster.getPacket(), config.viewable_action_distance)
	// }, 4000);
	// monster.monsterDeathTimer = setTimeout(function() {
	//   console.log('Destroying monster.');
	//   zone.removeMonster(monster.UniqueID);
	//   // Send the packet to everyone
	//   // Send item to all area
	//   // send the packet to all in area. item.getPacket()
	//   // zone.SendToAllAreaLocation( item.Location,item.getPacket(),config.viewable_action_distance )
	// },180000); // 3 min
	var node = this.QuadTree.addNode(new QuadTree.QuadTreeNode({ object: monster, update: this.npcUpdate, type: 'monster' }));
	monster.node = node;

	this.Monsters[monster.UniqueID] = monster; // won't need in future.
	//monster.SetAI(MonsterAIs.Get('Stand'));
	this.Objects.CreateNode(monster); // Set its ai here to spawned?
	// Send it to clients
	this.sendToAllAreaLocation(monster.Location, monster.getPacket(), config.viewable_action_distance);
	monster.JustSpawned = 0;
	monster.Skill = 1;
},
// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone.prototype.getMonster = function(index) {
	var monster = null;
	console.log('Get monster ' + index);
	if (this.Monsters[index]) {
		console.log('monster Found');
		monster = this.Monsters[index]; // Check for valid shit later eg distance.
	}
	return monster;
},

Zone.prototype.removeMonster = function(index) {
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
}

Zone.prototype.clearMonsters = function() {
	var zone = this;
	this.Monsters.forEach(function(monster, index) {
		if (item) {
			zone.removeMonster(monster.UniqueID); // Could use index
		}
	});
}


// NPC Functions
// NPC
Zone.prototype.createNPC = function(spawninfo) {
//console.log('creating monster with spawninfo: ',spawninfo);
var npc = new Npc(spawninfo.ID);

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
npc.Skill = 0;
}
// Expects itemjson to have Row, Column, ID
// Basicaly storageItemSchema is what we are retriving in character.js
Zone.prototype.getNPC = function(index) {
var npc = null;
console.log('Get npc ' + index);
if (this.NPC[index]) {
	console.log('npc Found');
	// return this.QuadTree.nodes[index]?? Lets use Quad Tree
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
		// 	console.log('Loading Monster Spawns for ' + zone.ID);
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