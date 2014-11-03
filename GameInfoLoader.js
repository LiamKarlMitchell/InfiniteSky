// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Game info loader

// When a game info file is loaded it should emit this event
// main.events.emit('gameinfo_loaded',file)

// In the future it would be nice to have a way to load game info from database or from file.
// TODO: Rewrite to use buffer rather than restuct as native code will be faster.

var path = require('path');
var events = require('events');

global.TotalGameInfos = 0;
global.TotalLoadedGameInfo = 0;
global.LoadGameInfoTimeout = null;
global.GameInfos = {};
global.GameInfoEmmiter = null;
global.GameInfosLoaded = false;

function GameInfoLoader(filename, structure, onRecordFunction) {
	events.EventEmitter.call(this);
	if(!filename || !structure || !onRecordFunction){ 
		global.GameInfoEmmiter = this;
		return;
	}
	global.GameInfos[filename] = {filename: filename, structure: structure, onRecordFunction: onRecordFunction, initialized: false, self: this};
	var self = this;
	this.Reload = function() {
		console.log('Note that this is a soft reload nothing is removed only overwritten.');
		self.Load(filename,structure,onRecordFunction);
	}

	this.Total = 0;
	this.Loaded = 0;
	this.on('loaded', function(filename){
		if(global.GameInfos[filename] && !global.GameInfos[filename].initialized){
			global.GameInfos[filename].initialized = true;
			global.TotalLoadedGameInfo++;
		}
		if(global.TotalLoadedGameInfo === global.TotalGameInfos){
			if(global.GameInfosLoaded) return;
			global.GameInfosLoaded = true;
			global.GameInfoEmmiter.emit('load');
		}
	});
	global.TotalGameInfos++;
	clearTimeout(global.LoadGameInfoTimeout);
	global.LoadGameInfoTimeout = setTimeout(function(){
		self.LoadAll();
	}, 1000);
}

GameInfoLoader.prototype.__proto__ = events.EventEmitter.prototype;

GameInfoLoader.prototype.LoadAll = function(){
	for(var i in global.GameInfos){
		global.GameInfos[i].self.Load(global.GameInfos[i].filename,global.GameInfos[i].structure,global.GameInfos[i].onRecordFunction);
	}
}

