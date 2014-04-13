// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Game info loader

// When a game info file is loaded it should emit this event
// main.events.emit('gameinfo_loaded',file)

// In the future it would be nice to have a way to load game info from database or from file.
// TODO: Rewrite to use buffer rather than restuct as native code will be faster.

var path = require('path');

function GameInfoLoader(filename, structure, onRecordFunction) {
	this.Load(filename,structure,onRecordFunction);
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
			// TODO: Make this able to execute async? it takes a lot of time and blocks server....
			// TODO: Use normal buffer rather than restruct? Or code restruct to use buffer implementation.
			var infos = restruct.struct('info',self.InfoStruct,RecordCount).unpack(data.slice(4));
			delete data;

			var length = infos.info.length, element = null;
			for (var i = 0; i < length; i++) {
				// Put the element into our function which could transform it.
				// We expect to be able to get back ID either from the value in record or some sort of getter.
				element = onRecordFunction(infos.info[i]);
				if (element !== undefined) {
					infos.info[i] = element;
				}
				// Assign to self as a key on ID for quick reference.
				// Example infos.Item[1] would be Silver
				// But we only care if ID is not 0.
				if (infos.info[i].ID !== 0) {
					self[infos.info[i].ID] = infos.info[i];
				} else {
					// Unload empty data because why waste the ram
					delete infos.info[i];
				}
			}

			// Loop through infos array and remove anything undefined
			// Maybe this could be written better such as any record with ID 0?
			i=length;
			while (i--) {
				if (infos.info[i] === undefined) {
					infos.info.splice(i,1);
				}
			}

			self.infos = infos.info;
			self.Loaded = true;
			main.events.emit('gameinfo_loaded',filename);
		} else {
			throw new Error("Not enouth bytes in "+filepath+' to read InfoStructure');
		}

	});
}

module.exports = GameInfoLoader;