// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({
	name: 'Structs',
	depends: []
}, function(){

if (typeof(structs)==='undefined') {
    structs = {}; // Global Variable of main.js range
}

structs.CVec3= restruct.
	float32l('X').
	float32l('Y').
	float32l('Z');

structs.Equipt= restruct.
	int32lu('ID').
	int32lu('Capacity').
	int8lu('Enchant'). // 1 = 3%
	int8lu('Combine').
	int16lu('Unknown');
	
structs.ItemEquip = restruct.
	int32lu('ID').
	int8lu('Enchant'). // 1 = 3%
	int8lu('Combine');

structs.SmallStorageItem = restruct.
	int32lu('ID').
	int32lu('Amount').
	int8lu('Enchant').
	int8lu('Combine').
	int16lu('unk');

structs.SmallStorageItemPet = restruct.
	int32lu('ID').
	int32lu('Activity').
	int32lu('Growth');

structs.Pet= restruct.
	int32lu("ID").
	int16lu('Unknown').
	int16lu('Activity').
	int32lu('Growth'); // 1250 = 0.001

structs.PetEquip = restruct.
	int32lu("ID").
	int16lu('Activity').
	int32lu('Growth');

structs.StorageItem = restruct.
	int32lu("ID").
	int32lu("Column").
	int32lu("Row").
	int32lu("Amount").
	int8lu("Enchant").
	int8lu("Combine").
	int16lu("Unknown");

structs.StorageItemPet = restruct.
	int32lu("ID").
	int32lu("Column").
	int32lu("Row").
	int32lu("Activity").
	int32lu("Growth");

structs.GiftItem = restruct.
	int32lu("ID").
	int32lu("Amount");

structs.QuickUseItem= restruct.
	int32lu("ID").
	int32lu("Amount");
	
structs.QuickUseSkill= restruct.
	int32lu("ID").
	int32lu("Level");

// 	structs. = restruct.REGION_MOVE_INFO
// 	float mPlaneInfo[4];
// 	float mSphereInfo[4];

// //STRUCTURE-[WORLDTRIS_FOR_GXD]
// structs. = restruct.WREGION_
// 	int ZoneAmount.//4
// 	REGION_MOVE_INFO Region[ZoneAmount];


// structs. = restruct.WM_FILE_HEADER
// 	int Size; ///size of compressed data
// 	float OrgSize; // size of uncompressed data
// // WM using ZLIB

// structs. = restruct.WM_FILE
// 	WM_FILE_HEADER;
// 	int8lu Compressed [WM_FILE_HEADER.Size];
// // WM using ZLIB

// structs. = restruct.WORLDVERTEX_FOR_GXD
// 	float mV[3];//12
// 	float mN[3];//24
// 	float mT1[2];//32
// 	float mT2[2];//40

// //STRUCTURE-[WORLDTRIS_FOR_GXD]
// structs. = restruct.WORLDTRIS_FOR_GXD
// 	int mTextureIndex;//4
// 	struct('WORLDVERTEX_FOR_GXD' mVertex[3];//124
// 	float mPlaneInfo[4];//140
// 	float mSphereInfo[4];//156


// structs. = restruct.WORLDTRIS_FOR_GXD
// 	int32lu('WORLDTRIS_AMOUNT').
// 	struct('WORLDTRIS_FOR_GXD',[WORLDTRIS_AMOUNT]).
// 	int8lu('QUADTREENODESTUFF',sizeof(WM_FILE.WM_FILE_HEADER.Size - WORLDTRIS_FOR_GXD[WORLDTRIS_AMOUNT])); // rest of data is quadtree stuffy :()


//Needs option in restruct to have array of strings with length, aka string('blah', 10, 13).  instead of struct for 10 friends
// Could probably make one [Liam]
structs.Friend = restruct.
	string('Name',13);

structs.Equip = function()
{
	this.ID=0;
	this.Enchant=0;
	this.Combine=0;
}

// Need to find skill and statpoints
structs.Character = restruct.
	int32lu('isGM'). // 4
	int32lu('Unused1',6).//Will add later // 8
	int32lu('PlayTime'). // 12
	string('Name',13). // 25
	string('StuffLikeLocation',119). // 144
	int32lu('Clan'). // 148
	int32lu('Gender'). // 152
	int32lu('Hair'). // 156
	int32lu('Face'). // 160
	int32lu('Level'). // 164
	int32lu('Experience'). // 168
	int32lu('OtherIngame',2).//Will add later // 172
	int32lu('SkillPoints'). // 176
	int32lu('Honor'). // 180
	int32lu('StatPoints'). // 184
	int32lu('StatVitality'). // 188
	int32lu('StatStrength'). // 192
	int32lu('StatChi'). // 196
	int32lu('StatDexterity'). // 200
	int32lu('GameStuff1'). // 204
	int32lu('GameStuff2'). //Will add later // 208
	//Equipt structs needed here, try find restruct's struct-in-struct example, or ask for one
	struct('Amulet',structs.Equipt). // 220
	struct('Cape',structs.Equipt). // 232
	struct('Armor',structs.Equipt). // 244
	struct('Glove',structs.Equipt). // 256
	struct('Ring',structs.Equipt). // 268
	struct('Boot',structs.Equipt). // 280
	struct('CalbashBottle',structs.Equipt). //Unknown Equip( using calbash improves ur dmg and reduces ur def(hotkey Q)item ingame ID 90030) // 292
	struct('Weapon',structs.Equipt). // 304
	struct('Pet',structs.Pet). // 316
	int32lu('storageUse'). // 320
	int32lu('Silver'). // here! // 324
	struct('Inventory',structs.StorageItem,64).
	struct('QuickUseItems',structs.QuickUseItem,4).
	int32lu('StorageSilver').
	int8lu('UnknownStuff1',1008).
 
	struct('SkillList',structs.QuickUseSkill,30).
	struct('SkillBar',structs.QuickUseSkill,24).
	int32lu('QuestID').//Quest ID
	int32lu('').//??
	int32lu('QuestStart').//Did you start the quest
	int32lu('QuestComplete').//Did you complete the quest
	int8lu('',20).

	string('Friends',13,10).

	int8ls('InGuild'). // 3270
	int8ls(''). // 3271
	int32lu(''). // 3272
	int32lu(''). // 3276
	int32lu(''). // 3280
	int32lu(''). // 3284
	int32lu('GuildAccess'). // 3288
	int32lu(''). // 3292
	int32lu(''). // 3296
	int32lu(''). // 3300
	int32lu(''). // 3304
	int32lu('CP'). // 3308
	int32lu(''). // 3312
	int32lu(''). // 3316

 int32lu('MapID'). // 3320
 int32lu('RealX'). // 3324
 int32lu('RealY'). // 3328
 int32lu('RealZ'). // 3332
 int32lu('Health'). // 3336
 int32lu('Chi'). // 3340
 int32lu('BankSilver'). // 3344
 int32lu(''). // 3348
 int32lu(''). // 3352
 int32lu(''). // 3356
 int32lu(''). // 3360
 int32lu(''). // 3364
 int32lu(''). // 3368
 int32lu(''). // 3372
 int32lu(''). // 3376
 int32lu(''). // 3380
 int32lu(''). // 3384
 int32lu(''). // 3388
 int32lu(''). // 3392
 int32lu(''). // 3396
 int32lu(''). // 3400
 int32lu(''). // 3404
 int32lu(''). // 3408
 int32lu(''). // 3412
 int32lu(''). // 3416
 int32lu(''). // 3420
 int32lu(''). // 3424
 int32lu(''). // 3428
 int32lu(''). // 3432
 int32lu(''). // 3436
 int32lu(''). // 3440
 int32lu(''). // 3444
 int32lu(''). // 3448
 int32lu(''). // 3452
 int32lu(''). // 3456
 int32lu(''). // 3460
 int32lu(''). // 3464
 int32lu(''). // 3468
 int32lu(''). // 3472
 int32lu(''). // 3476
 int32lu(''). // 3480
 int32lu(''). // 3484
 int32lu(''). // 3488
 int32lu(''). // 3492
 int32lu(''). // 3496
 int32lu(''). // 3500
 int32lu(''). // 3504
 int32lu(''). // 3508
 int32lu(''). // 3512
 int32lu(''). // 3516
 int32lu(''). // 3520
 int32lu(''). // 3524
 int32lu(''). // 3528
 int32lu(''). // 3532
 int32lu(''). // 3536
 int32lu(''). // 3540
 int32lu(''). // 3544
 int32lu(''). // 3548
 int32lu(''). // 3552
 int32lu(''). // 3556
 int32lu(''). // 3560
 int32lu(''). // 3564
 int32lu(''). // 3568
 int32lu(''). // 3572
 int32lu(''). // 3576
 int32lu(''). // 3580
 int32lu(''). // 3584
 int32lu(''). // 3588
 int32lu(''). // 3592
 int32lu(''). // 3596
 int32lu(''). // 3600
 int32lu(''). // 3604
 int32lu(''). // 3608
 int32lu(''). // 3612
 int32lu(''). // 3616
 int32lu(''). // 3620
 int32lu(''). // 3624
 int32lu(''). // 3628
 int32lu(''). // 3632
 int32lu(''). // 3636
 int32lu(''). // 3640
 int32lu(''). // 3644
 int32lu(''). // 3648
 int32lu(''). // 3652
 int32lu(''). // 3656
 int32lu(''). // 3660
 int32lu(''). // 3664
 int32lu(''). // 3668
 int32lu(''). // 3672
 int32lu(''). // 3676
 int32lu(''). // 3680
 int32lu(''). // 3684
 int32lu(''). // 3688
 int32lu(''). // 3692
 int32lu(''). // 3696
 int32lu(''). // 3700
 int32lu(''). // 3704
 int32lu(''). // 3708
 int32lu(''). // 3712
 int32lu(''). // 3716
 int32lu(''). // 3720
 int32lu(''). // 3724
 int32lu(''). // 3728
 int32lu(''). // 3732
 int32lu(''). // 3736
 int32lu(''). // 3740
 int32lu(''). // 3744
 int32lu(''). // 3748
 int32lu(''). // 3752
 int32lu(''). // 3756
 int32lu(''). // 3760
 int32lu(''). // 3764
 int32lu(''). // 3768
 int32lu(''). // 3772
 int32lu(''). // 3776
 int32lu(''). // 3780
 int32lu(''). // 3784
 int32lu(''). // 3788
 int32lu(''). // 3792
 int32lu(''). // 3796
 int32lu(''). // 3800
 int32lu(''). // 3804
 int32lu(''). // 3808
 int32lu(''). // 3812
 int32lu(''). // 3816
 int32lu(''). // 3820
 int32lu(''). // 3824
 int32lu(''). // 3828
 int32lu(''). // 3832
 int32lu(''). // 3836
 int32lu(''). // 3840
 int32lu(''). // 3844
 int32lu(''). // 3848
 int32lu(''). // 3852
 int32lu(''). // 3856
 int32lu(''). // 3860
 int32lu(''). // 3864
 int32lu(''). // 3868
 int32lu(''). // 3872
 int32lu(''). // 3876
 int32lu(''). // 3880
 int32lu(''). // 3884
 int32lu(''). // 3888
 int32lu(''). // 3892
 int32lu(''). // 3896
 int32lu(''). // 3900
 int32lu(''). // 3904
 int32lu(''). // 3908
 int32lu(''). // 3912
 int32lu(''). // 3916
 int32lu(''). // 3920
 int32lu(''). // 3924
 int32lu(''). // 3928
 int32lu(''). // 3932
 int32lu(''). // 3936
 int32lu(''). // 3940
 int32lu(''). // 3944
 int32lu(''). // 3948
 int32lu(''). // 3952
 int32lu(''). // 3956
 int32lu(''). // 3960
 int32lu(''). // 3964
 int32lu(''). // 3968
 int32lu(''). // 3972
 int32lu(''). // 3976
 int32lu(''). // 3980
 int32lu(''). // 3984
 int32lu(''). // 3988
 int32lu(''). // 3992
 int32lu(''). // 3996
 int32lu(''). // 4000
 int32lu(''). // 4004
 int32lu(''). // 4008
 int32lu(''). // 4012
 int32lu(''). // 4016
 int32lu(''). // 4020
 int32lu(''). // 4024
 int32lu(''). // 4028
 int32lu(''). // 4032
 int32lu(''). // 40363344
 int32lu('StrBonus'). // 4040
 int32lu('DexBonus'). // 4044
 int32lu(''). // 4048
 int32lu(''). // 4052
 int32lu(''). // 4056
 int32lu('LuckBuff'). // 4060
 int32lu('StrengthBuff'). // 4064
 int32lu('ExperienceBuff'). // 4068
 int32lu(''). // 4072
 int32lu('AutoBuff'). // 4076
 int32lu('AutoBuff0'). // 4080
 int32lu('AutoBuff0_Active'). // 4084
 int32lu('AutoBuff1'). // 4088
 int32lu('AutoBuff1_Active'). // 4092
 int32lu('AutoBuff2'). // 4096
 int32lu('AutoBuff2_Active'). // 4100
 int32lu('AutoBuff3'). // 4104
 int32lu('AutoBuff3_Active'). // 4108
 int32lu('AutoBuff4'). // 4112
 int32lu('AutoBuff_Active'). // 4116
 int32lu('AutoBuff5'). // 4120
 int32lu('AutoBuff5_Active'). // 4124
 int32lu('AutoBuff6'). // 4128
 int32lu('AutoBuff6_Active'). // 4132
 int32lu('AutoBuff7'). // 4136
 int32lu('AutoBuff7_Active'). // 4140
 int32lu(''). // 4144
 int32lu(''). // 4148
 int32lu('Bonus'). // 4152
 int32lu(''). // 4156
 int32lu(''). // 4160
 int32lu(''). // 4164
 int32lu(''). // 4168
 int32lu(''). // 4172
 int32lu('AutoPillHP'). // 4176
 int32lu('AutoPillChi'). // 4180
 int32lu(''). // 4184
 int32lu(''). // 4188
 int32lu(''). // 4192
 int32lu(''). // 4196
 int32lu(''). // 4200
 int32lu(''). // 4204
 int32lu(''). // 4208
 int32lu(''). // 4212
 int32lu(''). // 4216
 int32lu('Title'). // 4220
 int32lu(''). // 4224
 int32lu(''). // 4228
 int32lu(''). // 4232
 int32lu(''). // 4236
 int32lu(''). // 4240
 int32lu(''). // 4244
 int32lu(''). // 4248
 int32lu(''). // 4252
 int32lu(''). // 4256
 int32lu(''). // 4260
 int32lu(''). // 4264
 int32lu(''). // 4268
 int32lu(''). // 4272
 int32lu(''). // 4276
 int32lu(''). // 4280
 int32lu(''). // 4284
 int32lu(''). // 4288
 int32lu(''). // 4292
 int32lu(''). // 4296
 int32lu(''). // 4300
 int32lu(''). // 4304
 int32lu(''). // 4308
 int32lu(''). // 4312
 int32lu(''). // 4316
 int32lu('ElementalDamage'). // 4320
 int32lu('ElementalDefense'). // 4324
 int32lu('DarkDamage'). // 4328
 int32lu('FactionDefenseBonus'). // 4332
 int32lu(''). // 4336
 int32lu('ChanceDodge_Hit'). // 4340
 int32lu('DamageBonus'). // 4344
 int32lu('SilverBig'). // 4348
 int32lu(''). // 4352
 int32lu(''). // 4356
 int32lu(''). // 4360
 int32lu('Daily1'). // 4364
 int32lu('DailyPvPKill'). // 4368
 int32lu('DailyUnknown'). // 4372
 int32lu('DailyUnknown2'). // 4376
 //int32lu('DailyPvMKill'); // 4380
 int8lu('',3);

structs.SpawnInfo = restruct.
	int32lu('UniqueID').
	int32lu('ID').
	struct('Location',structs.CVec3).
	float32l('Direction');

structs.WREGION = restruct.
	int32ls('Unknown1').
	int32ls('ZoneID').
	int32ls('Unknown2').
	int32ls('Unknown3').
	int32ls('X').
	int32ls('Y').
	int32ls('Z').
	int32ls('Radius');

var cbFix = restruct.
	int32lu("ID").
	int32lu("Column").
	int32lu("Row").
	int32lu("Capacity").
	int32lu("Unknown");

structs.setInventoryStorageOnOffsets = function setInventoryOnOffset(buffer, offset, inventory, storage_offset, storage, bank_offset, bank){
	    var InventoryBufferSize = structs.StorageItem.size * inventory.length;
	    var InventoryBuffer = new Buffer(InventoryBufferSize);

	    var InventoryOffset = 0;
	    for(var i = 0; i < inventory.length; i++){
	        var object = inventory[i];
	        var workingBuffer;
	        if(object == undefined){
	            workingBuffer = new Buffer(structs.StorageItem.pack());
	            workingBuffer.copy(InventoryBuffer, InventoryOffset);
	        }else{
	            var item = infos.Item[object.ID];

	            if(item == undefined){
	                workingBuffer = new Buffer(structs.StorageItem.pack(
	                    object
	                ));
	            }else{
	                if(item.ItemType === 22){
	                    workingBuffer = new Buffer(structs.StorageItemPet.pack(
	                        object
	                    ));
					}else if(item.ItemType === 6){
						workingBuffer = new Buffer(cbFix.pack(
							object
						));
					}else{
	                    workingBuffer = new Buffer(structs.StorageItem.pack(
	                        object
	                    ));
	                }
	            }

	            if(workingBuffer !== undefined){
	                workingBuffer.copy(InventoryBuffer, InventoryOffset, 0, workingBuffer.length);
	            }
	        }
	        InventoryOffset += structs.StorageItem.size;
	    }

	    InventoryBuffer.copy(buffer, offset, 0, InventoryBuffer.length);

	    var StorageBufferSize = structs.SmallStorageItem.size * storage.length;
	    var StorageBuffer = new Buffer(StorageBufferSize);

	    var StorageOffset = 0;

	    for(var sI = 0; sI < storage.length; sI++){
	        var object = storage[sI];
	        var workingBuffer;
	        if(object === null || object === undefined){
	            workingBuffer = new Buffer(structs.SmallStorageItem.pack());
	            workingBuffer.copy(StorageBuffer, StorageOffset);
	        }else{
	            var item = infos.Item[object.ID];

	            if(item == undefined){
	                workingBuffer = new Buffer(structs.SmallStorageItem.pack(
	                    object
	                ));
	            }else{

	                if(item.ItemType === 22){
	                    workingBuffer = new Buffer(structs.SmallStorageItemPet.pack(
	                        object
	                    ));
					}else if(item.ItemType === 6){
						workingBuffer = new Buffer(cbFix.pack(
							object
						));
					}else{
	                    workingBuffer = new Buffer(structs.SmallStorageItem.pack(
	                        object
	                    ));
	                }
	            }

	            workingBuffer.copy(StorageBuffer, StorageOffset);
	        }

	        StorageOffset += structs.SmallStorageItem.size;
	    }

	    StorageBuffer.copy(buffer, storage_offset, 0, StorageBuffer.length);


	    var BankBufferSize = structs.SmallStorageItem.size * bank.length;
	    var BankBuffer = new Buffer(BankBufferSize);

	    var BankOffset = 0;

	    for(var i = 0; i < bank.length; i++){
	        var object = bank[i];
	        var workingBuffer;
	        if(object === null || object === undefined){
	            workingBuffer = new Buffer(structs.SmallStorageItem.pack());
	            workingBuffer.copy(BankBuffer, BankOffset);
	        }else{
	            var item = infos.Item[object.ID];

	            if(item == undefined){
	                workingBuffer = new Buffer(structs.SmallStorageItem.pack(
	                    object
	                ));
	            }else{

	                if(item.ItemType === 22){
	                    workingBuffer = new Buffer(structs.SmallStorageItemPet.pack(
	                        object
	                    ));
					}else if(item.ItemType === 6){
						workingBuffer = new Buffer(cbFix.pack(
							object
						));
					}else{
	                    workingBuffer = new Buffer(structs.SmallStorageItem.pack(
	                        object
	                    ));
	                }
	            }

	            workingBuffer.copy(BankBuffer, BankOffset);
	        }

	        BankOffset += structs.SmallStorageItem.size;
	    }

	    BankBuffer.copy(buffer, bank_offset, 0, BankBuffer.length);


	    return buffer;
	}

});