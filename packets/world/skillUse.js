var ReadUsedItem = restruct.
int32lu('ChiUsage').
int32lu('SkillID').
int32lu('SkillLevel').
int32lu('ChiUsage2').
int32lu('Unk5').
int32lu('Unk6');

var SendResponse = restruct.
int8lu('PacketID').
int8lu('Unk').
int32lu('Unk1').
int32lu('Unk2').
int32lu('Unk3').
pad(60);


var a7Restruct = restruct.
int32lu('Unk1').
int32lu('Unk2').
int32lu('Unk3').
int32lu('Unk4').
int32lu('Unk5').
int32lu('Unk6').
int32lu('Unk7').
int32lu('Unk8').
int32lu('Unk9').
int32lu('Unk10').
int32lu('Unk11').
int32lu('Unk12').
int32lu('Unk13').
int32lu('Unk14').
int32lu('Unk15').
int8lu('Unk16').
int8lu('Unk17');


var applyBuff = restruct.
int32lu('SkillID').
int32lu('SkillLevel').
int32lu('Slot').
int32lu('Unk4').
int32lu('Unk5');

var applyBuffRespond = restruct.
int8lu('PacketID').
int32lu('Unk').
int32lu('Unk1').
int32lu('Unk2').
pad(96);


// var buffsList = [105, 30, 103, 104, 26, 84, 83, 82, 7, 11, 19, 38, 34, 15, 45, 60, 53, 57, 49];

// var applyBuffFunctionTimeout = function(client, input){
// 	var buffID = null;
// 	var amount = 200;

// 	console.log("Applying buff: " + input.SkillID);

// 	switch(input.SkillID){

// 		case 25:
// 		case 6:
// 		case 44:
// 		buffID = 11;
// 		break;

// 		case 26:
// 		buffID = 3;
// 		break;

// 		case 7:
// 		buffID = 5;
// 		break;

// 		case 45:
// 		buffID = 13;
// 		break;

// 		case 30:
// 		case 15:
// 		case 53:
// 		buffID = 0;
// 		break;

// 		case 103:
// 		buffID = 19;
// 		break;

// 		case 104:
// 		buffID = 20;
// 		break;

// 		case 105:
// 		buffID = 21;
// 		break;

// 		case 84:
// 		buffID = 9;
// 		break;

// 		case 83:
// 		buffID = 15;
// 		break;

// 		case 82:
// 		buffID = 14;
// 		break;

// 		case 11:
// 		buffID = 1;
// 		break;

// 		case 19:
// 		case 38:
// 		case 57:
// 		buffID = 9;
// 		break;

// 		case 34:
// 		case 49:
// 		buffID = 1;
// 		break;

// 		default:
// 		console.log("Applying [ "+input.SkillID+" ] dont work yet, please report!");
// 		break;
// 	}

// 	if(buffID !== null){
// 		// console.log(infos.Skill[input.SkillID].ModifiersStart);
// 		// console.log(input);
// 		// console.log(modStart);
// 		// console.log(modEnd);

// 		// console.log(skillInfo);
// 		// console.log(modStart.EffectiveDuration);
// 		// console.log((modEnd.EffectiveDuration - modStart.EffectiveDuration));


// 		// var time = (modStart.EffectiveDuration + ((modEnd.EffectiveDuration - modStart.EffectiveDuration) * input.SkillLevel)) * 100;
// 		// var amount = modStart.EffectiveDuration + (difference * input.SkillLevel);
// 		// console.log(time);

// 		// var time = (modStart.EffectiveDuration*100);
// 		// console.log(time);

// 		if(buffID === 14)
// 		client.character.state.BuffHS = {'Time': 100, 'Amount': 200, 'Stacks': 5};
// 		else if(buffID >= 0 && buffID < 14)
// 		client.character.state.Buffs[buffID] = {'Time': 100, 'Amount': 22};
// 		else if(buffID > 14)
// 		client.character.state.Buffs2[buffID] = {'Time': 100, 'Amount': 22};


// 	    client.character.state.SkillID = 0;
// 		client.character.state.SkillLevel = 0;
// 		client.character.state.Frame = 0;
// 		client.character.state.Skill = client.character.state.OldSkill;
// 		// client.character.state.Stance = client.character.state.OldStance;
// 	}

// 	// client.character.state.Skill = client.character.state.FightingStance === undefined ? 4 : !client.character.state.FightingStance ? 4 : 3; // This applies the result character stance :)

// }


