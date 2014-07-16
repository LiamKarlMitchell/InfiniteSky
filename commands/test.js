// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: test
// Used to test
GMCommands.AddCommand(new Command('test', 80, function(string, client) {

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
	client.character.state._oUnknown4 =  1;
	client.character.state._oUnknown5 =  1;
	client.character.state._oUnknown6 =  1;
	client.character.state._oUnknown7 =  1;
	client.character.state._oUnknown8 =  1;
	client.character.state._oUnknown9 =  1;
	client.character.state._oUnknown10 = 1;
	client.character.state._oUnknown11 = 1;
	client.character.state._oUnknown12 = 1;
	client.character.state._oUnknown13 = 1;
	client.character.state._oUnknown14 = 1;
	client.character.state._oUnknown15 = 1;
	client.character.state._oUnknown16 = 1;
	client.character.state._oUnknown17 = 1;
	client.character.state._oUnknown18 = 1;
	client.character.state._oUnknown19 = 1;
	client.character.state._oUnknown20 = 1;
	client.character.state._oUnknown21 = 1;
	client.character.state._oUnknown22 = 1;
	client.character.state._oUnknown23 = 1;
	client.character.state._oUnknown24 = 1;
	client.character.state._oUnknown25 = 1;
	client.character.state._oUnknown26 = 1;
	client.character.state._oUnknown27 = 1;
	client.character.state._oUnknown28 = 1;
	client.character.state._oUnknown29 = 1;
	client.character.state._oUnknown30 = 1;
	client.character.state._oUnknown31 = 1;
	client.character.state._oUnknown32 = 1;
	client.character.state._oUnknown33 = 1;
	client.character.state._oUnknown34 = 1;
	client.character.state._oUnknown35 = 1;
	client.character.state._oUnknown36 = 1;
	client.character.state._oUnknown37 = 1;
	client.character.state._oUnknown38 = 1;
	client.character.state._oUnknown39 = 1;
	client.character.state._oUnknown40 = 1;
	client.character.state._oUnknown41 = 1;
	client.character.state._oUnknown42 = 1;
	client.character.state._oUnknown43 = 1;
	client.character.state._oUnknown44 = 1;
	client.character.state._oUnknown45 = 1;
	client.character.state._oUnknown46 = 1;
	client.character.state._oUnknown47 = 1;
	client.character.state._oUnknown48 =1;
	client.character.state._oUnknown49 =1;
	client.character.state._oUnknown50 =1;
	client.character.state._oUnknown51 =1;
	client.character.state._oUnknown52 =1;
	client.character.state._oUnknown53 =1;
	client.character.state._oUnknown54 =1;
	client.character.state._oUnknown55 =1;
	client.character.state._oUnknown56 =1;
	client.character.state._oUnknown57 =1;
	client.character.state._oUnknown58 =1;
	client.character.state._oUnknown59 =1;
	client.character.state._oUnknown60 =1;
	client.character.state._oUnknown61 =1;
	client.character.state._oUnknown62 =1;
	client.character.state._oUnknown63 =1;
	client.character.state._oUnknown64 =1;
	client.character.state._oUnknown65 =1;
	client.character.state._oUnknown66 =1;
	client.character.state._oUnknown67 =1;
	client.character.state._oUnknown68 =1;
	client.character.state._oUnknown69 =1;
	client.character.state._oUnknown70 =1;
	client.character.state._oUnknown71 =1;
	client.character.state._oUnknown72 =1;
	client.character.state._oUnknown73 =1;
	client.character.state._oUnknown74 =1;
	client.character.state._oUnknown75 =1;
	client.character.state._oUnknown76 =1;
	client.character.state._oUnknown77 =1;
	client.character.state._oUnknown78 =1;
	client.character.state._oUnknown79 =1;
	client.character.state._oUnknown80 =1;
	client.character.state._oUnknown81 =1;
	client.character.state._oUnknown82 =1;
	client.character.state._oUnknown83 =1;
	client.character.state._oUnknown84 =1;
	client.character.state._oUnknown85 =1;
	client.character.state._oUnknown86 =1;
	client.character.state._oUnknown87 =1;
	client.character.state._oUnknown88 =1;
	client.character.state._oUnknown89 =1;
	client.character.state._oUnknown90 =1;
	client.character.state._oUnknown91 =1;
	client.character.state._oUnknown92 =1;
	client.character.state._oUnknown93 =1;
	client.character.state._oUnknown94 =1;
	client.character.state._oUnknown95 =1;
	client.character.state._oUnknown96 =1;
	client.character.state._oUnknown97 =1;
	client.character.state._oUnknown98 =1;
	client.character.state._oUnknown99 =1;
	client.character.state._oUnknown100 =1;
	client.character.state._oUnknown101 =1;
	client.character.state._oUnknown102 =1;
	client.character.state._oUnknown103 =1;
	client.character.state._oUnknown104 =1;
	client.character.state._oUnknown105 =1;
	client.character.state._oUnknown106 =1;
	client.character.state._oUnknown107 =1;
	client.character.state._oUnknown108 =1;
	client.character.state._oUnknown109 =1;
	client.character.state._oUnknown110 =1;
	client.character.state._oUnknown111 =1;
	client.character.state._oUnknown112 =1;
	client.character.state._oUnknown113 =1;
	client.character.state._oUnknown114 =1;
	client.character.state._oUnknown115 =1;
	client.character.state._oUnknown116 =1;
	client.character.state._oUnknown117 =1;
	client.character.state._oUnknown118 =1;
	client.character.state._oUnknown119 =1;
	client.character.state._oUnknown120 =1;
	client.character.state._oUnknown121 =1;
	client.character.state._oUnknown122 =1;
	client.character.state._oUnknown123 =1;
	client.character.state._oUnknown124 =1;
	client.character.state._oUnknown125 =1;
	client.character.state._oUnknown126 =1;
	client.character.state._oUnknown127 =1;
	client.character.state._oUnknown128 =1;
	client.character.state._oUnknown129 =1;
	client.character.state._oUnknown130 =1;
	client.character.state._oUnknown131 =1;
	client.character.state._oUnknown132 =1;
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
	
}));

GMCommands.AddCommand(new Command('run', 80, function(string, client) {
	// client.character.state._Unknown1 = 1;	
	// RUnning flag?


	client.character.state._oUnknown135 =0;
	client.character.state._oUnknown136 =0;
	client.character.state._oUnknown137 =0; 
	client.character.state._oUnknown138 =0; 
	client.character.state._oUnknown145 =0; 
	client.character.state.UsedSkill = 0;
	
	client.write(client.character.state.getPacket());
}));
