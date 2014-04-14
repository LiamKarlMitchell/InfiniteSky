// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

mongoose = require('mongoose');
var vmscript = require('./vmscript');

//Constructor
// Handles connecting to the database
function DB(connectString) {
	global.db = this;

	this.mongoose = mongoose;
	global.mongoose = mongoose;

	console.log('Connecting to MongoDB: '+connectString);
	mongoose.connect(connectString);

	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Database Connected');
	  db.scripts = new vmscript('db','db');
	  main.events.emit('db_connected');

	  //console.log('Mongoose default connection open to ' + dbURI);
	  console.log('Mongoose connected');
	});

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
	  dumpError('Mongoose default connection error: ' + err);
	});
	
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	  // TODO: How to handle if db disconnects whilst server is up?
	});

	main.addShutdownMethod(function DBDisconnect(){ 
		console.log('Disconnecting from mongoose');
		mongoose.connection.close();
	});

	this.find = function(name, searchfilter, feilds) {
	  if (this[name]===undefined) { console.error('No db object defined as '+name); return; }
	  this[name].find(searchfilter,feilds,function(err,docs) {
	    if (err) {
	      dumpError(err);
	      return;
	    }
	    console.log(docs);
	  });
	};

}

module.exports = DB;