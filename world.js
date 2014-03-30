// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

if (typeof(world) === 'undefined') {
    world = {
        packets: new PacketCollection('./packets/world','WorldPC',require('./sandbox')),
        start: function () {
            this.server = net.createServer(function (socket) { world.connection(socket); });
            console.log('World server starting listen on port: '+util.config.ports.world);
            this.server.listen(util.config.ports.world);

            main.events.on('step', function(delta) {world.GameStep(delta)});
        },
        running: true
    };
    // Need to move to world.js
    var clients = [];
    var clientID = 0;
    var socket_transfers = [];
}

// zones is an object which will contain references to each zone object by its id.
if (typeof(zones) === 'undefined') {
    zones = {};
}

world.GameStep = function(delta) {
    // Do something with delta
    // console.log('Delta: '+delta);
};

world.connection = function(socket) {
    console.log("Client #" + clientID + " connected from IP "+socket.remoteAddress);

     socket.clientID = clientID;
     clientID++;
     socket.authenticated = false;

     socket.characters = [];

     //Handle socket disconnection
     socket.on('end', function() {
         console.log('Client #' + socket.clientID + ' ended connection');
         clients.splice(clients.indexOf(socket), 1);
         delete world[socket.clientID];
         db.Account.logoutUser(socket);
     });

     socket.on('error', function(err) {
         console.log('Client #' + socket.clientID + ' error: '+err);
         socket.destroy();
     });

     // Need to find out which functions to use and make this tidyer....
     // Need to check for memory leaks and make sure we actually delete the un needed socket.
     // Need to make sure using splice won't be slower than deleting the index.
     // Should maybe look at using room or list rather than array of socket object.
     socket.on('close', function() {
         console.log('Client #' + socket.clientID + ' closed connection');

         clients.splice(clients.indexOf(socket), 1);
         delete world[socket.clientID];
         //var i = allClients.indexOf(socket);
         //delete allClients[i];
         db.Account.logoutUser(socket);
     });

     socket.on('disconnect', function() {
         console.log('Client #' + socket.clientID + ' disconnected');

         clients.splice(clients.indexOf(socket), 1);
         delete world[socket.clientID];
         //var i = allClients.indexOf(socket);
         //delete allClients[i];
         // Remove from zone transfer list if its there
         db.Account.logoutUser(socket);

         try {
             world.packets.onDisconnected(socket);
         } catch (e) {
             util.dumpError(e);
         }
     });

     CachedBuffer.call(socket,world.packets);

     //Let client know how many people are playing on server
     try {
         world.packets.onConnected(socket);
     } catch (e) {
         util.dumpError(e);
     }

     clients.push(socket);
     world[socket.ID] = socket;
};

world.findAccountSocket = function(name) {
    for (var i=0;i<clients.length;i++) {
        if (clients[i].authenticated) {
            if (clients[i].ai.username === name) {
                return clients[i];
            }
        }
    }
    return null;
};

world.findSocketByCharacterID = function(CharacterID) {
    // Search connected clients
    for (var i = 0; i < clients.length; ++i) {
        if (clients[i].character._id == CharacterID && clients[i]._handle) {
            return clients[i];
        }
    }
    return null;
}

world.findCharacterSocket = function(Name) {
    // Search connected clients
    for (var i = 0; i < clients.length; ++i) {
        if (clients[i].character.Name == Name && clients[i]._handle) {
            socket = clients[i];
            break;
        }
    }
    return null;
};


world.addSocketToTransferQueue = function(socket) {
    if (socket.authenticated == false) return;
    // set a timeout on the object for logging out the account if it is not removed from world list
    socket.zoneTransferLogout = socket.setTimeout(socket.LogoutUser, util.config.zoneTransferLogoutTimer || 60000);
    socket_transfers.push(socket);
}

world.getSocketFromTransferQueue = function(Username) {
    var socket = null;
    for (var i = 0; i < socket_transfers.length; ++i) {
        var t = socket_transfers[i];

        if (t.authenticated == true && t.zoneTransfer == true && t.account.Username == Username) {
            socket = t;
            clearTimeout(socket.zoneTransferLogout);
            socket_transfers.splice(socket_transfers.indexOf(socket), 1);
            break;
        }
    }
    return socket;
}

world.findSocketInTransferQueue = function(Username) {
    var socket = null;
    for (var i = 0; i < socket_transfers.length; ++i) {
        var t = socket_transfers[i];

        if (t.authenticated == true && t.zoneTransfer == true && t.account.Username == Username) {
            socket = t;
            break;
        }
    }
    return socket;
}


