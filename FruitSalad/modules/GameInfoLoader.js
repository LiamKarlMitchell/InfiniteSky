// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Game info loader

// In the future it would be nice to have a way to load game info from database or from file.
// TODO: Rewrite to use buffer rather than restuct as native code will be faster.

var path = require('path');
var events = require('events');
var fs = require('fs');
var async = require('async');
var csv = require('fast-csv');

function GameInfoLoader(filename, structure, onRecordFunction) {
	this.load(filename, structure, onRecordFunction)
}

GameInfoLoader.prototype = new events.EventEmitter();

GameInfoLoader.prototype.load = function(filename, structure, onRecordFunction) {
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


	var filepath = path.join(config.world.info_directory || 'data',filename);

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
				if (info !== undefined && info._id) {
					// Assign to self as a key on ID for quick reference.
					// Example infos.Item[1] would be Silver
					// But we only care if ID is not 0 and that the info was actually valid
					self.infos[info._id] = info; // Put in array too
					self[info._id] = info; // Store in hash
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

				self.emit('loaded', filename);
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
