// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('Item', [], function(){
	// Shorthand Types
	//var String = db.mongoose.Schema.Types.String;
	//var Number = db.mongoose.Schema.Types.Number;
	var Bool = db.mongoose.Schema.Types.Boolean;
	//var Array = db.mongoose.Schema.Types.Array;
	//var Date = db.mongoose.Schema.Types.Date;
	var ObjectId = db.mongoose.Schema.Types.ObjectId;
	var Mixed = db.mongoose.Schema.Types.Mixed;

	var monsterschema = mongoose.Schema({
		id: { type: Number, index: true, unique: true, default: 0},
        Name: String, // 4
        // Unknown1C: Number, //2E
        // Unknown32: Number, // 32
        SpecialModelID: Number, // 36
        ModelID: Number, // 40
        // clickwidth: Number, // 44
        // clickheight: Number, // 48
        // clickdepth: Number, // 52
        // Unknown56: Number, // 56
        // Unknown60: Number, // 60
        // Unknown64: Number, // 64
        // Unknown68: Number, // 68
        // Unknown72: Number, // 72
        // Unknown76: Number, // 76
        // Unknown80: Number, // 80
        // Unknown84: Number, // 84
        Level: Number, // 88
        // Unknown92: Number, // 92
        Health: Number, // 96
        // Unknown100: Number, // 100
        // Unknown104: Number, // 104
        // Unknown108: Number, // 108
        // Unknown112: Number, // 112
        // Unknown116: Number, // 116
        // Unknown120: Number, // 120
        // Unknown124: Number, // 124
        // Unknown128: Number, // 128
        // RadiusInfo1: Number, // 132
        // RadiusInfo2: Number, // 136
        WalkSpeed: Number, // 140
        RunSpeed: Number, // 144
        // DeathSpeed: Number, // 148
        Damage: Number, // 152
        Defense: Number, // 156
        HitRate: Number, // 160
        DodgeRate: Number, // 164
				ElementalDefense: Array,
        // ElementAttackPower: Number, // 168
        // ElementDefensePower: Number, // 172
        // Critical: Number, // 176
        // Unknown180: Number, // 180
        // Unknown184: Number, // 184
        // Unknown188: Number, // 188
        // Unknown192: Number, // 192
        // Unknown196: Number, // 196
        // Unknown200: Number, // 200
        // Unknown204: Number, // 204
        // Unknown208: Number, // 208
        // Unknown212: Number, // 212
        // Unknown216: Number, // 216
        // Unknown220: Number, // 220
        // Unknown224: Number, // 224
        // Unknown228: Number, // 228
        // Unknown232: Number, // 232
        // Unknown236: Number, // 236
        // Unknown240: Number, // 240
        // Unknown244: Number, // 244
        // Unknown248: Number, // 248
        // Unknown252: Number, // 252
        // Unknown256: Number, // 256
        // Unknown260: Number, // 260
        // Unknown264: Number, // 264
        // Unknown268: Number, // 268
        // Unknown272: Number, // 272
        // Unknown276: Number, // 276
        // Unknown280: Number, // 280
        // Unknown284: Number, // 284
        // Unknown288: Number, // 288
        // Unknown292: Number, // 292
        // Unknown296: Number, // 296
        // Unknown300: Number, // 300
        // Unknown304: Number, // 304
        // Unknown308: Number, // 308
        // Unknown312: Number, // 312
        // Unknown316: Number, // 316
        // Unknown320: Number, // 320
        // Unknown324: Number, // 324
        ElementalDamage: Array,
				// LightATK: Number, // 328
        // ShadowATK: Number, // 332
        // DarkATK: Number, // 336
        // Unknown340: Number, // 340
        // Unknown344: Number, // 344
        // Unknown348: Number, // 348
        // Unknown352: Number, // 352
        // Unknown356: Number, // 356
        // Unknown360: Number, // 360
        // Unknown364: Number, // 364
        // Unknown368: Number, // 368
        // Unknown372: Number, // 372
        // Money Info
        // Unknown376: Number, // 376 //
        // Unknown380: Number, // 380 //
        // Unknown384: Number, // 384 //
        // Potion Info
        // Unknown388: Number, // 388
        // Unknown392: Number, // 392
        // Unknown396: Number, // 396
        // Unknown400: Number, // 400
        // Unknown404: Number, // 404
        // Unknown408: Number, // 408
        // Unknown412: Number, // 412
        // Unknown416: Number, // 416
        // Unknown420: Number, // 420
        // Unknown424: Number, // 424
        // Item Info
        // Unknown428: Number, // 428
        // Unknown432: Number, // 432
        // Unknown436: Number, // 436
        // Unknown440: Number, // 440
        // Unknown444: Number, // 444
        // Unknown448: Number, // 448
        // Unknown452: Number, // 452
        // Unknown456: Number, // 456
        // Unknown460: Number, // 460
        // Unknown464: Number, // 464
        // Unknown468: Number, // 468
        // Unknown472: Number, // 472
        // Quest Item Info
        // Unknown476: Number, // 476
        // Unknown480: Number, // 480
        // Extra Item Info
        // Unknown484: Number, // 484
        // Unknown488: Number, // 488
        // Unknown492: Number, // 492
        // Unknown496: Number, // 496
        // Unknown500: Number, // 500
        // Unknown504: Number, // 504
        // Unknown508: Number, // 508
        // Unknown512: Number, // 512
        // Unknown516: Number, // 516
        // Unknown520: Number, // 520
        // Unknown524: Number, // 524
        // Unknown528: Number, // 528
        // Unknown532: Number, // 532
        // Unknown536: Number, // 536
        // Unknown540: Number, // 540
        // Unknown544: Number, // 544
        // Unknown548: Number, // 548
        // Unknown552: Number, // 552
        // Unknown556: Number, // 556
        // Unknown560: Number, // 560
        // Unknown564: Number, // 564
        // Unknown568: Number, // 568
        // Unknown572: Number, // 572
        // Unknown576: Number, // 576
        // Unknown580: Number, // 580
        // Unknown584: Number, // 584
        // Unknown588: Number, // 588
        // Unknown592: Number, // 592
        // Unknown596: Number, // 596
        // Unknown600: Number, // 600
        // Unknown604: Number, // 604
        // Unknown608: Number, // 608
        // Unknown612: Number, // 612
        // Unknown616: Number, // 616
        // Unknown620: Number, // 620
        // Unknown624: Number, // 624
        // Unknown628: Number, // 628
        // Unknown632: Number, // 632
        // Unknown636: Number, // 636
        // Unknown640: Number, // 640
        // Unknown644: Number, // 644
        // Unknown648: Number, // 648
        // Unknown652: Number, // 652
        // Unknown656: Number, // 656
        // Unknown660: Number, // 660
        // Unknown664: Number, // 664
        // Unknown668: Number, // 668
        // Unknown672: Number, // 672
        // Unknown676: Number, // 676
        // Unknown680: Number, // 680
        // Unknown684: Number, // 684
        // Unknown688: Number, // 688
        // Unknown692: Number, // 692
        // Unknown696: Number, // 696
        // Unknown700: Number, // 700
        // Unknown704: Number, // 704
        // Unknown708: Number, // 708
        // Unknown712: Number, // 712
        // Unknown716: Number, // 716
        // Unknown720: Number, // 720
        // ImproveStone1_Chance: Number,
        // ImproveStone1_ID: Number, // 7
        // ImproveStone2_Chance: Number,
        // ImproveStone2_ID: Number, // 7
        // Unknown740: Number, // 740
        // PetDropChance: Number, // 744
        // PetID1: Number, // 748
        // PetID2: Number, // 752
        // Unknown756: Number, // 756
        // Unknown760: Number, // 760
        // Unknown764: Number, // 764
        // Unknown768: Number, // 768
        // Unknown772: Number, // 772
        // Unknown776: Number, // 776
        // Unknown780: Number, // 780
        // Unknown784: Number, // 784
        // Unknown788: Number, // 788
        // Unknown792: Number, // 792
        // Unknown796: Number, // 796
        // Unknown800: Number, // 800
        // Unknown804: Number, // 804
        // Unknown808: Number, // 808
        // Unknown812: Number, // 812
        // Unknown816: Number, // 816
        // Unknown820: Number, // 820
        // Unknown824: Number, // 824
        // Unknown828: Number, // 828
        // Unknown832: Number, // 832
        // Unknown836: Number, // 836
        // Unknown840: Number, // 840
        // Unknown844: Number, // 844
        // Unknown848: Number, // 848
        // Unknown852: Number, // 852
        // Unknown856: Number, // 856
        // Unknown860: Number, // 860
        // Unknown864: Number, // 864
        // Unknown868: Number, // 868
        // Unknown872: Number, // 872
        // Unknown876: Number, // 876
        // Unknown880: Number  // 880
	});


    monsterschema.toString = function(kind) {
		switch (kind) {
			case 'small':
                return this.ID+" - "+this.Name;
            break;
			default:
				return this.ID+" - "+this.Name+' Lv: '+this.Level+' HP: '+this.Health+' Atk: '+this.AttackPower+' Def: '+this.DefensePower+' AtkSuccess: '+this.AttackSuccess+' AtkBlock: '+this.AttackBlock+' EleAtk: '+this.ElementAttackPower+' EleDef: '+this.ElementDefensePower+' Crit: '+this.Critical;
			break;
		}
	}


	//Constructor
	delete mongoose.models['monster'];
	var Monster = db.mongoose.model('monster', monsterschema);

	db.Monster = Monster;

	db.Monster.findById = function(id, callback){
		db.Monster.findOne({
			id: id
		}, callback);
	};
});
