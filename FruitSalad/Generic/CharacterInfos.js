
// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Stat Modifiers
//0055E908 GuanUnarmedDamageMod = 1.4299999
//0055E90C GuanMarbleDamageMod = 4.0799999
//0055E910 GuanBladeDamagemod = 4.3000002
//0055E914 GuanSwordDamageMod = 3.8599999
//0055E918 FujinUnarmedDamageMod = 1.36
//0055E91C FujinLuteDamageMod = 2.9400001
//0055E920 KatanaDoubleBladeDamageMod = 2.71
//0055E924 KatanaFujinDamageMod = 3.1700001
//0055E928 JinongUnarmedDamageMod = 2.5899999
//0055E92C SecpterJinongDamageMod = 5.1700001
//0055E930 SpearJinongDamageMod = 5.6100001
//0055E934 BladeJinongDamageMod = 5.3899999
//0055E938 flt_55E938      = 0.13
//0055E93C GuanHitRateMod  = 5.1399999
//0055E940 FujinHitRateMod = 4.5700002
//0055E944 JinongHitRateMod = 5.71
//0055E948 flt_55E948      = 2.5
//0055E94C GuaunDodgeMod   = 2.5699999
//0055E950 FujinDodgeMod   = 2.29
//0055E954 JinongDodgeMod  = 2.8599999

//http://12sky.agame.co.kr/info/class/1
//http://12sky.agame.co.kr/info/class/2
//http://12sky.agame.co.kr/info/class/3
// Clan      | HP    | Mana   | HitRate | Dodge | W1    | W2    | W3
// _____________________________________________________________________
// Guanyin   | 15.31 | 20     | 5.14    | 2.57  | 3.86  | 4.3   | 4.08
// Fujin     | 14.29 | 17.14  | 4.57    | 2.29  | 3.17  | 2.71  | 2.94
// Jinong    | 16.33 | 22.29  | 5.71    | 2.86  | 5.39  | 5.61  | 5.17
// if(typeof generic === 'undefined'){
//   generic = {};
// }
var uuid = require('node-uuid');

var Modifiers = [];
var GuanyinModifiers = {
  HP: 15.31,
  Chi: 20,
  HitRate: 5.1399999,
  Dodge: 2.5699999,
  Damage: [
    1.4299999, // UnarmedDamageMod
    3.8599999, // SwordDamageMod
    4.3000002, // BladeDamagemod
    4.0799999 // MarbleDamageMod
  ]
};

var FujinModifiers = {
  HP: 14.29,
  Chi: 17.14,
  HitRate: 4.5700002,
  Dodge: 2.29,
  Damage: [
    1.36, // UnarmedDamageMod
    3.1700001, // KatanaFujinDamageMod
    2.71, // KatanaDoubleBladeDamageMod
    2.9400001 // LuteDamageMod
  ]
};

var JinongModifiers = {
  HP: 16.33,
  Chi: 22.29,
  HitRate: 5.71,
  Dodge: 2.8599999,
  Damage: [
    2.5899999, // UnarmedDamageMod
    5.3899999, // BladeDamageMod
    5.6100001, // SpearDamageMod
    5.1700001 // SecpterDamageMod
  ]
};

Modifiers.push(GuanyinModifiers);
Modifiers.push(FujinModifiers);
Modifiers.push(JinongModifiers);


var calculation = {};
calculation.Damage = function(item, enchant, combine, done){
  // Damage is missed by 1, some calculations are Math.floor'ed.
  this.Damage = this.ExpInfo.Damage[this.Clan] * 2;
  this.Damage += Math.floor(this.character.Stat_Strength * this.Weapon.Mod);
  this.Damage += this.Weapon.Damage;

  if(this.Damage > this.Pet.Damage){
    this.Damage += this.Pet.Damage / 100 * this.Pet.Scale;
  }else{
    this.Damage += this.Damage;
  }

  done();
};

