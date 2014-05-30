// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the SkillInfo data

var SkillData = restruct.
    int32ls('ChiCost').
    int32ls('DegreeOfDefensiveSkill').
    int32ls('ChiRecovery').
    int32ls('ChanceToAcupressure').
    int32ls('ChanceToUnstun').
    int32ls('AirWalkDistance').
    int32ls('EnergyBall').
    int32ls('DamageIncreased').
    int32ls().
    int32ls('AttackRangeApplied').
    int32ls('DamageApplied').
    int32ls('OnlyForLightDamage').
    int32ls('OnlyForShadowDamage').
    int32ls('OnlyForDarkDamage').
    int32ls('ChanceToHitApplied').
    int32ls('EffectiveDuration').
    int32ls('IncreasedDamage').
    int32ls('IncreasedDefense').
    int32ls().
    int32ls().
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
    int32lu('ID').
    string('Name',28).
    int32lu('Unknown32'). // 32  
    int32lu('Unknown36'). // 36  
    int32lu('SpriteStartID'). // 40  
    int32lu('Clan'). // 44  
    int32lu('Weapon'). // 48  
    string('Description1',51). // 52  
    string('Description2',51). // 103 
    string('Description3',50). // 154 
    int32ls('Unknown204'). // 204 
    int32ls('Unknown208'). // 208 
    int32ls('Unknown212'). // 212 
    int32ls('Unknown216'). // 216 
    int32ls('Unknown220'). // 220 
    int32ls('Unknown224'). // 224 
    int32ls('Unknown228'). // 228 
    int32ls('Unknown232'). // 232 
    int32ls('Unknown236'). // 236 
    int32ls('Unknown240'). // 240 
    int32ls('Unknown244'). // 244 
    int32ls('Unknown248'). // 248 
    int32ls('Unknown252'). // 252 
    int32ls('Unknown256'). // 256 
    int32ls('Unknown260'). // 260 
    int32ls('Unknown264'). // 264 
    int32ls('Unknown268'). // 268 
    int32ls('Unknown272'). // 272 
    int32ls('Unknown276'). // 276 
    int32ls('Unknown280'). // 280 
    int32ls('Unknown284'). // 284 
    int32ls('Unknown288'). // 288 
    int32ls('Unknown292'). // 292 
    int32ls('Unknown296'). // 296 
    int32ls('Unknown300'). // 300 
    int32ls('Unknown304'). // 304 
    int32ls('Unknown308'). // 308 
    int32ls('Unknown312'). // 312 
    int32ls('Unknown316'). // 316 
    int32ls('Unknown320'). // 320 
    int32ls('Unknown324'). // 324 
    int32ls('Unknown328'). // 328 
    int32ls('Unknown332'). // 332 
    int32ls('Unknown336'). // 336 
    int32ls('Unknown340'). // 340 
    int32ls('Unknown344'). // 344 
    int32ls('Unknown348'). // 348 
    int32ls('Unknown352'). // 352 
    int32ls('Unknown356'). // 356 
    int32ls('Unknown360'). // 360 
    int32ls('Unknown364'). // 364 
    int32ls('Unknown368'). // 368 
    int32ls('Unknown372'). // 372 
    int32ls('Unknown376'). // 376 
    int32ls('Unknown380'). // 380 
    int32ls('Unknown384'). // 384 
    int32ls('Unknown388'). // 388 
    int32ls('Unknown392'). // 392 
    int32ls('Unknown396'). // 396 
    int32ls('Unknown400'). // 400 
    int32ls('Unknown404'). // 404 
    int32ls('Unknown408'). // 408 
    int32ls('Unknown412'). // 412 
    int32ls('Unknown416'). // 416 
    int32ls('Unknown420'). // 420 
    int32ls('Unknown424'). // 424 
    int32ls('Unknown428'). // 428 
    int32ls('Unknown432'). // 432 
    int32ls('Unknown436'). // 436 
    int32ls('Unknown440'). // 440 
    int32ls('Unknown444'). // 444 
    int32ls('Unknown448'). // 448 
    int32ls('Unknown452'). // 452 
    int32ls('Unknown456'). // 456 
    int32ls('Unknown460'). // 460 
    int32ls('Unknown464'). // 464 
    int32ls('Unknown468'). // 468 
    int32ls('Unknown472'). // 472 
    int32ls('Unknown476'). // 476 
    int32ls('Unknown480'). // 480 
    int32ls('Unknown484'). // 484 
    int32ls('Unknown488'). // 488 
    int32ls('Unknown492'). // 492 
    int32ls('Unknown496'). // 496 
    int32ls('Unknown500'). // 500 
    int32ls('Unknown504'). // 504 
    int32ls('Unknown508'). // 508 
    int32ls('Unknown512'). // 512 
    int32ls('Unknown516'). // 516 
    int32ls('Unknown520'). // 520 
    int32ls('Unknown524'). // 524 
    int32ls('Unknown528'). // 528 
    int32ls('Unknown532'). // 532 
    int32ls('Unknown536'). // 536 
    int32ls('Unknown540'). // 540 
    int32ls('Unknown544'). // 544 
    int32ls('Unknown548'). // 548 
    int32ls('Unknown552'). // 552 
    int32ls('Unknown556'). // 556 
    int32ls('Unknown560'). // 560 
    int32ls('Unknown564'). // 564 
    int32lu('PointsToLearn'). // 568 
    int32ls('MaxSkillLevel'). // 572
    int32ls('Unknown576'). // 579
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