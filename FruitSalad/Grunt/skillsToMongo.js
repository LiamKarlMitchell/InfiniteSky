module.exports = function(grunt) {
  grunt.registerTask('skillsToMongo', 'Loads npc from the game file 005_00003.IMG into Mongo.', function() {
  	var done = this.async();
  	//vmscript.watch('Config/login.json');
	var vmscript = new (require('../VMScript.js'))();
	Database = require('../Modules/db.js');
	var GameInfoLoader = require('../Modules/GameInfoLoader.js');
	var restruct = require('../Modules/restruct');
	var encoding = require('encoding');
  var hexy = require('hexy').hexy;

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for skillsToMongo.');
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
  		console.log('Clearing all existing Skills in MongoDB.');
  		db.Skill.remove().exec();

		console.log('Please wait loading info into database may take some time.');
		// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
    var SkillData = restruct.
      int32ls('ChiCost').
      int32ls('DegreeOfDefensiveSkill').
      int32ls('ChiRecovery').
      int32ls('ChanceToAcupressure').
      int32ls('ChanceToUnstun').
      int32ls('AirWalkDistance').
      int32ls('EnergyBall').
      int32ls('DamageIncreased').
      int32ls('Unk1').
      int32ls('AttackRangeApplied').
      int32ls('DamageApplied').
      int32ls('OnlyForLightDamage').
      int32ls('OnlyForShadowDamage').
      int32ls('OnlyForDarkDamage').
      int32ls('ChanceToHitApplied').
      int32ls('EffectiveDuration').
      int32ls('IncreasedDamage').
      int32ls('IncreasedDefense').
      int32ls('Unk2').
      int32ls('CastTime').
      int32ls('IncreasedLightResistance').
      int32ls('IncreasedShadowResistance').
      int32ls('IncreasedDarkResistance').
      int32ls('IncreasedChanceToHit').
      int32ls('IncreasedChanceToDodge').
      int32ls('IncreasedMovementSpeed').
      int32ls('IncreasedAttackSpeed').
      int32ls('IncreasedLuck').
      int32ls('EnchancedChanceToDeadlyBlow').
      int32ls('ChanceToReturnDamage').
      int32ls('IncreasedAcupressureDefense').
      int32ls('ChanceToRemoveIncreaseEffect').
      int32ls('HPRegenerationPoints').
      int32ls('ChiRegenerationPoints');

		var Skills = new GameInfoLoader('005_00003.IMG',
			restruct.
      int32lu("ID").
      string("Name",28).
      int32lu("Category"). // 32
      int32lu('unk0'). // 36
      int32lu('SpriteStartID'). // 40
      int32lu('Clan'). // 44
      int32lu('Weapon'). // 48
      string('Description1',51). // 52
      string('Description2',51). // 103
      string('Description3',50). // 154
      int32ls('unk1'). // 204
      int32ls('unk2'). // 208
      int32ls('unk3'). // 212
      int32ls('unk4'). // 216
      int32ls('unk5'). // 220
      int32ls('unk6'). // 224
      int32ls('unk7'). // 228
      int32ls('unk8'). // 232
      int32ls('unk9'). // 236
      int32ls('unk10'). // 240
      int32ls('unk11'). // 244
      int32ls('unk12'). // 248
      int32ls('unk13'). // 252
      int32ls('unk14'). // 256
      int32ls('unk15'). // 260
      int32ls('unk16'). // 264
      int32ls('unk17'). // 268
      int32ls('unk18'). // 272
      int32ls('unk19'). // 276
      int32ls('unk20'). // 280
      int32ls('unk21'). // 284
      int32ls('unk22'). // 288
      int32ls('unk23'). // 292
      int32ls('unk24'). // 296
      int32ls('unk25'). // 300
      int32ls('unk26'). // 304
      int32ls('unk27'). // 308
      int32ls('unk28'). // 312
      int32ls('unk29'). // 316
      int32ls('unk30'). // 320
      int32ls('unk31'). // 324
      int32ls('unk32'). // 328
      int32ls('unk33'). // 332
      int32ls('ChiUsage'). // 336
      int32ls('unk35'). // 340
      int32ls('unk66'). // 344
      int32ls('unk99'). // 348
      int32ls('unk132'). // 352
      int32ls('unk165'). // 356
      int32ls('unk198'). // 360
      int32ls('unk231'). // 364
      int32ls('unk264'). // 368
      int32ls('unk297'). // 372
      int32ls('unk330'). // 376
      int32ls('unk363'). // 380
      int32ls('unk396'). // 384
      int32ls('unk429'). // 388
      int32ls('unk462'). // 392
      int32ls('unk495'). // 396
      int32ls('unk528'). // 400
      int32ls('unk561'). // 404
      int32ls('unk594'). // 408
      int32ls('unk627'). // 412
      int32ls('unk660'). // 416
      int32ls('unk693'). // 420
      int32ls('unk726'). // 424
      int32ls('unk759'). // 428
      int32ls('unk792'). // 432
      int32ls('unk825'). // 436
      int32ls('unk858'). // 440
      int32ls('unk891'). // 444
      int32ls('unk924'). // 448
      int32ls('unk957'). // 452
      int32ls('unk990'). // 456
      int32ls('unk1023'). // 460
      int32ls('unk1056'). // 464
      int32ls('unk1089'). // 468
      int32ls('unk1122'). // 472
      int32ls('unk1155'). // 476
      int32ls('unk1188'). // 480
      int32ls('unk1221'). // 484
      int32ls('unk1254'). // 488
      int32ls('unk1287'). // 492
      int32ls('unk1320'). // 496
      int32ls('unk1353'). // 500
      int32ls('unk1386'). // 504
      int32ls('unk1419'). // 508
      int32ls('unk1452'). // 512
      int32ls('unk1485'). // 516
      int32ls('unk1518'). // 520
      int32ls('unk1551'). // 524
      int32ls('unk1584'). // 528
      int32ls('unk1617'). // 532
      int32ls('unk1650'). // 536
      int32ls('unk1683'). // 540
      int32ls('unk1716'). // 544
      int32ls('unk1749'). // 548
      int32ls('unk1782'). // 552
      int32ls('unk1815'). // 556
      int32ls('unk1848'). // 560
      int32ls('unk1881'). // 564
      int32lu('PointsToLearn'). // 232
      int32ls('MaxSkillLevel'). // 236
      int32ls('unk2000'). // 240
      struct('ModifiersStart', SkillData).
      struct('ModifiersEnd', SkillData),
			  function onRecordLoad(record, buffer) {
			  	if (record.ID) {
            db.Skill.create(record, function(err, doc){
              if(err){
                console.log(err);
                return;
              }
              console.log("Skill added:", doc.ID);
            });
			  	}
			  }
			);

		Skills.once('loaded', function(){
			done(true);
		});

  	});

	vmscript.watch('Config/world.json');
  });
};
