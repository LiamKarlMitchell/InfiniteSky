//vmscript.watch('Config/login.json');
var vmscript = new (require('../vmscript.js'))();
Database = require('../Modules/db.js');

module.exports = function(grunt) {
  grunt.registerTask('itemsToMongo', 'Loads items from the game file 005_00002.IMG into Mongo.', function() {
  	var done = this.async();

  	vmscript.on(['config'], function() {

	  	if (!config.database || !config.database.connection_string) {
	  		throw new Error('Expecting config.database.connection_string to be set.');
	  	}

	  	if (!config.info_directory) {
	  		throw new Error('Expecting config.info_directory to be set. Please run grunt init or grunt locateGameFiles.');
	  	}

		Database(config.database.connection_string, function(){
			console.log("Database connected");
			vmscript.watch('Database/item.js');
		});

  	});

  	vmscript.on(['items'], function() {
  		// TODO: Load items from Game File
  		console.log('TODO Clear all of the existing Items in MongoDB.');
  		console.log('TODO Load items from Game File into MongoDB.'); // See GameInfoLoader :D.
  		done();
  	});
  	//database
	//connection_string

	vmscript.watch('Config/world.json');
  });
};

//Items.csv