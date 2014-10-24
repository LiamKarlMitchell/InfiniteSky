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

WorldPC.Set(0x19, {
	Restruct: ReadUsedItem,
	function: function makeIt(client, input){
		console.log("Skill: " + infos.Skill[input.SkillID]);

		if(client.character.state.CurrentChi > 0 && client.character.state.CurrentChi >= input.ChiUsage && input.ChiUsage <= client.character.state.CurrentChi){
			console.log("Skill consumed CHI");
			var skillInfo = infos.Skill[input.SkillID];
			if(!skillInfo){
				console.log("Skill info not found");
				return;
			}
			
			var Modifiers = skillInfo.ModifiersStart;
			
			// console.log(Modifiers);
			
			client.character.state.DisplayBuffs = 1;
			
			//client.character.state.CurrentChi -= input.ChiUsage;
            client.character.state.SkillID = input.SkillID;
			client.character.state.SkillLevel = input.SkillLevel;

			client.character.state.Stance = 0;
			if (input.SkillID === 2) {
				client.character.state.Skill = 32;
			}
			//client.character.state.Skill = input.SkillID;
			client.character.state.Frame = 0;
			// var amount;
			// var BuffCode;
			// var unk;
			
			// switch(input.SkillID){
			// 	case 25:
			// 	amount = Math.round(Modifiers.DamageIncreased*100);
			// 	BuffCode = 11;
			// 	break;
				
			// 	case 30:
			// 	amount = Math.round(Modifiers.IncreasedDamage*100);
			// 	BuffCode = 0;
			// 	break;
				
			// 	case 26:
			// 	amount = Math.round(Modifiers.IncreasedDamage*100);
			// 	BuffCode = 23;
			// 	break;
				
			// 	case 82:
			// 	amount = Math.round(Modifiers.DegreeOfDefensiveSkill*100);
			// 	BuffCode = 14;
			// 	unk = 10;
			// 	break;
				
			// 	case 83:
			// 	amount = Math.round(Modifiers.EnchancedChanceToDeadlyBlow*100);
			// 	BuffCode = 15;
			// 	break;
				
			// 	case 84:
			// 	amount = Math.round(Modifiers.IncreasedLuck*100);
			// 	BuffCode = 16;
			// 	break;
				
			// 	case 103:
			// 	console.log("HRR");
			// 	amount = Math.round(Modifiers.ChanceToReturnDamage*100);
			// 	BuffCode = 21;
			// 	break;
				
			// 	case 104:
			// 	amount = Math.round(Modifiers.IncreasedAcupressureDefense*100);
			// 	BuffCode = 22;
			// 	break;
			// }
			
			// var time = Modifiers.EffectiveDuration * 100;
			
			// console.log("Amount: " + amount + ", Time: " + time);

			// console.log("Setting the buff into state");
		
			
			//console.log(Modifiers);
			// var buffer = new Buffer(applyBuffRespond.pack({
			// 	PacketID: 0x2d,
			// 	Unk: 0,
			// 	Unk1: 0,
			// 	Unk2: 0
			// }));
			// client.write(buffer);

			client.sendInfoMessage('Using Skill '+input.SkillID);
			client.write(client.character.state.getPacket());
		}
	}
});

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

WorldPC.Set(0x7a, {
	Restruct: a7Restruct,
	function: function(client, input){
		// console.log("Unknown Packet 0x7a: ", input);
	}
});

var applyBuff = restruct.
int32lu('SkillID').
int32lu('SkillLevel').
int32lu('Unk3').
int32lu('Unk4').
int32lu('Unk5');

var applyBuffRespond = restruct.
	int8lu('PacketID').
	int32lu('Unk').
	int32lu('Unk1').
	int32lu('Unk2').
	pad(96);


