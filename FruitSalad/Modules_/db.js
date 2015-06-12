// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var mongoose = require('mongoose');

//Constructor
// Handles connecting to the database
function DB(connectString, callback) {
	global.db = this;
	this.mongoose = mongoose;
	global.mongoose = mongoose;
	mongoose.connect(connectString);

	// When successfully connected
	mongoose.connection.on('connected', callback);

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
		console.error(err); // TODO: Add a way to handle errors.
	  dumpError('Mongoose default connection error: ' + err);
	});
	
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	  // TODO: How to handle if db disconnects whilst server is up?
	});

	this.find = function(name, searchfilter, feilds) {
	  if (this[name]===undefined) { console.error('No db object defined as '+name); return; }
	  this[name].find(searchfilter,feilds,function(err,docs) {
	    if (err) {
	      console.error(err);
	      return;
	    }
	    console.log(docs);
	  });
	};

	return this;
}

module.exports = DB;