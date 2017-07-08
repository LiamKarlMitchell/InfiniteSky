// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/**
 * Schema for a user account.
 * @class db.Account
 */
vms('Counter', [], function(){

  /**
   * Used to provide an incrmental ID to emulate the ID system in a kind of relational DB that the game would use.
   */
  var countersSchema = db.mongoose.Schema({
    _id: String,
    seq: {type: Number, default: 0}
  });

  countersSchema.statics.increment = function (counter, callback) {
      return this.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, {new: true, upsert: true, select: {seq: 1}}, callback);
  };

  delete db.mongoose.models['counters'];
  db.Counters = db.mongoose.model('counters', countersSchema);

  /**
   * Gets the next id for a sequence by name.
   * @param  {String}   name     The sequence name to get an ID for.
   * @param  {Function} callback The call back function first argument is the callback ID. NULL if error.
   */
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

});