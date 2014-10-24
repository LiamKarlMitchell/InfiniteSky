GMCommands.AddCommand(new Command('invite',0,function command_giveexp(string,client){
	if (string.length===0) {
		client.sendInfoMessage("Example Usage: /invite player");
		return;
	}

	if(string.length > packets.CharName_Length){
		client.sendInfoMessage("Invited player name is too long");
		return;
	}

	var InvitedSocket = world.findCharacterSocket(string);
	if(!InvitedSocket){
		client.sendInfoMessage("Invited player does not exists or is offline");
	}else{
		if(InvitedSocket.character.Clan === client.character.Clan){
			if(InvitedSocket.character.Party){
				if(client.character.Party.leader.character.Name === client.character.Name)
					client.sendInfoMessage(InvitedSocket.character.Name + " is already in the party");
				else client.sendInfoMessage("You are not a party leader");
			}else{
				var pObj = world.findParty(client.character.Name);
				var pObjFounded = true;
				if(!pObj){
					pObj = new partyObject();
					pObj.addLeader(client);
					world.Party.push(pObj);
					pObjFounded = false;
				}
				
				if(pObj.leader.character.Name === client.character.Name){
					client.character.Party = pObjFounded ? pObj : world.findParty(client.character.Name);
					client.character.Party.addInvited(InvitedSocket.character.Name);
					
					InvitedSocket.write(new Buffer(packets.sendRequestToJoingParty.pack({
						"PacketID": 0x33,
						"CharacterName": client.character.Name
					})));
				}else{
					client.sendInfoMessage("You are not a party leader");
				}
			}
		}else{
			client.sendInfoMessage("Invited player does not exists or is offline");
		}
	}
	
	// console.log(packets.RequestRespond);
	// console.log(socket.character.Name);
}));