calculation.Defense = function(item, enchant, combine, done){
  // Damage is missed by 1, some calculations are Math.floor'ed.
  this.Defense = this.ExpInfo.Defense[this.Clan];
  this.Defense += this.Outfit.Defense;
  this.Defense += this.Boots.Defense;
  this.Defense += this.Gloves.Defense;
  this.Defense += this.Cape.Defense;

  if(this.Defense > this.Pet.Defense){
    this.Defense += this.Pet.Defense / 100 * this.Pet.Scale;
  }else{
    this.Defense += this.Defense;
  }

  this.Defense = Math.floor(this.Defense);

  done();
};

calculation.Cape = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    this.Cape.Defense = item.Defense;
    this.Cape.ElementalDefense = item.ElementalDefense;
    this.Cape.Mastery = this.getMasteryBonuses(item);
    this.Cape.AllMastery = item.IncreaseAllSkillMastery;
    this.Cape.DecreasedChiConsumption = item.DecreaseChiConsumption;
    this.Cape.DodgeDeadlyBlow = item.DodgeDeadlyBlow;
    break;

    default:
    this.Cape.Defense = 0;
    this.Cape.ElementalDefense = [
      0,  // Light
      0,  // Shadow
      0   // Dark
    ];
    this.Cape.Mastery = {};
    this.Cape.AllMastery = 0;
    this.Cape.DecreasedChiConsumption = 0;
    this.Cape.DodgeDeadlyBlow = 0;
    break;
  }

  this.update(['DodgeRate', 'Luck', 'Mastery', 'ElementalDefense', 'Defense', 'DodgeDeadlyBlow'], done);
};

calculation.Outfit = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    var DefenseTick = (item.Level > 95 && item.Level <= 145) ? 22 : 14;
    var dodgeTick = (item.Level > 95 && item.Level <= 145) ? 3 : 2;

    this.Outfit.Defense = item.Defense;
    this.Outfit.Defense += (DefenseTick * combine);
    this.Outfit.Defense += this.Outfit.Defense / 100 * enchant;

    this.Outfit.DodgeRate = item.DodgeRate;
    this.Outfit.DodgeRate += dodgeTick * combine;

    this.Outfit.ElementalDefense = item.ElementalDefense;
    this.Outfit.Mastery = this.getMasteryBonuses(item);
    this.Outfit.AllMastery = item.IncreaseAllSkillMastery;
    this.Outfit.Luck = item.Luck;
    this.Outfit.Vitality = item.Vitality;
    break;

    default:
    this.Outfit.Defense = 0;
    this.Outfit.ElementalDefense = [
      0,  // Light
      0,  // Shadow
      0   // Dark
    ];
    this.Outfit.Vitality = 0;
    this.Outfit.Luck = 0;
    this.Outfit.Mastery = {};
    this.Outfit.AllMastery = 0;
    this.Outfit.DodgeRate = 0;
    break;
  }

  this.update(['DodgeRate', 'Luck', 'Mastery', 'ElementalDefense', 'Defense', 'MaxHP'], done);
};

calculation.Weapon = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    var weaponModIndex = item ? item.getWeaponModIndex(this.Clan) : 0;
    this.Weapon.Mod = this.Modifiers.Damage[weaponModIndex];

    var combineTick = (item.Level > 95 && item.Level <= 145) ? 35 : (item.Level > 85 && item.Level <= 95) ? 25 : 15;
    var hitTick = (item.Level > 95 && item.Level <= 145) ? 5 : (item.Level > 85 && item.Level <= 95) ? 3 : 2;

    this.Weapon.Damage = item.Damage;
    this.Weapon.Damage += combineTick * combine;
    this.Weapon.Damage += this.Weapon.Damage / 100 * enchant;

    this.Weapon.HitRate = item.HitRate;
    this.Weapon.HitRate += hitTick * combine;

    this.Weapon.ElementalDamage = item.ElementalDamage[this.Clan];

    this.Weapon.Mastery = this.getMasteryBonuses(item);
    this.Weapon.AllMastery = item.IncreaseAllSkillMastery;
    break;

    default:
    this.Weapon.Mod = this.Modifiers.Damage[0];
    this.Weapon.Damage = 0;
    this.Weapon.ElementalDamage = 0;
    this.Weapon.HitRate = 0;
    this.Weapon.Mastery = {};
    this.Weapon.AllMastery = 0;
    break;
  }

  this.update(['Damage', 'HitRate', 'ElementalDamage', 'Mastery'], done);
};

