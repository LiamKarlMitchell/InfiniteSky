
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
var Modifiers = [];
//Modifiers[client.Character.clan].Dodge
//Modifiers[client.Character.clan].Damage[WeaponType]

var GainModifiers = {
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

Modifiers.push(GainModifiers);
Modifiers.push(FujinModifiers);
Modifiers.push(JinongModifiers);


generic.Modifiers = Modifiers;


var characterStatsInfoObj = function(c, character){
  // TODO : Include all the base stats and erease them from the methods below.
  // this.client = c === null ? this.client.character ;
  if(c === null){
    this.client = {};
    this.client.character = character;
  }else{
    this.client = c;
  }
  this.clan = this.client.character.Clan;


  this.Pet = {
    HP: 0,
    Chi: 0,
    Damage: 0,
    Defense: 0,
    Skills: {},
    Dodge: 0,
    HitRate: 0,
    ElementalDamage: 0,
    ElementalDefense: 0
  };

  this.Armor = {
    Vitality: 0,
    Defense: 0,
    Dodge: 0,
    Resists: {
      Light: 0,
      Shadow: 0,
      Dark : 0
    },
    Luck: 0,
    Skills: {},
    AllSkills: 0
  };

  this.Modifiers = generic.Modifiers[this.client.character.Clan] || null;
  this.Weapon = {
    Damage: 0,
    Mod: this.Modifiers.Damage[0],
    HitRate: 0,
    ElementalDamage: 0,
    Skills: {},
    AllSkills: 0
  };

  this.Boots = {
    Defense: 0,
    Dodge: 0,
    Luck: 0,
    Skills: {},
    AllSkills: 0
  };

  this.Ring = {
    Dexterity: 0,
    ElementalDamage: 0,
    DeadlyRate: 0,
    Luck: 0,
    Skills: {},
    AllSkills: 0
  };

  this.Gloves = {
    Defense: 0,
    HitRate: 0,
    Luck: 0,
    Skills: {},
    AllSkills: 0
  };

  this.Cape = {
    Defense: 0,
    Resists: {
      Light: 0,
      Shadow: 0,
      Dark : 0
    },
    Skills: {},
    AllSkills: 0
  };
  this.Amulet = {
    Chi: 0,
    Resists: {
      Light: 0,
      Shadow: 0,
      Dark : 0
    },
    Luck: 0,
    Skills: {},
    AllSkills: 0
  };

  this.DexHitRate = 0;
  this.DexDodge = 0;

  this.Damage = 0;
  this.Dodge = 0;
  this.Defense = 0;
  this.HitRate = 0;
  this.MaxHP = 0;
  this.MaxChi = 0;

  this.ElementalDamage = 0;
  this.Resists = {
    Light: 0,
    Shadow: 0,
    Dark : 0
  };

  this.Luck = 0;
  this.DeadlyRate = 0;

  this.Skills = {};
  this.AllSkills = 0;

  return this;
};

var characterStatsInfo_Prototype = characterStatsInfoObj.prototype;

characterStatsInfo_Prototype.updateEquipmentByDefault = function(equipment_name){
  switch(equipment_name){
    case 'Weapon':
      this.Weapon.Damage = 0;
      this.Weapon.Mod = this.Modifiers.Damage[0];

      this.Weapon.ElementalDamage = 0;
      this.Weapon.HitRate = 0;
      this.updateStat('StatStrength');
      this.updateStat('HitRate');
      // TODO: When skills are ready, appropriate level increment. Only applies to the weapons that has the benefits for the skills
    break;


    case 'Pet':
      // this.Pet.
      this.Pet = {
        HP: 0,
        Chi: 0,
        Damage: 0,
        Defense: 0,
        Skills: {},
        Dodge: 0,
        HitRate: 0,
        ElementalDamage: 0,
        ElementalDefense: 0
      };

      this.updateStat('HP');
      this.updateStat('Chi');
      this.updateStat('Damage');
      this.updateStat('Defense');
      this.updateStat('Skills');
      this.updateStat('Dodge');
      this.updateStat('HitRate');
      this.updateStat('ElementalDamage');
      this.updateStat('Resists');
    break;


    case 'Armor':
    this.Armor.Defense = 0;
    this.Armor.Vitality = 0;
    this.Armor.Dodge = 0;

    this.Armor.Resists.Light = 0;
    this.Armor.Resists.Shadow = 0;
    this.Armor.Resists.Dark = 0;


    this.updateStat('Defense');
    this.updateStat('Dodge');
    break;

    case 'Boot':
      this.Boots.Defense = 0;
      this.Boots.Dodge = 0;

      this.updateStat('Defense');
      this.updateStat('Dodge');
    break;


    case 'Glove':
      this.Gloves.Defense = 0;
      this.Gloves.HitRate = 0;

      this.updateStat('Defense');
      this.updateStat('HitRate');
    break;

    case 'Cape':
      this.Cape.Defense = 0;

      this.Cape.Resists.Light = 0;
      this.Cape.Resists.Shadow = 0;
      this.Cape.Resists.Dark = 0;


      this.updateStat('Defense');
      this.updateStat('Resists');
    break;

    case 'Amulet':
      this.Amulet.Chi = 0;
      this.Amulet.Resists.Light = 0;
      this.Amulet.Resists.Shadow = 0;
      this.Amulet.Resists.Dark = 0;

      this.Amulet.Luck = 0;

      this.updateStat('StatChi');
      this.updateStat('Resists');
    break;

    case 'Ring':
      this.Ring.Luck = 0;
      this.Ring.Dexterity = 0;
      this.Ring.ElementalDamage = 0;
      this.Ring.DeadlyRate = 0;

      this.updateStat('StatDexterity');
      this.updateStat('Luck');
      this.updateStat('ElementalDamage');
      this.updateStat('DeadlyRate');
    break;

    default:
    console.log("characterStatsInfo_Prototype.updateEquipmentByDefault("+equipment_name+") not found in Switch");
    return false;
    break;
  }
  return true;
}

characterStatsInfo_Prototype.updateEquipment = function(equipment_name){
  // TODO: Callback once the calculation has finished so we can for example send an response for itemActions to wear an item.


  // Check if we have supplied the function with item name we want to take a look at
  if(!equipment_name){
    console.log("The item was not specified.")
    return;
  }

  // Check if the character has the item equiped
  if(!this.client.character[equipment_name]){
    //TODO: Handle the updates of stats if necessary, like weapons do.
    if(!this.updateEquipmentByDefault(equipment_name)) console.log("Trying to update the ["+equipment_name+"] but character does not have it, or the client.character.infos.updateEquipmentByDefault method cannot initialize default settings for item.");
    return;
  }

  // Get the item from character
  var item = this.client.character[equipment_name];
  if(!item.ID){
    if(!this.updateEquipmentByDefault(equipment_name)) console.log("Trying to update the ["+equipment_name+"] but character does not have it, or the client.character.infos.updateEquipmentByDefault method cannot initialize default settings for item.");
    return;
  }


  // Get the item info
  var itemInfo = infos.Item[item.ID];
  if(!itemInfo){
    console.log("infos.Item["+item.ID+"] has not been found");
    return;
  }



  // Get the defaults
  var enchant = item.Enchant*3 || 0;
  var combine = item.Combine || 0;
  var growth = item.Growth || 0;

  switch(equipment_name){
    case 'Weapon':
      var combineTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 35 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 25 : 15;
      var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 5 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 3 : 2;

      this.Weapon.Damage = (combineTick*combine) + itemInfo.Damage;

      this.Weapon.Damage += Math.floor(this.Weapon.Damage/100*enchant);
      switch(this.clan){
        case 0:
        this.Weapon.Mod = itemInfo.ItemType === 13 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 14 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 15 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
        break;

        case 1:
        this.Weapon.Mod = itemInfo.ItemType === 16 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 17 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 18 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
        break;

        case 2:
        this.Weapon.Mod = itemInfo.ItemType === 19 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 20 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 21 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
        break;
      }

      this.Weapon.ElementalDamage = this.clan === 0 ? itemInfo.LightDamage : this.clan === 1 ? itemInfo.ShadowDamage : itemInfo.DarkDamage;
      this.Weapon.HitRate = (hitTick*combine) + itemInfo.ChancetoHit;

      var deadlyRate = itemInfo.PercentToDeadlyBlow;

      this.updateStat('StatStrength');
      this.updateStat('HitRate');
      // TODO: When skills are ready, appropriate level increment. Only applies to the weapons that has the benefits for the skills
    break;


    case 'Pet':
      var MAX_GROWTH = itemInfo.PetStats.MaxGrowth;
      var scale = item.Growth / MAX_GROWTH;

      // console.log("Updating pet ["+item.ID+"]");
      // console.log("Pet growth: " + item.Growth);
      switch(item.ID){
        case 9800:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.Pet.HitRate = (itemInfo.PetStats.HitRate / 200) * (scale * 200);
        this.Pet.ElementalDamage = (itemInfo.PetStats.ElementalDamage / 200) * (scale * 200);
        this.updateStat('Damage');
        this.updateStat('HitRate');
        this.updateStat('ElementalDamage');
        break;

        case 9801:
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.Pet.ElementalDefense = (itemInfo.PetStats.ElementalDefense / 200) * (scale * 200);
        this.Pet.ElementalDefense = this.Pet.ElementalDefense > 136 ? 136 : this.Pet.ElementalDefense;
        this.Pet.Dodge = (itemInfo.PetStats.Dodge / 200) * (scale * 200);

        this.updateStat('Health');
        this.updateStat('Resists');
        this.updateStat('Dodge');
        break;

        case 9802:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.Pet.HitRate = (itemInfo.PetStats.HitRate / 200) * (scale * 200);
        this.Pet.Dodge = (itemInfo.PetStats.Dodge / 200) * (scale * 200);
        this.updateStat('Health');
        this.updateStat('Defense');
        this.updateStat('Damage');
        this.updateStat('HitRate');
        this.updateStat('Dodge');
        break;

        case 98999:
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.updateStat('Health');
        break;

        case 99000:
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.updateStat('Defense');
        break;

        case 99001:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.updateStat('Damage');
        break;

        case 99226:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.updateStat('Health');
        this.updateStat('Damage');
        break;

        case 99227:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.updateStat('Damage');
        this.updateStat('Defense');
        break;

        case 99228:
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.updateStat('Health');
        this.updateStat('Defense');
        break;

        case 99229:
        this.Pet.HP = (itemInfo.PetStats.HP / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.HP / 100 * 10 : 0);
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.updateStat('Health');
        this.updateStat('Defense');
        this.updateStat('Damage');
        break;

        case 99267:
        case 99282:
        this.Pet.Defense = (itemInfo.PetStats.Defense / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Defense / 100 * 10 : 0);
        this.Pet.Skills = itemInfo.PetStats.Skills;
        this.updateStat('Defense');
        this.updateSkills();
        break;

        case 99268:
        case 99283:
        this.Pet.Damage = (itemInfo.PetStats.Damage / 200) * (scale * 200) + (item.Growth >= MAX_GROWTH ? itemInfo.PetStats.Damage / 100 * 10 : 0);
        this.Pet.Skills = itemInfo.PetStats.Skills;
        this.updateStat('Damage');
        this.updateSkills();
        break;

        default:
        console.log("The ["+item.ID+"] item is not a PET!");
        break;
      }
    break;


    case 'Armor':
    var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 22 : 14;
    var dodgeTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 3 : 2;

    this.Armor.Defense = (DefenseTick * combine) + itemInfo.Defense;
    this.Armor.Defense += (this.Armor.Defense / 100 * enchant);
    this.Armor.Vitality = itemInfo.Vitality;
    this.Armor.Dodge = (dodgeTick * combine) + itemInfo.ChancetoDodge;

    this.Armor.Resists.Light = itemInfo.LightResistance;
    this.Armor.Resists.Shadow = itemInfo.ShawdowResistance;
    this.Armor.Resists.Dark = itemInfo.DarkResistance;


    this.updateStat('Defense');
    this.updateStat('Dodge');
    break;

    case 'Boot':
      var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 3 : 2;
      var dodgeTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 6;

      this.Boots.Defense = (DefenseTick * combine) + itemInfo.Defense;
      this.Boots.Dodge = (dodgeTick * combine) + itemInfo.ChancetoDodge;
      this.Boots.Dodge += Math.floor(this.Boots.Dodge / 100 * enchant);

      this.updateStat('Defense');
      this.updateStat('Dodge');
    break;


    case 'Glove':
      var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 5;
      // Todo: check values for this level ranges
      var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 13 : 8;

      this.Gloves.Defense = (DefenseTick * combine) + itemInfo.Defense;


      this.Gloves.HitRate = (hitTick * combine) + itemInfo.ChancetoHit;
      this.Gloves.HitRate += (this.Gloves.HitRate / 100) * enchant;

      this.updateStat('Defense');
      this.updateStat('HitRate');
    break;

    case 'Cape':
      this.Cape.Defense = itemInfo.Defense;

      this.Cape.Resists.Light = itemInfo.LightResistance;
      this.Cape.Resists.Shadow = itemInfo.ShawdowResistance;
      this.Cape.Resists.Dark = itemInfo.DarkResistance;


      this.updateStat('Defense');
      this.updateStat('Resists');
    break;

    case 'Amulet':
      this.Amulet.Chi = itemInfo.Chi;
      this.Amulet.Resists.Light = itemInfo.LightResistance;
      this.Amulet.Resists.Shadow = itemInfo.ShawdowResistance;
      this.Amulet.Resists.Dark = itemInfo.DarkResistance;

      this.Cape.Luck = itemInfo.Luck;

      this.updateStat('StatChi');
    break;

    case 'Ring':
      this.Ring.Luck = itemInfo.Luck;
      this.Ring.Dexterity = itemInfo.Dexterity;
      this.Ring.ElementalDamage = this.clan === 0 ? itemInfo.LightDamage : this.clan === 1 ? itemInfo.ShadowDamage : itemInfo.DarkDamage;
      this.Ring.DeadlyRate = itemInfo.PercentToDeadlyBlow;

      this.updateStat('StatDexterity');
      this.updateStat('Luck');
      this.updateStat('ElementalDamage');
      this.updateStat('DeadlyRate');
    break;
  }


  return this;
}

characterStatsInfo_Prototype.updateAll = function(){
  this.updateEquipment('Weapon');
  this.updateEquipment('Armor');
  this.updateEquipment('Boot');
  this.updateEquipment('Glove');
  this.updateEquipment('Cape');
  this.updateEquipment('Amulet');
  this.updateEquipment('Ring');
  this.updateEquipment('Pet');

  this.updateStat('StatVitality');
  this.updateStat('StatChi');
  this.updateStat('StatDexterity');
  this.updateStat('StatStrength');

  this.updateStat('Defense');
  this.updateStat('HitRate');
  this.updateStat('Dodge');
  this.updateStat('DeadlyRate');
  this.updateStat('Luck');
  this.updateStat('Resists');
  this.updateStat('ElementalDamage');

  this.updateSkills();
}

characterStatsInfo_Prototype.updateLevel = function(){
  // TODO: On level updates
  this.updateAll();
}

characterStatsInfo_Prototype.updateSkills = function(){
  
}

characterStatsInfo_Prototype.updateStat = function(stat_name){
  var Stat = this.client.character[stat_name];
  // if(
  //   (
  //     stat_name !== 'Defense' &&
  //     stat_name !== 'HitRate' &&
  //     stat_name !== 'Dodge' &&
  //     stat_name !== 'Luck' &&
  //     stat_name !== 'DeadlyRate' &&
  //     stat_name !== 'Resists' &&
  //     stat_name !== 'ElementalDamage'
  //   ) && Stat === undefined
  // ){
  //   console.log("Stat " + stat_name + " is undefined");
  //   return;
  // }

  if(!this.Modifiers){
    console.log("No character modifiers");
    return;
  }

  var ExpInfo = infos.Exp[this.client.character.Level];
  if(!ExpInfo){
    console.log("No exp info for level : ", this.client.character.Level);
    return;
  }

  switch(stat_name){
    case 'StatVitality':
    case 'Vitality':
    case 'HP':
    case 'Health':
    var baseHP = this.clan === 0 ? ExpInfo.GuanyinHP : this.clan === 1 ? ExpInfo.FujinHP : ExpInfo.JinongHP;
    var formula = baseHP + (this.Modifiers.HP * (Stat+this.Armor.Vitality)) + this.Pet.HP;
    this.MaxHP = formula;

    if(this.client.character.Health > this.MaxHP){
      this.client.character.Health = this.MaxHP;
      this.client.character.save();
    }
    break;

    case 'StatChi':
    var baseCHI = this.clan === 0 ? ExpInfo.GuanyinChi : this.clan === 1 ? ExpInfo.FujinChi : ExpInfo.JinongChi;
    var formula = baseCHI + (this.Modifiers.Chi * (Stat + this.Amulet.Chi));
    this.MaxChi = formula;

    if(this.client.character.Chi > this.MaxChi){
      this.client.character.Chi = this.MaxChi;
      this.client.character.save();
    }
    break;

    case 'StatDexterity':
    var baseDodge = this.clan === 0 ? ExpInfo.GuanyinDodge : this.clan === 1 ? ExpInfo.FujinDodge : ExpInfo.JinongDodge;
    Stat += this.Ring.Dexterity;

    var dodgeFormula = baseDodge + (this.Modifiers.Dodge * Stat);

    this.DexHitRate = (this.Modifiers.HitRate * Stat);
    this.DexDodge = (this.Modifiers.Dodge * Stat);

    this.updateStat('HitRate');
    this.updateStat('Dodge');
    break;

    case 'StatStrength':
    case 'Damage':
    var baseDamage = this.clan === 0 ? ExpInfo.GuanyinDamage : this.clan === 1 ? ExpInfo.FujinDamage : ExpInfo.JinongDamage;
    var damageFormula = (baseDamage + (this.Weapon.Mod * Stat)) + baseDamage + this.Weapon.Damage;
    this.Damage = damageFormula;
    this.Damage += this.Pet.Damage;
    break;

    case 'Defense':
    var baseDefense = this.clan === 0 ? ExpInfo.GuanyinDefense : this.clan === 1 ? ExpInfo.FujinDefense : ExpInfo.JinongDefense;
    this.Defense = this.Armor.Defense + this.Boots.Defense + this.Gloves.Defense + this.Cape.Defense + baseDefense;
    this.Defense += this.Pet.Defense;
    break;

    case 'HitRate':
    this.HitRate = this.Weapon.HitRate + this.Gloves.HitRate + this.DexHitRate;
    this.HitRate += this.Pet.HitRate;
    break;

    case 'Dodge':
    var baseDefense = this.clan === 0 ? ExpInfo.GuanyinDefense : this.clan === 1 ? ExpInfo.FujinDefense : ExpInfo.JinongDefense;
    this.Dodge = this.Boots.Dodge + this.Armor.Dodge + this.DexDodge;
    this.Dodge += this.Pet.Dodge;
    break;

    case 'Luck':
    this.Luck = this.Boots.Luck + this.Armor.Luck + this.Gloves.Luck + this.Amulet.Luck + this.Ring.Luck;
    break;

    case 'Resists':
    this.Resists.Light = this.Armor.Resists.Light + this.Amulet.Resists.Light + this.Cape.Resists.Light;
    this.Resists.Shadow = this.Armor.Resists.Shadow + this.Amulet.Resists.Shadow + this.Cape.Resists.Shadow;
    this.Resists.Dark = this.Armor.Resists.Dark + this.Amulet.Resists.Dark + this.Cape.Resists.Dark;

    this.Resists.Light += this.Resists.Light / 136 * this.Pet.ElementalDefense;
    this.Resists.Shadow += this.Resists.Shadow / 136 * this.Pet.ElementalDefense;
    this.Resists.Dark += this.Resists.Dark / 136 * this.Pet.ElementalDefense;
    break;

    case 'ElementalDamage':
    var baseElementalDamage = this.clan === 0 ? ExpInfo.LightDamage : this.clan === 1 ? ExpInfo.ShadowDamage : ExpInfo.DarkDamage;
    this.ElementalDamage = this.Weapon.ElementalDamage + this.Ring.ElementalDamage + baseElementalDamage;
    break;

    case 'DeadlyRate':
    this.DeadlyRate = this.Ring.DeadlyRate;
    break;
  }
}

characterStatsInfo_Prototype.print = function(){
  console.log();
  console.log("Damage : " + this.Damage);
  console.log("Defense : " + this.Defense);
  console.log("Max HP : " + this.MaxHP);
  console.log("Max Chi : " + this.MaxChi);
  console.log("Hit Rate : " + this.HitRate);
  console.log("Dodge : " + this.Dodge);
  console.log("Luck : " + this.Luck);
  console.log("Resits : ", this.Resists);
  console.log("Deadly rate : ", this.DeadlyRate);
  console.log("ElementalDamage : ", this.ElementalDamage);
}

generic.characterStatsInfoObj = characterStatsInfoObj;
  // _this.infos = new characterStatsInfo(this);
  // client.characterInfo.updateAll();
  // client.characterInfo.print();


generic.calculateCharacterinfos = function calculateCharacterinfos(_this, onLevel) {
  console.log("generic.calculateCharacterinfos is depracted!");
  // var characterStatsInfo = function(client){
  //   // TODO : Include all the base stats and erease them from the methods below.
  //   this.client = client;
  //   this.clan = client.character.Clan;


  //   this.Pet = {
  //     HP: 0,
  //     Chi: 0,
  //     Damage: 0,
  //     Defense: 0
  //   };

  //   this.Armor = {
  //     Vitality: 0,
  //     Defense: 0,
  //     Dodge: 0,
  //     Resists: {
  //       Light: 0,
  //       Shadow: 0,
  //       Dark : 0
  //     },
  //     Luck: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.Modifiers = generic.Modifiers[client.character.Clan] || null;
  //   this.Weapon = {
  //     Damage: 0,
  //     Mod: this.Modifiers.Damage[0],
  //     HitRate: 0,
  //     ElementalDamage: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.Boots = {
  //     Defense: 0,
  //     Dodge: 0,
  //     Luck: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.Ring = {
  //     Dexterity: 0,
  //     ElementalDamage: 0,
  //     DeadlyRate: 0,
  //     Luck: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.Gloves = {
  //     Defense: 0,
  //     HitRate: 0,
  //     Luck: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.Cape = {
  //     Defense: 0,
  //     Resists: {
  //       Light: 0,
  //       Shadow: 0,
  //       Dark : 0
  //     },
  //     Skills: {},
  //     AllSkills: 0
  //   };
  //   this.Amulet = {
  //     Chi: 0,
  //     Resists: {
  //       Light: 0,
  //       Shadow: 0,
  //       Dark : 0
  //     },
  //     Luck: 0,
  //     Skills: {},
  //     AllSkills: 0
  //   };

  //   this.DexHitRate = 0;
  //   this.DexDodge = 0;

  //   this.Damage = 0;
  //   this.Dodge = 0;
  //   this.Defense = 0;
  //   this.HitRate = 0;
  //   this.MaxHP = 0;
  //   this.MaxChi = 0;

  //   this.ElementalDamage = 0;
  //   this.Resists = {
  //     Light: 0,
  //     Shadow: 0,
  //     Dark : 0
  //   };

  //   this.Luck = 0;
  //   this.DeadlyRate = 0;

  //   this.Skills = {};
  //   this.AllSkills = 0;

  //   return this;
  // };

  // var characterStatsInfo_Prototype = characterStatsInfo.prototype;

  // characterStatsInfo_Prototype.updateEquipment = function(equipment_name){
  //   // TODO: Callback once the calculation has finished so we can for example send an response for itemActions to wear an item.


  //   // Check if we have supplied the function with item name we want to take a look at
  //   if(!equipment_name){
  //     console.log("The item was not specified.")
  //     return;
  //   }

  //   // Check if the character has the item equiped
  //   if(!this.client.character[equipment_name]){
  //     //TODO: Handle the updates of stats if necessary, like weapons do.
  //     console.log("Trying to update the ["+equipment_name+"] but character does not have it.");
  //     return;
  //   }

  //   // Get the item from character
  //   var item = this.client.character[equipment_name];
  //   if(!item.ID){
  //     console.log("Equiped item has got no ID!");
  //     return;
  //   }


  //   // Get the item info
  //   var itemInfo = infos.Item[item.ID];
  //   if(!itemInfo){
  //     console.log("infos.Item["+item.ID+"] has not been found");
  //     return;
  //   }

  //   // Get the defaults
  //   var enchant = item.Enchant*3 || 0;
  //   var combine = item.Combine || 0;
  //   var growth = item.Growth || 0;

  //   switch(equipment_name){
  //     case 'Weapon':
  //       var combineTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 35 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 25 : 15;
  //       var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 5 : (itemInfo.Level > 85 && itemInfo.Level <= 95) ? 3 : 2;

  //       this.Weapon.Damage = (combineTick*combine) + itemInfo.Damage;

  //       this.Weapon.Damage += Math.floor(this.Weapon.Damage/100*enchant);
  //       switch(this.clan){
  //         case 0:
  //         this.Weapon.Mod = itemInfo.ItemType === 13 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 14 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 15 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
  //         break;

  //         case 1:
  //         this.Weapon.Mod = itemInfo.ItemType === 16 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 17 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 18 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
  //         break;

  //         case 2:
  //         this.Weapon.Mod = itemInfo.ItemType === 19 ? this.Modifiers.Damage[1] : itemInfo.ItemType === 20 ? this.Modifiers.Damage[2] : itemInfo.ItemType === 21 ? this.Modifiers.Damage[3] : this.Modifiers.Damage[0];
  //         break;
  //       }

  //       this.Weapon.ElementalDamage = this.clan === 0 ? itemInfo.LightDamage : this.clan === 1 ? itemInfo.ShadowDamage : itemInfo.DarkDamage;
  //       this.Weapon.HitRate = (hitTick*combine) + itemInfo.ChancetoHit;

  //       var deadlyRate = itemInfo.PercentToDeadlyBlow;

  //       this.updateStat('StatStrength');
  //       this.updateStat('HitRate');
  //       // TODO: When skills are ready, appropriate level increment. Only applies to the weapons that has the benefits for the skills
  //     break;


  //     case 'Pet':
  //       var MAX_GROWTH = 250000000;
  //       //TODO: Pet stats
  //     break;


  //     case 'Armor':
  //     var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 22 : 14;
  //     var dodgeTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 3 : 2;

  //     this.Armor.Defense = (DefenseTick * combine) + itemInfo.Defense;
  //     this.Armor.Defense += (this.Armor.Defense / 100 * enchant);
  //     this.Armor.Vitality = itemInfo.Vitality;
  //     this.Armor.Dodge = (dodgeTick * combine) + itemInfo.ChancetoDodge;

  //     this.Armor.Resists.Light = itemInfo.LightResistance;
  //     this.Armor.Resists.Shadow = itemInfo.ShawdowResistance;
  //     this.Armor.Resists.Dark = itemInfo.DarkResistance;


  //     this.updateStat('Defense');
  //     this.updateStat('Dodge');
  //     break;

  //     case 'Boot':
  //       var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 3 : 2;
  //       var dodgeTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 6;

  //       this.Boots.Defense = (DefenseTick * combine) + itemInfo.Defense;
  //       this.Boots.Dodge = (dodgeTick * combine) + itemInfo.ChancetoDodge;
  //       this.Boots.Dodge += Math.floor(this.Boots.Dodge / 100 * enchant);

  //       this.updateStat('Defense');
  //       this.updateStat('Dodge');
  //     break;


  //     case 'Glove':
  //       var DefenseTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 8 : 5;
  //       // Todo: check values for this level ranges
  //       var hitTick = (itemInfo.Level > 95 && itemInfo.Level <= 145) ? 13 : 8;

  //       this.Gloves.Defense = (DefenseTick * combine) + itemInfo.Defense;


  //       this.Gloves.HitRate = (hitTick * combine) + itemInfo.ChancetoHit;
  //       this.Gloves.HitRate += (this.Gloves.HitRate / 100) * enchant;

  //       this.updateStat('Defense');
  //       this.updateStat('HitRate');
  //     break;

  //     case 'Cape':
  //       this.Cape.Defense = itemInfo.Defense;

  //       this.Cape.Resists.Light = itemInfo.LightResistance;
  //       this.Cape.Resists.Shadow = itemInfo.ShawdowResistance;
  //       this.Cape.Resists.Dark = itemInfo.DarkResistance;


  //       this.updateStat('Defense');
  //       this.updateStat('Resists');
  //     break;

  //     case 'Amulet':
  //       this.Amulet.Chi = itemInfo.Chi;
  //       this.Amulet.Resists.Light = itemInfo.LightResistance;
  //       this.Amulet.Resists.Shadow = itemInfo.ShawdowResistance;
  //       this.Amulet.Resists.Dark = itemInfo.DarkResistance;

  //       this.Cape.Luck = itemInfo.Luck;

  //       this.updateStat('StatChi');
  //     break;

  //     case 'Ring':
  //       this.Ring.Luck = itemInfo.Luck;
  //       this.Ring.Dexterity = itemInfo.Dexterity;
  //       this.Ring.ElementalDamage = this.clan === 0 ? itemInfo.LightDamage : this.clan === 1 ? itemInfo.ShadowDamage : itemInfo.DarkDamage;
  //       this.Ring.DeadlyRate = itemInfo.PercentToDeadlyBlow;

  //       this.updateStat('StatDexterity');
  //       this.updateStat('Luck');
  //       this.updateStat('ElementalDamage');
  //       this.updateStat('DeadlyRate');
  //     break;
  //   }


  //   return this;
  // }

  // characterStatsInfo_Prototype.updateAll = function(){
  //   this.updateEquipment('Weapon');
  //   this.updateEquipment('Armor');
  //   this.updateEquipment('Boot');
  //   this.updateEquipment('Glove');
  //   this.updateEquipment('Cape');
  //   this.updateEquipment('Amulet');
  //   this.updateEquipment('Ring');

  //   this.updateStat('StatVitality');
  //   this.updateStat('StatChi');
  //   this.updateStat('StatDexterity');
  //   this.updateStat('StatStrength');

  //   this.updateStat('Defense');
  //   this.updateStat('HitRate');
  //   this.updateStat('Dodge');
  //   this.updateStat('DeadlyRate');
  //   this.updateStat('Luck');
  //   this.updateStat('Resists');
  //   this.updateStat('ElementalDamage');

  //   this.updateSkills();
  // }

  // characterStatsInfo_Prototype.updateLevel = function(){
  //   // TODO: On level updates
  //   this.updateAll();
  // }

  // characterStatsInfo_Prototype.updateSkills = function(){
    
  // }

  // characterStatsInfo_Prototype.updateStat = function(stat_name){
  //   var Stat = client.character[stat_name];
  //   if(
  //     (
  //       stat_name !== 'Defense' &&
  //       stat_name !== 'HitRate' &&
  //       stat_name !== 'Dodge' &&
  //       stat_name !== 'Luck' &&
  //       stat_name !== 'DeadlyRate' &&
  //       stat_name !== 'Resists' &&
  //       stat_name !== 'ElementalDamage'
  //     ) && Stat === undefined
  //   ){
  //     console.log("Stat " + stat_name + " is undefined");
  //     return;
  //   }

  //   if(!this.Modifiers){
  //     console.log("No character modifiers");
  //     return;
  //   }

  //   var ExpInfo = infos.Exp[client.character.Level];
  //   if(!ExpInfo){
  //     console.log("No exp info for level : ", client.character.Level);
  //     return;
  //   }

  //   switch(stat_name){
  //     case 'StatVitality':
  //     var baseHP = this.clan === 0 ? ExpInfo.GuanyinHP : this.clan === 1 ? ExpInfo.FujinHP : ExpInfo.JinongHP;
  //     var formula = baseHP + (this.Modifiers.HP * (Stat+this.Armor.Vitality)) + this.Pet.HP;
  //     this.MaxHP = formula;
  //     break;

  //     case 'StatChi':
  //     var baseCHI = this.clan === 0 ? ExpInfo.GuanyinChi : this.clan === 1 ? ExpInfo.FujinChi : ExpInfo.JinongChi;
  //     var formula = baseCHI + (this.Modifiers.Chi * (Stat + this.Amulet.Chi));
  //     this.MaxChi = formula;
  //     break;

  //     case 'StatDexterity':
  //     var baseDodge = this.clan === 0 ? ExpInfo.GuanyinDodge : this.clan === 1 ? ExpInfo.FujinDodge : ExpInfo.JinongDodge;
  //     Stat += this.Ring.Dexterity;

  //     var dodgeFormula = baseDodge + (this.Modifiers.Dodge * Stat);

  //     this.DexHitRate = (this.Modifiers.HitRate * Stat);
  //     this.DexDodge = (this.Modifiers.Dodge * Stat);

  //     this.updateStat('HitRate');
  //     this.updateStat('Dodge');
  //     break;

  //     case 'StatStrength':
  //     var baseDamage = this.clan === 0 ? ExpInfo.GuanyinDamage : this.clan === 1 ? ExpInfo.FujinDamage : ExpInfo.JinongDamage;
  //     var damageFormula = (baseDamage + (this.Weapon.Mod * Stat)) + baseDamage + this.Weapon.Damage;
  //     this.Damage = damageFormula;
  //     break;

  //     case 'Defense':
  //     var baseDefense = this.clan === 0 ? ExpInfo.GuanyinDefense : this.clan === 1 ? ExpInfo.FujinDefense : ExpInfo.JinongDefense;
  //     this.Defense = this.Armor.Defense + this.Boots.Defense + this.Gloves.Defense + this.Cape.Defense + baseDefense;
  //     break;

  //     case 'HitRate':
  //     this.HitRate = this.Weapon.HitRate + this.Gloves.HitRate + this.DexHitRate;
  //     break;

  //     case 'Dodge':
  //     var baseDefense = this.clan === 0 ? ExpInfo.GuanyinDefense : this.clan === 1 ? ExpInfo.FujinDefense : ExpInfo.JinongDefense;
  //     this.Dodge = this.Boots.Dodge + this.Armor.Dodge + this.DexDodge;
  //     break;

  //     case 'Luck':
  //     this.Luck = this.Boots.Luck + this.Armor.Luck + this.Gloves.Luck + this.Amulet.Luck + this.Ring.Luck;
  //     break;

  //     case 'Resists':
  //     this.Resists.Light = this.Armor.Resists.Light + this.Amulet.Resists.Light + this.Cape.Resists.Light;
  //     this.Resists.Shadow = this.Armor.Resists.Shadow + this.Amulet.Resists.Shadow + this.Cape.Resists.Shadow;
  //     this.Resists.Dark = this.Armor.Resists.Dark + this.Amulet.Resists.Dark + this.Cape.Resists.Dark;
  //     break;

  //     case 'ElementalDamage':
  //     var baseElementalDamage = this.clan === 0 ? ExpInfo.LightDamage : this.clan === 1 ? ExpInfo.ShadowDamage : ExpInfo.DarkDamage;
  //     this.ElementalDamage = this.Weapon.ElementalDamage + this.Ring.ElementalDamage + baseElementalDamage;
  //     break;

  //     case 'DeadlyRate':
  //     this.DeadlyRate = this.Ring.DeadlyRate;
  //     break;
  //   }
  // }

  // characterStatsInfo_Prototype.print = function(){
  //   console.log();
  //   console.log("Damage : " + this.Damage);
  //   console.log("Defense : " + this.Defense);
  //   console.log("Max HP : " + this.MaxHP);
  //   console.log("Max Chi : " + this.MaxChi);
  //   console.log("Hit Rate : " + this.HitRate);
  //   console.log("Dodge : " + this.Dodge);
  //   console.log("Luck : " + this.Luck);
  //   console.log("Resits : ", this.Resists);
  //   console.log("Deadly rate : ", this.DeadlyRate);
  //   console.log("ElementalDamage : ", this.ElementalDamage);

  //   console.log('----');
  //   console.log(client.character.infos);
  // }


  // _this.infos = new characterStatsInfo(this);
  // client.characterInfo.updateAll();
  // client.characterInfo.print();

  // _this.do2FPacket=1;
    //console.log('updateInfos');

  // var level = this.Level;
  // if (level>106) level=106;
  // if (reloadEXPInfo || this.expinfo === undefined) this.expinfo = infos.Exp[level];

  // // Setup base stats bassed on points, bonuses gear etc.
  // if (this.expinfo === undefined) {
  //   throw new Error('Level is set to '+level+' for character '+this.Name+' which does not have exp info for it.');
  // }


  // // Setup base stats bassed on points, bonuses gear etc.

  // var infos = {}; // Should make this a js object

  // // Should seprate this out into another js object for using with monsters and npc too.
  // // Constructor shit

  // infos.HP = 0;
  // infos.Chi = 0;

  // infos.BaseStatStrength = this.StatStrength;
  // infos.BaseStatDexterity = this.StatDexterity;
  // infos.BaseStatVitality = this.StatVitality;
  // infos.BaseStatChi = this.StatChi;

  // infos.StatStrength = this.StatStrength;
  // infos.StatDexterity = this.StatDexterity;
  // infos.StatVitality = this.StatVitality;
  // infos.StatChi = this.StatChi;

  // infos.Luck=0;
  // infos.Damage=0;
  // infos.DamageBonus=this.DamageBonus;
  // infos.Defense=0;
  // infos.LightDamage=0;
  // infos.ShadowDamage=0;
  // infos.DarkDamage=0;
  // infos.LightResistance=0;
  // infos.ShawdowResistance=0;
  // infos.DarkResistance=0;
  // infos.ChancetoHit=0;
  // infos.ChancetoDodge=0;
  // infos.PercentToDeadlyBlow=0; 

  // infos.HitRate = 0;
  // infos.DodgeDeadlyBlow = 0;
  // infos.DecreaseChiConsumption = 0;
  // infos.Dodge = 0;

  // function ApplyItemEffects(item)
  // {
  //   var info = infos.Item[item.ID];
  //   if (info===null) return;
  //   if (info.ID===0) return;

  //   //if (info.Name.indexOf('Boots')>-1) eyes.inspect(info);

  //   infos.StatStrength += info.Strength || 0;
  //   infos.StatDexterity += info.Dexterity || 0;
  //   infos.StatVitality += info.Vitality || 0;
  //   infos.StatChi += info.Chi || 0;
  //   infos.Luck += info.Luck || 0;
  //   infos.DamageBonus += info.Damage || 0;
  //   infos.Defense += info.Defense || 0;
  //   infos.LightDamage += info.LightDamage || 0;
  //   infos.ShadowDamage += info.ShadowDamage || 0;
  //   infos.DarkDamage += info.DarkDamage || 0;
  //   infos.LightResistance += info.LightResistance || 0;
  //   infos.ShawdowResistance += info.ShawdowResistance || 0;
  //   infos.DarkResistance += info.DarkResistance || 0;
  //   infos.ChancetoHit += info.ChancetoHit || 0;
  //   infos.ChancetoDodge += info.ChancetoDodge || 0;
  //   infos.PercentToDeadlyBlow += info.PercentToDeadlyBlow || 0;

  //   infos.DecreaseChiConsumption += info.DecreaseChiConsumption || 0;
  //   infos.DodgeDeadlyBlow += info.DodgeDeadlyBlow || 0;

  // // Need to code in skill bonuses
  //   // info.SkillBonusID1 || 0;
  //   // info.SkillBonusID2 || 0;
  //   // info.SkillBonusID3 || 0;
  //   // info.SkillBonusAmount1 || 0;
  //   // info.SkillBonusAmount2 || 0;
  //   // info.SkillBonusAmount3 || 0;
  //   // info.IncreaseAllSKillMastery || 0;

  //   // Apply equipment enchant bassed on item type
  //   // http://www.aeriagames.com/wiki/index.php?title=Items&game=twelvesky2
  //       // http://cebunogard.blogspot.com/
  //       // Boots Dodge
  //       // Armor Defense
  //       // Weapon Damage
  //       // Gloves Hit
  //       // Ring Damage and Crit
  //       // Amulet Luck
  //       // Capes Defense
  //   switch (info.InventoryItemType()) {
      
  //   }
  //   // Apply enchant bonuses

  //   // Apply combine bonuses
  // }

  // // Apply equip bonuses
  // if (this.Ring && this.Ring.ID)     ApplyItemEffects(this.Ring);
  // if (this.Cape && this.Cape.ID)     ApplyItemEffects(this.Cape);
  // if (this.Armor && this.Armor.ID)   ApplyItemEffects(this.Armor);
  // if (this.Glove && this.Glove.ID)   ApplyItemEffects(this.Glove);
  // if (this.Amulet && this.Amulet.ID) ApplyItemEffects(this.Amulet);
  // if (this.Boot && this.Boot.ID)     ApplyItemEffects(this.Boot);
  // if (this.Weapon && this.Weapon.ID) ApplyItemEffects(this.Weapon);
  // if (this.Pet && this.Pet.ID)       ApplyItemEffects(this.Pet);
  // if (this.CalbashBottle && this.CalbashBottle.ID) ApplyItemEffects(this.CalbashBottle);

  // // Ask world/zone for bonuses applied to faction

  // // Apply item effects

  // // Apply skill effects

  // // Not sure if these are right way to apply the bonuses
  // infos.StatStrength += this.StrBonus || 0;
  // infos.StatDexterity += this.DexBonus || 0;
  // infos.Luck += this.LuckBuff || 0;
  // infos.StatStrength += this.StrengthBuff || 0;
    
  // infos.DarkDamage += this.DarkDamage || 0;

  // infos.Defense += this.FactionDefenseBonus || 0;
  
  // infos.HitRate += this.ChanceDodge_Hit || 0;
  // infos.Dodge += this.ChanceDodge_Hit || 0;

  // infos.HitRate += infos.ChancetoHit || 0;
  // infos.Dodge += infos.ChancetoDodge || 0;

  // // Damage formular goes here...

  // var cvars = Modifiers[this.Clan];
  // var WeaponType = 0;

  // infos.HP += cvars.HP;
  // infos.Chi += cvars.Chi;

  // // Calculate Damage

  // // Get Weapon TypeID
  //   if (this.Weapon && this.Weapon.ID > 0) {
  //   var ii = infos.Item[this.Weapon.ID];
  //   if (ii!==null) {
  //            if (ii.ItemType == 13) WeaponType = 1; // Sword
  //       else if (ii.ItemType == 14) WeaponType = 2; // Blade
  //       else if (ii.ItemType == 15) WeaponType = 3; // Marble
  //       else if (ii.ItemType == 16) WeaponType = 1; // Katana
  //       else if (ii.ItemType == 17) WeaponType = 2; // Double Blade
  //       else if (ii.ItemType == 18) WeaponType = 3; // Lute
  //       else if (ii.ItemType == 19) WeaponType = 1; // Light Blade
  //       else if (ii.ItemType == 20) WeaponType = 2; // Long Spear
  //       else if (ii.ItemType == 21) WeaponType = 3; // Scepter
  //     }
  //   }
  // infos.WeaponType = WeaponType;

  // infos.Damage += ((cvars.Damage[WeaponType] * infos.StatStrength)+infos.DamageBonus) || 0;

  // infos.HitRate += cvars.HitRate*infos.StatDexterity;
  // infos.Dodge += cvars.Dodge*infos.StatDexterity;
  // Apply GM command effects
  // Caculate the final HP and CHI etc from stat info

  // Apply class effects  
  // Take statpoints into consideration
  //http://12skys.webs.com/stats.htm
// this.SkillPoints
// this.StatPoints
// this.StatVitality
// this.StatStrength
// this.StatChi
// this.StatDex

// BELOW HERE IS OLD CODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Im not 100% sure in any order of which to do these.
  // switch (this.Clan)
  // {
  //   case 0: // Guanyin
  //   infos.Damage += this.expinfo.GuanyinDamage;
  //   infos.Defense += this.expinfo.GuanyinDefense;
  //   infos.HitRate += this.expinfo.GuanyinHitrate;
  //   infos.Dodge += this.expinfo.GuanyinDodge;
  //   infos.LightDamage += this.expinfo.LightDamage;

  //   infos.HP += this.expinfo.GuanyinHP;
  //   infos.Chi += this.expinfo.GuanyinChi;

  //   //infos.HP += infos.StatVitality*Stat_PointM['Guanyin'].VitMul//15.31; //-  1 Vitality Point -> 15.31 Hit Points
  //   //infos.Chi += infos.StatChi*Stat_PointM['Guanyin'].ChiMul//20; //-  1 Chi Point -> 20 Chi

  //   //infos.ChancetoHit += (infos.StatDexterity*Stat_PointM['Guanyin'].DexMul.Hit/*5.14*/) + infos.HitRate; //-  1 Dexterity -> 5.14 Chance to Hit
  //   //infos.ChancetoDodge += (infos.StatDexterity*Stat_PointM['Guanyin'].DexMul.Dodge/*2.75*/) + infos.Dodge; //-  1 Dexterity -> 2.57 Chance to Dodge

  //   //if (this.Weapon.ID)
  //   //-  1 Strength -> Using Sword : 3.86
  //   //-  1 Strength -> Using  Blade : 4.3
  //   //-  1 Strength -> Using Marble : 4.08    
  //   break;
  //   case 1: // Fujin
  //   infos.Damage += this.expinfo.FujinDamage;
  //   infos.Defense += this.expinfo.FujinDefense;
  //   infos.HitRate += this.expinfo.FujinHitrate;
  //   infos.Dodge += this.expinfo.FujinDodge;
  //   infos.ShadowDamage += this.expinfo.ShadowDamage;
    
  //   infos.HP += this.expinfo.FujinHP;
  //   infos.Chi += this.expinfo.FujinChi;

  //   //infos.HP += infos.StatVitality*Stat_PointM['Fujin'].VitMul//14.29; //-  1 Vitality Point -> 14.29 Hit Points
  //   //infos.Chi += infos.StatChi*Stat_PointM['Fujin'].ChiMul//17.14; //-  1 Chi Point -> 17.14 Chi

  //   //infos.ChancetoHit += (infos.StatDexterity*Stat_PointM['Fujin'].DexMul.Hit/*4.57*/) + infos.HitRate; //-  1 Dexterity -> 4.57 Chance to Hit
  //   //infos.ChancetoDodge += (infos.StatDexterity*Stat_PointM['Fujin'].DexMul.Dodge/*2.29*/) + infos.Dodge; //-  1 Dexterity -> 2.29 Chance to Dodge
  //   //-  1 Strength -> Using Katana : 3.17
  //   //-  1 Strength -> Using Double Blade : 2.71
  //   //-  1 Strength -> Using Lute : 2.94
  //   break;
  //   case 2: // Jinong
  //   infos.Damage += this.expinfo.JinongDamage;
  //   infos.Defense += this.expinfo.JinongDefense;
  //   infos.HitRate += this.expinfo.JinongHitrate;
  //   infos.Dodge += this.expinfo.JinongDodge;
  //   infos.DarkDamage += this.expinfo.DarkDamage;
    
  //   infos.HP += this.expinfo.JinongHP;
  //   infos.Chi += this.expinfo.JinongChi;

  //   //infos.HP += infos.StatVitality*Stat_PointM['Jinong'].VitMul//16.33; //-  1 Vitality Point -> 16.33 Hit Points
  //   //infos.Chi += infos.StatChi*Stat_PointM['Jinong'].ChiMul//22.29; //-  1 Chi Point -> 22.29 Chi

  //   //infos.ChancetoHit += (infos.StatDexterity*Stat_PointM['Jinong'].DexMul/*5.71*/) + infos.HitRate; //-  1 Dexterity -> 5.71 Chance to Hit
  //   //infos.ChancetoDodge += (infos.StatDexterity*Stat_PointM['Jinong'].DexMul/*2.86*/) + infos.Dodge; //-  1 Dexterity -> 2.86 Chance to Dodge
  //   //-  1 Strength -> Using Light Blade : 5.39
  //   //-  1 Strength -> Using Long Spear : 5.61
  //   //-  1 Strength -> Using Scepter : 5.17
  //   break;
  // }

  // Get rid of decimals on HP and Chi
  // infos.HP = Math.floor(infos.HP);
  // infos.Chi = Math.floor(infos.Chi);

  // Cap HP and Chi if they are higher than what is now max
  // if (this.Health > infos.HP || this.state.CurrentHealth > infos.HP) {
  //  this.Health = infos.HP;
  //  this.state.CurrentHealth = infos.HP;
  // }
  // if (this.Chi > infos.HP || this.state.CurrentChi > infos.Chi) {
  //  this.Chi = infos.Chi;
  //  this.state.CurrentChi = infos.Chi;
  // }
  //eyes.inspect(infos);
  // this.infos = infos;
};
