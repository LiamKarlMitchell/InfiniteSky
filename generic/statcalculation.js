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


generic.calculateCharacterStatInfo = function calculateCharacterStatInfo(reloadEXPInfo) {
    //console.log('updateInfos');

  var level = this.Level;
  if (level>106) level=106;
  if (reloadEXPInfo || this.expinfo === undefined) this.expinfo = infos.Exp[level];

  // Setup base stats bassed on points, bonuses gear etc.
  if (this.expinfo === undefined) {
    throw new Error('Level is set to '+level+' for character '+this.Name+' which does not have exp info for it.');
  }


  // Setup base stats bassed on points, bonuses gear etc.

  var statInfo = {}; // Should make this a js object

  // Should seprate this out into another js object for using with monsters and npc too.
  // Constructor shit

  statInfo.HP = 0;
  statInfo.Chi = 0;

  statInfo.BaseStatStrength = this.StatStrength;
  statInfo.BaseStatDexterity = this.StatDexterity;
  statInfo.BaseStatVitality = this.StatVitality;
  statInfo.BaseStatChi = this.StatChi;

  statInfo.StatStrength = this.StatStrength;
  statInfo.StatDexterity = this.StatDexterity;
  statInfo.StatVitality = this.StatVitality;
  statInfo.StatChi = this.StatChi;

  statInfo.Luck=0;
  statInfo.Damage=0;
  statInfo.DamageBonus=this.DamageBonus;
  statInfo.Defense=0;
  statInfo.LightDamage=0;
  statInfo.ShadowDamage=0;
  statInfo.DarkDamage=0;
  statInfo.LightResistance=0;
  statInfo.ShawdowResistance=0;
  statInfo.DarkResistance=0;
  statInfo.ChancetoHit=0;
  statInfo.ChancetoDodge=0;
  statInfo.PercentToDeadlyBlow=0; 

  statInfo.HitRate = 0;
  statInfo.DodgeDeadlyBlow = 0;
  statInfo.DecreaseChiConsumption = 0;
  statInfo.Dodge = 0;

  function ApplyItemEffects(info)
  {
    if (info===null) return;
    if (info.ID===0) return;

    //if (info.Name.indexOf('Boots')>-1) eyes.inspect(info);

    statInfo.StatStrength += info.Strength || 0;
    statInfo.StatDexterity += info.Dexterity || 0;
    statInfo.StatVitality += info.Vitality || 0;
    statInfo.StatChi += info.Chi || 0;
    statInfo.Luck += info.Luck || 0;
    statInfo.DamageBonus += info.Damage || 0;
    statInfo.Defense += info.Defense || 0;
    statInfo.LightDamage += info.LightDamage || 0;
    statInfo.ShadowDamage += info.ShadowDamage || 0;
    statInfo.DarkDamage += info.DarkDamage || 0;
    statInfo.LightResistance += info.LightResistance || 0;
    statInfo.ShawdowResistance += info.ShawdowResistance || 0;
    statInfo.DarkResistance += info.DarkResistance || 0;
    statInfo.ChancetoHit += info.ChancetoHit || 0;
    statInfo.ChancetoDodge += info.ChancetoDodge || 0;
    statInfo.PercentToDeadlyBlow += info.PercentToDeadlyBlow || 0;

    statInfo.DecreaseChiConsumption += info.DecreaseChiConsumption || 0;
    statInfo.DodgeDeadlyBlow += info.DodgeDeadlyBlow || 0;

  // Need to code in skill bonuses
    // info.SkillBonusID1 || 0;
    // info.SkillBonusID2 || 0;
    // info.SkillBonusID3 || 0;
    // info.SkillBonusAmount1 || 0;
    // info.SkillBonusAmount2 || 0;
    // info.SkillBonusAmount3 || 0;
    // info.IncreaseAllSKillMastery || 0;

    // Apply equipment enchant bassed on item type
    // http://www.aeriagames.com/wiki/index.php?title=Items&game=twelvesky2
        // http://cebunogard.blogspot.com/
        // Boots Dodge
        // Armor Defense
        // Weapon Damage
        // Gloves Hit
        // Ring Damage and Crit
        // Amulet Luck
        // Capes Defense
  }

  // Apply equip bonuses
  if (this.Ring && this.Ring.ID) ApplyItemEffects(infos.Item[this.Ring.ID]);
  if (this.Cape && this.Cape.ID) ApplyItemEffects(infos.Item[this.Cape.ID]);
  if (this.Armor && this.Armor.ID) ApplyItemEffects(infos.Item[this.Armor.ID]);
  if (this.Glove && this.Glove.ID) ApplyItemEffects(infos.Item[this.Glove.ID]);
  if (this.Amulet && this.Amulet.ID) ApplyItemEffects(infos.Item[this.Amulet.ID]);
  if (this.Boot && this.Boot.ID) ApplyItemEffects(infos.Item[this.Boot.ID]);
  if (this.Weapon && this.Weapon.ID) ApplyItemEffects(infos.Item[this.Weapon.ID]);
  if (this.Pet && this.Pet.ID) ApplyItemEffects(infos.Item[this.Pet.ID]);
  if (this.CalbashBottle && this.CalbashBottle.ID) ApplyItemEffects(infos.Item[this.CalbashBottle.ID]);

  // Ask world/zone for bonuses applied to faction

  // Apply item effects

  // Apply skill effects

  // Not sure if these are right way to apply the bonuses
  statInfo.StatStrength += this.StrBonus || 0;
  statInfo.StatDexterity += this.DexBonus || 0;
  statInfo.Luck += this.LuckBuff || 0;
  statInfo.StatStrength += this.StrengthBuff || 0;
    
  statInfo.DarkDamage += this.DarkDamage || 0;

  statInfo.Defense += this.FactionDefenseBonus || 0;
  
  statInfo.HitRate += this.ChanceDodge_Hit || 0;
  statInfo.Dodge += this.ChanceDodge_Hit || 0;

  statInfo.HitRate += statInfo.ChancetoHit || 0;
  statInfo.Dodge += statInfo.ChancetoDodge || 0;

  // Damage formular goes here...

  var cvars = Modifiers[this.Clan];
  var WeaponType = 0;

  statInfo.HP += cvars.HP;
  statInfo.Chi += cvars.Chi;

  // Calculate Damage

  // Get Weapon TypeID
    if (this.Weapon && this.Weapon.ID > 0) {
    var ii = infos.Item[this.Weapon.ID];
    if (ii!==null) {
             if (ii.ItemType == 13) WeaponType = 1; // Sword
        else if (ii.ItemType == 14) WeaponType = 2; // Blade
        else if (ii.ItemType == 15) WeaponType = 3; // Marble
        else if (ii.ItemType == 16) WeaponType = 1; // Katana
        else if (ii.ItemType == 17) WeaponType = 2; // Double Blade
        else if (ii.ItemType == 18) WeaponType = 3; // Lute
        else if (ii.ItemType == 19) WeaponType = 1; // Light Blade
        else if (ii.ItemType == 20) WeaponType = 2; // Long Spear
        else if (ii.ItemType == 21) WeaponType = 3; // Scepter
      }
    }
  statInfo.WeaponType = WeaponType;

  console.log('Weapon Type: '+WeaponType);
  statInfo.Damage += ((cvars.Damage[WeaponType] * statInfo.StatStrength)+statInfo.DamageBonus) || 0;

  statInfo.HitRate += cvars.HitRate*statInfo.StatDexterity;
  statInfo.Dodge += cvars.Dodge*statInfo.StatDexterity;
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
  switch (this.Clan)
  {
    case 0: // Guanyin
    statInfo.Damage += this.expinfo.GuanyinDamage;
    statInfo.Defense += this.expinfo.GuanyinDefense;
    statInfo.HitRate += this.expinfo.GuanyinHitrate;
    statInfo.Dodge += this.expinfo.GuanyinDodge;
    statInfo.LightDamage += this.expinfo.LightDamage;

    statInfo.HP += this.expinfo.GuanyinHP;
    statInfo.Chi += this.expinfo.GuanyinChi;

    //statInfo.HP += statInfo.StatVitality*Stat_PointM['Guanyin'].VitMul//15.31; //-  1 Vitality Point -> 15.31 Hit Points
    //statInfo.Chi += statInfo.StatChi*Stat_PointM['Guanyin'].ChiMul//20; //-  1 Chi Point -> 20 Chi

    //statInfo.ChancetoHit += (statInfo.StatDexterity*Stat_PointM['Guanyin'].DexMul.Hit/*5.14*/) + statInfo.HitRate; //-  1 Dexterity -> 5.14 Chance to Hit
    //statInfo.ChancetoDodge += (statInfo.StatDexterity*Stat_PointM['Guanyin'].DexMul.Dodge/*2.75*/) + statInfo.Dodge; //-  1 Dexterity -> 2.57 Chance to Dodge

    //if (this.Weapon.ID)
    //-  1 Strength -> Using Sword : 3.86
    //-  1 Strength -> Using  Blade : 4.3
    //-  1 Strength -> Using Marble : 4.08    
    break;
    case 1: // Fujin
    statInfo.Damage += this.expinfo.FujinDamage;
    statInfo.Defense += this.expinfo.FujinDefense;
    statInfo.HitRate += this.expinfo.FujinHitrate;
    statInfo.Dodge += this.expinfo.FujinDodge;
    statInfo.ShadowDamage += this.expinfo.ShadowDamage;
    
    statInfo.HP += this.expinfo.FujinHP;
    statInfo.Chi += this.expinfo.FujinChi;

    //statInfo.HP += statInfo.StatVitality*Stat_PointM['Fujin'].VitMul//14.29; //-  1 Vitality Point -> 14.29 Hit Points
    //statInfo.Chi += statInfo.StatChi*Stat_PointM['Fujin'].ChiMul//17.14; //-  1 Chi Point -> 17.14 Chi

    //statInfo.ChancetoHit += (statInfo.StatDexterity*Stat_PointM['Fujin'].DexMul.Hit/*4.57*/) + statInfo.HitRate; //-  1 Dexterity -> 4.57 Chance to Hit
    //statInfo.ChancetoDodge += (statInfo.StatDexterity*Stat_PointM['Fujin'].DexMul.Dodge/*2.29*/) + statInfo.Dodge; //-  1 Dexterity -> 2.29 Chance to Dodge
    //-  1 Strength -> Using Katana : 3.17
    //-  1 Strength -> Using Double Blade : 2.71
    //-  1 Strength -> Using Lute : 2.94
    break;
    case 2: // Jinong
    statInfo.Damage += this.expinfo.JinongDamage;
    statInfo.Defense += this.expinfo.JinongDefense;
    statInfo.HitRate += this.expinfo.JinongHitrate;
    statInfo.Dodge += this.expinfo.JinongDodge;
    statInfo.DarkDamage += this.expinfo.DarkDamage;
    
    statInfo.HP += this.expinfo.JinongHP;
    statInfo.Chi += this.expinfo.JinongChi;

    //statInfo.HP += statInfo.StatVitality*Stat_PointM['Jinong'].VitMul//16.33; //-  1 Vitality Point -> 16.33 Hit Points
    //statInfo.Chi += statInfo.StatChi*Stat_PointM['Jinong'].ChiMul//22.29; //-  1 Chi Point -> 22.29 Chi

    //statInfo.ChancetoHit += (statInfo.StatDexterity*Stat_PointM['Jinong'].DexMul/*5.71*/) + statInfo.HitRate; //-  1 Dexterity -> 5.71 Chance to Hit
    //statInfo.ChancetoDodge += (statInfo.StatDexterity*Stat_PointM['Jinong'].DexMul/*2.86*/) + statInfo.Dodge; //-  1 Dexterity -> 2.86 Chance to Dodge
    //-  1 Strength -> Using Light Blade : 5.39
    //-  1 Strength -> Using Long Spear : 5.61
    //-  1 Strength -> Using Scepter : 5.17
    break;
  }

  // Get rid of decimals on HP and Chi
  statInfo.HP = Math.floor(statInfo.HP);
  statInfo.Chi = Math.floor(statInfo.Chi);

  // Cap HP and Chi if they are higher than what is now max
  // if (this.Health > statInfo.HP || this.state.CurrentHealth > statInfo.HP) {
  //  this.Health = statInfo.HP;
  //  this.state.CurrentHealth = statInfo.HP;
  // }
  // if (this.Chi > statInfo.HP || this.state.CurrentChi > statInfo.Chi) {
  //  this.Chi = statInfo.Chi;
  //  this.state.CurrentChi = statInfo.Chi;
  // }

    this.do2FPacket=1;
  //eyes.inspect(statInfo);
  this.statInfo = statInfo;
};
