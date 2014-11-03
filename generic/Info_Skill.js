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
        int32lu(). // 36  
        int32lu('SpriteStartID'). // 40  
        int32lu('Clan'). // 44  
        int32lu('Weapon'). // 48  
        string('Description1',51). // 52  
        string('Description2',51). // 103 
        string('Description3',50). // 154 
        int32ls(). // 204 
        int32ls(). // 208 
        int32ls(). // 212 
        int32ls(). // 216 
        int32ls(). // 220 
        int32ls(). // 224 
        int32ls(). // 228 
        int32ls(). // 232 
        int32ls(). // 236 
        int32ls(). // 240 
        int32ls(). // 244 
        int32ls(). // 248 
        int32ls(). // 252 
        int32ls(). // 256 
        int32ls(). // 260 
        int32ls(). // 264 
        int32ls(). // 268 
        int32ls(). // 272 
        int32ls(). // 276 
        int32ls(). // 280 
        int32ls(). // 284 
        int32ls(). // 288 
        int32ls(). // 292 
        int32ls(). // 296 
        int32ls(). // 300 
        int32ls(). // 304 
        int32ls(). // 308 
        int32ls(). // 312 
        int32ls(). // 316 
        int32ls(). // 320 
        int32ls(). // 324 
        int32ls(). // 328 
        int32ls(). // 332 
        int32ls('ChiUsage'). // 336 
        int32ls(). // 340 
        int32ls(). // 344 
        int32ls(). // 348 
        int32ls(). // 352 
        int32ls(). // 356 
        int32ls(). // 360 
        int32ls(). // 364 
        int32ls(). // 368 
        int32ls(). // 372 
        int32ls(). // 376 
        int32ls(). // 380 
        int32ls(). // 384 
        int32ls(). // 388 
        int32ls(). // 392 
        int32ls(). // 396 
        int32ls(). // 400 
        int32ls(). // 404 
        int32ls(). // 408 
        int32ls(). // 412 
        int32ls(). // 416 
        int32ls(). // 420 
        int32ls(). // 424 
        int32ls(). // 428 
        int32ls(). // 432 
        int32ls(). // 436 
        int32ls(). // 440 
        int32ls(). // 444 
        int32ls(). // 448 
        int32ls(). // 452 
        int32ls(). // 456 
        int32ls(). // 460 
        int32ls(). // 464 
        int32ls(). // 468 
        int32ls(). // 472 
        int32ls(). // 476 
        int32ls(). // 480 
        int32ls(). // 484 
        int32ls(). // 488 
        int32ls(). // 492 
        int32ls(). // 496 
        int32ls(). // 500 
        int32ls(). // 504 
        int32ls(). // 508 
        int32ls(). // 512 
        int32ls(). // 516 
        int32ls(). // 520 
        int32ls(). // 524 
        int32ls(). // 528 
        int32ls(). // 532 
        int32ls(). // 536 
        int32ls(). // 540 
        int32ls(). // 544 
        int32ls(). // 548 
        int32ls(). // 552 
        int32ls(). // 556 
        int32ls(). // 560 
        int32ls(). // 564 
        int32lu('PointsToLearn'). // 232 
        int32ls('MaxSkillLevel'). // 236 
        int32ls(). // 240 
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