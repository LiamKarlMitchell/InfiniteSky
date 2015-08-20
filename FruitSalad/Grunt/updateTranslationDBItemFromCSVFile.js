module.exports = function(grunt) {
  grunt.registerTask('updateTranslationDBItemFromCSVFile', 'Updates all of the item translations in the database with what is in our downloaded csv from the Google Spreadsheet.', function() {
  	var done = this.async();
  	//vmscript.watch('Config/login.json');
	var vmscript = new (require('../VMScript.js'))();
	Database = require('../Modules/db.js');
	var GameInfoLoader = require('../Modules/GameInfoLoader.js');
	var restruct = require('../Modules/restruct');
	var csv = require('fast-csv');
	var async = require('async');
	var fs = require('fs');
	
	
	
  	vmscript.on(['config'], function() {
  		console.log('Starting config check for updateTranslationDBItemFromCSVFile.');
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
			vmscript.watch('Database/item.js');
		});

  	});

  	vmscript.on(['Item'], function() {
  		console.log('Getting spreadsheet from Google Docs.');
  		// Item Translation
  		// https://docs.google.com/spreadsheets/d/1yhC0JLjJ68tkcFoXzC8lRla6bE7qcSGrX6FUxlPYKbA/edit#gid=894866128
  		// Publish URL:
  		// https://docs.google.com/spreadsheets/d/1yhC0JLjJ68tkcFoXzC8lRla6bE7qcSGrX6FUxlPYKbA/pubhtml?gid=894866128&single=true
		
		var stream = fs.createReadStream("Item - English.csv");
		var csvStream = csv({headers: true}).on("data", function(data) {
			console.log('Updating: '+data.ID+' '+data.Name);
					db.Item.update({ _id: data.ID }, { 
						Name: data.Name,
						Description1: data.Description1,
						Description2: data.Description2,
						Description3: data.Description3
					}).exec();
		}).on("end",function(){
			console.log("done");
			done();
		});
		
		stream.pipe(csvStream);
	
  	});


	vmscript.watch('Config/world.json');
  });
};
