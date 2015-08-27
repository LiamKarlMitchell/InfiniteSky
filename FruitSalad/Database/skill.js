// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('SkillInfo', [], function(){
  var skillSchema = mongoose.Schema({
    ID: { type: Number, unique: true, index: true, default: 0 },
    Name: String,
    Category: Number,
    // unk0: Number,
    SpriteStartID: Number,
    Clan: Number,
    Weapon: Number,
    Description1: String,
    Description2: String,
    Description3: String,
    // unk1: Number,
    // unk2: Number,
    // unk3: Number,
    // unk4: Number,
    // unk5: Number,
    // unk6: Number,
    // unk7: Number,
    // unk8: Number,
    // unk9: Number,
    // unk10: Number,
    // unk11: Number,
    // unk12: Number,
    // unk13: Number,
    // unk14: Number,
    // unk15: Number,
    // unk16: Number,
    // unk17: Number,
    // unk18: Number,
    // unk19: Number,
    // unk20: Number,
    // unk21: Number,
    // unk22: Number,
    // unk23: Number,
    // unk24: Number,
    // unk25: Number,
    // unk26: Number,
    // unk27: Number,
    // unk28: Number,
    // unk29: Number,
    // unk30: Number,
    // unk31: Number,
    // unk32: Number,
    // unk33: Number,
    ChiUsage: Number,
    // unk33: Number,
    // unk66: Number,
    // unk99: Number,
    // unk132: Number,
    // unk165: Number,
    // unk198: Number,
    // unk231: Number,
    // unk264: Number,
    // unk297: Number,
    // unk330: Number,
    // unk363: Number,
    // unk396: Number,
    // unk429: Number,
    // unk462: Number,
    // unk495: Number,
    // unk528: Number,
    // unk561: Number,
    // unk594: Number,
    // unk627: Number,
    // unk660: Number,
    // unk693: Number,
    // unk726: Number,
    // unk759: Number,
    // unk792: Number,
    // unk825: Number,
    // unk858: Number,
    // unk891: Number,
    // unk924: Number,
    // unk957: Number,
    // unk990: Number,
    // unk1023: Number,
    // unk1056: Number,
    // unk1089: Number,
    // unk1122: Number,
    // unk1155: Number,
    // unk1188: Number,
    // unk1221: Number,
    // unk1254: Number,
    // unk1287: Number,
    // unk1320: Number,
    // unk1353: Number,
    // unk1386: Number,
    // unk1419: Number,
    // unk1452: Number,
    // unk1485: Number,
    // unk1518: Number,
    // unk1551: Number,
    // unk1584: Number,
    // unk1617: Number,
    // unk1650: Number,
    // unk1683: Number,
    // unk1716: Number,
    // unk1749: Number,
    // unk1782: Number,
    // unk1815: Number,
    // unk1848: Number,
    // unk1881: Number,
    PointsToLearn: Number,
    MaxSkillLevel: Number,
    // unk2000: Number,
    ModifiersStart: Object,
    ModifiersEnd: Object
  });

  skillSchema.methods.isUsedByClan = function(clan){
    return this.Clan === 1 || this.Clan === (clan+2);
  };

  skillSchema.methods.getSkillMods = function(SkillLevel) {
        var mods = { // See the grunt task skillsToMongo.js for these names since its neglected in the schema -_- TODO Put these names in the schema (See npc text schema for example)
            ChiCost: 0,
            DegreeOfDefensiveSkill: 0,
            ChiRecovery: 0,
            ChanceToAcupressure: 0,
            ChanceToUnstun: 0,
            AirWalkDistance: 0,
            EnergyBall: 0,
            DamageIncreased: 0,
            Unk1: 0,
            AttackRangeApplied: 0,
            DamageApplied: 0,
            OnlyForLightDamage: 0,
            OnlyForShadowDamage: 0,
            OnlyForDarkDamage: 0,
            ChanceToHitApplied: 0,
            EffectiveDuration: 0,
            IncreasedDamage: 0,
            IncreasedDefense: 0,
            Unk2: 0,
            CastTime: 0,
            IncreasedLightResistance: 0,
            IncreasedShadowResistance: 0,
            IncreasedDarkResistance: 0,
            IncreasedChanceToHit: 0,
            IncreasedChanceToDodge: 0,
            IncreasedMovementSpeed: 0,
            IncreasedAttackSpeed: 0,
            IncreasedLuck: 0,
            EnchancedChanceToDeadlyBlow: 0,
            ChanceToReturnDamage: 0,
            IncreasedAcupressureDefense: 0,
            ChanceToRemoveIncreaseEffect: 0,
            HPRegenerationPoints: 0,
            ChiRegenerationPoints: 0
        };
        if (SkillLevel < 1) {
            return mods;
        }
        if (SkillLevel>this.MaxSkillLevel) {
            throw new Error('Skill level too high.'+this.toString());
        }

        var Scale = SkillLevel/this.MaxSkillLevel;

        // Old code.
        //for (var name in this.ModifiersStart) {
            //mods[name] = (this.ModifiersEnd[name] - this.ModifiersStart[name]) * Scale;
        //}
        
        // Unwrapped for speed
        
        mods.ChiCost = Math.ceil(this.ModifiersStart.ChiCost + (this.ModifiersEnd.ChiCost - this.ModifiersStart.ChiCost) * Scale);
        mods.DegreeOfDefensiveSkill = (this.ModifiersEnd.DegreeOfDefensiveSkill - this.ModifiersStart.DegreeOfDefensiveSkill) * Scale;
        mods.ChiRecovery = (this.ModifiersEnd.ChiRecovery - this.ModifiersStart.ChiRecovery) * Scale;
        mods.ChanceToAcupressure = (this.ModifiersEnd.ChanceToAcupressure - this.ModifiersStart.ChanceToAcupressure) * Scale;
        mods.ChanceToUnstun = (this.ModifiersEnd.ChanceToUnstun - this.ModifiersStart.ChanceToUnstun) * Scale;
        mods.AirWalkDistance = (this.ModifiersEnd.AirWalkDistance - this.ModifiersStart.AirWalkDistance) * Scale;
        mods.EnergyBall = (this.ModifiersEnd.EnergyBall - this.ModifiersStart.EnergyBall) * Scale;
        mods.DamageIncreased = (this.ModifiersEnd.DamageIncreased - this.ModifiersStart.DamageIncreased) * Scale;
        mods.Unk1 = (this.ModifiersEnd.Unk1 - this.ModifiersStart.Unk1) * Scale;
        mods.AttackRangeApplied = (this.ModifiersEnd.AttackRangeApplied - this.ModifiersStart.AttackRangeApplied) * Scale;
        mods.DamageApplied = (this.ModifiersEnd.DamageApplied - this.ModifiersStart.DamageApplied) * Scale;
        mods.OnlyForLightDamage = (this.ModifiersEnd.OnlyForLightDamage - this.ModifiersStart.OnlyForLightDamage) * Scale;
        mods.OnlyForShadowDamage = (this.ModifiersEnd.OnlyForShadowDamage - this.ModifiersStart.OnlyForShadowDamage) * Scale;
        mods.OnlyForDarkDamage = (this.ModifiersEnd.OnlyForDarkDamage - this.ModifiersStart.OnlyForDarkDamage) * Scale;
        mods.ChanceToHitApplied = (this.ModifiersEnd.ChanceToHitApplied - this.ModifiersStart.ChanceToHitApplied) * Scale;
        mods.EffectiveDuration = (this.ModifiersEnd.EffectiveDuration - this.ModifiersStart.EffectiveDuration) * Scale;
        mods.IncreasedDamage = (this.ModifiersEnd.IncreasedDamage - this.ModifiersStart.IncreasedDamage) * Scale;
        mods.IncreasedDefense = (this.ModifiersEnd.IncreasedDefense - this.ModifiersStart.IncreasedDefense) * Scale;
        mods.Unk2 = (this.ModifiersEnd.Unk2 - this.ModifiersStart.Unk2) * Scale;
        mods.CastTime = (this.ModifiersEnd.CastTime - this.ModifiersStart.CastTime) * Scale;
        mods.IncreasedLightResistance = (this.ModifiersEnd.IncreasedLightResistance - this.ModifiersStart.IncreasedLightResistance) * Scale;
        mods.IncreasedShadowResistance = (this.ModifiersEnd.IncreasedShadowResistance - this.ModifiersStart.IncreasedShadowResistance) * Scale;
        mods.IncreasedDarkResistance = (this.ModifiersEnd.IncreasedDarkResistance - this.ModifiersStart.IncreasedDarkResistance) * Scale;
        mods.IncreasedChanceToHit = (this.ModifiersEnd.IncreasedChanceToHit - this.ModifiersStart.IncreasedChanceToHit) * Scale;
        mods.IncreasedChanceToDodge = (this.ModifiersEnd.IncreasedChanceToDodge - this.ModifiersStart.IncreasedChanceToDodge) * Scale;
        mods.IncreasedMovementSpeed = (this.ModifiersEnd.IncreasedMovementSpeed - this.ModifiersStart.IncreasedMovementSpeed) * Scale;
        mods.IncreasedAttackSpeed = (this.ModifiersEnd.IncreasedAttackSpeed - this.ModifiersStart.IncreasedAttackSpeed) * Scale;
        mods.IncreasedLuck = (this.ModifiersEnd.IncreasedLuck - this.ModifiersStart.IncreasedLuck) * Scale;
        mods.EnchancedChanceToDeadlyBlow = (this.ModifiersEnd.EnchancedChanceToDeadlyBlow - this.ModifiersStart.EnchancedChanceToDeadlyBlow) * Scale;
        mods.ChanceToReturnDamage = (this.ModifiersEnd.ChanceToReturnDamage - this.ModifiersStart.ChanceToReturnDamage) * Scale;
        mods.IncreasedAcupressureDefense = (this.ModifiersEnd.IncreasedAcupressureDefense - this.ModifiersStart.IncreasedAcupressureDefense) * Scale;
        mods.ChanceToRemoveIncreaseEffect = (this.ModifiersEnd.ChanceToRemoveIncreaseEffect - this.ModifiersStart.ChanceToRemoveIncreaseEffect) * Scale;
        mods.HPRegenerationPoints = (this.ModifiersEnd.HPRegenerationPoints - this.ModifiersStart.HPRegenerationPoints) * Scale;
        mods.ChiRegenerationPoints = (this.ModifiersEnd.ChiRegenerationPoints - this.ModifiersStart.ChiRegenerationPoints) * Scale;

        return mods;
    }

  delete mongoose.models['skill'];
  var SkillInfo = db.mongoose.model('skill', skillSchema);

  SkillInfo.findById = function(id, callback){
		db.Skill.findOne({
			ID: id
		}, callback);
	};

  db.Skill = SkillInfo;
});
