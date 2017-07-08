// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('SpawnGroup', [], function(){
	var monsterSpawnInfo = mongoose.Schema({
		id: Number,
		amount: Number,
		extra: {} // Can be used for extra information storage if required.
	});

	var spawnGroupSchema = mongoose.Schema({
	    zoneID: Number,
	    // Top Left X,Y,Z
	    x: Number,
	    y: Number,
	    z: Number,
	    // Bottom Right X,Y,Z
	    x2: Number,
	    y2: Number,
	    z2: Number,
	    monsters: [monsterSpawnInfo], // Spawn groups are always for monsters
	    tags: Array
	});

	spawnGroupSchema.index({zoneID: 1});

	spawnGroupSchema.virtual('created').get( function () {
	  if (this["_created"]) return this["_created"];
	  return this["_created"] = this._id.getTimestamp();
	});

	delete mongoose.models['spawngroup'];
	var SpawnGroup = db.mongoose.model('spawngroup', spawnGroupSchema);
	db.SpawnGroup = SpawnGroup;
	db.monsterSpawnInfo = monsterSpawnInfo;
});