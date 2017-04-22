// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('SpawnLog', [], function(){
	var spawnLogSchema = mongoose.Schema({
		username: String,
		type: String,
	    zoneID: Number,
	    uniqueID1: Number,
	    uniqueID2: Number,
	    id: Number,
	    x: Number,
	    y: Number,
	    z: Number,
	    direction: Number,
	    tags: Array,
	    spawnGroup: Number // Link to a SpawnGroup schema here.
	});

	spawnLogSchema.index({_id: 1, zoneID: 1, uniqueID1: 1 });
	spawnLogSchema.index({zoneID: 1, id: 1, uniqueID1: 1 });
	spawnLogSchema.index({ username: 1 });

	spawnLogSchema.virtual('created').get( function () {
	  if (this["_created"]) return this["_created"];
	  return this["_created"] = this._id.getTimestamp();
	});

	delete mongoose.models['spawnlog'];
	var SpawnLog = db.mongoose.model('spawnlog', spawnLogSchema);
	db.SpawnLog = SpawnLog;

	SpawnLog.updateZoneUniqueID = function SpawnLog__updateZoneUniqueID(zoneID, uniqueID1, uniqueID2, values, callback){
		db.SpawnLog.update({
			zoneID: zoneID,
			uniqueID1: uniqueID1,
			uniqueID2: uniqueID2
		}, values, {multi: true}, callback);
	};
	 db.SpawnLog.zoneID = function(zoneID, callback){
        db.SpawnLog.find({
            zoneID: zoneID
        }, callback);
    };
});