calculation.HitRate = function(item, enchant, combine, done){
  this.HitRate = Math.floor(this.Modifiers.HitRate * this.character.Stat_Dexterity);
  this.HitRate += this.Gloves.HitRate;
  this.HitRate += this.Weapon.HitRate;
  this.HitRate += this.Pet.HitRate;

  this.HitRate = Math.floor(this.HitRate);
  done();
};

calculation.Boots = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    var DefenseTick = (item.Level > 95 && item.Level <= 145) ? 3 : 2;
    var dodgeTick = (item.Level > 95 && item.Level <= 145) ? 8 : 6;

    this.Boots.Defense = item.Defense;
    this.Boots.Defense += DefenseTick * combine;

    this.Boots.DodgeRate = item.DodgeRate;
    this.Boots.DodgeRate += dodgeTick * combine;
    this.Boots.DodgeRate += this.Boots.DodgeRate / 100 * enchant;

    this.Boots.Luck = item.Luck;
    this.Boots.Mastery = this.getMasteryBonuses(item);
    break;

    default:
    this.Boots.Defense = 0;
    this.Boots.DodgeRate = 0;
    this.Boots.Luck = 0;
    this.Boots.Mastery = {};
    break;
  }

  this.update(['DodgeRate', 'Luck', 'Defense', 'Mastery'], done);
};

calculation.Gloves = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    var DefenseTick = (item.Level > 95 && item.Level <= 145) ? 8 : 5;
    var hitTick = (item.Level > 95 && item.Level <= 145) ? 13 : 8;

    this.Gloves.Defense = item.Defense;
    this.Gloves.Defense += DefenseTick * combine;

    this.Gloves.HitRate = item.HitRate;
    this.Gloves.HitRate += hitTick * combine;
    this.Gloves.HitRate += this.Gloves.HitRate / 100 * enchant;

    this.Gloves.Luck = item.Luck;
    this.Gloves.Mastery = this.getMasteryBonuses(item);
    break;

    default:
    this.Gloves.HitRate = 0;
    this.Gloves.Mastery = {};
    this.Gloves.Luck = 0;
    this.Gloves.Defense = 0;
    break;
  }

  this.update(['HitRate', 'Luck', 'Defense', 'Mastery'], done);
};

calculation.Luck = function(item, enchant, combine, done){
  this.Luck = this.Outfit.Luck;
  this.Luck += this.Boots.Luck;
  this.Luck += this.Ring.Luck;
  this.Luck += this.Amulet.Luck;
  this.Luck += this.Gloves.Luck;

  done();
};

calculation.DeadlyRate = function(item, enchant, combine, done){
  done();
};

calculation.DodgeRate = function(item, enchant, combine, done){
  this.DodgeRate = this.ExpInfo.Dodge[this.Clan];
  this.DodgeRate += this.Outfit.DodgeRate;
  this.DodgeRate += this.Boots.DodgeRate;
  this.DodgeRate += this.Pet.DodgeRate;

  if(this.DodgeRate > this.Pet.DodgeRate){
    this.DodgeRate += this.Pet.DodgeRate / 100 * this.Pet.Scale;
  }else{
    this.DodgeRate += this.DodgeRate;
  }

  done();
};

calculation.ElementalDamage = function(item, enchant, combine, done){
  this.ElementalDamage = this.ExpInfo.ElementalDamage[this.Clan];
  this.ElementalDamage += this.Weapon.ElementalDamage;
  this.ElementalDamage += this.Ring.ElementalDamage;
  this.ElementalDamage += this.Pet.ElementalDamage;

  done();
};

calculation.Mastery = function(item, enchant, combine, done){
  this.SkillMastery = {};
  this.AllSkillsMastery = 0;

  this.concatMastery(this.Pet);
  this.concatMastery(this.Boots);
  this.concatMastery(this.Weapon);
  this.concatMastery(this.Outfit);
  this.concatMastery(this.Cape);
  this.concatMastery(this.Amulet);
  this.concatMastery(this.Ring);
  this.concatMastery(this.Gloves);

  done();
};

