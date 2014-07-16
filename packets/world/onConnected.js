// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldServerInfoPacket = restruct.
	int8lu('packetID').
	string('encdata',16);

WorldPC.onConnected = function (socket) {
	// Send server info to client here... we don't really seem to have actuall data usage for this
	socket.write(new Buffer(WorldServerInfoPacket.pack({
		packetID: 0x00
	})));

	socket.afterPacketsHandled = function afterPacketsHandled() {
		if(!socket.authenticated){
			return;
		}
		
		socket.send2FUpdate();
		// socket.timeOuts = {};
		// socket.timeOuts.Buffs = {};
		// socket.timeOuts.TotalBuffs = 0;
		
		// socket.timeOuts.RegenerateChi = function(){
		// 	clearTimeout(socket.timeOuts.ChiUpdate);
		// 	console.log("Current chi: " + socket.character.state.CurrentChi);
		// 	console.log("Max chi: " + socket.character.state.MaxChi);
		// 	if(socket.character.state.CurrentChi < socket.character.state.MaxChi){
		// 		var regenChiTick = 400;
		// 		if((socket.character.state.CurrentChi+regenChiTick) > socket.character.state.MaxChi){
		// 			socket.character.state.CurrentChi = socket.character.state.MaxChi;
		// 		}else{
		// 			socket.character.state.CurrentChi += regenChiTick;
		// 		}
		// 		console.log("Chi regenerated");
		// 		socket.send2FUpdate();
		// 	}else{
		// 		return;
		// 	}
		// };
		
		// socket.timeOuts.ChiUpdate = setTimeout(socket.timeOuts.RegenerateChi, 5000);
		
		// socket.character.timeOuts.ClearBuff = function(buffCode){
		// 	console.log("Buff cleared");
		// 	socket.character.state.Buffs[buffCode] = {};
		// 	socket.character.timeOuts.TotalBuffs--;
		// 	socket.character.timeOuts.Buffs[buffCode] = null;
		// 	console.log("Total buffs: " + socket.character.timeOuts.TotalBuffs);
		// 	if(!socket.character.timeOuts.TotalBuffs && socket.character.state.DisplayBuffs){
		// 		socket.character.state.DisplayBuffs = 0;
		// 	}
		// 	console.log("TEST: ", socket.character.timeOuts.Buffs[buffCode]);
		// 	socket.write(socket.character.state.getPacket());
		// };
			
		// socket.character.timeOuts.SetBuffTime = function(buffCode, time){
		// 	if(buffCode > 0){
		// 		if(!socket.character.state.DisplayBuffs) socket.character.state.DisplayBuffs = 1;
				
		// 		console.log("Buff setted");
		// 		console.log("BuffTimeout", socket.character.timeOuts.Buffs[buffCode]);
				
		// 		if(!socket.character.timeOuts.Buffs[buffCode]){
		// 			socket.character.timeOuts.TotalBuffs++;
		// 		}else{
		// 			clearTimeout(socket.character.timeOuts.Buffs[buffCode]);
		// 		}

				
		// 		socket.character.timeOuts.Buffs[buffCode] = setTimeout(function(){ return socket.character.timeOuts.ClearBuff(buffCode); }, time);
				
		// 	}
		// };
			
		
	}
}