function newSkillUpdate(client, input){
	console.log(input);
	console.log("Applying Skill ID : " + input.SkillID);
	var skillInfo = infos.Skill[input.SkillID];

	if (!skillInfo) {
		client.sendInfoMessage('Skill '+input.SkillID+' not coded.');
		console.log('Skill '+input.SkillID+' not coded.');
		return;
	}
	console.log(skillInfo);

	var modStart = skillInfo.ModifiersStart;
	var modEnd = skillInfo.ModifiersEnd;

	console.log(modStart);
	console.log(modEnd);

	// console.log(client.character.SkillList);

	var hasSkill = null;
	for(var i=client.character.SkillList.length-1; i>0; i--){
		var skill = client.character.SkillList[i];
		if(!skill) continue;
		if(skill.ID === input.SkillID){
			hasSkill = skill;
			break;
		}
	}

	if(!hasSkill){
		console.log("The player used skill that was not in his SkillList!");
		return;
	}

	var cost = Math.round((modStart.ChiCost * 100) + ((((modEnd.ChiCost - modStart.ChiCost)*100)/skillInfo.MaxSkillLevel) * input.SkillLevel));
	console.log("Skill Cost: "+cost);

	var time = Math.round((modStart.EffectiveDuration * 100) + ((((modEnd.EffectiveDuration - modStart.EffectiveDuration)*100)/skillInfo.MaxSkillLevel) * input.SkillLevel));

	switch(input.Slot){
		case 4:
		console.log("Applying Increse Damage Once");
		var amount = Math.round((modStart.DamageIncreased * 100) + ((((modEnd.DamageIncreased - modStart.DamageIncreased)*100)/skillInfo.MaxSkillLevel) * input.SkillLevel));
		client.character.state.Buffs[11] = {'Time': time, 'Amount': amount};
		break;

		case 6:
		console.log("Applying Elemental Damage Increase");
		var amount = (modStart.Unk2 * 100) + ((((modEnd.Unk2 - modStart.Unk2)*100)/skillInfo.MaxSkillLevel) * input.SkillLevel);
		client.character.state.Buffs[3] = {'Time': time, 'Amount': amount};
		break;

		case 7:
		client.character.state.Buffs[13] = {'Time': time, 'Amount': 22};
		break;

		case 8:
		console.log("Applying Reflect Damage")
		// Reflect damage
		var amount = Math.round((modStart.ChanceToReturnDamage * 100) + ((((modEnd.ChanceToReturnDamage - modStart.ChanceToReturnDamage)*100)/skillInfo.MaxSkillLevel) * input.SkillLevel));
		console.log(amount);
		client.character.state.Buffs2[4] = {'Time': time, 'Amount': amount};
		break;

		case 9:
		client.character.state.Buffs2[5] = {'Time': time, 'Amount': 22};
		break;

		case 10:
		client.character.state.Buffs2[6] = {'Time': time, 'Amount': 22};
		break;

		case 12:
		console.log("Applying Damage Increase");

		var amount = Math.round((modStart.IncreasedDamage * 100) + ((( (modEnd.IncreasedDamage - modStart.IncreasedDamage) * 100 ) / skillInfo.MaxSkillLevel) * input.SkillLevel));
		client.character.state.Buffs[0] = {'Time': time, 'Amount': amount};
		break;

		case 17:
		client.character.state.BuffHS = {'Time': time, 'Amount': 200, 'Stacks': 5};
		break;

		case 18:
		client.character.state.Buffs2[0] = {'Time': time, 'Amount': 22};
		break;

		case 19:
		client.character.state.Buffs2[1] = {'Time': time, 'Amount': 22};
		break;
	}


	client.character.state.SkillID = client.character.state.OldSkill;
	client.character.state.SkillLevel = 0;
	client.character.state.Frame = 0;
	client.character.state.Skill = 0;

	client.Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
}

WorldPC.Set(0x19, {
	Restruct: ReadUsedItem,
	function: function makeIt(client, input){
		console.log('make it method');

		if(client.character.state.onSkillStateUpdate){
			client.character.state.onSkillStateUpdate = false;

	        client.character.state.SkillID = input.SkillID;
			client.character.state.SkillLevel = input.SkillLevel;

			client.Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
		}
	}
});

WorldPC.Set(0x18, {
	Restruct: applyBuff,
	function: function(client, input){
		console.log('apply buff method');
		newSkillUpdate(client, input);
	}
});


WorldPC.Set(0x7a, {
	Restruct: a7Restruct,
	function: function(client, input){
		// console.log('Client indicates that one of the buffs has runned out of the time, need to clear the state.'); // Used when the state of character buffs on client doesnt match with state sended by the server
	}
});