calculation.MaxHP = function(item, enchant, combine, done){
  this.MaxHP = this.ExpInfo.BaseHP[this.Clan];
  this.MaxHP += Math.floor((this.character.Stat_Vitality + this.Outfit.Vitality) * this.Modifiers.HP);

  if(this.MaxHP > this.Pet.HP){
    this.MaxHP += this.Pet.HP / 100 * this.Pet.Scale;
  }else{
    this.MaxHP += this.MaxHP;
  }

  done();
};

calculation.MaxChi = function(item, enchant, combine, done){
  this.MaxChi = this.ExpInfo.BaseChi[this.Clan];
  this.MaxChi += Math.floor(
    (this.character.Stat_Chi + this.Amulet.Chi) * this.Modifiers.Chi
  );

  done();
};

calculation.ElementalDefense = function(item, enchant, combine, done){
  this.ElementalDefense[0] = this.Outfit.ElementalDefense[0];
  this.ElementalDefense[1] = this.Outfit.ElementalDefense[1];
  this.ElementalDefense[2] = this.Outfit.ElementalDefense[2];

  this.ElementalDefense[0] += this.Amulet.ElementalDefense[0];
  this.ElementalDefense[1] += this.Amulet.ElementalDefense[1];
  this.ElementalDefense[2] += this.Amulet.ElementalDefense[2];

  this.ElementalDefense[0] += this.Cape.ElementalDefense[0];
  this.ElementalDefense[1] += this.Cape.ElementalDefense[1];
  this.ElementalDefense[2] += this.Cape.ElementalDefense[2];

  // TODO: Pet adding elemental defense.
  // this.ElementalDefense[0] += this.Pet.ElementalDefense[0];
  // this.ElementalDefense[1] += this.Pet.ElementalDefense[1];
  // this.ElementalDefense[2] += this.Pet.ElementalDefense[2];

  done();
};

calculation.DodgeDeadlyBlow = function(item, enchant, combine, done){
  done();
};

calculation.Ring = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    this.Ring.ElementalDamage = item.ElementalDamage[this.Clan];
    this.Ring.Dexterity = item.Dexterity;
    this.Ring.DeadlyRate = item.DeadlyRate;
    this.Ring.Luck = item.Luck;
    this.Ring.Mastery = this.getMasteryBonuses(item);
    this.Ring.AllMastery = item.IncreaseAllSkillMastery;
    break;

    default:
    this.Ring.ElementalDamage = 0;
    this.Ring.Dexterity = 0;
    this.Ring.DeadlyRate = 0;
    this.Ring.Luck = 0;
    this.Ring.Mastery = {};
    this.Ring.AllMastery = 0;
    break;
  }

  this.update(['DeadlyRate', 'DodgeRate', 'HitRate', 'Luck', 'ElementalDamage', 'Mastery'], done);
};

calculation.Amulet = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    this.Amulet.ElementalDefense = item.ElementalDefense;
    this.Amulet.Chi = item.Chi;
    this.Amulet.Luck = item.Luck;
    this.Amulet.Mastery = this.getMasteryBonuses(item);
    this.Amulet.AllMastery = item.IncreaseAllSkillMastery;
    break;

    default:
    this.Amulet.ElementalDefense = [0,0,0];
    this.Amulet.Chi = 0;
    this.Amulet.Luck = 0;
    this.Amulet.Mastery = {};
    this.Amulet.AllMastery = 0;
    break;
  }

  this.update(['MaxChi', 'Luck', 'ElementalDefense', 'Mastery'], done);
};

