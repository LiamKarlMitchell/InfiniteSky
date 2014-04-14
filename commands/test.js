// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: test
// Used to test
GMCommands.AddCommand(new Command('test', 80, function(string, client) {
	client.sendInfoMessage(JSON.stringify(vmscript.getNamespace('generic')));
	var cvars = generic.Modifiers[client.character.Clan];
	var statInfo = client.character.statInfo;
	var DamageBonus = 0;
	var WeaponType = 0;

    if (client.character.Weapon && client.character.Weapon.ID > 0) {
		var ii = infos.Item[client.character.Weapon.ID];
		if (ii!=null) {
			DamageBonus = ii.Damage;
			DexterityBonus = ii.Dexterity;
			client.sendInfoMessage('Item info found type: '+ii.ItemType+' dmgmod: '+cvars.Damage[WeaponType]);
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

	client.sendInfoMessage('damage is '+Math.floor((cvars.Damage[WeaponType] * statInfo.StatStrength)+DamageBonus)+' weapon type: '+WeaponType+' dex: '+statInfo.StatStrength);
}));

GMCommands.AddCommand(new Command('stats', 80, function(string, client) {
	client.sendInfoMessage(JSON.stringify(client.character.statInfo));
}));

GMCommands.AddCommand(new Command('rstat', 80, function(string, client) {
	client.character.updateInfos();
	for (a in client.character.statInfo) {
		client.sendInfoMessage(a+': '+client.character.statInfo[a]);
	}
	client.sendInfoMessage('Damage: '+client.character.statInfo.Damage);

		var cvars = generic.Modifiers[client.character.Clan];
	var statInfo = client.character.statInfo;
	console.log(statInfo);
	client.sendInfoMessage('damage is '+Math.floor((cvars.Damage[statInfo.WeaponType] * statInfo.StatStrength))+' weapon type: '+statInfo.WeaponType+' str: '+statInfo.StatStrength);
}));

GMCommands.AddCommand(new Command('info', 80, function(string, client) {
	var item = infos.Item[string];
	if(item === undefined){

	}else{
		console.log("#############################################");
		for(var key in item){
			if(item.hasOwnProperty(key)){
				console.log(key+": "+item[key]);
			}
		}
	}
}));