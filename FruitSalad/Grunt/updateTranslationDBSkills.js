module.exports = function(grunt) {
	grunt.registerTask('updateTranslationDBSkills', 'Updates all of the skill translations in the database with what is in our Google Spreadsheet.', function() {
	  	var done = this.async();
		//vmscript.watch('Config/login.json');
		var vmscript = new (require('../VMScript.js'))();
		Database = require('../Modules/db.js');
		var GameInfoLoader = require('../Modules/GameInfoLoader.js');
		var restruct = require('../Modules/restruct');
		var Tabletop = require('tabletop');

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
				vmscript.watch('Database/skill.js');
			});

	  	});

	  	vmscript.on(['SkillInfo'], function() {
	  		console.log('Getting spreadsheet from Google Docs.');
	  		// Item Translation
	  		// https://docs.google.com/spreadsheets/d/1rL1HPMZi8Yxt8XPqAm15wkJc0Ak1hzqZB1yD864QO4w/edit#gid=1823029235
	  		// Publish URL:
	  		// https://docs.google.com/spreadsheets/d/1rL1HPMZi8Yxt8XPqAm15wkJc0Ak1hzqZB1yD864QO4w/pubhtml?gid=1823029235&single=true
			Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/14hWHyB7KMg1V2uJVOx3zSp44OTZLy8085c63zSs3vME/pubhtml?gid=1602464661&single=true',
	            callback: function(data, tabletop) { 
	            	for (var i=0;i<data.length;i++) {
	            		//console.log(data[i]);
	            		//console.log('Updating: '+data[i].ID+' '+data[i].Name);
	            		//console.log(data[i].Description1);
						db.Skill.update({ ID: data[i].ID }, { 
							Name: data[i].Name,
							Description1: data[i].Description1,
							Description2: data[i].Description2,
							Description3: data[i].Description3
						}).exec();
	        		}
	            	done(true);
	            },
	        	simpleSheet: true });
	  	});


		vmscript.watch('Config/world.json');
	});
}