calculation.Pet = function(item, enchant, combine, done){
  switch(typeof item){
    case 'object':
    if(!item.Pet){
      return;
    }

    // If pet increases 100% of total damage and its > than their max, its then capped to the max Damage.

    if(item.Pet.MaxGrowth < this.character.Pet.Growth) this.character.Pet.Growth = item.Pet.MaxGrowth;

    var isMaxed = this.character.Pet.Growth === item.Pet.MaxGrowth;

    this.Pet.Scale = 100 / item.Pet.MaxGrowth * this.character.Pet.Growth;

    this.Pet.HP = item.Pet.HP;
    this.Pet.HP += isMaxed ? item.Pet.HP / 100 * 10 : 0;

    this.Pet.Damage = item.Pet.Damage;
    this.Pet.Damage += isMaxed ? item.Pet.Damage / 100 * 10 : 0;
    this.Pet.Defense = item.Pet.Defense;
    this.Pet.Defense += isMaxed ? item.Pet.Defense / 100 * 10 : 0;

    this.Pet.Mastery = item.Pet.Mastery;
    this.Pet.DodgeRate = item.Pet.DodgeRate;
    this.Pet.HitRate = item.Pet.HitRate;
    this.Pet.ElementalDamage = item.Pet.ElementalDamage;
    this.Pet.ElementalDefense = item.Pet.ElementalDefense;
    break;

    default:
    this.Pet.HP = 0;
    this.Pet.Damage = 0;
    this.Pet.Defense = 0;
    this.Pet.Mastery = {};
    this.Pet.DodgeRate = 0;
    this.Pet.HitRate = 0;
    this.Pet.ElementalDamage = 0;
    this.Pet.ElementalDefense = 0;
    this.Pet.Scale = 0;
    break;
  }

  this.update(['MaxHP', 'Damage', 'Defense', 'Mastery', 'DodgeRate', 'HitRate', 'ElementalDamage', 'ElementalDefense'], done);
};

