// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('SpawnLog', [], function(){
	var spawnLogSchema = mongoose.Schema({
	    username: String, // The username of whomever captured this spawn. (As defined in their PrivateServer.ini)
	    zoneid: Number,   // The ID of the Zone the Spawn was captured in.
	    id: Number,       // The ID of the thing eg MonsterID or NPCID.
		nodeid: Number,   // The first  identifyer used. (NodeID / instanceID)
		otherid: Number,  // The second identifyer used. (Who Knows? Maybe index or auto increment?)
		x: Number,
		y: Number,
		z: Number,
		direction: Number
	});
	

	//Constructor
	delete mongoose.models['spawnlog'];
	var SpawnLog = db.mongoose.model('spawnlog', spawnLogSchema);
	db.SpawnLog = SpawnLog;

	SpawnLog.virtual('created').get( function () {
	  if (this["_created"]) return this["_created"];
	  return this["_created"] = this._id.getTimestamp();
	});

	SpawnLog.getById = function(_id, callback){
		db.SpawnLog.findOne({
			_id: _id
		}, callback);
	};
});