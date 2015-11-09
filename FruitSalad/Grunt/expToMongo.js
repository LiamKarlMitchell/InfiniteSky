module.exports = function(grunt) {
  grunt.registerTask('expToMongo', 'Loads exp info from the game file 005_00001.IMG into Mongo.', function() {
  	var done = this.async();
	//vmscript.watch('Config/login.json');
	var vmscript = new (require('../VMScript.js'))();
	Database = require('../Modules/db.js');
	var GameInfoLoader = require('../Modules/GameInfoLoader.js');
	var restruct = require('../Modules/restruct');


  	vmscript.on(['config'], function() {
  		console.log('Starting config check for expToMongo.');
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
			vmscript.watch('Database/exp.js');
		});

  	});

  	vmscript.on(['Exp'], function() {
  		console.log('Clearing all existing Exp in MongoDB.');
  		db.Exp.remove().exec();

		console.log('Please wait loading info into database may take some time.');
		// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
		var Exp = new GameInfoLoader('005_00001.IMG',
			  restruct.
			  int32lu("Level").
			  int32lu("EXPStart").
			  int32lu("EXPEnd").
			  int32lu("Unknown1").
			  int32lu("Unknown2").
			  int32lu("SkillPoint").

        int32lu('Damage', 3).
			  // int32lu("GuanyinDamage").
			  // int32lu("FujinDamage").
			  // int32lu("JinongDamage").

        int32lu('Defense', 3).

			  // int32lu("GuanyinDefense").
			  // int32lu("FujinDefense").
			  // int32lu("JinongDefense").
        int32lu('HitRate', 3).

			  // int32lu("GuanyinHitrate").
			  // int32lu("FujinHitrate").
			  // int32lu("JinongHitrate").
        int32lu('Dodge', 3).
			  // int32lu("GuanyinDodge").
			  // int32lu("FujinDodge").
			  // int32lu("JinongDodge").
        int32lu('ElementalDamage', 3).
			  // int32lu("LightDamage").
			  // int32lu("ShadowDamage").
			  // int32lu("DarkDamage").
        int32lu('BaseHP', 3).
			  // int32lu("GuanyinHP").
			  // int32lu("FujinHP").
			  // int32lu("JinongHP").
        int32lu('BaseChi', 3),
			  // int32lu("GuanyinChi").
			  // int32lu("FujinChi").
			  // int32lu("JinongChi"),
			  function onRecordLoad(record) {
			  	if (record.Level) {
			  		if(record.Level === 145) record.EXPEnd = 2000000000;
            record.BaseHP.reverse();
            record.BaseChi.reverse();
            record.ElementalDamage.reverse();
            record.Dodge.reverse();
            record.HitRate.reverse();
            record.Defense.reverse();
            record.Damage.reverse();

			  		db.Exp.create(record, function(err, doc) {
			  			if (err) {
			  				console.error(err);
			  				return;
			  			}


			  			console.log('Confirming save of '+doc.Level);
			  		});
			  	}
			  }
			);

		Exp.once('loaded', function(){
			done(true);
		});

  	});

	vmscript.watch('Config/world.json');
  });
};
