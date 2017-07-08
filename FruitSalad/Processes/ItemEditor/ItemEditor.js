vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');

console.log("Editor running");

vms('Spawn Logger', [
	'Config/network.json',
	'Config/login.json',
], function(){
	express = require('express');
	socketio = require('socket.io');
	bodyParser = require('body-parser');

	restruct = require('./Modules/restruct');
	Database = require('./Modules/db.js');


	util = require('./Modules/util.js');
	util.setupUncaughtExceptionHandler();

	bunyan = require('bunyan');

	function ItemEditorInstance(){
		log = bunyan.createLogger({name: 'InfiniteSky/ItemEditor',
		    streams: [{
		        stream: process.stderr
		    }]
		});

		var self = this;
		this.itemSlotSize = {};

		global.app = this.app = express();
		this.io = socketio.listen(app.listen(config.network.ports.itemeditor || 8474));

		this.io.sockets.on('connection', function (socket) {
		  self.onConnection.call(socket);
		});

		Database(config.login.database.connection_string, function(){
			vmscript.watch('Database');
		});

		this.app.use(express.static(path.join(process.directory, 'public')));
		this.app.use(bodyParser.json());
	}

	var ItemEditorPrototype = ItemEditorInstance.prototype;

	ItemEditorPrototype.onConnection = function ItemEditor__onConnection() {
    console.log("New item editor connection");
		var self = this;
		this.on('character data', function(name){
			// console.log("Getting character data for item editor", name);
			db.Character.findOne({
				Name: name
			}, function(err, character){
				if(err){
					return;
				}

				if(!character){
					return;
				}

				// console.log

				self.emit('character data', character);
			});
		});

		this.on('get items', function(){
			db.Item.find({}, '_id Name ItemType').cache().exec(function(err, docs){
				for(var i=0; i<docs.length; i++){
					process.ItemEditor.itemSlotSize[docs[i]._id] = docs[i].getSlotSize();
				}
				self.emit('items', docs);
			});
		});

		this.on('get characters', function(){
			db.Character.find(null, 'Name _id', function(err, docs){
				self.emit('characters', docs);
			});
		});

		this.on('add item', function(name, id){
			db.Character.findOne({Name: name}, function(err, character){
				if(err){
					return;
				}

				if(!character){
					return;
				}

				var nextInventoryIndex = character.nextInventoryIndex();
				if(nextInventoryIndex === null){
					return;
				}

				console.log("Next inv indeas", nextInventoryIndex);

				db.Item.findById(id, function(err, item){
					if(err){
						return;
					}

					if(!item){
						return;
					}

					var size = item.getSlotSize();
					var isStackable = item.isStackable();
					var row, column, found;

					for(var y=0; y<8; y++){
						for(var x=0; x<8; x++){
							if(character.inventoryIntersection(process.ItemEditor.itemSlotSize, x, y, size) === null){
								found = true;
								row = x;
								column = y;
								break;
							}
						}
						if(found) break;
					}

					if(row === undefined || column === undefined){
						return;
					}
					var obj = {};
					obj.Column = column;
					obj.Row = row;
					obj.ID = id;

					if(isStackable) obj.Amount = 1;

					character.Inventory[nextInventoryIndex] = obj;

					character.markModified('Inventory');
					character.save(function(err){
						if(err){
							return;
						}

						// TODO: Find character and refresh their inventory.
						self.emit('character data', character);
						global.rpc.api.call('World', 'reloadCharacterData', character.Name);
					});
				});
			});
		});

		this.on('clear inventory', function(name){
			db.Character.findOne({Name: name}, function(err, character){
				if(err){
					return;
				}

				if(!character){
					return;
				}

				character.Inventory.length = 0;
				character.markModified('Inventory');
				character.save(function(err){
					if(err){
						return;
					}

					self.emit('character data', character);
					global.rpc.api.call('World', 'reloadCharacterData', character.Name);
				});
			});
		});

		this.on('set', function(name, index, values){
			db.Character.findOne({Name: name}, function(err, character){
				if(err){
					return;
				}

				if(!character){
					return;
				}

				var invItem = character.Inventory[index];
				if(!invItem){
					return;
				}

				if(typeof values.Row !== 'undefined' && typeof values.Column !== 'undefined'){
					if(
						character.inventoryIntersection(
							process.ItemEditor.itemSlotSize,
							values.Row,
							values.Column,
							process.ItemEditor.itemSlotSize[invItem.ID]
						) !== null)
					{
						console.log("We got intersection of item in item editor");
						return;
					}
				}

				console.log("Setting values");
				for(var name in values){
					invItem[name] = values[name];
				}

				character.markModified('Inventory');
				character.save(function(err){
					if(err){
						return;
					}

					self.emit('character data', character);
					global.rpc.api.call('World', 'reloadCharacterData', character.Name);
				});
			});
		});

		this.on('remove item', function(name, index){
			db.Character.findOne({Name: name}, function(err, character){
				if(err){
					return;
				}

				if(!character){
					return;
				}

				var invItem = character.Inventory[index];
				if(!invItem){
					return;
				}

				character.Inventory[index] = null;

				character.markModified('Inventory');
				character.save(function(err){
					if(err){
						return;
					}

					self.emit('character data', character);
					global.rpc.api.call('World', 'reloadCharacterData', character.Name);
				});
			});
		});
	}

	ItemEditorPrototype.getItem = function(req, res){
		db.Item.findById(parseInt(req.query.id), function(err, item){
			if(err){
				res.json({error: 'Could not find item due to finding error'});
				return;
			}

			if(!item){
				res.json({error: 'Item not found'});
				return;
			}

			res.json(item);
		});
	};

	var SocketFunctions =  {};

	if (typeof process.ItemEditor === 'undefined') {
		process.ItemEditor = new ItemEditorInstance();
	}else{
		process.ItemEditor.__proto__ = ItemEditorPrototype;
	}

	process.ItemEditor.app.get('/item', function(req, res){ process.ItemEditor.getItem(req, res); });
});
