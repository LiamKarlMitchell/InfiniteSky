module.exports = function(grunt) {
  grunt.registerTask('monstersToMongo', 'Loads monsters from the game file 005_00004.IMG into Mongo.', function() {
  	var done = this.async();
  	//vmscript.watch('Config/login.json');
	var vmscript = new (require('../VMScript.js'))();
	Database = require('../Modules/db.js');
	var GameInfoLoader = require('../Modules/GameInfoLoader.js');
	var restruct = require('../Modules/restruct');
	var encoding = require("encoding");

  	vmscript.on(['config'], function() {
  		console.log('Starting config check for monstersToMongo.');
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

  	vmscript.on(['MonsterInfo'], function() {
  		console.log('Clearing all existing Mosnters in MongoDB.');
  		db.Monster.remove().exec();

		console.log('Please wait loading info into database may take some time.');
		// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
		var Monsters = new GameInfoLoader('005_00004.IMG',
			restruct.
		        int32lu("id"). // 0
		        string("Name",24). // 4
		        int32ls("Unknown1C"). //2E
		        int32ls("Unknown32"). // 32
		        int32lu("SpecialModelID"). // 36
		        int32lu("ModelID"). // 40
		        int32ls("clickwidth"). // 44
		        int32ls("clickheight"). // 48
		        int32ls("clickdepth"). // 52
		        int32ls("Unknown56"). // 56
		        int32ls("Unknown60"). // 60
		        int32ls("Unknown64"). // 64
		        int32ls("Unknown68"). // 68
		        int32ls("Unknown72"). // 72
		        int32ls("Unknown76"). // 76
		        int32ls("Unknown80"). // 80
		        int32ls("Unknown84"). // 84
		        int32lu("Level"). // 88
		        int32ls("Experience"). // 92
		        int32lu("Health"). // 96
		        int32ls("Unknown100"). // 100
		        int32ls("Unknown104"). // 104
		        int32ls("Unknown108"). // 108
		        int32ls("Unknown112"). // 112
		        int32ls("Unknown116"). // 116
		        int32ls("Unknown120"). // 120
		        int32ls("Unknown124"). // 124
		        int32ls("Unknown128"). // 128
		        int32ls("RadiusInfo1"). // 132
		        int32ls("RadiusInfo2"). // 136
		        int32ls("WalkSpeed"). // 140
		        int32ls("RunSpeed"). // 144
		        int32ls("DeathSpeed"). // 148
		        int32ls("Damage"). // 152
		        int32ls("Defense"). // 156
		        int32ls("HitRate"). // 160
            int32ls("DodgeRate"). // 164
            int32ls("ElementalDamage", 3). // 164
            // int32ls("Unknown177"). // 164
            // int32ls("Unknown178"). // 164
		        // int32ls("Unknown179"). // 164
		        // int32ls("ElementalDefense", 3). // 168
		        int32ls("Unknown180"). // 180
		        int32ls("Unknown184"). // 184
		        int32ls("Unknown188"). // 188
		        int32ls("Unknown192"). // 192
		        int32ls("Unknown196"). // 196
		        int32ls("Unknown200"). // 200
		        int32ls("Unknown204"). // 204
		        int32ls("Unknown208"). // 208
		        int32ls("Unknown212"). // 212
		        int32ls("Unknown216"). // 216
		        int32ls("Unknown220"). // 220
		        int32ls("Unknown224"). // 224
		        int32ls("Unknown228"). // 228
		        int32ls("Unknown232"). // 232
		        int32ls("Unknown236"). // 236
		        int32ls("Unknown240"). // 240
		        int32ls("Unknown244"). // 244
		        int32ls("Unknown248"). // 248
		        int32ls("Unknown252"). // 252
		        int32ls("Unknown256"). // 256
		        int32ls("Unknown260"). // 260
		        int32ls("Unknown264"). // 264
		        int32ls("Unknown268"). // 268
		        int32ls("Unknown272"). // 272
		        int32ls("Unknown276"). // 276
		        int32ls("Unknown280"). // 280
		        int32ls("Unknown284"). // 284
		        int32ls("QuestDropChance"). // 288
		        int32ls("QuestDropItem"). // 292
		        int32ls("Unknown296"). // 296
		        int32ls("Unknown300"). // 300
		        int32ls("Unknown304"). // 304
		        int32ls("Unknown308"). // 308
		        int32ls("Unknown312"). // 312
		        int32ls("Unknown316"). // 316
		        int32ls("Unknown320"). // 320
            int32ls("Unknown324"). // 324
            int32ls("Unknown325"). // 324
            int32ls("Unknown326"). // 324
		        int32ls("Unknown327"). // 324
		        int32ls("Unknown340"). // 340
		        int32ls("Unknown344"). // 344
		        int32ls("Unknown348"). // 348
		        int32ls("Unknown352"). // 352
		        int32ls("Unknown356"). // 356
		        int32ls("Unknown360"). // 360
		        int32ls("Unknown364"). // 364
		        int32ls("Unknown368"). // 368
		        int32ls("Unknown372"). // 372
		        // Money Info
		        int32ls("Unknown376"). // 376 // Min
		        int32ls("Unknown380"). // 380 // Max
		        int32ls("Unknown384"). // 384 // Chance
		        // Potion Info
		        int32ls("Unknown388"). // 388
		        int32ls("Unknown392"). // 392
		        int32ls("Unknown396"). // 396
		        int32ls("Unknown400"). // 400
		        int32ls("Unknown404"). // 404
		        int32ls("Unknown408"). // 408
		        int32ls("Unknown412"). // 412
		        int32ls("Unknown416"). // 416
		        int32ls("Unknown420"). // 420
		        int32ls("Unknown424"). // 424
		        // Item Info
		        int32ls("Unknown428"). // 428
		        int32ls("Unknown432"). // 432
		        int32ls("Unknown436"). // 436
		        int32ls("Unknown440"). // 440
		        int32ls("Unknown444"). // 444
		        int32ls("Unknown448"). // 448
		        int32ls("Unknown452"). // 452
		        int32ls("Unknown456"). // 456
		        int32ls("Unknown460"). // 460
		        int32ls("Unknown464"). // 464
		        int32ls("Unknown468"). // 468
		        int32ls("Unknown472"). // 472
		        // Quest Item Info
		        int32ls("Unknown476"). // 476
		        int32ls("Unknown480"). // 480
		        // Extra Item Info
		        int32ls("Unknown484"). // 484
		        int32ls("Unknown488"). // 488
		        int32ls("Unknown492"). // 492
		        int32ls("Unknown496"). // 496
		        int32ls("Unknown500"). // 500
		        int32ls("Unknown504"). // 504
		        int32ls("Unknown508"). // 508
		        int32ls("Unknown512"). // 512
		        int32ls("Unknown516"). // 516
		        int32ls("Unknown520"). // 520
		        int32ls("Unknown524"). // 524
		        int32ls("Unknown528"). // 528
		        int32ls("Unknown532"). // 532
		        int32ls("Unknown536"). // 536
		        int32ls("Unknown540"). // 540
		        int32ls("Unknown544"). // 544
		        int32ls("Unknown548"). // 548
		        int32ls("Unknown552"). // 552
		        int32ls("Unknown556"). // 556
		        int32ls("Unknown560"). // 560
		        int32ls("Unknown564"). // 564
		        int32ls("Unknown568"). // 568
		        int32ls("Unknown572"). // 572
		        int32ls("Unknown576"). // 576
		        int32ls("Unknown580"). // 580
		        int32ls("Unknown584"). // 584
		        int32ls("Unknown588"). // 588
		        int32ls("Unknown592"). // 592
		        int32ls("Unknown596"). // 596
		        int32ls("Unknown600"). // 600
		        int32ls("Unknown604"). // 604
		        int32ls("Unknown608"). // 608
		        int32ls("Unknown612"). // 612
		        int32ls("Unknown616"). // 616
		        int32ls("Unknown620"). // 620
		        int32ls("Unknown624"). // 624
		        int32ls("Unknown628"). // 628
		        int32ls("Unknown632"). // 632
		        int32ls("Unknown636"). // 636
		        int32ls("Unknown640"). // 640
		        int32ls("Unknown644"). // 644
		        int32ls("Unknown648"). // 648
		        int32ls("Unknown652"). // 652
		        int32ls("Unknown656"). // 656
		        int32ls("Unknown660"). // 660
		        int32ls("Unknown664"). // 664
		        int32ls("Unknown668"). // 668
		        int32ls("Unknown672"). // 672
		        int32ls("Unknown676"). // 676
		        int32ls("Unknown680"). // 680
		        int32ls("Unknown684"). // 684
		        int32ls("Unknown688"). // 688
		        int32ls("Unknown692"). // 692
		        int32ls("Unknown696"). // 696
		        int32ls("Unknown700"). // 700
		        int32ls("Unknown704"). // 704
		        int32ls("Unknown708"). // 708
		        int32ls("Unknown712"). // 712
		        int32ls("Unknown716"). // 716
		        int32lu("Unknown720"). // 720
		        int32ls("ImproveStone1_Chance"). // 724
		        int32ls("ImproveStone1_ID"). // 728
		        int32ls("ImproveStone2_Chance"). // 732
		        int32ls("ImproveStone2_ID"). // 736
		        int32ls("Unknown740"). // 740
		        int32ls("PetDropChance"). // 744
		        int32ls("PetID1"). // 748
		        int32ls("PetID2"). // 752
		        int32ls("Unknown756"). // 756
		        int32ls("Unknown760"). // 760
		        int32ls("Unknown764"). // 764
		        int32ls("Unknown768"). // 768
		        int32ls("Unknown772"). // 772
		        int32ls("Unknown776"). // 776
		        int32ls("Unknown780"). // 780
		        int32ls("Unknown784"). // 784
		        int32ls("Unknown788"). // 788
		        int32ls("Unknown792"). // 792
		        int32ls("Unknown796"). // 796
		        int32ls("Unknown800"). // 800
		        int32ls("Unknown804"). // 804
		        int32ls("Unknown808"). // 808
		        int32ls("Unknown812"). // 812
		        int32ls("Unknown816"). // 816
		        int32ls("Unknown820"). // 820
		        int32ls("Unknown824"). // 824
		        int32ls("Unknown828"). // 828
		        int32ls("Unknown832"). // 832
		        int32ls("Unknown836"). // 836
		        int32ls("Unknown840"). // 840
		        int32ls("Unknown844"). // 844
		        int32ls("Unknown848"). // 848
		        int32ls("Unknown852"). // 852
		        int32ls("Unknown856"). // 856
		        int32ls("Unknown860"). // 860
		        int32ls("Unknown864"). // 864
		        int32ls("Unknown868"). // 868
		        int32ls("Unknown872"). // 872
		        int32ls("Unknown876"). // 876
		        int32ls("Unknown880"), // 880
			  function onRecordLoad(record) {
			  	if (record.id) {
					record.Name = encoding.convert(record.Name, 'UTF-8', 'EUC-KR').toString();
			  		// console.log(record.id, record.Name);
            // if(record.id === 1) console.log(record);
            if(record.id === 100) console.log(record);
			  		db.Monster.create(record, function(err, doc) {
			  			if (err) {
			  				console.error(err);
			  				return;
			  			}

			  			// console.log('Confirming save of '+doc.id);
			  		});
			  	}
			  }
			);

		Monsters.once('loaded', function(){
			done(true);
		});

  	});

	vmscript.watch('Config/world.json');
  });
};
