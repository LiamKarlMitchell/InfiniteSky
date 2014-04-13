// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */

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
   .writeToPath(filename, records, {headers: true})
   .on("finish", function(){
   	  callback(null, "Done writing "+filename);
   });  
}


cli.makecsv = function CLI_MakeCSV(input) {
	infoToCSV('Item',['ID','Name','Rareness','ItemType','LevelRequirement','HonorPointReq','SkillBonusID1','SkillBonusID2','SkillBonusID3','SkillBonusAmount1','SkillBonusAmount2','SkillBonusAmount3','Description2','Description3'],console.log);
	infoToCSV('Monster',['ID','Name','Health','AttackPower','DefensePower','Critical'],console.log);
	infoToCSV('Npc',['ID','Name','Chat1','Chat2','Chat3','Chat4','Chat5'],console.log)
	infoToCSV('Exp',['Level','EXPStart','EXPEnd','SkillPoint'],console.log)
};

cli.makecsv.help = function CLI_MakeCSV_help(input) {
	return 'Makes csv files for translation use.';
};

