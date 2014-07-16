// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: giveexp
// Gives you experience points
GMCommands.AddCommand(new Command('xp',0,function command_giveexp(string,client){
	if (string.length==0) { client.sendInfoMessage("Example Usage: /giveexp 10");
							return;}
	// Get Amount from string
	var Value = parseInt(string);
	if (isNaN(Value)) {
		client.sendInfoMessage("Example Usage: /giveexp 10");
			return;
	}
	///console.log(Value);
	client.giveEXP(Value);

	client.sendInfoMessage("You have "+client.character.Experience+" EXP");
}));


var xp_table = [];
var base = 200;

/*
	lvl 1:
		experience: 221 (221)
		levelup: 222
		1tick: 0.45%
		
	lvl 2:
		experience: 510 (289) (68)
		levelup: 511
		1tick: 0.35%
		
	lvl 3:
		experience: 855 (345) (56)
		levelup: 856
		1tick: 0.29%	
		
	lvl 4:
		experience: 1244 (389) (44)
		levelup: 1245
		1tick: 0.26%
		
	lvl 5:
		experience: 2020 (776) (44)
		levelup: 2021
		1tick: 0.26%	
*/

for(var i=1; i<=4; i++){
	if(!xp_table[i-2]){
		var increment = base+(base/100*10)*i;
	}else{
		var increment = xp_table[i-2].experience+(base/100*10)*i;
	}
	
	xp_table.push({
		level: i,
		experience: increment
	});
}

GMCommands.AddCommand(new Command('xptable',0,function command_giveexp(string,client){
	eyes.inspect(xp_table);
}));