var loadedInfos = {
    '005_00001.IMG': infos.Exp !== undefined && infos.Exp.Loaded,
    '005_00002.IMG': infos.Item !== undefined && infos.Item.Loaded,
    '005_00003.IMG': infos.Skill !== undefined && infos.Skill.Loaded,
    '005_00004.IMG': infos.Monster !== undefined && infos.Monster.Loaded
    //'005_00005.IMG':
    //'005_00006.IMG': infos.Npc !== undefined && infos.Npc.Loaded,
    //'005_00007.IMG': infos.Quest !== undefined && infos.Quest.Loaded,
};


// sendToAll
world.sendToAll = function(buffer) {
    for (var i = 0; i < clients.length; ++i) {
        var socket = clients[i];
        if (socket.authenticated) {
            socket.write(buffer);
        }
    }
}

world.sendInfoMessageToAll = function(string) {
    for (var i = 0; i < clients.length; ++i) {
        var socket = clients[i];
        if (socket.authenticated) {
            socket.sendInfoMessage(buffer);
        }
    }
}

world.sendToClan = function(clan, buffer) {
    for (var i = 0; i < clients.length; ++i) {
        var socket = clients[i];
        if (socket.authenticated) {
            if (socket.character.Clan == clan) {
                socket.write(buffer);
            }
        }
    }
}

world.sendToZone = function(zoneID, buffer) {
    if (zones[zoneID]) {
        zones[zoneID].sendToAll(buffer);
    }
}
// End of helper functions  

// TODO: Implement server side game simulation so things really do move and are in correct spots.
world.step = function(delta) {
    // Check if running
    if (this.running === false) return;
    // Foreach Zone call .step
    var keys = Object.keys(zones);
    for (var i = 0; i < keys.length; ++i) {
        if (zones[keys[i]]) {
            zones[keys[i]].step(delta);
        }
    }

    // Foreach Client call .step
}

world.addClient = function(socket) {
    // Can attach things here if we need to
    // Call Attach Hooks 
    // setupClient(socket);
    clients.push(socket);
}

world.removeClient = function(socket) {
    // Call Remove Hooks
    clients.splice(clients.indexOf(socket), 1);
}


// Loading check
var AreAllInfosLoaded = function () {
    for (var info in loadedInfos) {
        if (loadedInfos.hasOwnProperty(info)) {
            //console.log(info+' '+ ( loadedInfos[info] ? "Loaded" : "Not Loaded" ));
            if (!loadedInfos[info]) {
                return false;
            }
        }
    }
    if (typeof(db) === "undefined" || db.Account === undefined) {
        console.log("db.Account is not loaded");
        return false;
    }
    if (typeof(db) === "undefined" || db.Character === undefined) {
        console.log("db.Character is not loaded");
        return false;
    }
    return true;
}

if (world.start) {
    if (AreAllInfosLoaded()) {
        // Accept connections?
        world.start();
        delete world.start;
    } else if (world.waiting_on_game_info === undefined) {
        world.waiting_on_game_info = 1;

        var infoWaitEvent = function (what) {
            switch (what) {
                case '005_00001.IMG': loadedInfos['005_00001.IMG'] =  infos.Exp !== undefined && infos.Exp.Loaded; break;
                case '005_00002.IMG': loadedInfos['005_00002.IMG'] =  infos.Item !== undefined && infos.Item.Loaded; break;
                case '005_00003.IMG': loadedInfos['005_00003.IMG'] = infos.Skill !== undefined && infos.Skill.Loaded; break;
                case '005_00004.IMG': loadedInfos['005_00004.IMG'] =  infos.Monster !== undefined && infos.Monster.Loaded; break;
                //case '005_00005.IMG': loadedInfos['005_00005.IMG'] = break;
                case '005_00006.IMG': loadedInfos['005_00006.IMG'] =  infos.Npc !== undefined && infos.Npc.Loaded; break;
                case '005_00007.IMG': loadedInfos['005_00007.IMG'] =  infos.Quest !== undefined && infos.Quest.Loaded; break;
            }

            if (AreAllInfosLoaded()) {
                console.log('All info the World Server needs is loaded.');
                // Accept connections?
                if (world.start) {
                    world.start();
                    delete world.start;
                }
                main.events.removeListener('gameinfo_loaded',infoWaitEvent);
            }
        };

        main.events.once('db_accounts_schema_loaded', infoWaitEvent);
        main.events.once('db_character_schema_loaded', infoWaitEvent);

        main.events.on('gameinfo_loaded', infoWaitEvent);
    }
}