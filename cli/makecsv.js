// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */
cli.makecsv = function CLI_MakeCSV(input) {
function infoToCSV(name,keys,callback) {
	// Check if not exist
	if (infos[name] === undefined) {
		callback('infos.'+name+' does not exist!');
		return;
	}

	// Check if not loaded
  if (infos[name].Loaded == false) {
		callback('infos.'+name+' is not loaded!');
		return;
	}

	var records = [];

	// Put record/csv code here
  // Write headers
  records.push(keys);
  
  // Make records
  for (var id in infos[name]) {
  	if (infos.Item.hasOwnProperty(id)) {
  		// Each record contains values we need
  		var record = [];

  		// Loop through array of keys to output column header
			for (var i=0; i<keys.length; i++) {
				record.push(infos[name][id][ keys[i] ]);
			}

  		records.push(record);
  	}
  }
	
// Write CSV to a fileof the records
var filename = "./data/translation/"+name+".csv";
  csv
   .writeToPath(filename, records, {headers: true, quote: '"', escape: '\\',delimiter: '|'})
   .on("finish", function(){
   	  callback(null, "Done writing "+filename);
   });  
};

	infoToCSV('Item',[
						'ID',
						'Name',
						'Level',
						'ItemType',
						'Rareness',
						'Clan',
						'Description1',
						'Description2',
						'Description3',
						'LevelRequirement',
						'HonorPointReq',
						'PurchasePrice',
						'SalePrice',
						'DisplayItem2D',
						'Strength',
						'Dexterity',
						'Vitality',
						'Chi',
						'Luck',
						'Damage',
						'Defense',
						'LightDamage',
						'ShadowDamage',
						'DarkDamage',
						'LightResistance',
						'ShawdowResistance',
						'DarkResistance',
						'ChancetoHit',
						'ChancetoDodge',
						'PercentToDeadlyBlow',
						'ValueType',
						'Value1',
						'SkillBonusID1',
						'SkillBonusID2',
						'SkillBonusID3',
						'SkillBonusAmount1',
						'SkillBonusAmount2',
						'SkillBonusAmount3'
						],console.log);


	// infoToCSV('Monster',[
	// 					'ID',
	// 					'Name',
	// 					'Level',
	// 					'Health',
	// 					'ModelID',
	// 					'RadiusInfo1',
	// 					'RadiusInfo2',
	// 					'WalkSpeed',
	// 					'RunSpeed',
	// 					'DeathSpeed',
	// 					'AttackPower',
	// 					'DefensePower',
	// 					'AttackSuccess',
	// 					'AttackBlock',
	// 					'ElementAttackPower',
	// 					'ElementDefensePower',
	// 					'Critical',
	// 					'LightATK',
	// 					'ShadowATK',
	// 					'DarkATK',
	// 					'ImproveStone1_Chance',
	// 					'ImproveStone1_ID',
	// 					'ImproveStone2_Chance',
	// 					'ImproveStone2_ID',
	// 					'Unknown740',
	// 					'PetDropChance',
	// 					'PetID1',
	// 					'PetID2'
	// 					],console.log);

infoToCSV('Monster',[
					'ID',
					'Name',
					'Level',
					'Health',
					'ModelID',
					'RadiusInfo1',
					'RadiusInfo2',
					'WalkSpeed',
					'RunSpeed',
					'DeathSpeed',
					'AttackPower',
					'DefensePower',
					'AttackSuccess',
					'AttackBlock',
					'ElementAttackPower',
					'ElementDefensePower',
					"Critical",
					"clickheight",
					"clickdepth",
					"Unknown56",
					"Unknown60",
					"Unknown64",
					"Unknown68",
					"Unknown72",
					"Unknown76",
					"Unknown80",
					"Unknown84",
					"Unknown92",
					"Unknown100",
					"Unknown104",
					"Unknown108",
					"Unknown112",
					"Unknown116",
					"Unknown120",
					"Unknown124",
					"Unknown128",
					"Unknown180",
					"Unknown184",
					"Unknown188",
					"Unknown192",
					"Unknown196",
					"Unknown200",
					"Unknown204",
					"Unknown208",
					"Unknown212",
					"Unknown216",
					"Unknown220",
					"Unknown224",
					"Unknown228",
					"Unknown232",
					"Unknown236",
					"Unknown240",
					"Unknown244",
					"Unknown248",
					"Unknown252",
					"Unknown256",
					"Unknown260",
					"Unknown264",
					"Unknown268",
					"Unknown272",
					"Unknown276",
					"Unknown280",
					"Unknown284",
					"Unknown288",
					"Unknown292",
					"Unknown296",
					"Unknown300",
					"Unknown304",
					"Unknown308",
					"Unknown312",
					"Unknown316",
					"Unknown320",
					"Unknown324",
					"LightATK",
					"ShadowATK",
					"DarkATK",
					"Unknown340",
					"Unknown344",
					"Unknown348",
					"Unknown352",
					"Unknown356",
					"Unknown360",
					"Unknown364",
					"Unknown368",
					"Unknown372",
					"Unknown376",
					"Unknown380",
					"Unknown384",
					"Unknown388",
					"Unknown392",
					"Unknown396",
					"Unknown400",
					"Unknown404",
					"Unknown408",
					"Unknown412",
					"Unknown416",
					"Unknown420",
					"Unknown424",
					"Unknown428",
					"Unknown432",
					"Unknown436",
					"Unknown440",
					"Unknown444",
					"Unknown448",
					"Unknown452",
					"Unknown456",
					"Unknown460",
					"Unknown464",
					"Unknown468",
					"Unknown472",
					"Unknown476",
					"Unknown480",
					"Unknown484",
					"Unknown488",
					"Unknown492",
					"Unknown496",
					"Unknown500",
					"Unknown504",
					"Unknown508",
					"Unknown512",
					"Unknown516",
					"Unknown520",
					"Unknown524",
					"Unknown528",
					"Unknown532",
					"Unknown536",
					"Unknown540",
					"Unknown544",
					"Unknown548",
					"Unknown552",
					"Unknown556",
					"Unknown560",
					"Unknown564",
					"Unknown568",
					"Unknown572",
					"Unknown576",
					"Unknown580",
					"Unknown584",
					"Unknown588",
					"Unknown592",
					"Unknown596",
					"Unknown600",
					"Unknown604",
					"Unknown608",
					"Unknown612",
					"Unknown616",
					"Unknown620",
					"Unknown624",
					"Unknown628",
					"Unknown632",
					"Unknown636",
					"Unknown640",
					"Unknown644",
					"Unknown648",
					"Unknown652",
					"Unknown656",
					"Unknown660",
					"Unknown664",
					"Unknown668",
					"Unknown672",
					"Unknown676",
					"Unknown680",
					"Unknown684",
					"Unknown688",
					"Unknown692",
					"Unknown696",
					"Unknown700",
					"Unknown704",
					"Unknown708",
					"Unknown712",
					"Unknown716",
					"Unknown720",
					"ImproveStone1_Chance",
					"ImproveStone1_ID",
					"ImproveStone2_Chance",
					"ImproveStone2_ID",
					"Unknown740",
					"PetDropChance",
					"PetID1",
					"PetID2",
					"Unknown756",
					"Unknown760",
					"Unknown764",
					"Unknown768",
					"Unknown772",
					"Unknown776",
					"Unknown780",
					"Unknown784",
					"Unknown788",
					"Unknown792",
					"Unknown796",
					"Unknown800",
					"Unknown804",
					"Unknown808",
					"Unknown812",
					"Unknown816",
					"Unknown820",
					"Unknown824",
					"Unknown828",
					"Unknown832",
					"Unknown836",
					"Unknown840",
					"Unknown844",
					"Unknown848",
					"Unknown852",
					"Unknown856",
					"Unknown860",
					"Unknown864",
					"Unknown868",
					"Unknown872",
					"Unknown876",
					"Unknown880",
					],console.log);

	infoToCSV('Npc',['ID','Name','Chat1','Chat2','Chat3','Chat4','Chat5'],console.log)
	//infoToCSV('Exp',['Level','EXPStart','EXPEnd','SkillPoint'],console.log)
	infoToCSV('Exp',[
					'Level',
					'EXPStart',
					'EXPEnd',
					'Unknown1',
					'Unknown2',
					'SkillPoint',
					'GuanyinDamage',
					'FujinDamage',
					'JinongDamage',
					'GuanyinDefense',
					'FujinDefense',
					'JinongDefense',
					'GuanyinHitrate',
					'FujinHitrate',
					'JinongHitrate',
					'GuanyinDodge',
					'FujinDodge',
					'JinongDodge',
					'LightDamage',
					'ShadowDamage',
					'DarkDamage',
					'GuanyinHP',
					'FujinHP',
					'JinongHP',
					'GuanyinChi',
					'FujinChi',
					'JinongChi'
					],console.log)

	infoToCSV('Skill',['ID','Name','Description1','Description2', 'Description3','Clan','Weapon','PointsToLearn','MaxSkillLevel'],console.log)
};

cli.makecsv.help = function CLI_MakeCSV_help(input) {
	return 'Makes csv files for translation use.';
};

