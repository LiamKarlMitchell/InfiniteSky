if(typeof(Zone) === 'undefined') {
    Zone: function Zone(ID) {
        this.ID = ID;
        this.Init();
    };
}
Zone.prototype = {
    Init: function() {
        this.Loaded = false;
        // TODO: Implement Quadtree for these objects
        this.NPC = [];
        this.Monster = [];
        this.Item = [];
        this.Player = [];
        this.Clients = [];

        this.zone_script = {};
    },
    addSocket: function(socket) {
        // Should check to make sure it dosnt exist already etc.
        this.Clients.push(socket);
        if(this.zone_script.onClientJoin) this.zone_script.onClientJoin(socket);
        // Create character state object for this socket
        // Send character state object to all with it being compressed
        // Setup any timers needed and shit here
        //socket.character.Talk('Hello World!');
        this.sendToAllAreaLocation(socket.character.state.Location, packets.makeCompressedPacket(
        0x18, new Buffer(
        packets.ActionReplyPacket.pack(
        socket.character.state))), util.config.viewable_action_distance);
    },
    findCharacterSocket: function(Name) {
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
    },
    findSocketByCharacterID: function(CharacterID) {
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
    },
    removeSocket: function(socket) {
        // Remove it from any other updates needed here eg Duel, Monster AI, NPC Talking Too?, Faction Count on Zone etc
        // Remove any zone timers and such
        if(this.zone_script.onClientLeave) this.zone_script.onClientLeave(socket);
        //this.Clients = this.Clients.splice(this.Clients.indexOf(socket), 1);
        this.Clients.slice(this.Clients.indexOf(socket), 1);
    },
    forEachClient: function(func) {
        this.Clients.forEach(function(client) {
            if(client.authenticated == false) return;
            return func.call(client);
        });
    },
    sendToAll: function(buffer) {
        this.Clients.forEach(function(client) {
            if(client.authenticated == false || !client._handle) return;
            client.write(buffer);
        });
    },
    sendToAllArea: function(origional, sendtoself, buffer, distance) {
        this.Clients.forEach(function(client) {
            if(client.authenticated == false || !client._handle) return;
            if(sendtoself == false && client == origional) return;
            if(client.character.state.Location.getDistance(origional.character.state.Location) <= distance) {
                client.write(buffer);
            }
        });
    },
    sendToAllAreaLocation: function(location, buffer, distance, self) {
        this.Clients.forEach(function(client) {
            if(client.authenticated == false || !client._handle) return;
            if(self && client == self) return; // Skip sending to self if self is set
            if(client.character.state.Location.getDistance(location) <= distance) {
                client.write(buffer);
            }
        });
    },
    sendToAllClan: function(buffer, clan) {
        this.Clients.forEach(function(client) {
            if(client.authenticated == false || !client._handle) return;
            if(client.character.Clan == clan) {
                client.write(buffer);
            }
        });
    },
    getPortal: function(ZoneID) {
        console.log('getPortal ' + ZoneID);
        var portal = null
        for(var i = 0; i < this.MoveRegions.length; ++i) {
            console.log(i, this.MoveRegions[i].ZoneID, i % 2);
            if(i % 2 == 0 && this.MoveRegions[i].ZoneID == ZoneID) {
                portal = this.MoveRegions[i];
                break;
            }
        }
        return portal;
    },
    getPortalEndPoint: function(ZoneID) {
        console.log('getPortalEndPoint ' + ZoneID);
        var portal = null;
        for(var i = 0; i < this.MoveRegions.length; ++i) {
            if(i % 2 == 1 && this.MoveRegions[i].ZoneID == ZoneID) {
                portal = this.MoveRegions[i];
                break;
            }
        }
        return portal;
    },
    Load: function(callback) {
        if(this.Loaded) {
            callback('Already Loaded');
            console.log('Zone ' + this.ID + ' is already loaded.');
            return;
        }
        // Start Loading world mesh
        // Monster Spawns
        // NPC Spawns
        // Map Scripts
        // Finally

        // TODO: Implement zone loading info
		// 	async.series([

		// 	function LoadTerrain(callback) {
		// 		TerrainLoad.call(zone, zoneinfo.Name, function(err) {
		// 			callback(null, true);
		// 			//console.log('Map Y at 0,0 is '+zone.GetY(0, 0));
		// 		});
		// 	},

		// 	function LoadMonsterSpawns(callback) {
		// 		console.log('Loading Monster Spawns for ' + zoneinfo.Name);
		// 		fs.readFile('data/spawninfo/' + numberZeroFill(zoneinfo.ID, 3) + '.MOB', function(err, data) {
		// 			if (err) {
		// 				// Meh
		// 			} else {
		// 				var RecordCount = data.readUInt32LE(0);

		// 				var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
		// 				data = null;
		// 				var length = spawndata.info.length,
		// 					element = null;
		// 				for (var i = 0; i < length; i++) {
		// 					element = spawndata.info[i];

		// 					var monster = zone.createMonster(element);
		// 					if (monster) {

		// 						zone.addMonster(monster);

		// 					}
		// 					if (monster == null) {
		// 						//console.log('Failed to load monster '+element.ID+' for zone '+zone.getID());
		// 					}
		// 				}
		// 			}

		// 			callback(null, true);
		// 		});
		// 	}, function LoadNPCSpawns(callback) {
		// 		console.log('Loading NPC Spawns for ' + zoneinfo.Name);
		// 		fs.readFile('data/spawninfo/' + numberZeroFill(zoneinfo.ID, 3) + '.NPC', function(err, data) {
		// 			if (err) {
		// 				//console.log(err);
		// 			} else {
		// 				var RecordCount = data.readUInt32LE(0);

		// 				//console.log(RecordCount);
		// 				var spawndata = restruct.struct('info', structs.SpawnInfo, RecordCount).unpack(data.slice(4));
		// 				data = null;
		// 				var length = spawndata.info.length,
		// 					element = null;
		// 				for (var i = 0; i < length; i++) {
		// 					element = spawndata.info[i];
		// 					//eyes.inspect(element);
		// 					if (element.ID) {
		// 						var npc = zone.createNPC(element);
		// 						zone.addNPC(npc);
		// 					}
		// 				}
		// 			}

		// 			callback(null, true);
		// 		});
		// 	},

		// 	function LoadPortals(callback) {
		// 		console.log('Loading Portals for ' + zoneinfo.Name);
		// 		fs.readFile('data/world/' + zoneinfo.Name + '_ZONEMOVEREGION.WREGION', function(err, data) {
		// 			if (err) {
		// 				//console.log(err);
		// 			} else {

		// 				var RecordCount = data.readUInt32LE(0);

		// 				//console.log(RecordCount);
		// 				var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
		// 				data = null;
		// 				var length = wregion.info.length,
		// 					element = null;

		// 				for (var i = 0; i < length; i++) {
		// 					element = wregion.info[i];
		// 					zone.MoveRegions.push(element);
		// 				}
		// 			}

		// 			callback(null, true);
		// 		});
		// 	},

		// 	function LoadSaferegion(callback) {
		// 		console.log('Loading Safe Region for ' + zoneinfo.Name);
		// 		fs.readFile('data/world/' + zoneinfo.Name + '_ZONESAFEREGION.WREGION', function(err, data) {
		// 			if (err) {
		// 				//error loading
		// 				//console.log(err);
		// 			} else {
		// 				var RecordCount = data.readUInt32LE(0);

		// 				var wregion = restruct.struct('info', structs.WREGION, RecordCount).unpack(data.slice(4));
		// 				data = null;
		// 				var length = wregion.info.length,
		// 					element = null;
		// 				for (var i = 0; i < length; i++) {
		// 					element = wregion.info[i];
		// 					if (element.Unknown1 != 0) console.log(element, i, zone.ID, 'id not 0');
		// 					if (element.Unknown2 != 0) console.log(element, i, zone.ID, 'id not 0');
		// 					if (element.Unknown3 != 0) console.log(element, i, zone.ID, 'id not 0');

		// 					zone.SafeRegions.push(element);
		// 				}
		// 			}

		// 			callback(null, true);
		// 		});
		// 	}], function(err, results) {
		// 		//console.log('Outputing Anim8or File for '+zone.Name);
		// 		//zone.OutputAnim8orFile();
		// 		callback_function(null, {
		// 			ID: zoneinfo.ID,
		// 			Loaded: true
		// 		});
		// 	});


		// }


        callback(null, true);
    }
};
main.events.emit('gameinfo_loaded', 'Zone');