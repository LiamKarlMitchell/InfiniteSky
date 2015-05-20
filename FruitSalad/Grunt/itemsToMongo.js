//vmscript.watch('Config/login.json');
var vmscript = new (require('../vmscript.js'))();
Database = require('../Modules/db.js');

module.exports = function(grunt) {
  grunt.registerTask('itemsToMongo', 'Loads items from the game file 005_00002.IMG into Mongo.', function() {
  	var done = this.async();

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for itemsToMongo.');
  		if (!config.world) {
			console.error('Expecting config.world to be set.');
	  		return done(false);
  		}

	  	if (!config.world.database || !config.world.database.connection_string) {
	  		console.error('Expecting config.database.connection_string to be set.');
	  		return done(false);
	  	}

	  	if (!config.world.info_directory) {
	  		console.error('Expecting config.info_directory to be set. Please run grunt init or grunt locateGameFiles.');
	  		return done(false);
	  	}

		Database(config.world.database.connection_string, function(){
			console.log("Database connected");
			vmscript.watch('Database/item.js');
		});

  	});

  	vmscript.on(['items'], function() {
  		// TODO: Load items from Game File
  		console.log('TODO Clear all of the existing Items in MongoDB.');
  		console.log('TODO Load items from Game File into MongoDB.'); // See GameInfoLoader :D.
  		done(false);
  	});
  	//database
	//connection_string

	vmscript.watch('Config/world.json');
  });
};

//Items.csv