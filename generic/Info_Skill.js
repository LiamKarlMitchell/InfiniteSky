// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the SkillInfo data
vms.depends({
  name: 'Info_Skill',
  depends: []
}, function(){
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

    // Incase we ever make an editor we could have constructor?
    function SkillInfo(){};
    SkillInfo.prototype = {
        inspect: safeguard_cli.inspect,
        getSkillModifiers: function(SkillLevel) {
            if (SkillLevel>this.MaxSkillLevel) {
                throw new Error('Skill level too high.'+this.toString());
            }

            var Scale = SkillLevel/this.MaxSkillLevel;

            var SkillModifiers = {};
            for (var name in this.ModifiersStart) {
                SkillModifiers[name] = (this.ModifiersEnd[name] - this.ModifiersStart[name]) * Scale;
            }

            return SkillModifiers;
        },
        toString: function(kind) {
            switch (kind) {
                case 'small':
                default:
                    return this.ID+" - "+this.Name;
                break;
            }
        }
    };

    LoadSkillInfo = function() {
        // Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
        infos.Skill = new GameInfoLoader('005_00003.IMG',

        this.InfoStruct = restruct.
        int32lu("ID").
        string("Name",28).
        // Categories
        // 1 = General
        // 3 and 4 = Support
        // 2 = Attack
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
        int32ls('unk33'). // 340
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
        struct('ModifiersStart',SkillData).
        struct('ModifiersEnd',SkillData),

      function onRecordLoad(record) {
        if (record.ID) {
            // Change the prototype so that we have access to methods we want.
            record.__proto__ = SkillInfo.prototype;
            if (record.ID) {
                // All % should be / 100 from game data.
                for (var name in record.ModifiersStart) {
                    record.ModifiersStart[name] = record.ModifiersStart[name]/100;
                    record.ModifiersEnd[name] = record.ModifiersEnd[name]/100;
                }
            }
        }
        return record;
      });
    }

    // If we have not loaded the Skill info yet then load it
    if (infos.Skill === undefined) LoadSkillInfo();

});