WorldPC.Set(0x18, {
	Restruct: applyBuff,
	function: function(client, input){
		console.log('After the buff is applied?');
	
		// 0 = Soaring Power
		// 1 = Godly Firewall
		// 2
		// 3 = Huricane Winds?
		// 4
		// 5
		// 6
		// 7
		// 8
		// 9 = Music of the Wind
		// 10
		// 11 = Invisible Arrows
		// 12 = Drunk Buff
		// 13
		// 14 = Heavenely Shield
		// 15 = Heavenely Blow
		// 16 = Gurda Song
		// 17
		// 18
		// 19
		// 20
		// 21
		
		var buffID;
		switch(input.SkillID){
			case 84:
			buffID = 16;
			break;
			
			case 83:
			buffID = 15;
			break;
			
			case 82:
			buffID = 14;
			break;
			
			case 105:
			
			break;
			
			case 34:
			buffID = 1;
			break;
			
			case 30:
			buffID = 0;
			break;
			
			case 38:
			buffID = 9;
			break;
			
			case 25:
			buffID = 11;
			break;
			
			case 82:
			// We need to change restruct here to be able to apply the "stacks" of the HS
			buffID = 14;
			break;
			
			case 83:
			buffID = 15;
			break;
			
			case 84:
			buffID = 16;
			break;
			
			default:
			console.log("This buff is not coded yet");
			return;
			break;
		}
			
		client.character.state.Buffs[buffID] = {'Time': 600, 'Amount': 600};
		client.write(client.character.state.getPacket());
		
		// console.log("Preparing the buff");			
		
		// if(input.SkillID !== client.character.state.SkillID){
		// 	console.log("ID Does not match");
		// 	return;
		// }
		// // Maybe loop it every 200 ms to check if applied, after 3 tires return error or disconnect the player
		
		// var skillInfo = infos.Skill[input.SkillID];
		// if(!skillInfo){
		// 	console.log("Skill info not found");
		// 	return;
		// }
		
		// var Modifiers = skillInfo.ModifiersStart;
		
		// if(!Modifiers){
		// 	console.log("No modifiers");
		// 	return;
		// }
		
		
		// console.log(Modifiers);
		
		// var amount;
		// var BuffCode;
		// var Unk;
		// switch(input.SkillID){
		// 	case 25:
		// 	amount = Math.round(Modifiers.DamageIncreased*100);
		// 	BuffCode = 11;
		// 	break;
			
		// 	case 30:
		// 	amount = Math.round(Modifiers.IncreasedDamage*100);
		// 	BuffCode = 0;
		// 	break;
			
		// 	case 26:
		// 	amount = Math.round(Modifiers.IncreasedDamage*100);
		// 	BuffCode = 1;
		// 	break;
			
		// 	case 82:
		// 	amount = Math.round(Modifiers.DegreeOfDefensiveSkill*100);
		// 	BuffCode = 14;
		// 	Unk = 8;
		// 	break;
			
		// 	case 83:
		// 	amount = Math.round(Modifiers.DegreeOfDefensiveSkill*100);
		// 	BuffCode = 14;
		// 	break;
		// }
	
		
		// if(amount === undefined || BuffCode === undefined){
		// 	console.log("No amount or buff code");
		// 	return;
		// }
	
		// var time = Modifiers.EffectiveDuration*100;
		
		// console.log("Amount: " + amount + ", Time: " + time);

		// console.log("Setting the buff into state");
		
		// if(Unk)
		// client.character.state.Buffs[BuffCode] = {'Time': time, 'Unk': Unk};
		// else client.character.state.Buffs[BuffCode] = {'Time': time, 'Amount': amount};

		// client.write(client.character.state.getPacket());

		
		// if(client.character.state.applyingBuffTime) return;
		// setTimeout(function(){
		// 	client.character.state.applyingBuffTime = false;
		// 	console.log("Global cooldown reseted");
		// }, 2000);
			
		// client.character.state.applyingBuffTime = true;
		// console.log(input);
		// var buffer = new Buffer(applyBuffRespond.pack({
		// 	PacketID: 0x2d,
		// 	Unk: input.Unk1,
		// 	Unk1: input.Unk2,
		// 	Unk2: input.Unk3
		// }));
		
		// console.log(hexy(buffer));
		
		// client.write(buffer);
		
		// client.character.state._Unknown4 = [3000, 102];
		// client.character.state._Unknown1 = [3000, 102]; // Time, Percentage 100 = 0
		// client.character.state._Unknown4 = [3000, 102]; // Time, Percentage 100 = 0
		// client.character.state._Unknown13 = [3000, 102]; // Drunk	
		// client.character.state._Unknown15 = [3000, 102]; // HS
		
		// Gurda song test on using skill
		// client.character.state.Buffs[16].Time = 3000;
		// client.character.state.Buffs[16].Amount = 3000;

		// client.character.state._Unknown22 = [3000, 102]; // HR?
		//  client.character.state._Unknown23 = [3000, 102];
		// client.write(client.character.state.getPacket());
	}
});

// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   8E 08 00 00   4A 00 00 00   E0 AB 09 00 
// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   93 08 00 00   4A 00 00 00   E0 AB 09 00         
// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   93 08 00 00   47 00 00 00   E0 AB 09 00  
// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   8D 08 00 00   47 00 00 00   E0 AB 09 00        
// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   8C 08 00 00   46 00 00 00   E0 AB 09 00
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   76 08 00 00   40 00 00 00   E0 AB 09 00 
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   81 08 00 00   40 00 00 00   E0 AB 09 00     
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   64 08 00 00   40 00 00 00   E0 AB 09 00         
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   6F 08 00 00   40 00 00 00   E0 AB 09 00
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   7A 08 00 00   40 00 00 00   E0 AB 09 00          
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   85 08 00 00   40 00 00 00   E0 AB 09 00     
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   90 08 00 00   40 00 00 00   E0 AB 09 00     
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   93 08 00 00   40 00 00 00   E0 AB 09 00     

// Jumping
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   1E 08 00 00   40 00 00 00   E0 AB 09 00    
// 2F    66 00 00 00   D0 EB F7 05   00 00 00 00   6F 10 00 00   29 08 00 00   40 00 00 00   E0 AB 09 00  

// Wpe pro fujin     
// 2F    91 00 00 00   94 D3 F2 48   00 00 00 00   44 29 00 00   CA 13 00 00   00 00 00 00   00 00 00 00 
// 2F    91 00 00 00   94 D3 F2 48   00 00 00 00   44 29 00 00   5F 12 00 00   00 00 00 00   00 00 00 00 
// 2F    91 00 00 00   94 D3 F2 48   00 00 00 00   44 29 00 00   88 12 00 00   00 00 00 00   00 00 00 00 
// 2F    91 00 00 00   94 D3 F2 48   00 00 00 00   44 29 00 00   49 14 00 00   00 00 00 00   00 00 00 00 
// 2F    66 00 00 00   5B 46 F8 05   00 00 00 00   6F 10 00 00   E6 07 00 00   5E 00 00 00   E0 AB 09 00  

// Seems like wrong packet... too random!