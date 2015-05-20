
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
if(typeof generic === 'undefined'){
  generic = {};
}

vms('CharacterInfo', [], function(){
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


var CharacterInfos = function(c, character){
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

CharacterInfos.prototype.updateEquipmentByDefault = function(equipment_name){
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
    console.log("CharacterInfos.prototype.updateEquipmentByDefault("+equipment_name+") not found in Switch");
    return false;
    break;
  }
  return true;
}

CharacterInfos.prototype.updateEquipment = function(equipment_name){
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

CharacterInfos.prototype.updateAll = function(){
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

CharacterInfos.prototype.updateLevel = function(){
  // TODO: On level updates
  this.updateAll();
}

CharacterInfos.prototype.updateSkills = function(){
  
}

CharacterInfos.prototype.updateStat = function(stat_name){
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

CharacterInfos.prototype.print = function(){
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

global.CharacterInfos = CharacterInfos;
});