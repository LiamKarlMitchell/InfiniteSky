// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the SkillInfo data

var SkillData = restruct.
    int32lu('ChiCost').
    int32lu('DegreeOfDefensiveSkill').
    int32lu('ChiRecovery').
    int32lu('ChanceToAcupressure').
    int32lu('ChanceToUnstun').
    int32lu('AirWalkDistance').
    int32lu('EnergyBall').
    int32lu('DamageIncreased').
    int32lu().
    int32lu('AttackRangeApplied').
    int32lu('DamageApplied').
    int32lu('OnlyForLightDamage').
    int32lu('OnlyForShadowDamage').
    int32lu('OnlyForDarkDamage').
    int32lu('ChanceToHitApplied').
    int32lu('EffectiveDuration').
    int32lu('IncreasedDamage').
    int32lu('IncreasedDefense').
    int32lu().
    int32lu().
    int32lu('IncreasedLightResistance').
    int32lu('IncreasedShadowResistance').
    int32lu('IncreasedDarkResistance').
    int32lu('IncreasedChanceToHit').
    int32lu('IncreasedChanceToDodge').
    int32lu('IncreasedMovementSpeed').
    int32lu('IncreasedAttackSpeed').
    int32lu('IncreasedLuck').
    int32lu('EnchancedChanceToDeadlyBlow').
    int32lu('ChanceToReturnDamage').
    int32lu('IncreasedAcupressureDefense').
    int32lu('ChanceToRemoveIncreaseEffect').
    int32lu('HPRegenerationPoints').
    int32lu('ChiRegenerationPoints');

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
            SkillModifiers[name] = (this.infos.ModifiersEnd[name] - this.ModifiersStart[name]) * Scale;
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
    int32lu(). // 32  
    int32lu(). // 36  
    int32lu('SpriteStartID'). // 40  
    int32lu('Clan'). // 44  
    int32lu('Weapon'). // 48  
    string('Description1',51). // 52  
    string('Description2',51). // 103 
    string('Description2',50). // 154 
    int32lu(). // 204 
    int32lu(). // 208 
    int32lu(). // 212 
    int32lu(). // 216 
    int32lu(). // 220 
    int32lu(). // 224 
    int32lu(). // 228 
    int32lu(). // 232 
    int32lu(). // 236 
    int32lu(). // 240 
    int32lu(). // 244 
    int32lu(). // 248 
    int32lu(). // 252 
    int32lu(). // 256 
    int32lu(). // 260 
    int32lu(). // 264 
    int32lu(). // 268 
    int32lu(). // 272 
    int32lu(). // 276 
    int32lu(). // 280 
    int32lu(). // 284 
    int32lu(). // 288 
    int32lu(). // 292 
    int32lu(). // 296 
    int32lu(). // 300 
    int32lu(). // 304 
    int32lu(). // 308 
    int32lu(). // 312 
    int32lu(). // 316 
    int32lu(). // 320 
    int32lu(). // 324 
    int32lu(). // 328 
    int32lu(). // 332 
    int32lu(). // 336 
    int32lu(). // 340 
    int32lu(). // 344 
    int32lu(). // 348 
    int32lu(). // 352 
    int32lu(). // 356 
    int32lu(). // 360 
    int32lu(). // 364 
    int32lu(). // 368 
    int32lu(). // 372 
    int32lu(). // 376 
    int32lu(). // 380 
    int32lu(). // 384 
    int32lu(). // 388 
    int32lu(). // 392 
    int32lu(). // 396 
    int32lu(). // 400 
    int32lu(). // 404 
    int32lu(). // 408 
    int32lu(). // 412 
    int32lu(). // 416 
    int32lu(). // 420 
    int32lu(). // 424 
    int32lu(). // 428 
    int32lu(). // 432 
    int32lu(). // 436 
    int32lu(). // 440 
    int32lu(). // 444 
    int32lu(). // 448 
    int32lu(). // 452 
    int32lu(). // 456 
    int32lu(). // 460 
    int32lu(). // 464 
    int32lu(). // 468 
    int32lu(). // 472 
    int32lu(). // 476 
    int32lu(). // 480 
    int32lu(). // 484 
    int32lu(). // 488 
    int32lu(). // 492 
    int32lu(). // 496 
    int32lu(). // 500 
    int32lu(). // 504 
    int32lu(). // 508 
    int32lu(). // 512 
    int32lu(). // 516 
    int32lu(). // 520 
    int32lu(). // 524 
    int32lu(). // 528 
    int32lu(). // 532 
    int32lu(). // 536 
    int32lu(). // 540 
    int32lu(). // 544 
    int32lu(). // 548 
    int32lu(). // 552 
    int32lu(). // 556 
    int32lu(). // 560 
    int32lu(). // 564 
    int32lu('PointsToLearn'). // 232 
    int32lu('MaxSkillLevel'). // 236 
    int32lu(). // 240 
    struct('ModifiersStart',SkillData).
    struct('ModifiersEnd',SkillData),

  function onRecordLoad(record) {
    if (record.ID) {
        // Change the prototype so that we have access to methods we want.
        record.__proto__ = SkillInfo.prototype;
        if (record.ID) {
            // All % should be / 100 from game data.
            for (var name in record.ModifiersStart) {
                record.ModifiersStart[name] = record.ModifiersStart[name] / 100;
            }
            for (var name in record.ModifiersEnd) {
                record.ModifiersEnd[name] = record.ModifiersEnd[name] / 100;
            }
        }   
    }
    return record;
  });
}

// If we have not loaded the Skill info yet then load it
if (infos.Skill === undefined) LoadSkillInfo();