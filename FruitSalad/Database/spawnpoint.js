// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('SpawnPoint', [], function(){
	var spawnPointSchema = mongoose.Schema({
	    zoneID: Number,
	    type: String, // mon or npc
	    x: Number,
	    y: Number,
	    z: Number,
	    id: Number,
	    direction: Number,
	    tags: Array
	});

	spawnPointSchema.index({zoneID: 1});

	spawnPointSchema.virtual('created').get( function () {
	  if (this["_created"]) return this["_created"];
	  return this["_created"] = this._id.getTimestamp();
	});

	delete mongoose.models['spawnpoint'];
	var SpawnPoint = db.mongoose.model('spawnpoint', spawnPointSchema);
	db.SpawnPoint = SpawnPoint;
});