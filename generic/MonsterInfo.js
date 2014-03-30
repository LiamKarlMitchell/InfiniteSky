// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the MonsterInfo data

// Incase we ever make an editor we could have constructor?
function MonsterInfo(){};
MonsterInfo.prototype = {
	inspect: safeguard_cli.inspect,

	toString: function(kind) {
		switch (kind) {
			case 'small':      
                return this.ID+" - "+this.Name;
            break;
			default:
				return this.ID+" - "+this.Name+' Lv: '+this.Level+' HP: '+this.Health+' Atk: '+this.AttackPower+' Def: '+this.DefensePower+' AtkSuccess: '+this.AttackSuccess+' AtkBlock: '+this.AttackBlock+' EleAtk: '+this.ElementAttackPower+' EleDef: '+this.ElementDefensePower+' Crit: '+this.Critical;
			break;
		}
	}

};

LoadMonsterInfo = function() {
	// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
	infos.Monster = new GameInfoLoader('005_00004.IMG',
restruct.
  int32lu("ID"). // 0
    string("Name",24). // 4
    int32lu("Unknown1C"). //2E
    int32lu("Unknown32"). // 32
    int32lu("SpecialModelID"). // 36
    int32lu("ModelID"). // 40
    int32lu("clickwidth"). // 44
    int32lu("clickheight"). // 48
    int32lu("clickdepth"). // 52
    int32lu("Unknown56"). // 56
    int32lu("Unknown60"). // 60
    int32lu("Unknown64"). // 64
    int32lu("Unknown68"). // 68
    int32lu("Unknown72"). // 72
    int32lu("Unknown76"). // 76
    int32lu("Unknown80"). // 80
    int32lu("Unknown84"). // 84
    int32lu("Level"). // 88
    int32lu("Unknown92"). // 92
    int32lu("Health"). // 96
    int32lu("Unknown100"). // 100
    int32lu("Unknown104"). // 104
    int32lu("Unknown108"). // 108
    int32lu("Unknown112"). // 112
    int32lu("Unknown116"). // 116
    int32lu("Unknown120"). // 120
    int32lu("Unknown124"). // 124
    int32lu("Unknown128"). // 128
    int32lu("RadiusInfo1"). // 132
    int32lu("RadiusInfo2"). // 136
    int32lu("WalkSpeed"). // 140
    int32lu("RunSpeed"). // 144
    int32lu("DeathSpeed"). // 148
    int32lu("AttackPower"). // 152
    int32lu("DefensePower"). // 156
    int32lu("AttackSuccess"). // 160
    int32lu("AttackBlock"). // 164
    int32lu("ElementAttackPower"). // 168
    int32lu("ElementDefensePower"). // 172
    int32lu("Critical"). // 176
    int32lu("Unknown180"). // 180
    int32lu("Unknown184"). // 184
    int32lu("Unknown188"). // 188
    int32lu("Unknown192"). // 192
    int32lu("Unknown196"). // 196
    int32lu("Unknown200"). // 200
    int32lu("Unknown204"). // 204
    int32lu("Unknown208"). // 208
    int32lu("Unknown212"). // 212
    int32lu("Unknown216"). // 216
    int32lu("Unknown220"). // 220
    int32lu("Unknown224"). // 224
    int32lu("Unknown228"). // 228
    int32lu("Unknown232"). // 232
    int32lu("Unknown236"). // 236
    int32lu("Unknown240"). // 240
    int32lu("Unknown244"). // 244
    int32lu("Unknown248"). // 248
    int32lu("Unknown252"). // 252
    int32lu("Unknown256"). // 256
    int32lu("Unknown260"). // 260
    int32lu("Unknown264"). // 264
    int32lu("Unknown268"). // 268
    int32lu("Unknown272"). // 272
    int32lu("Unknown276"). // 276
    int32lu("Unknown280"). // 280
    int32lu("Unknown284"). // 284
    int32lu("Unknown288"). // 288
    int32lu("Unknown292"). // 292
    int32lu("Unknown296"). // 296
    int32lu("Unknown300"). // 300
    int32lu("Unknown304"). // 304
    int32lu("Unknown308"). // 308
    int32lu("Unknown312"). // 312
    int32lu("Unknown316"). // 316
    int32lu("Unknown320"). // 320
    int32lu("Unknown324"). // 324
    int32lu("LightATK"). // 328
    int32lu("ShadowATK"). // 332
    int32lu("DarkATK"). // 336
    int32lu("Unknown340"). // 340
    int32lu("Unknown344"). // 344
    int32lu("Unknown348"). // 348
    int32lu("Unknown352"). // 352
    int32lu("Unknown356"). // 356
    int32lu("Unknown360"). // 360
    int32lu("Unknown364"). // 364
    int32lu("Unknown368"). // 368
    int32lu("Unknown372"). // 372
    // Money Info
    int32lu("Unknown376"). // 376 // Min
    int32lu("Unknown380"). // 380 // Max
    int32lu("Unknown384"). // 384 // Chance
    // Potion Info
    int32lu("Unknown388"). // 388
    int32lu("Unknown392"). // 392
    int32lu("Unknown396"). // 396
    int32lu("Unknown400"). // 400
    int32lu("Unknown404"). // 404
    int32lu("Unknown408"). // 408
    int32lu("Unknown412"). // 412
    int32lu("Unknown416"). // 416
    int32lu("Unknown420"). // 420
    int32lu("Unknown424"). // 424
    // Item Info
    int32lu("Unknown428"). // 428
    int32lu("Unknown432"). // 432
    int32lu("Unknown436"). // 436
    int32lu("Unknown440"). // 440
    int32lu("Unknown444"). // 444
    int32lu("Unknown448"). // 448
    int32lu("Unknown452"). // 452
    int32lu("Unknown456"). // 456
    int32lu("Unknown460"). // 460
    int32lu("Unknown464"). // 464
    int32lu("Unknown468"). // 468
    int32lu("Unknown472"). // 472
    // Quest Item Info
    int32lu("Unknown476"). // 476
    int32lu("Unknown480"). // 480
    // Extra Item Info
    int32lu("Unknown484"). // 484
    int32lu("Unknown488"). // 488
    int32lu("Unknown492"). // 492
    int32lu("Unknown496"). // 496
    int32lu("Unknown500"). // 500
    int32lu("Unknown504"). // 504
    int32lu("Unknown508"). // 508
    int32lu("Unknown512"). // 512
    int32lu("Unknown516"). // 516
    int32lu("Unknown520"). // 520
    int32lu("Unknown524"). // 524
    int32lu("Unknown528"). // 528
    int32lu("Unknown532"). // 532
    int32lu("Unknown536"). // 536
    int32lu("Unknown540"). // 540
    int32lu("Unknown544"). // 544
    int32lu("Unknown548"). // 548
    int32lu("Unknown552"). // 552
    int32lu("Unknown556"). // 556
    int32lu("Unknown560"). // 560
    int32lu("Unknown564"). // 564
    int32lu("Unknown568"). // 568
    int32lu("Unknown572"). // 572
    int32lu("Unknown576"). // 576
    int32lu("Unknown580"). // 580
    int32lu("Unknown584"). // 584
    int32lu("Unknown588"). // 588
    int32lu("Unknown592"). // 592
    int32lu("Unknown596"). // 596
    int32lu("Unknown600"). // 600
    int32lu("Unknown604"). // 604
    int32lu("Unknown608"). // 608
    int32lu("Unknown612"). // 612
    int32lu("Unknown616"). // 616
    int32lu("Unknown620"). // 620
    int32lu("Unknown624"). // 624
    int32lu("Unknown628"). // 628
    int32lu("Unknown632"). // 632
    int32lu("Unknown636"). // 636
    int32lu("Unknown640"). // 640
    int32lu("Unknown644"). // 644
    int32lu("Unknown648"). // 648
    int32lu("Unknown652"). // 652
    int32lu("Unknown656"). // 656
    int32lu("Unknown660"). // 660
    int32lu("Unknown664"). // 664
    int32lu("Unknown668"). // 668
    int32lu("Unknown672"). // 672
    int32lu("Unknown676"). // 676
    int32lu("Unknown680"). // 680
    int32lu("Unknown684"). // 684
    int32lu("Unknown688"). // 688
    int32lu("Unknown692"). // 692
    int32lu("Unknown696"). // 696
    int32lu("Unknown700"). // 700
    int32lu("Unknown704"). // 704
    int32lu("Unknown708"). // 708
    int32lu("Unknown712"). // 712
    int32lu("Unknown716"). // 716
    int32lu("Unknown720"). // 720
    int32lu("ImproveStone1_Chance"). // 724
    int32lu("ImproveStone1_ID"). // 728
    int32lu("ImproveStone2_Chance"). // 732
    int32lu("ImproveStone2_ID"). // 736
    int32lu("Unknown740"). // 740
    int32lu("PetDropChance"). // 744
    int32lu("PetID1"). // 748
    int32lu("PetID2"). // 752
    int32lu("Unknown756"). // 756
    int32lu("Unknown760"). // 760
    int32lu("Unknown764"). // 764
    int32lu("Unknown768"). // 768
    int32lu("Unknown772"). // 772
    int32lu("Unknown776"). // 776
    int32lu("Unknown780"). // 780
    int32lu("Unknown784"). // 784
    int32lu("Unknown788"). // 788
    int32lu("Unknown792"). // 792
    int32lu("Unknown796"). // 796
    int32lu("Unknown800"). // 800
    int32lu("Unknown804"). // 804
    int32lu("Unknown808"). // 808
    int32lu("Unknown812"). // 812
    int32lu("Unknown816"). // 816
    int32lu("Unknown820"). // 820
    int32lu("Unknown824"). // 824
    int32lu("Unknown828"). // 828
    int32lu("Unknown832"). // 832
    int32lu("Unknown836"). // 836
    int32lu("Unknown840"). // 840
    int32lu("Unknown844"). // 844
    int32lu("Unknown848"). // 848
    int32lu("Unknown852"). // 852
    int32lu("Unknown856"). // 856
    int32lu("Unknown860"). // 860
    int32lu("Unknown864"). // 864
    int32lu("Unknown868"). // 868
    int32lu("Unknown872"). // 872
    int32lu("Unknown876"). // 876
    int32lu("Unknown880"), // 880

  function onRecordLoad(record) {
  	if (record.ID) {
  		// Change the prototype so that we have access to methods we want.
  		record.__proto__ = MonsterInfo.prototype;
  	}
  	return record;
  });
}

// If we have not loaded the monster info yet then load it
if (infos.Monster === undefined) LoadMonsterInfo();