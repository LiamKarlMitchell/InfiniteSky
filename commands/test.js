// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: test
// Used to test
GMCommands.AddCommand(new Command('test', 80, function(string, client) {
<<<<<<< HEAD
function clientWriteItemActionSuccess(client, input){
    client.write(new Buffer(packets.ItemActionReplyPacket2.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        ItemID: input.ItemID,
        Unknown3: input.Unknown3,
        Unknown4: input.Unknown4,
        Unknown5: input.Unknown5,
        Amount: input.Amount,
        InventoryIndex: input.InventoryIndex,
        RowDrop: input.RowDrop,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup,
        ColumnMove: input.ColumnMove,
        RowMove: input.RowMove,
        Failed: 0
    })));
}
// 11 - Move from bank too inventory ? - Uses move
// 12 - Reply to using item
// 14 - Cancled
// 16 - Item has been obtained - Uses move
clientWriteItemActionSuccess(client, { ActionType: 2, ItemID: 8, InventoryIndex: 5} );
clientWriteItemActionSuccess(client, { ActionType: 0, ItemID: 8, InventoryIndex: 5,

ItemUniqueID: 1,
ItemUniqueID2: 1,
RowDrop: 5,
ColumnPickup: 5,
RowPickup: 5,
ColumnMove: 3,
RowMove: 5
 });

	// client.sendInfoMessage(JSON.stringify(vmscript.getNamespace('generic')));
	// var cvars = generic.Modifiers[client.character.Clan];
	// var statInfo = client.character.statInfo;
=======
	
	client.sendInfoMessage("HP is "+client.character.state.CurrentHP+'/'+client.character.state.MaxHP);
	// var cvars = generic.Modifiers[client.character.Clan];
	var statInfo = client.character.statInfo;
	console.log(statInfo);
>>>>>>> upstream/master
	// var DamageBonus = 0;
	// var WeaponType = 0;

 //    if (client.character.Weapon && client.character.Weapon.ID > 0) {
	// 	var ii = infos.Item[client.character.Weapon.ID];
	// 	if (ii!=null) {
	// 		DamageBonus = ii.Damage;
	// 		DexterityBonus = ii.Dexterity;
	// 		client.sendInfoMessage('Item info found type: '+ii.ItemType+' dmgmod: '+cvars.Damage[WeaponType]);
	// 					     if (ii.ItemType == 13) WeaponType = 1; // Sword
	// 					else if (ii.ItemType == 14) WeaponType = 2; // Blade
	// 					else if (ii.ItemType == 15) WeaponType = 3; // Marble
	// 					else if (ii.ItemType == 16) WeaponType = 1; // Katana
	// 					else if (ii.ItemType == 17) WeaponType = 2; // Double Blade
	// 					else if (ii.ItemType == 18) WeaponType = 3; // Lute
	// 					else if (ii.ItemType == 19) WeaponType = 1; // Light Blade
	// 					else if (ii.ItemType == 20) WeaponType = 2; // Long Spear
	// 					else if (ii.ItemType == 21) WeaponType = 3; // Scepter
	// 		}
	// 	}

	// client.sendInfoMessage('damage is '+Math.floor((cvars.Damage[WeaponType] * statInfo.StatStrength)+DamageBonus)+' weapon type: '+WeaponType+' dex: '+statInfo.StatStrength);
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

GMCommands.AddCommand(new Command('npcs', 80, function(string, client) {
	for(var i = 1; i <= 153; i++){
		console.log(i + " : " + infos.Npc[i].Name);
	}
}));

GMCommands.AddCommand(new Command('npc', 80, function(string, client) {
	for(var object in infos.Npc[11]){
		var npc = infos.Npc[11];
		if(npc.hasOwnProperty(object)){
			console.log(object + " : " + npc[object]);
		}
	}
}));

function npcs(){
	for(var i = 1; i <= 153; i++){
		console.log(i + " : " + infos.Npc[i].Name);
	}
}

GMCommands.AddCommand(new Command('skills', 80, function(string, client) {
	for(var i = 1; i <= 120; i++){
		console.log(i + " : " + infos.Skill[i].Name + " @ " + infos.Skill[i].Clan);
	}
}));


GMCommands.AddCommand(new Command('bling', 80, function(string, client) {
	client.character.state._oUnknown1 =  15000;
	client.character.state._oUnknown2 =  15000;// all value 15000 has nothing to do with character or buff
	client.character.state._oUnknown3 =  15000;// altho not sure if it has to do with some items...
	client.character.state._oUnknown4 =  15000;
	client.character.state._oUnknown5 =  15000;
	client.character.state._oUnknown6 =  15000;
	client.character.state._oUnknown7 =  15000;
	client.character.state._oUnknown8 =  15000;
	client.character.state._oUnknown9 =  15000;
	client.character.state._oUnknown10 = 15000;
	client.character.state._oUnknown11 = 15000;
	client.character.state._oUnknown12 = 15000;
	client.character.state._oUnknown13 = 15000;
	client.character.state._oUnknown14 = 15000;
	client.character.state._oUnknown15 = 15000;
	client.character.state._oUnknown16 = 15000;
	client.character.state._oUnknown17 = 15000;
	client.character.state._oUnknown18 = 15000;
	client.character.state._oUnknown19 = 15000;
	client.character.state._oUnknown20 = 15000;
	client.character.state._oUnknown21 = 15000;
	client.character.state._oUnknown22 = 15000;
	client.character.state._oUnknown23 = 15000;
	client.character.state._oUnknown24 = 15000;
	client.character.state._oUnknown25 = 15000;
	client.character.state._oUnknown26 = 15000;
	client.character.state._oUnknown27 = 15000;
	client.character.state._oUnknown28 = 15000;
	client.character.state._oUnknown29 = 15000;
	client.character.state._oUnknown30 = 15000;
	client.character.state._oUnknown31 = 15000;
	client.character.state._oUnknown32 = 15000;
	client.character.state._oUnknown33 = 15000;
	client.character.state._oUnknown34 = 15000;
	client.character.state._oUnknown35 = 15000;
	client.character.state._oUnknown36 = 15000;
	client.character.state._oUnknown37 = 15000;
	client.character.state._oUnknown38 = 15000;
	client.character.state._oUnknown39 = 15000;
	client.character.state._oUnknown40 = 15000;
	client.character.state._oUnknown41 = 15000;
	client.character.state._oUnknown42 = 15000;
	client.character.state._oUnknown43 = 15000;
	client.character.state._oUnknown44 = 15000;
	client.character.state._oUnknown45 = 15000;
	client.character.state._oUnknown46 = 15000;
	client.character.state._oUnknown47 = 15000;
	client.character.state._oUnknown48 =15000;
	client.character.state._oUnknown49 =15000;
	client.character.state._oUnknown50 =15000;
	client.character.state._oUnknown51 =15000;
	client.character.state._oUnknown52 =15000;
	client.character.state._oUnknown53 =15000;
	client.character.state._oUnknown54 =15000;
	client.character.state._oUnknown55 =15000;
	client.character.state._oUnknown56 =15000;
	client.character.state._oUnknown57 =15000;
	client.character.state._oUnknown58 =15000;
	client.character.state._oUnknown59 =15000;
	client.character.state._oUnknown60 =15000;
	client.character.state._oUnknown61 =15000;
	client.character.state._oUnknown62 =15000;
	client.character.state._oUnknown63 =15000;
	client.character.state._oUnknown64 =15000;
	client.character.state._oUnknown65 =15000;
	client.character.state._oUnknown66 =15000;
	client.character.state._oUnknown67 =15000;
	client.character.state._oUnknown68 =15000;
	client.character.state._oUnknown69 =15000;
	client.character.state._oUnknown70 =15000;
	client.character.state._oUnknown71 =15000;
	client.character.state._oUnknown72 =15000;
	client.character.state._oUnknown73 =15000;
	client.character.state._oUnknown74 =15000;
	client.character.state._oUnknown75 =15000;
	client.character.state._oUnknown76 =15000;
	client.character.state._oUnknown77 =15000;
	client.character.state._oUnknown78 =15000;
	client.character.state._oUnknown79 =15000;
	client.character.state._oUnknown80 =15000;
	client.character.state._oUnknown81 =15000;
	client.character.state._oUnknown82 =15000;
	client.character.state._oUnknown83 =15000;
	client.character.state._oUnknown84 =15000;
	client.character.state._oUnknown85 =15000;
	client.character.state._oUnknown86 =15000;
	client.character.state._oUnknown87 =15000;
	client.character.state._oUnknown88 =15000;
	client.character.state._oUnknown89 =15000;
	client.character.state._oUnknown90 =15000;
	client.character.state._oUnknown91 =15000;
	client.character.state._oUnknown92 =15000;
	client.character.state._oUnknown93 =15000;
	client.character.state._oUnknown94 =15000;
	client.character.state._oUnknown95 =15000;
	client.character.state._oUnknown96 =15000;
	client.character.state._oUnknown97 =15000;
	client.character.state._oUnknown98 =15000;
	client.character.state._oUnknown99 =15000;
	client.character.state._oUnknown100 =15000;
	client.character.state._oUnknown101 =15000;
	client.character.state._oUnknown102 =15000;
	client.character.state._oUnknown103 =15000;
	client.character.state._oUnknown104 =15000;
	client.character.state._oUnknown105 =15000;
	client.character.state._oUnknown106 =15000;
	client.character.state._oUnknown107 =15000;
	client.character.state._oUnknown108 =15000;
	client.character.state._oUnknown109 =15000;
	client.character.state._oUnknown110 =15000;
	client.character.state._oUnknown111 =15000;
	client.character.state._oUnknown112 =15000;
	client.character.state._oUnknown113 =15000;
	client.character.state._oUnknown114 =15000;
	client.character.state._oUnknown115 =15000;
	client.character.state._oUnknown116 =15000;
	client.character.state._oUnknown117 =15000;
	client.character.state._oUnknown118 =15000;
	client.character.state._oUnknown119 =15000;
	client.character.state._oUnknown120 =15000;
	client.character.state._oUnknown121 =15000;
	client.character.state._oUnknown122 =15000;
	client.character.state._oUnknown123 =15000;
	client.character.state._oUnknown124 =15000;
	client.character.state._oUnknown125 =15000;
	client.character.state._oUnknown126 =15000;
	client.character.state._oUnknown127 =15000;
	client.character.state._oUnknown128 =15000;
	client.character.state._oUnknown129 =15000;
	client.character.state._oUnknown130 =15000;
	client.character.state._oUnknown131 =15000;  
	client.character.state._oUnknown132 =15000;
	client.character.state._oUnknown133 =0; // red pvp buff add's dmg def hitrage ( only works for 60 min with red pvp pill)
	client.character.state._oUnknown134 =0; // blue pvp buff (think pvp buff/exp/cp ) '' '' ''   with blue pvp pill
	client.character.state._oUnknown135 =15000;
	client.character.state._oUnknown136 =15000;
	client.character.state._oUnknown137 =15000; 
	client.character.state._oUnknown138 =15000; 
	client.character.state._oUnknown139 =1; // Gold elite buff ( appears using Gold elites (2 stages higher from regular m33 elites))
	client.character.state._oUnknown140 =1; // payeol tag (title needs to wear blue set elite items)(2x option...?)
	client.character.state._oUnknown141 =1000; // CP Tag wich can be made from cp option menu ( 1 value point = 1 cp) Style lvl 1 title from 100cp Wargod max title at 1000 cp
	client.character.state._oUnknown142 =0; // makes charcater torso dissapear no clue why
	client.character.state._oUnknown143 =1; // pet buff ( only works with red pet pill 180 min per pill)
	client.character.state._oUnknown144 =1; // payeol tag (title needs to wear blue set elite items)( title gets from cp)
	client.character.state._oUnknown145 =15000; 
}))
