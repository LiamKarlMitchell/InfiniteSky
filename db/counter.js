// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Used to provide incrmental ID to emulate the kind of relational DB that the game would use.
var countersSchema = db.mongoose.Schema({
  //_id: { type: String, unique: true, index: true },
  _id: String,
    seq: {type: Number, default: 0}
});

countersSchema.statics.increment = function (counter, callback) {
    return this.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, {new: true, upsert: true, select: {seq: 1}}, callback);
};

delete db.mongoose.models.counters;
db.Counters = db.mongoose.model('counters', countersSchema);

db.getNextSequence = function(name,callback) {
  db.Counters.increment(name,function(err,obj) {
    if (err) {
      callback(null);
    }
    else
    {
      callback(obj.seq);
    }
  });
};
