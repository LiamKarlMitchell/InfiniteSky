// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the SkillInfo data

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
restruct.
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
    int32lu('ChiRegenerationPoints'),

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