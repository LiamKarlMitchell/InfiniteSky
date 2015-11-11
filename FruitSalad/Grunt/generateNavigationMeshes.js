module.exports = function(grunt) {
  grunt.registerTask('generateNavigationMeshes', 'Gets the game map files into a navigation mesh to be used with recast.', function() {
  	var done = this.async();
	var vmscript = new (require('../VMScript.js'))();
	var Recast = require('recastjs');
	var async = require('async');
	
	var fileRegex = /^Z(\d{3})(?:_(\d+))?\.obj$/;

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for generateNavigationMeshes.');
  		if (!config.world) {
			console.error('Expecting config.world to be set.');
	  		return done(false);
  		}

	  	if (!config.world.world_directory) {
	  		console.error('Expecting config.world.world_directory to be set. Please run grunt init or grunt locateGameFiles.');
	  		return done(false);
	  	}

		// TODO: Get list of game map files WO/WM or w/e and convert them to OBJ.
		// USE ! config.world.info_directory just using the below path for testing.
 		fs.readdir(path.join(config.world.data_path, 'navigation_mesh'), function(err, items) {
	        if (err) {
	            console.error(err);
	            return done(false);
	        }

	        var files = [];
	        for (var i = 0; i < items.length; i++) {
	        	var capture = fileRegex.exec(items[i]);
	            if (capture !== null) {
	                files.push(items[i]);
	            }
	        }
	    }
		// TODO: Turn them into OBJ.
		// TODO: Feed into recast.
		// var recast = new Recast();
		// recast.OBJLoader(objFileName, recast_objLoaded);
		// TODO: Save tilecache navigation mesh to disk. (Maybe compress it if its not already)

  	});

  	function recast_objLoaded() {
  		console.log(this);
  		done(false);
  	}



	vmscript.watch('Config/world.json');
  });
};
