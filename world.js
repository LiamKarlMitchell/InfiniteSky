// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({
    name: 'World Server',
    depends: ['infos.Exp.Loaded', 'infos.Item.Loaded', 'infos.Npc.Loaded', 'infos.Skill.Loaded', 'db.Account', 'db.Character', 'Zone', 'packets']
}, function() {
    if(typeof(world) === 'undefined') {
        console.log('World server code loaded');
        world = {
            packets: new PacketCollection('./packets/world', 'WorldPC', require('./sandbox')),
            start: function() {
                this.server = net.createServer(function(socket) {
                    world.connection(socket);
                });
                console.log('World server starting listen on port: ' + config.ports.world);
                this.server.listen(config.ports.world);
                this.loadAllZones();
                main.events.emit('world_started');
                main.events.on('step', function(delta) {
                    world.GameStep(delta);
                });
            },
            running: true
        };
        // Need to move to world.js
        world.clients = [];
        world.clientID = 0;
        world.socket_transfers = [];
    } else {
        console.log('World server code reloaded');
    }
    // zones is an object which will contain references to each zone object by its id.
    if(typeof(zones) === 'undefined') {
        zones = {};
    }    
    world.GameStep = function(delta) {
        // Do something with delta
        // console.log('Delta: '+delta);
    };
    world.connection = function(socket) {
        console.log("Client #" + world.clientID + " connected from IP " + socket.remoteAddress);
        socket.clientID = world.clientID;
        world.clientID++;
        socket.authenticated = false;
        // Start of Socket Functions
        socket.Destroying = false;
        socket.clientID = world.clientID;
        world.clientID++;
        // TODO: World server should assume the previous socket's id after a successfull handshake/login.
        // This allows us to have a session object using that id :)
        socket.authenticated = false;
        socket.character = {};
        socket.zoneTransfer = false;
        socket.zoneForceTransfer = false;
        // Setup commands for socket here
        socket.character.do2FPacket = 0;
        // Character related commands
        socket.toString = function(Format) {
            return this.world.clientID + ' - ' + this.account.Username + ' Char: ' + this.character.Name + ' Map: ' + this.character.MapID + ' CharacterID: ' + this.character._id;
            //CharacterTypeIdentifier
        };
        // Gives the character exp and handles sending out the level up packets
        socket.giveEXP = function(Value) {
            if(Value <= 0) return; // If no exp given or - amount
            // Give the character the EXP, returns # of levels if level up
            // Apply any EXP Buffs here
            var EXPBuff = 0;
            EXPBuff += this.character.ExperienceBuff;
            // Add in Faction, Item, Zone, World EXP buffs here
            if(EXPBuff !== 0) value += value * EXPBuff;
            // End of EXP Buffing
            console.log("Giving " + this.character.Name + ' ' + Value + ' EXP ' + this.character.Experience);
            var LevelUp = this.character.giveEXP(Value);
            // If level up set level up data
            if(LevelUp > 0) {
                console.log("Leveled up " + LevelUp);
                // Send to the character it's new exp,hp,statpoint,skillpoint,etc...
                this.character.Health = this.character.state.CurrentHP = this.character.state.MaxHP = this.character.statInfo.HP;
                this.character.Chi = this.character.state.CurrentChi = this.character.state.MaxChi = this.character.statInfo.Chi;
                // Send out new EXP packet
                socket.character.state.Level = socket.character.Level;
                // Need to find these
                socket.character.state.LevelUpAnimation = 1;
                socket.character.state.LevelUpAnimationFrame = 0;
                console.log("Level Up");
                if(LevelUp == 1) {
                    socket.sendInfoMessage("You Leveled up");
                } else {
                    socket.sendInfoMessage("You Leveled up " + LevelUp + " times");
                }
                this.Zone.sendToAllArea(this, true, new Buffer(packets.LevelUpPacket.pack({
                    PacketID: 0x2E,
                    ID1: this.character._id,
                    ID2: 0,
                    //this.character.CharacterTypeIdentifier,
                    Levels: LevelUp
                })), config.viewable_action_distance);
                // Save character
                // Must write a character.save function that does the XYZ and shit.
                socket.character.RealX = parseInt(socket.character.state.Location.X, 10);
                socket.character.RealY = parseInt(socket.character.state.Location.Y, 10);
                socket.character.RealZ = parseInt(socket.character.state.Location.Z, 10);
                socket.character.save();
            }
            // Send out its character action update packet
        };
        socket.giveItemInStorage = function(item, action) {
            console.log('giveItemInInventory not yet implemented');
            var ItemID = item.ItemID || 0;
            var Column = item.Column || 0;
            var Row = item.Row || 0;
            var Amount = item.Amount || 0;
            var Enchant = item.Enchant || 0;
            var Combine = item.Combine || 0;
            var Action = action || 1; // Default action for giving item using gm command
            if(item.Column === null && item.Row === null) {
                // Find best Column/Row
            }
            // do magic here item could be an id defaulting amount of 1 or an object like new_character_json has
            if(this.character.QuickUseItems[item.RowPickup] === null) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount,
                    "ID": item.ItemID
                };
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else if(this.character.QuickUseItems[item.RowPickup] !== null && ItemID === this.character.QuickUseItems[item.RowPickup].ID) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount + this.character.QuickUseItems[item.RowPickup.Amount]
                };
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else {
                //whatever is thier goes back in inventory
                this.LogoutUser;
            }
            return -15;
            // Update char info
            // Save inventory data
        }
        socket.giveItemInInventory = function(item, action) {
            console.log('giveItemInInventory not yet implemented');
            var ItemID = item.ItemID || 0;
            var Column = item.Column || 0;
            var Row = item.Row || 0;
            var Amount = item.Amount || 0;
            var Enchant = item.Enchant || 0;
            var Combine = item.Combine || 0;
            var Action = action || 1; // Default action for giving item using gm command
            if(item.Column == null && item.Row == null) {
                // Find best Column/Row
            }
            // do magic here item could be an id defaulting amount of 1 or an object like new_character_json has
            for(var i = 0; i < 64; ++i) {
                if(this.character.Inventory[i] == null) {
                    this.character.Inventory[i] = {
                        "Amount": item.Amount,
                        "Column": item.ColumnMove,
                        "Row": item.RowMove,
                        "ID": item.ItemID
                    }
                    this.character.markModified('Inventory');
                    this.character.save();
                    console.log("Amount" + item.Amount + "Column" + item.ColumnMove + "Row" + item.RowMove + "ID" + item.itemID)
                    return 15;
                } else {
                    this.LogoutUser;
                }
            }
            return -15;
            // Update char info
            // Save inventory data
        }
        socket.giveSkillInSkillBar = function(item, action) {
            console.log('giveSkillInSkillBar not yet implemented');
            var Skill = this.character.SkillList[item.InventoryIndex]
            var ItemID = Skill.ID || 0;
            var Column = item.Level || 0;
            var Row = item.Row || 0;
            var Amount = item.Amount || 0;
            var Enchant = item.Enchant || 0;
            var Combine = item.Combine || 0;
            var Action = action || 1; // Default action for giving item using gm command
            if(item.RowPickup == null && item.ColumnPickup == null) {
                // Find best Column/Row
            }
            // do magic here item could be an id defaulting amount of 1 or an object like new_character_json has
            if(this.character.SkillBar[item.RowPickup] == null) {
                this.character.SkillBar[item.RowPickup] = {
                    "ID": Skill.ID,
                    "Level": item.Amount
                }
                this.character.markModified('SkillBar');
                this.character.save();
                console.log("ID" + Skill.ID + "Level" + item.Amount + "||");
                return 15;
            } else if(this.character.QuickUseItems[item.RowPickup] != null) {
                this.character.SkillBar[item.RowPickup] = {
                    "ID": Skill.ID,
                    "Level": item.Amount
                }
                this.character.markModified('SkillBar');
                this.character.save();
                console.log("ID" + Skill.ID + "Level" + item.Amount + "||OVERRIGHT");
                return 15;
            } else {
                //whatever is thier goes back in inventory
                this.LogoutUser;
            }
            return -15;
            // Update char info
            // Save inventory data
        }
        socket.giveItemInPillBar = function(item, action) {
            console.log('giveItemInInventory not yet implemented');
            var ItemID = item.ItemID || 0;
            var Column = item.Column || 0;
            var Row = item.Row || 0;
            var Amount = item.Amount || 0;
            var Enchant = item.Enchant || 0;
            var Combine = item.Combine || 0;
            var Action = action || 1; // Default action for giving item using gm command
            if(item.Column == null && item.Row == null) {
                // Find best Column/Row
            }
            // do magic here item could be an id defaulting amount of 1 or an object like new_character_json has
            if(this.character.QuickUseItems[item.RowPickup] == null) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount,
                    "ID": item.ItemID
                }
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else if(this.character.QuickUseItems[item.RowPickup] != null && ItemID == this.character.QuickUseItems[item.RowPickup].ID) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount + this.character.QuickUseItems[item.RowPickup.Amount]
                }
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else {
                //whatever is thier goes back in inventory
                this.LogoutUser;
            }
            return -15;
            // Update char info
            // Save inventory data
        }
        socket.giveItemInPillBar = function(item, action) {
            console.log('giveItemInInventory not yet implemented');
            var ItemID = item.ItemID || 0;
            var Column = item.Column || 0;
            var Row = item.Row || 0;
            var Amount = item.Amount || 0;
            var Enchant = item.Enchant || 0;
            var Combine = item.Combine || 0;
            var Action = action || 1; // Default action for giving item using gm command
            if(item.Column == null && item.Row == null) {
                // Find best Column/Row
            }
            // do magic here item could be an id defaulting amount of 1 or an object like new_character_json has
            if(this.character.QuickUseItems[item.RowPickup] == null) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount,
                    "ID": item.ItemID
                }
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else if(this.character.QuickUseItems[item.RowPickup] != null && ItemID == this.character.QuickUseItems[item.RowPickup].ID) {
                this.character.QuickUseItems[item.RowPickup] = {
                    "Amount": item.Amount + this.character.QuickUseItems[item.RowPickup.Amount]
                }
                this.character.markModified('QuickUseItems');
                this.character.save();
                console.log("Amount" + item.Amount + "ID" + item.itemID);
                return 15;
            } else {
                //whatever is thier goes back in inventory
                this.LogoutUser;
            }
            return -15;
            // Update char info
            // Save inventory data
        }
        socket.send2FUpdate = function() {
            if(this.character.do2FPacket == 0) return;
            this.character.do2FPacket = 0;
            //console.log('sending 2F Update');
            var update = {
                'PacketID': 0x2F,
                'Level': this.character.Level,
                'Experience': this.character.Experience,
                'Honor': this.character.Honor,
                'CurrentHP': this.character.state.CurrentHP,
                'CurrentChi': this.character.state.CurrentChi,
                'PetActivity': this.character.Pet === null ? 0 : this.character.Pet.Activity,
                'PetGrowth': this.character.Pet === null ? 0 : this.character.Pet.Growth
            };
            //eyes.inspect(update);
            this.write(new Buffer(packets.HealingReplyPacket.pack(update)));
        }
        // Returns false if it failed, true if success
        socket.Teleport = function(Location, ZoneID) {
            var ChangeZone = false;
            // Teleport to zone
            // Make sure ZoneID is number.
            if(ZoneID && ZoneID != this.character.MapID) {
                var thePort = 0;
                var theIP = '';
                var status = 0;
                console.log("Teleporting to Zone ID's not tested yet");
                // Check if zone id exists
                var TransferZone = worldserver.findZoneByID(ZoneID);
                if(TransferZone == null) {
                    console.log("Zone not found");
                    status = 1;
                    this.write(
                    new Buffer(
                    packets.MapLoadReply.pack({
                        packetID: 0x0A,
                        Status: status,
                        IP: theIP,
                        Port: thePort
                    })));
                    return false;
                }
                console.log('Zone found');
                if(Location) {
                    // Use the location
                    console.log('Location set');
                    this.character.state.Location.X = Location.X;
                    this.character.state.Location.Y = Location.Y;
                    this.character.state.Location.Z = Location.Z;
                    this.character.state.Skill = 0;
                    this.character.state.Frame = 0;
                    this.sendActionStateToArea();
                } else {
                    // Get a location for the zone
                    console.log('Finding portal 0 endpoint');
                    var PortalEndPoint = TransferZone.getPortalEndPoint(0);
                    if(PortalEndPoint) {
                        console.log('Location set');
                        this.character.state.Location.X = PortalEndPoint.X;
                        this.character.state.Location.Y = PortalEndPoint.Y;
                        this.character.state.Location.Z = PortalEndPoint.Z;
                        // Get random spot in that radius?
                    } else {
                        console.log('Location not set');
                        this.character.state.Location.X = 0;
                        this.character.state.Location.Y = 0;
                        this.character.state.Location.Z = 0;
                    }
                }
                // The Character State object for use in world for moving and health etc.
                //this.character.state.setFromCharacter(this.character);
                //console.log(this.character.state.Location);
                // Ask the zones/mapservers if they are ready for connections
                // If not then set Status to 1
                //status = 1;
                // Add to WorldServer client transfer.
                // Set the ZoneID and XYZ they are to goto.
                this.character.MapID = TransferZone.getID();
                this.zoneTransfer = true;
                this.zoneForceTransfer = true;
                worldserver.addSocketToTransferQueue(this);
                console.log('Tell client which map server to connect too');
                //socket.characters[gamestart.Slot].MapID << get the map id of character :P
                // Get world.clients ip, check if it is on lan with server,
                // if so send it servers lan ip and port
                // otherwise send it real world ip and port
                theIP = config.externalIP;
                if(this.remoteAddress.indexOf('127') == 0) {
                    theIP = '127.0.0.1'
                }
                console.log('IP for client to connect too before translation: ' + theIP);
                for(var i = 0; i < natTranslations.length; i++) {
                    if(natTranslations[i].contains(this.remoteAddress)) {
                        theIP = natTranslations[i].ip;
                        break;
                    }
                }
                console.log('IP for client to connect too: ' + theIP);
                thePort = config.ports.world;
                console.log({
                    packetID: 0x0A,
                    Status: status,
                    IP: theIP,
                    Port: thePort
                });
                this.account.save();
                this.character.save();
                this.write(
                new Buffer(
                packets.MapLoadReply.pack({
                    packetID: 0x0A,
                    Status: status,
                    IP: theIP,
                    Port: thePort
                })));
                return true;
            }
            if(Location) {
                this.character.state.Location.X = Location.X;
                this.character.state.Location.Y = Location.Y;
                this.character.state.Location.Z = Location.Z;
            }
            // Send character update packet
            this.Zone.sendToAllArea(this, true, packets.makeCompressedPacket(
            0x18, new Buffer(
            packets.ActionReplyPacket.pack(
            this.character.state))), config.viewable_action_distance);
            return true;
        }
        socket.onDeath = function(Killer) {
            if(Killer) {
                // Killed by player, monster, npc?
                switch(typeof(Killer.constructor.name)) {
                case "Monster":
                    break;
                case "NPC":
                    break;
                case "Socket":
                    // Handle giving the other character bonuses etc
                    console.log(this.toString() + ' Killed By ' + Killer.toString());
                    break;
                case "World":
                    break;
                }
            } else {
                console.log(this.toString() + ' Killed');
            }
        }
        // End of commands
        socket.LogoutUser = function() {
            if(socket.authenticated) {
                if(socket.zoneTransfer == false) {
                    //Save Character to DB
                    socket.character.save();
                    socket.account.active = 0;
                    socket.account.save();
                    // db.mongoose.Account.update({
                    //  _id: socket.account._id
                    // }, {
                    //  $set: {
                    //      active: "0"
                    //  }
                    // });
                }
            }
            if(typeof(socket.Zone) != 'undefined') {
                socket.Zone.removeSocket(socket);
            }
            console.log('socket.LogoutUser ' + socket.Username);
            world.getSocketFromTransferQueue(this.account.Username)
        }
        socket.on('error', function(err) {
            console.log('Client #' + socket.clientID + ' error: ', err);
            socket.destroy();
            //removeDisconnectedCharacter.call(socket);
        });
        //Handle socket disconnection
        // socket.on('end', function() {
        //  console.log('Client #' + socket.clientID + ' ended connection');
        //  // Handle logging out user
        //  removeDisconnectedCharacter.call(socket);
        // });
        // Need to find out which functions to use and make this tidyer....
        // Need to check for memory leaks and make sure we actually delete the un needed socket.
        // Need to make sure using splice won't be slower than deleting the index.
        // Should maybe look at using room or list rather than array of socket object.
        socket.on('close', function() {
            console.log('Client #' + socket.clientID + ' closed connection');
            console.log('world.js needs to remove socket from zone it is in too. and tell all party/guild its offline etc');
            removeDisconnectedCharacter.call(socket);
            //Let client know how many people are playing on server
            try {
                world.packets.onDisconnected(socket);
            } catch(e) {}
        });
        socket.on('disconnect', function() {
            console.log('Client #' + socket.clientID + ' disconnected');
            console.log('world.js needs to remove socket from zone it is in too. and tell all party/guild its offline etc');
            removeDisconnectedCharacter.call(socket);
        });

        function removeDisconnectedCharacter() {
            if(this.Destroying) return;
            this.Destroying = true;
            console.log('Removing disconnected character from world ' + this.character.Name);
            if(this.authenticated == false) {
                return;
            }
            // Need to store zone transfer location different to current location.
            if(this.zoneTransfer) {
                console.log('removeDisconnectedCharacter ' + this.acocunt.Username)
                world.getSocketFromTransferQueue(this.account.Username);
                this.character.RealX = parseInt(this.character.state.ToLocation.X, 10);
                this.character.RealY = parseInt(this.character.state.ToLocation.Y, 10);
                this.character.RealZ = parseInt(this.character.state.ToLocation.Z, 10);
                console.log('removeDisconnectedCharacter zone transfer is: ' + this.character.state.ToLocation.toString());
                console.log(this.character.RealX + ' ' + this.character.RealY + ' ' + this.character.RealZ + ' ');
                this.character.MapID = this.character.ToMapID;
            } else {
                this.character.RealX = parseInt(this.character.state.Location.X, 10);
                this.character.RealY = parseInt(this.character.state.Location.Y, 10);
                this.character.RealZ = parseInt(this.character.state.Location.Z, 10);
            }
            this.character.save();
            // Tell clan members, party, friend that they went offline
            // Tell monsters or we to untarget
            // Cancel any timers we need too
            this.LogoutUser();
            world.removeClient(this);
        }
        socket.sendActionStateToArea = function() {
            this.Zone.sendToAllArea(this, true, packets.makeCompressedPacket(
            0x18, new Buffer(
            packets.ActionReplyPacket.pack(
            this.character.state))), config.viewable_action_distance);
        }
        socket.sendInfoMessage = function(message) {
            // Could split this up if it takes up too many messages
            // Or we could use a custom packet or something to store it
            // in the System messages
            var i, j, temparray, chunk = 60;
            for(i = 0, j = message.length; i < j; i += packets.MessageLength) {
                temparray = message.slice(i, i + packets.MessageLength);
                if(!this._handle) return;
                this.write(new Buffer(
                packets.ChatPacketReply.pack({
                    PacketID: 0x2A,
                    Name: 'System',
                    Message: temparray
                })));
            };
        }
        // End of Socket Functions
        //Handle socket disconnection
        socket.on('end', function() {
            console.log('Client #' + socket.clientID + ' ended connection');
            world.clients.splice(world.clients.indexOf(socket), 1);
            delete world[socket.clientID];
            db.Account.logoutUser(socket);
        });
        socket.on('error', function(err) {
            console.log('Client #' + socket.clientID + ' error: ' + err);
            socket.destroy();
        });
        // Need to find out which functions to use and make this tidyer....
        // Need to check for memory leaks and make sure we actually delete the un needed socket.
        // Need to make sure using splice won't be slower than deleting the index.
        // Should maybe look at using room or list rather than array of socket object.
        socket.on('close', function() {
            console.log('Client #' + socket.clientID + ' closed connection');
            world.clients.splice(world.clients.indexOf(socket), 1);
            delete world[socket.clientID];
            //var i = allworld.clients.indexOf(socket);
            //delete allworld.clients[i];
            db.Account.logoutUser(socket);
        });
        socket.on('disconnect', function() {
            console.log('Client #' + socket.clientID + ' disconnected');
            world.clients.splice(world.clients.indexOf(socket), 1);
            delete world[socket.clientID];
            //var i = allworld.clients.indexOf(socket);
            //delete allworld.clients[i];
            // Remove from zone transfer list if its there
            db.Account.logoutUser(socket);
            try {
                world.packets.onDisconnected(socket);
            } catch(e) {
                dumpError(e);
            }
        });
        CachedBuffer.call(socket, world.packets);
        //Let client know how many people are playing on server
        try {
            world.packets.onConnected(socket);
        } catch(e) {
            dumpError(e);
        }
        world.addClient(socket);
        world[socket.ID] = socket;
    };
    world.findAccountSocket = function(name) {
        for(var i = 0; i < world.clients.length; i++) {
            if(world.clients[i].authenticated) {
                if(world.clients[i].ai.username === name) {
                    return world.clients[i];
                }
            }
        }
        return null;
    };
    world.findSocketByCharacterID = function(CharacterID) {
        // Search connected world.clients
        for(var i = 0; i < world.clients.length; ++i) {
            if(world.clients[i].character._id == CharacterID && world.clients[i]._handle) {
                return world.clients[i];
            }
        }
        return null;
    }
    world.findCharacterSocket = function(Name) {
        // Search connected world.clients
        for(var i = 0; i < world.clients.length; ++i) {
            if(world.clients[i].character.Name == Name && world.clients[i]._handle) {
                return world.clients[i];
            }
        }
        return null;
    };
    world.addSocketToTransferQueue = function(socket) {
        if(socket.authenticated == false) return;
        // set a timeout on the object for logging out the account if it is not removed from world list
        socket.zoneTransferLogout = socket.setTimeout(socket.LogoutUser, config.zoneTransferLogoutTimer || 60000);
        world.socket_transfers.push(socket);
    }
    world.getSocketFromTransferQueue = function(Username) {
        var socket = null;
        for(var i = 0; i < world.socket_transfers.length; ++i) {
            var t = world.socket_transfers[i];
            if(t.authenticated == true && t.zoneTransfer == true && t.account.Username == Username) {
                socket = t;
                clearTimeout(socket.zoneTransferLogout);
                world.socket_transfers.splice(world.socket_transfers.indexOf(socket), 1);
                break;
            }
        }
        return socket;
    }
    world.findSocketInTransferQueue = function(Username) {
        var socket = null;
        for(var i = 0; i < world.socket_transfers.length; ++i) {
            var t = world.socket_transfers[i];
            if(t.authenticated == true && t.zoneTransfer == true && t.account.Username == Username) {
                socket = t;
                break;
            }
        }
        return socket;
    }
    // sendToAll
    world.sendToAll = function(buffer) {
        for(var i = 0; i < world.clients.length; ++i) {
            var socket = world.clients[i];
            if(socket.authenticated) {
                socket.write(buffer);
            }
        }
    }
    world.sendInfoMessageToAll = function(string) {
        for(var i = 0; i < world.clients.length; ++i) {
            var socket = world.clients[i];
            if(socket.authenticated) {
                socket.sendInfoMessage(buffer);
            }
        }
    }
    world.sendToClan = function(clan, buffer) {
        for(var i = 0; i < world.clients.length; ++i) {
            var socket = world.clients[i];
            if(socket.authenticated) {
                if(socket.character.Clan == clan) {
                    socket.write(buffer);
                }
            }
        }
    }
    world.sendToZone = function(zoneID, buffer) {
        if(zones[zoneID]) {
            zones[zoneID].sendToAll(buffer);
        }
    }
    // End of helper functions  
    // TODO: Implement server side game simulation so things really do move and are in correct spots.
    world.step = function(delta) {
        // Check if running
        if(this.running === false) return;
        // Foreach Zone call .step
        var keys = Object.keys(zones);
        for(var i = 0; i < keys.length; ++i) {
            if(zones[keys[i]]) {
                zones[keys[i]].step(delta);
            }
        }
        // Foreach Client call .step
    }
    world.addClient = function(socket) {
        // Can attach things here if we need to
        // Call Attach Hooks 
        // setupClient(socket);
        world.clients.push(socket);
    }
    world.removeClient = function(socket) {
        // Call Remove Hooks
        world.clients.splice(world.clients.indexOf(socket), 1);
    }
    world.zoneLoaded = function(err, id) {
        if(err) {
            console.error('\x1B[31m' + 'Zone: ' + id + ' Failed to load' + '\x1B[0m');
            return;
        }
        if(zones[id] === undefined) {
            console.info('\x1B[33m' + 'Zone: ' + id + ' Skipped' + '\x1B[0m');
        } else {
            console.info('\x1B[32m' + 'Zone: ' + id + ' Loaded successfully' + '\x1B[0m');
        }
    }
    // TODO: Handle the alias zones.
    // These are zones which have a different id but the same files as another zone id.
    world.loadAllZones = function() {
        console.log('Loading Zones...');
        if(config.Zones !== undefined) {
            var mapLoadQueue = async.queue(world.loadZone, config.AsyncZoneLoadLimit || 4);
            for(var id in config.Zones) {
                if(config.Zones.hasOwnProperty(id) && !isNaN(id)) {
                    mapLoadQueue.push(id, world.doneZoneLoad);
                }
            }
        } else {
            console.error('\x1B[31mPlease define Zones object in your config.json\x1B[0m');
        }
    }
    world.loadZone = function(ZoneID, callback) {
        if(callback === undefined) callback = world.zoneLoaded;
        //console.log('Loading Zone: '+ZoneID);
        // Check if ZoneID is number or object
        if(typeof(ZoneID) === 'object') {
            ZoneID = ZoneID.ID;
        }
        if(zones[ZoneID] && config.Zones[ZoneID].Load == false) {
            // TODO: Unload the zone.
            callback(null, ZoneID)
            return;
        }
        if(zones[ZoneID] === undefined && config.Zones[ZoneID].Load) {
            console.log('ZoneID is: ' + ZoneID);
            zones[ZoneID] = new Zone(ZoneID);
            zones[ZoneID].Load(callback);
        } else {
            console.log('Zone ' + ZoneID + ' Already Loaded');
            callback('Zone ' + ZoneID + ' Already Loaded');
        }
    }
    world.unloadZone = function(ZoneID) {
        if(zones[ZoneID] !== undefined) {
            zones[ZoneID].unload();
            //main.events.emit('unload_zone',ZoneID);
            delete zones[ZoneID];
        } else {
            console.log('Zone Not Loaded');
        }
    }

    if(world.start) {
        world.start();
        delete world.start;
    }
});