vms('CharacterInfo', [], function(){
  function CharacterInfos(client){
    this.character = client.character;
    this.Clan = client.character.Clan;
    this.Level = client.character.Level;

    this.Modifiers = Modifiers[this.Clan] || null;
    if(!this.Modifiers){
      console.log("Character info clan has undefined modifiers.");
      return;
    }

    this.MaxHP = 0;
    this.MaxChi = 0;
    this.Damage = 0;
    this.Defense  = 0;
    this.DodgeRate = 0;
    this.HitRate  = 0;
    this.ElementalDamage = 0;
    this.ElementalDefense = [
      0,  // Light
      0,  // Shadow
      0   // Dark
    ];

    this.SkillMastery = {};
    this.AllSkillsMastery = 0;
    this.Chance_ReturnDamage = 0;
    this.Chance_DeadlyBlow = 0;
    this.AcupressureDefense = 0;
    this.Chance_Acupressure = 0;
    this.Luck = 0;

    this.Weapon = {
      Damage: 0,
      Mod: this.Modifiers.Damage[0],
      HitRate: 0,
      ElementalDamage: 0,
      Mastery: {},
      AllMastery: 0
    };

    this.Outfit = {
      Vitality: 0,
      Defense: 0,
      DodgeRate: 0,
      ElementalDefense: [
        0,  // Light
        0,  // Shadow
        0   // Dark
      ],
      Luck: 0,
      Skills: {},
      AllSkills: 0
    };

    this.Cape = {
      Defense: 0,
      DodgeDeadlyBlow: 0,
      DecreasedChiConsumption: 0,
      ElementalDefense: [
        0,  // Light
        0,  // Shadow
        0   // Dark
      ],
      Mastery: {},
      AllMastery: 0
    };

    this.Boots = {
      Defense: 0,
      DodgeRate: 0,
      Luck: 0,
      Mastery: {}
    };

    this.Gloves = {
      Defense: 0,
      HitRate: 0,
      Luck: 0,
      Mastery: {}
    };

    this.Ring = {
      Dexterity: 0,
      ElementalDamage: 0,
      DeadlyRate: 0,
      Luck: 0,
      Mastery: {},
      AllMastery: 0
    };

    this.Amulet = {
      Chi: 0,
      ElementalDefense: [
        0,
        0,
        0
      ],
      Luck: 0,
      Mastery: {},
      AllMastery: 0
    };

    this.Pet = {
      HP: 0,
      Chi: 0,
      Damage: 0,
      Defense: 0,
      Mastery: {},
      DodgeRate: 0,
      HitRate: 0,
      ElementalDamage: 0,
      ElementalDefense: 0,
      MaxGrowth: 0,
      Scale: 0
    };

    this.updateCalls = {};
  }

  CharacterInfos.prototype.concatMastery = function(obj){
    for(var skillID in obj.Mastery)
      if(this.SkillMastery[skillID] === undefined)
        this.SkillMastery[skillID] = obj.Mastery[skillID];
      else
        this.SkillMastery[skillID] =+ obj.Mastery[skillID];

      if(obj.AllMastery) this.AllSkillsMastery += obj.AllMastery;
  };

  CharacterInfos.prototype.getMasteryBonuses = function(item){
    var result = {};
    if(item.Mastery1) result[item.Mastery1] = item.Mastery1_Amount;
    if(item.Mastery2) result[item.Mastery2] = item.Mastery2_Amount;
    if(item.Mastery3) result[item.Mastery3] = item.Mastery3_Amount;
    return result;
  };

  CharacterInfos.prototype.onExpInfo = function(name, oncalc_callback){
    if(typeof oncalc_callback !== 'function'){
      var callback = (function(id){
        var table = this.updateCalls[id];
        if(!table){
          return;
        }

        if(++table.counter === table.length){
          if(typeof table.callback === 'function'){
            this.updateCalls[id].callback.call(this);
          }

          delete this.updateCalls[id];
        }
      }).bind(this, oncalc_callback);

      oncalc_callback = callback;
    }

    var func = calculation[name];
    if(typeof func !== 'function'){
      console.log("Calculation method of", name, "is not a function, found:", typeof func);
      if(typeof oncalc_callback === 'function') oncalc_callback();
      return;
    }


    var charItem = this.character[name];
    var self = this;
    if(charItem && charItem.ID){
      db.Item.findById(charItem.ID, function(err, item_info){
        if(err){
          return;
        }

        if(!item_info){
          return;
        }

        func.call(self, item_info, charItem.Enchant ? (charItem.Enchant * 3) : 0, charItem.Combine ? charItem.Combine : 0, oncalc_callback);
      });
    }else{
      func.call(self, false, 0, 0, oncalc_callback);
    }
  };

  CharacterInfos.prototype.update = function infos_Update(n, oncalc_callback){
    var id = uuid.v4();
    var names = [];
    if(typeof n === 'string') names.push(n); else names = n;
    this.updateCalls[id] = {counter: 0, length: names.length, callback: oncalc_callback};

    var self = this;
    for(var i=0; i<names.length; i++){
      var name = names[i];
      if(this.Level !== this.character.Level || this.ExpInfo === undefined){
        db.Exp.getByLevel(this.character.Level, function(err, exp){
          if(err){
            return;
          }

          if(!exp){
            return;
          }

          self.ExpInfo = exp;
          self.onExpInfo.call(self, name, id);
        });
      }else{
        this.onExpInfo.call(self, name, id);
      }
    }
  };

  CharacterInfos.prototype.updateAll = function infos_UpdateAll(onready_callback){
    var equipment = ['Weapon', 'Outfit', 'Gloves', 'Boots', 'Cape', 'Amulet', 'Pet', 'Ring'];
    var loaded = 0;
    var callback = function(){
      if(++loaded === equipment.length){
        if(typeof onready_callback === 'function') onready_callback();
      }
    }

    for(var i=0; i<equipment.length; i++) this.update(equipment[i], callback);
  };

  CharacterInfos.prototype.print = function(){
    console.log("Character Infos:");
    console.log("MaxHP:", this.MaxHP);
    console.log("MaxChi:", this.MaxChi);
    console.log("Damage:", this.Damage);
    console.log("Defense:", this.Defense);
    console.log("DodgeRate:", this.DodgeRate);
    console.log("HitRate:", this.HitRate);
    console.log("ElementalDamage:", this.ElementalDamage);
    console.log("ElementalDefense:", this.ElementalDefense);
    console.log("SkillMastery:", this.SkillMastery);
    console.log("AllSkillsMastery:", this.AllSkillsMastery);
    console.log("Chance_ReturnDamage:", this.Chance_ReturnDamage);
    console.log("Chance_DeadlyBlow:", this.Chance_DeadlyBlow);
    console.log("AcupressureDefense:", this.AcupressureDefense);
    console.log("Chance_Acupressure:", this.Chance_Acupressure);
    console.log("Luck:", this.Luck);
  };

  global.CharacterInfos = CharacterInfos;
});
