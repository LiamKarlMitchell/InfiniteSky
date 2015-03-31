// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: giveexp
// Gives you experience points
var respond = restruct.
int8lu('PacketID').
int32lu('CharacterID').
int32lu('NodeID').
int8lu('LevelsGained');

// console.log(respond.size);

GMCommands.AddCommand(new Command('xp',0,function command_giveexp(string,client){
	if (string.length==0) { client.sendInfoMessage("Example Usage: /giveexp 10");
							return;}
	// Get Amount from string
	var Value = parseInt(string);
	if (isNaN(Value)) {
		client.sendInfoMessage("Example Usage: /giveexp 10");
			return;
	}

    // client.character.state.Skill = 0;
    // client.character.state.Stance = 0;
    // client.character.state.Frame = 0;
    // client.write(client.character.state.getPacket());
    // console.log("Sending respond", client.node.id);

	// clietn.character.
	// ///console.log(Value);
	client.giveEXP(Value);
	// client.character.save();
	// client.send2FUpdate();

	// client.write(new Buffer(respond.pack({
	//     PacketID: 0x2E,
	//     LevelsGained: 145,
	//     CharacterID: client.character._id,
	//     NodeID: client.node.id
	// })));

 //    client.Zone.sendToAllArea(client, true, new Buffer(respond.pack({
	//     PacketID: 0x2E,
	//     LevelsGained: 145,
	//     CharacterID: client.character._id,
	//     NodeID: client.node.id
 //    })), config.viewable_action_distance);

	// // client.sendInfoMessage("You have "+client.character.Experience+" EXP");


	// var expInfo = infos.Exp[client.character.Level];
	// if(!expInfo){

	// 	return;
	// }

	// var reminder = expInfo.EXPEnd - Value;

	// var levelGained = 0;
	// while(reminder <= 0){
	// 	levelGained++;
	// 	if((client.character.Level + levelGained) > 145){
	// 		console.log("Exceeding the range of level info");
	// 		return;
	// 	}
	// 	expInfo = infos.Exp[client.character.Level + levelGained];
	// 	if(!expInfo){
	// 		console.log("No exp info somehow");
	// 		return;
	// 	}
	// 	reminder = expInfo.EXPEnd + reminder;
	// }

	// client.character.Level += levelGained;
	// client.character.Experience += Value;

	// // console.log("Giving "+ Value + " experience");
	// client.character.save();

 //    var update = {
 //        'PacketID': 0x2F,
 //        'Level': 145,
 //        'Experience': 222222222222
 //    };
 //    //eyes.inspect(update);
 //    client.write(new Buffer(packets.HealingReplyPacket.pack(update)));

 	// client.send2FUpdate();

 	// console.log(client.send2FUpdate.toString());
}));