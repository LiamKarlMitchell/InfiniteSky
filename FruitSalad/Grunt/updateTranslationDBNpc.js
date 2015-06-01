//vmscript.watch('Config/login.json');
var vmscript = new (require('../vmscript.js'))();
Database = require('../Modules/db.js');
var GameInfoLoader = require('../Modules/GameInfoLoader.js');
var restruct = require('../Modules/restruct');
var Tabletop = require('Tabletop');

module.exports = function(grunt) {
  grunt.registerTask('updateTranslationDBNpc', 'Updates all of the item translations in the database with what is in our Google Spreadsheet.', function() {
  	var done = this.async();

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for updateTranslationDBNpc.');
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
			vmscript.watch('Database/npc.js');
		});

  	});

  	vmscript.on(['NPC'], function() {
  		console.log('Getting spreadsheet from Google Docs.');
  		// Item Translation
  		// https://docs.google.com/spreadsheets/d/1rL1HPMZi8Yxt8XPqAm15wkJc0Ak1hzqZB1yD864QO4w/edit#gid=1823029235
  		// Publish URL:
  		// https://docs.google.com/spreadsheets/d/1rL1HPMZi8Yxt8XPqAm15wkJc0Ak1hzqZB1yD864QO4w/pubhtml
		Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1rL1HPMZi8Yxt8XPqAm15wkJc0Ak1hzqZB1yD864QO4w/pubhtml',
            callback: function(data, tabletop) { 
            	for (var i=0;i<data.length;i++) {
            		console.log('Updating: '+data[i].id+' '+data[i].name);
					db.NPC.update({ _id: data[i].id }, { 
						Name: data[i].name,
						Chat1: data[i].chat1,
						Chat2: data[i].chat2,
						Chat3: data[i].chat3,
						Chat4: data[i].chat4,
						Chat5: data[i].chat5
					}).exec();
        		}
            	done(true);
            },
        	simpleSheet: true });
  	});


	vmscript.watch('Config/world.json');
  });
};
