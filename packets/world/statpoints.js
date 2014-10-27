// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var perPoint = 14.2880349;

var vitDeltaRounded = Math.round((perPoint * (93-1)) + 28);
var vitDelta = (perPoint * (93-1)) + 28;

console.log();
console.log("Should be : " + 1342);

console.log(vitDeltaRounded + " " + vitDelta);


WorldPC.KeyValueUnsigned = restruct.
int8lu('PacketID').
int32lu('Key').
int32lu('Value');

WorldPC.Set(0x16, {
	Restruct: restruct.
	int32lu('Key').
	int32lu('Value').
	int8lu('Unknown'),

	function: function SpendStatpoint(socket, pac) {
		if (socket.character.StatPoints == 0) return;

		//if (pac.Key==0x55)
		switch (pac.Key) {
		case 0:
		case 1:
		case 2:
		case 3:
			pac.Value = 1;
			break;
		case 4:
		case 5:
		case 6:
		case 7:
			pac.Value = 5;
			break;
		}

		// Check that they have StatPoints to spend
		if (socket.character.StatPoints < pac.Value) return;
		// Vit 3
		// Chi 1
		// Str 0
		// Dex 2
		switch (pac.Key) {
		case 0:
			// Str
			socket.character.StatStrength += pac.Value;
			socket.sendInfoMessage('Increment Str by ' + pac.Value);
			break;
		case 1:
			// Chi
			socket.character.StatChi += pac.Value;
			socket.sendInfoMessage('Increment Chi by ' + pac.Value);
			break;
		case 2:
			// Dex
			socket.character.StatDexterity += pac.Value;
			socket.sendInfoMessage('Increment Dex by ' + pac.Value);
			break;
		case 3:
			// Vit



			socket.character.StatVitality += pac.Value;

			// socket.character.StatVitality

			// var vit = 28;
			// var every = 4;
			// var nextJump = 0;
			// var increaseBy = 1;
			// var randomAdd = 37;
			// var firstRandom = true;
			// var every3I = 0;
			var perPoint = 14.281;

			var vitDeltaRounded = Math.round((perPoint * (socket.character.StatVitality-1)) + 28);
			var vitDelta = (perPoint * (socket.character.StatVitality-1)) + 28;


			console.log(vitDeltaRounded + " " + vitDelta);


			// console.log(Math.round((perPoint * (socket.character.StatVitality-1)) + 28));
			// for(var i=1; i < socket.character.StatVitality; i++){
				// console.log(i);
				// if(i === randomAdd){
				// 	every = 4;
				// 	nextJump = 0;
				// 	vit += 15;
				// 	randomAdd += i > 98 ? 32 : 31;
				// 	console.log(randomAdd);
				// 	console.log("Will be ")
				// 	// firstRandom = false;
				// 	console.log("Random add");
				// 	continue;
				// }

				// if(i < 3){
				// 	vit += 14;
				// }else if(i === 3){
				// 	vit += 15;
				// }else if(i < 6){
				// 	vit += 14;
				// }else if(i === 6){
				// 	vit += 15;
				// }else if(i > 6){
				// 	nextJump++;
				// 	if(every === 4 && nextJump === every){
				// 		every = 3;
				// 		nextJump = 0;
				// 		// every3I = 0;
				// 		// console.log("Every 4");
				// 		vit += 15;

				// 	}else if(every === 3 && nextJump === every){
				// 		// every3I++;
				// 		every = 4;
				// 		nextJump = 0;
				// 		// console.log("Every 3");
				// 		vit += 15;
				// 	}else{
				// 		// console.log("Normal");
				// 		vit += 14;
				// 	}
				// }

				// }else if(i === 37){
				// 	every = 4;
				// 	nextJump = 0;
				// 	vit += 15;
				// }else if(i > 37 && i <=67){
				// 	nextJump++;
				// 	if(every === 4 && nextJump === every){
				// 		every = 3;
				// 		nextJump = 0;
				// 		console.log("Every 4");
				// 		vit += 15;

				// 	}else if(every === 3 && nextJump === every){
				// 		every = 4;
				// 		nextJump = 0;
				// 		console.log("Every 3");
				// 		vit += 15;
				// 	}else{
				// 		console.log("Normal");
				// 		vit += 14;
				// 	}
				// }else if(i === 68){
				// 	every = 4;
				// 	nextJump = 0;
				// 	vit += 15;
				// }else if(i > 68 && < ){
				// 	console.log("More than 67");
				// 	nextJump++;
				// 	if(every === 4 && nextJump === every){
				// 		every = 3;
				// 		nextJump = 0;
				// 		console.log("Every 4");
				// 		vit += 15;

				// 	}else if(every === 3 && nextJump === every){
				// 		every = 4;
				// 		nextJump = 0;
				// 		console.log("Every 3");
				// 		vit += 15;
				// 	}else{
				// 		console.log("Normal");
				// 		vit += 14;
				// 	}
				// }

				// if(i < 3){
				// 	vit += 14;
				// }else if(i === 3){
				// 	vit += 15;
				// }else if(i < 6){
				// 	vit += 14;
				// }else if(i === 6){
				// 	vit += 15;
				// }else if(i > 16){
				// 	console.log("More than 18");
				// 	if(every === 4){
				// 		nextJump++;
				// 		if(nextJump === every){
				// 			vit += (15+increaseBy);
				// 			increaseBy++;
				// 			every = 3;
				// 			nextJump = 0;
				// 		}else{
				// 			vit += (14);
				// 		}
				// 	}else if(every === 3){
				// 		nextJump++;
				// 		if(nextJump === every){
				// 			vit += (15+increaseBy);
				// 			increaseBy++;
				// 			every = 4;
				// 		}else{
				// 			vit += (14);
				// 		}
				// 	}
				// }else if(every === 4){
				// 	nextJump++;
				// 	if(nextJump === every){
				// 		vit += 15;
				// 		every = 3;
				// 		nextJump = 0;
				// 	}else{
				// 		vit += 14;
				// 	}
				// }else if(every === 3){
				// 	nextJump++;
				// 	if(nextJump === every){
				// 		vit += 15;
				// 		every = 4;
				// 	}else{
				// 		vit += 14;
				// 	}
				// }
			// }

			// console.log(vit + ' current vit : ' + socket.character.StatVitality);

			socket.sendInfoMessage('Increment Vit by ' + pac.Value);
			break;
		case 4:
			// Str 5
			socket.character.StatStrength += pac.Value;
			socket.sendInfoMessage('Increment Str by ' + pac.Value);
			break;
		case 5:
			// Chi 5
			socket.character.StatChi += pac.Value;
			socket.sendInfoMessage('Increment Chi by ' + pac.Value);
			break;
		case 6:
			// Dex 5
			socket.character.StatDexterity += pac.Value;
			socket.sendInfoMessage('Increment Dex by ' + pac.Value);
			break;
		case 7:
			// Vit 5
			socket.character.StatVitality += pac.Value;
			socket.sendInfoMessage('Increment Vit by ' + pac.Value);
			break;

		default:
			socket.sendInfoMessage('Invalid statpoint allocation: ' + pac.Key);
			return;
			break;
		}

		socket.character.StatPoints -= pac.Value;
		socket.sendInfoMessage('StatPoints is now: '+socket.character.StatPoints);

		socket.write(new Buffer(WorldPC.KeyValueUnsigned.pack({
			PacketID: 0x84,
			Key: 0x37,
			// Hur?? koreans.
			Value: pac.Key
		})));

		// socket.character.updateInfos(false);
		// Update character state
		socket.character.state.setFromCharacter(socket.character);

		// socket.character.save();
	}
});

// Reset Stats 61