GameInfoLoader.prototype.inspect = safeguard_cli.inspect;
GameInfoLoader.prototype.Load = function(filename, structure, onRecordFunction) {
	var self = this;
	this.Loaded = false;

	if (filename === undefined) {
		throw new Error('You must provide a filename');
	}

	if (structure === undefined) {
		throw new Error('You must provide a structure!');
	}

	if (onRecordFunction === undefined) {
		onRecordFunction = function(record){ record; };
	}

	// Work out the file path
	this.infos = [];
	this.InfoStruct  = structure;
	

	var filepath = path.join(config.data_dir || 'data','infos',filename);

	console.log('Loading Game Info: '+filepath);
	fs.readFile(filepath,function(err,data) {
		if (err) {
			throw err;
			return;
		}

		var RecordCount;
		if (data.length>4) {
			RecordCount = data.readUInt32LE(0);
		} else {
			throw new Error("Not enouth bytes in "+filepath+' to read RecordCount');
		}
		
		if (data.length-4>=self.InfoStruct.size * RecordCount) {
			// TODO: Use normal buffer rather than restruct? Or code restruct to use buffer implementation.
			var tasks = [];

			var queue = async.queue(function (task, callback) {
				var info = self.InfoStruct.unpack(task.data);
				// Put the element into our function which could transform it.
				// We expect to be able to get back ID either from the value in record or some sort of getter.
				info = onRecordFunction(info);
				if (info !== undefined && info.ID) {
					// Assign to self as a key on ID for quick reference.
					// Example infos.Item[1] would be Silver
					// But we only care if ID is not 0 and that the info was actually valid		
					self.infos[info.ID] = info; // Put in array too
					self[info.ID] = info; // Store in hash
				}
				async.setImmediate(callback);
			},10);

			var pos = 4;
			for (var i=0;i<RecordCount;i++) {
				queue.push({ index: i, data: data.slice(pos,pos+self.InfoStruct.size) });
				pos+=self.InfoStruct.size;
			}
			delete data;

			queue.pause();

			queue.drain = function(err){
				if (err) {
					dumpError(err);
					return;
				}

				var csvFile = '';
				var columns = [];
				switch (filename) {
					// case '005_00001.IMG':
					// csvFile = 'Exp.csv';
					// break;
					case '005_00002.IMG':
					csvFile = 'Item.csv';
					columns = ['ID','Name','Description1','Description2', 'Description3'];
					break;
					case '005_00003.IMG':
					csvFile = 'Skill.csv';
					columns = ['ID','Name','Description1','Description2', 'Description3'];
					break;
					case '005_00004.IMG':
					csvFile = 'Monster.csv';
					columns = ['ID','Name'];
					break;
					case '005_00006.IMG':
					csvFile = 'Npc.csv';
					columns = ['ID','Name','Chat1','Chat2','Chat3','Chat4','Chat5'];
					break;
					//case '005_00007.IMG':
					//csvFile = 'Quest.csv';
					//break;					
					default:
					self.emit('loaded', filename);
					self.Loaded = true;
					// main.events.emit('gameinfo_loaded',filename);
					return;
					break;
				}

				filepath = path.join(config.data_dir || 'data','translation',csvFile);

				fs.exists(filepath, function(exists) {
					if (!exists) {
						dumpError('Server cannot load "'+filepath+'" skipping translation csv.');
						console.log('All '+filename+' records have been processed.');
						self.emit('loaded', filename);
						self.Loaded = true;
						// main.events.emit('gameinfo_loaded',filename);
						return;
					}
					csv
					 .fromPath(filepath, {quote: '"', escape: '\\',delimiter: ',', headers: true})
					 .on("record", function(data){
					     var record = self[data[columns[0]]];
					     if (record) {
						     for (var i=1;i<columns.length;i++) {
						     	record[columns[i]] = data[columns[i]];
						     }
					 	 } else {
					 	 	record = {};
					 	 	for (var i=0;i<columns.length;i++) {
					 	 		record[columns[i]] = data[columns[i]];
					 	 	}
					 	 	
					 	 	record = onRecordFunction(record);
					 	 	if (record !== undefined && record.ID) {
					 	 		self.infos[record[columns[0]]] = record;
					 	 		self[record[columns[0]]] = record;
					 	 	}
					 	 	//dumpError('Record '+data[columns[0]]+' not found in file: '+filename);
					 	 }
					 })
					 .on("end", function(){
					    self.Loaded = true;
					    console.log('All '+filename+' records have been processed.');
						// main.events.emit('gameinfo_loaded',filename);
						self.emit('loaded', filename);
					 });
				});

			};

			queue.resume();

		} else {
			throw new Error("Not enouth bytes in "+filepath+' to read InfoStructure');
		}

	});
}

GameInfoLoader.prototype.getByName = function(name, limit) {
	var found = [];
	for (var i=0;i<this.infos.length;i++) {
		if (this.infos[i] === undefined) continue;
		if (this.infos[i].Name === name) {
			found.push(this.infos[i]);
			if (limit && found.length === limit) break;
		}
	}
	return found;
}

GameInfoLoader.prototype.getByNameLike = function(name, limit) {
	var found = [];
	name = name.toLowerCase().replace(/ /g,'');
	for (var i=0;i<this.infos.length;i++) {
		if (this.infos[i] === undefined) continue;
		if (this.infos[i].Name.toLowerCase().replace(/ /g,'').indexOf(name)>-1) {
			found.push(this.infos[i]);
			if (limit && found.length === limit) break;
		}
	}
	return found;
}

module.exports = GameInfoLoader;