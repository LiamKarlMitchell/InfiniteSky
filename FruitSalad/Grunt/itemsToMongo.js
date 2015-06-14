module.exports = function(grunt) {
  grunt.registerTask('itemsToMongo', 'Loads items from the game file 005_00002.IMG into Mongo.', function() {
  	var done = this.async();

  	//vmscript.watch('Config/login.json');
	var vmscript = new (require('../VMScript.js'))();
	Database = require('../Modules/db.js');
	var GameInfoLoader = require('../Modules/GameInfoLoader.js');
	var restruct = require('../Modules/restruct');
	var encoding = require("encoding");

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for itemsToMongo.');
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
  		console.log('Clearing all existing Items in MongoDB.');
  		db.Item.remove().exec();

		console.log('Please wait loading info into database may take some time.');
		// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
		var Items = new GameInfoLoader('005_00002.IMG',
			restruct.
			  int32lu("_id").
			  string('Name',28).
			  int32lu("Rareness").
			  int32lu("ItemType").
			  int32lu("DisplayItem2D").
			  int32ls("_1").
			  int32lu("Level"). // Double as LevelRequirement?
			  int32lu("Clan").
			  int32ls("_4").
			  int32ls("_5").
			  int32ls("_6").
			  int32ls("_7").
			  int32ls("_8").
			  int32ls("_9").
			  int32ls("_10").
			  int32ls("_11").
			  int32ls("_12").
			  int32lu("PurchasePrice").
			  int32lu("SalePrice").
			  int32ls("_13").
			  int32ls("Capacity").
			  int32ls("LevelRequirement").
			  int32ls("HonorPointReq").
			  int32ls("_15a").
			  int32ls("Strength").
			  int32ls("Dexterity").
			  int32ls("Vitality").
			  int32ls("Chi").
			  int32ls("Luck").
			  int32ls("Damage").
			  int32ls("Defense").
			  int32ls("LightDamage").
			  int32ls("ShadowDamage").
			  int32ls("DarkDamage").
			  int32ls("LightResistance").
			  int32ls("ShawdowResistance").
			  int32ls("DarkResistance").
			  int32ls("ChancetoHit").
			  int32ls("ChancetoDodge").
			  int32ls("PercentToDeadlyBlow").
			  int32ls("SkillBonusID1").
			  int32ls("SkillBonusID2").
			  int32ls("SkillBonusID3").
			  int32ls("SkillBonusAmount1").
			  int32ls("SkillBonusAmount2").
			  int32ls("SkillBonusAmount3").
			  int32ls("_14").
			  int32ls("ValueType").
			  int32ls("Value1").
			  int32ls("_16").
			  int32ls("_17").
			  int32ls("Refinement").
			  int32ls("ChancetoEarnExperiencePointsfromFinalhit").
			  int32ls("ExperiencePointEarnedfromFinalhit_PERCENTBONUS_").
			  int32ls("_18").
			  int32ls("_19").
			  int32ls("DecreaseChiConsumption").
			  int32ls("DodgeDeadlyBlow").
			  int32ls("IncreaseAllSKillMastery").
			  int32ls("_20").
			  int32ls("_21").
			  int32ls("_22").
			  int32ls("_23").
			  string('Description1',25).
			  string('Description2',25).
			  string('Description3',26),
			  function onRecordLoad(record) {
			  	if (record._id) {
			  		// Convert the encoding of the name and descriptions.
			  		record.Name = encoding.convert(record.Name, 'UTF-8', 'EUC-KR').toString();
			  		console.log(record._id, record.Name);
			  		record.Description1 = encoding.convert(record.Description1, 'UTF-8', 'EUC-KR').toString();
			  		record.Description2 = encoding.convert(record.Description2, 'UTF-8', 'EUC-KR').toString();
			  		record.Description3 = encoding.convert(record.Description3, 'UTF-8', 'EUC-KR').toString();
			  		db.Item.create(record, function(err, doc) {
			  			if (err) {
			  				console.error(err);
			  				return;
			  			}

			  			console.log('Confirming save of '+doc._id);
			  		});
			  	}
			  }
			);

		Items.once('loaded', function(){
			done(true);
		});

  	});

	vmscript.watch('Config/world.json');
  });
};
