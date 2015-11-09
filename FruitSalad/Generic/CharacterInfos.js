
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

calculation.Damage = function(item, item, done){
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

calculation.Defense = function(item, item, done){
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

calculation.Cape = function(item, item, done){
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

calculation.Outfit = function(itemInfo, item, done){
  switch(typeof itemInfo){
    case 'object':
    var DefenseTick = (item.Level > 95 && item.Level <= 145) ? 22 : 14;
    var dodgeTick = (item.Level > 95 && item.Level <= 145) ? 3 : 2;

    this.Outfit.Defense = itemInfo.Defense;
    this.Outfit.Defense += (DefenseTick * item.Combine);
    this.Outfit.Defense += this.Outfit.Defense / 100 * item.Enchant;

    this.Outfit.DodgeRate = itemInfo.DodgeRate;
    this.Outfit.DodgeRate += dodgeTick * item.Combine;

    this.Outfit.ElementalDefense = itemInfo.ElementalDefense;
    this.Outfit.Mastery = this.getMasteryBonuses(itemInfo);
    this.Outfit.AllMastery = itemInfo.IncreaseAllSkillMastery;
    this.Outfit.Luck = itemInfo.Luck;
    this.Outfit.Vitality = itemInfo.Vitality;
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

calculation.Weapon = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    var weaponModIndex = itemInfo ? itemInfo.getWeaponModIndex(this.Clan) : 0;
    this.Weapon.Mod = this.Modifiers.Damage[weaponModIndex];

    var combineTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 35 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 25 : 15;
    var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 5 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 3 : 2;

    this.Weapon.Damage = itemInfo.Damage;
    this.Weapon.Damage += combineTick * item.Combine;
    this.Weapon.Damage += this.Weapon.Damage / 100 * item.Enchant;

    this.Weapon.HitRate = itemInfo.HitRate;
    this.Weapon.HitRate += hitTick * item.Combine;

    this.Weapon.ElementalDamage = itemInfo.ElementalDamage[this.Clan];

    this.Weapon.Mastery = this.getMasteryBonuses(itemInfo);
    this.Weapon.AllMastery = itemInfo.IncreaseAllSkillMastery;
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

calculation.HitRate = function(itemInfo, item, done){
  this.HitRate = Math.floor(this.Modifiers.HitRate * this.character.Stat_Dexterity);
  this.HitRate += this.Gloves.HitRate;
  this.HitRate += this.Weapon.HitRate;
  this.HitRate += this.Pet.HitRate;

  this.HitRate = Math.floor(this.HitRate);
  done();
};

calculation.Boots = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 3 : 2;
    var dodgeTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 6;

    this.Boots.Defense = itemInfo.Defense;
    this.Boots.Defense += DefenseTick * item.Combine;

    this.Boots.DodgeRate = itemInfo.DodgeRate;
    this.Boots.DodgeRate += dodgeTick * item.Combine;
    this.Boots.DodgeRate += this.Boots.DodgeRate / 100 * item.Enchant;

    this.Boots.Luck = itemInfo.Luck;
    this.Boots.Mastery = this.getMasteryBonuses(itemInfo);
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

calculation.Gloves = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 5;
    var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 13 : 8;

    this.Gloves.Defense = itemInfo.Defense;
    this.Gloves.Defense += DefenseTick * item.Combine;

    this.Gloves.HitRate = itemInfo.HitRate;
    this.Gloves.HitRate += hitTick * item.Combine;
    this.Gloves.HitRate += this.Gloves.HitRate / 100 * item.Enchant;

    this.Gloves.Luck = itemInfo.Luck;
    this.Gloves.Mastery = this.getMasteryBonuses(itemInfo);
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

calculation.Luck = function(itemInfo, item, done){
  this.Luck = this.Outfit.Luck;
  this.Luck += this.Boots.Luck;
  this.Luck += this.Ring.Luck;
  this.Luck += this.Amulet.Luck;
  this.Luck += this.Gloves.Luck;

  done();
};

calculation.DeadlyRate = function(itemInfo, item, done){
  done();
};

calculation.DodgeRate = function(itemInfo, item, done){
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

calculation.ElementalDamage = function(itemInfo, item, done){
  this.ElementalDamage = this.ExpInfo.ElementalDamage[this.Clan];
  this.ElementalDamage += this.Weapon.ElementalDamage;
  this.ElementalDamage += this.Ring.ElementalDamage;
  this.ElementalDamage += this.Pet.ElementalDamage;

  done();
};

calculation.Mastery = function(itemInfo, item, done){
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

calculation.MaxHP = function(itemInfo, item, done){
  console.log("Max hp test");
  this.MaxHP = this.ExpInfo.BaseHP[this.Clan];
  console.log(this.MaxHP);
  this.MaxHP += (this.character.Stat_Vitality + this.Outfit.Vitality) * this.Modifiers.HP;
  console.log(this.MaxHP);

  if(this.MaxHP > this.Pet.HP){
    this.MaxHP += this.Pet.HP / 100 * this.Pet.Scale;
  }else{
    this.MaxHP += this.MaxHP;
  }
  console.log(this.MaxHP);

  done();
};

calculation.MaxChi = function(itemInfo, item, done){
  this.MaxChi = this.ExpInfo.BaseChi[this.Clan];
  this.MaxChi += Math.floor(
    (this.character.Stat_Chi + this.Amulet.Chi) * this.Modifiers.Chi
  );

  done();
};

calculation.ElementalDefense = function(itemInfo, item, done){
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

calculation.DodgeDeadlyBlow = function(itemInfo, item, done){
  done();
};

calculation.Ring = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    this.Ring.ElementalDamage = itemInfo.ElementalDamage[this.Clan];
    this.Ring.Dexterity = itemInfo.Dexterity;
    this.Ring.DeadlyRate = itemInfo.DeadlyRate;
    this.Ring.Luck = itemInfo.Luck;
    this.Ring.Mastery = this.getMasteryBonuses(itemInfo);
    this.Ring.AllMastery = itemInfo.IncreaseAllSkillMastery;
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

calculation.Amulet = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    this.Amulet.ElementalDefense = itemInfo.ElementalDefense;
    this.Amulet.Chi = itemInfo.Chi;
    this.Amulet.Luck = itemInfo.Luck;
    this.Amulet.Mastery = this.getMasteryBonuses(itemInfo);
    this.Amulet.AllMastery = itemInfo.IncreaseAllSkillMastery;
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

calculation.Pet = function(itemInfo, item, done){
  switch(typeof item){
    case 'object':
    if(!itemInfo.Pet){
      return;
    }

    // If pet increases 100% of total damage and its > than their max, its then capped to the max Damage.

    if(itemInfo.Pet.MaxGrowth < item.Growth) item.Growth = itemInfo.Pet.MaxGrowth;

    var isMaxed = item.Growth === itemInfo.Pet.MaxGrowth;

    this.Pet.Scale = 100 / itemInfo.Pet.MaxGrowth * item.Growth;

    this.Pet.HP = itemInfo.Pet.HP;
    this.Pet.HP += isMaxed ? itemInfo.Pet.HP / 100 * 10 : 0;

    this.Pet.Damage = itemInfo.Pet.Damage;
    this.Pet.Damage += isMaxed ? itemInfo.Pet.Damage / 100 * 10 : 0;
    this.Pet.Defense = itemInfo.Pet.Defense;
    this.Pet.Defense += isMaxed ? itemInfo.Pet.Defense / 100 * 10 : 0;

    this.Pet.Mastery = itemInfo.Pet.Mastery;
    this.Pet.DodgeRate = itemInfo.Pet.DodgeRate;
    this.Pet.HitRate = itemInfo.Pet.HitRate;
    this.Pet.ElementalDamage = itemInfo.Pet.ElementalDamage;
    this.Pet.ElementalDefense = itemInfo.Pet.ElementalDefense;
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

  CharacterInfos.prototype.update = function infos_Update(n, oncalc_callback){
    var names = [];
    if(typeof n === 'string') names.push(n); else names = n;

    if(this.Level !== this.character.Level || this.ExpInfo === undefined){
      db.Exp.getByLevel(this.character.Level, (function(err, exp){
        if(err){
          console.log("Error occured on getting exp info while updating character infos");
          console.log(err);
          return;
        }

        if(!exp){
          console.log("Exp info not founded while updating character infos");
          return;
        }

        this.self.ExpInfo = exp;
        this.self.updateAfterExpInfo.call(this.self, this.names, this.oncalc_callback);
      }).bind({self: this, names: names, oncalc_callback: oncalc_callback}));
      return;
    }

    this.updateAfterExpInfo.call(this, names, oncalc_callback);
  };

  CharacterInfos.prototype.updateAfterExpInfo = function infos_UpdateAfterExpInfo(n, oncalc_callback){
    var id = uuid.v4();

    this.updateCalls[id] = {counter: 0, total: n.length, after: oncalc_callback};

    var callback = (function(update_id){
      var uCall = this.updateCalls[update_id];
      if(!uCall){
        console.log("No update call object");
        return;
      }

      if(++uCall.counter === uCall.total && typeof uCall.after === 'function'){
        uCall.after();
        delete this.updateCalls[update_id];
      }
    }).bind(this, id);

    var self = this;
    for(var i=0; i<n.length; i++){
      var name = n[i];
      var uFunc = calculation[name];
      if(!uFunc){
        console.log("No calculation method called:", name);
        continue;
      }

      var charObjItem = this.character[name];
      if(!charObjItem) charObjItem = undefined;
      else {
        charObjItem.Enchant = charObjItem.Enchant === undefined ? 0 : charObjItem.Enchant;
        charObjItem.Combine = charObjItem.Combine === undefined ? 0 : charObjItem.Combine;
      }

      if(charObjItem && charObjItem.ID){
        db.Item.findById(charObjItem.ID, function(err, itemInfo){
          if(err){
            console.log("Error occoured on item info");
            return;
          }

          if(!itemInfo){
            console.log("Item info not founded", itemInfo, err);
            return;
          }

          uFunc.call(self, itemInfo, charObjItem, callback);
        });
        continue;
      }

      uFunc.call(self, undefined, charObjItem, callback);
    }
  };

  CharacterInfos.prototype.updateAll = function infos_UpdateAll(onready_callback){
    var equipment = ['Weapon', 'Outfit', 'Gloves', 'Cape', 'Ring', 'Amulet', 'Boots'];

    var updatesCalled = 0;
    var callback = function(){
      if(++updatesCalled === equipment.length){
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
