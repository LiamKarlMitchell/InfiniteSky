//vmscript.watch('Config/login.json');
var vmscript = new (require('../vmscript.js'))();
Database = require('../Modules/db.js');
var GameInfoLoader = require('../Modules/GameInfoLoader.js');
var restruct = require('../Modules/restruct');
var Tabletop = require('Tabletop');

module.exports = function(grunt) {
  grunt.registerTask('updateTranslationDBMonster', 'Updates all of the monster translations in the database with what is in our Google Spreadsheet.', function() {
  	var done = this.async();

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for updateTranslationDBMonster.');
  		if (!config.world) {
			console.error('Expecting config.world to be set.');
	  		return done(false);
  		}

	  	if (!config.world.database || !config.world.database.connection_string) {
	  		console.error('Expecting config.world.database.connection_string to be set.');
	  		return done(false);
	  	}

	  	if (!config.world.info_directory) {
	  		console.error('Expecting config.world.info_directory to be set. Please run grunt init or grunt locateGameFiles.');
	  		return done(false);
	  	}

		Database(config.world.database.connection_string, function(){
			console.log("Database connected");
			vmscript.watch('Database/monster.js');
		});

  	});

  	vmscript.on(['Monster'], function() {
  		console.log('Getting spreadsheet from Google Docs.');
  		// Monster Translation
  		// https://docs.google.com/spreadsheets/d/1fnV6s_Kho95tra_xc2RyBkCK1CHah6pI_fyTlGOIO2s/edit#gid=1442269867
  		// Publish URL:
  		// https://docs.google.com/spreadsheets/d/1fnV6s_Kho95tra_xc2RyBkCK1CHah6pI_fyTlGOIO2s/pubhtml
		Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1fnV6s_Kho95tra_xc2RyBkCK1CHah6pI_fyTlGOIO2s/pubhtml',
            callback: function(data, tabletop) { 
            	for (var i=0;i<data.length;i++) {
            		console.log('Updating: '+data[i].id+' '+data[i].name);
					db.Monster.update({ _id: data[i].id }, { 
						Name: data[i].name
					}).exec();
        		}
            	done(true);
            },
        	simpleSheet: true });
  	});


	vmscript.watch('Config/world.json');
  });
};
