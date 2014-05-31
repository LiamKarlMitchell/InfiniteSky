if(world.Party === undefined){
	world.Party = [];
}

world.findParty = function(leader_name){
	for(var i=0; i<world.Party.length;i++){
		if(world.Party[i] && world.Party[i].leader.character.Name === leader_name){
			return world.Party[i];
			break;
		}
	}
	return null;
};

world.deleteParty = function(leader_name){
	for(var i=0; i<world.Party.length;i++){
		if(world.Party[i] && world.Party[i].leader.character.Name === leader_name){
			world.Party.splice(i, 1);
			break;
		}
	}
	return null;
};

var read1D = restruct.
string('CharacterName', 13).
pad(8);

var sendRequestToJoingParty = restruct.
int8lu('PacketID').
string('CharacterName', 13);

packets.sendRequestToJoingParty = restruct.
int8lu('PacketID').
string('CharacterName', 13);

var recvAskToJoin = restruct.
string('CharacterName', 13).
int8lu('Result').
int32lu('Unk1').
int32lu('Unk2');

var recvAskerPressOk = restruct.
string('Name', 13).
int32lu('Unk1').
int32lu('Unk2');

var JoinParty = restruct.
int8lu('PacketID').
string('Name', 13);

var LeaveParty = restruct.
int8lu('PacketID'). // 0x26
string('Name', 13);

var BreakParty = restruct.
int8lu('PacketID');

var removeParty = restruct.
int8lu('PacketID');

var showPartyCharacterName = restruct.string("CharacterName", 13);
var showParty = restruct. //Total = 79
int8lu("PacketID").
string("LeaderName", 13).
string("Name", 13).
struct('Characters', showPartyCharacterName, 4);


var party = restruct.
int8lu("PacketID").
pad(77);

var partyObject = function(){
	this.characters = [];
	this.invitedCharacters = [];
	this.leader = null;
	
	this.addLeader = function(socket){
		this.leader = socket;
		this.addCharacter(socket);
	};
	
	this.addInvited = function(character_name){
		this.invitedCharacters.push(character_name);
	};
	
	this.removeInvited = function(character_name){
		for(var i=0; i<this.invitedCharacters.length; i++){
			if(this.invitedCharacters[i] && this.invitedCharacters[i] === character_name){
				this.invitedCharacters.splice(i,1);
				console.log(">Invitation instance removed");
				break;
			}
		}
	};
	
	this.isInvited = function(character_name){
		for(var i=0; i<this.invitedCharacters.length; i++){
			if(this.invitedCharacters[i] && this.invitedCharacters[i] === character_name){
				return true;
			}
		}
		return false;
	};
	

	this.addCharacter = function(socket){
		this.removeInvited(socket.character.Name);
		
		if(this.characters.length+1 > 5){
			console.log("[Hack attepmpt] The party tried to add >5 player to the group")
			return;
		}
		
		for(var i=0; i<this.characters.length; i++){
			if(this.characters[i]){

				this.characters[i].write(new Buffer(
					JoinParty.pack(
						{
							"PacketID": 0x25,
							"Name": socket.character.Name
						}
					)
				));
			}
		}
		
		this.characters.push(socket);
	};
	
	this.logoutCharacter = function(name){
		for(var i=0; i<this.characters.length;i++){
			if(this.characters[i] && this.characters[i].character.Name && this.characters[i].character.Name !== this.leader.character.Name && this.characters[i].character.Name === name){
				this.characters.splice(i, 1);
				
				for(var i=0; i<this.characters.length;i++){
					if(this.characters[i]){

						this.characters[i].write(new Buffer(
							LeaveParty.pack({
								"PacketID": 0x26,
								"Name": name
							})
						));
	
					}
				}
				
				if(this.characters.length <= 1)
					this.disband();
				
				break;
			}
		}
	};
	
	this.removeCharacter = function(name){
		for(var i=0; i<this.characters.length;i++){
			if(this.characters[i] && this.characters[i].character.Name && this.characters[i].character.Name !== this.leader.character.Name && this.characters[i].character.Name === name){
				this.characters[i].character.state.InParty = 0;
				this.characters[i].character.state.setFromCharacter(this.characters[i].character);	

				this.characters[i].write(new Buffer(
					showParty.pack({
						"PacketID": 0x28
					})
				));

				this.characters[i].write(new Buffer(
					BreakParty.pack({
						"PacketID": 0x29
					})
				));
				
				this.characters[i].character.Party = null;
				this.characters.splice(i, 1);
				
				for(var i=0; i<this.characters.length;i++){
					if(this.characters[i]){

						this.characters[i].write(new Buffer(
							LeaveParty.pack({
								"PacketID": 0x26,
								"Name": name
							})
						));
	
					}
				}
				
				if(this.characters.length <= 1)
					this.disband();
				
				break;
			}
		}
	};
	
	this.disband = function(){
		for(var i=0; i<this.characters.length;i++){
			if(this.characters[i]){
				
				if(this.characters[i].character.state.InParty){
					this.characters[i].character.state.InParty = 0;
					this.characters[i].character.state.setFromCharacter(this.characters[i].character);	
				}
				

				this.characters[i].write(new Buffer(
					showParty.pack({
						"PacketID": 0x28
					})
				));


				this.characters[i].write(new Buffer(
					BreakParty.pack({
						"PacketID": 0x29
					})
				));
	
				
				this.characters[i].character.Party = null;
			}
		}
		
		world.deleteParty(this.leader.character.Name);
	};
	// string("LeaderName", 13).
	// string("LeaderName2", 13).
	// string("Name", 13).
	// struct('Characters', showPartyCharacterName, 3);
	this.broadcastPartyNames = function(){
		if(this.characters.length > 0){
			var restruct = {};
			
			restruct.PacketID = 0x28;
			restruct.LeaderName = this.leader.character.Name;
			restruct.Name = this.leader.character.Name;
			
			for(var i=0; i<this.characters.length; i++){
				if(this.characters[i]){
					var obj = this.characters[i].character;

					restruct.Characters = [];
					
					for(var j=0; j<this.characters.length; j++){
						if(this.characters[j]){
							var obj2 = this.characters[j].character;
							if(obj2.Name !== this.leader.character.Name)
								restruct.Characters.push({CharacterName: obj2.Name});
							
						}
					}

					this.characters[i].write(new Buffer(showParty.pack(restruct)));
					
					if(!this.characters[i].character.state.InParty){
						this.characters[i].character.state.InParty = 1;
						this.characters[i].character.state.setFromCharacter(this.characters[i].character);	
					}
				}
			}
		}	
	};
	
	this.broadcastMessage = function(message){
		if(this.characters.length > 0){
			for(var i=0; i<this.characters.length; i++){
				if(this.characters[i]){
						
				}
			}
		}	
	};
};

WorldPC.Set(0x1D, {
	Restruct: read1D,
	function: function handlePartyInvite(client, input){
		var InvitedSocket = world.findCharacterSocket(input.CharacterName);
		if(!InvitedSocket){

		}else{
			if(InvitedSocket.character.Clan === client.character.Clan){
				var pObj = world.findParty(client.character.Name);
				var pObjFounded = true;
				if(!pObj){
					pObj = new partyObject();
					pObj.addLeader(client);
					world.Party.push(pObj);
					pObjFounded = false;
				}
				
				client.character.Party = pObjFounded ? pObj : world.findParty(client.character.Name);
				client.character.Party.addInvited(InvitedSocket.character.Name);
				
				InvitedSocket.write(new Buffer(sendRequestToJoingParty.pack({
					"PacketID": 0x33,
					"CharacterName": client.character.Name
				})));
			}else{
				Inviter.write(new Buffer(RequestRespond.pack(
					{
						"PacketID": 0x35,
						"Name": client.character.Name,
						"Result": 3
					}
				)));
			}
		}
	}
});

var RequestRespond = restruct.
int8lu("PacketID").
string('Name', 13).
int8lu('Result');

packets.RequestRespond = restruct.
int8lu("PacketID").
string('Name', 13).
int8lu('Result');

var InviterRespondTest = restruct. // Total = 78 bytes
int8lu("PacketID").
int32lu("Unk1").
int32lu("Unk2").
int32lu("Unk3").
int8lu("Unk4").
int32lu("Unk5").
int32lu("Unk6").
int32lu("Unk7").
int8lu("Unk8").
pad(48).
string("Unk9", 2).
int8lu("Unk10");

WorldPC.Set(0x12, {Size: 8, function: function partyDisbanded(client){
	console.log( client.character.Name + " disbanding the party");
	var pObj = client.character.Party.leader.character.Name === client.character.Name ? true : false;
	if(pObj){
		console.log(client.character.Name + " is the leader of the party");
		client.character.Party.disband();
	}
}});
WorldPC.Set(0x0F, {Size: 8, function: function leaveParty(client){
	var isLeader = client.character.Party && client.character.Party.leader.character.Name === client.character.Name;
	console.log(client.character.Name + " is leaving the " + client.character.Party.leader.character.Name + " party.");
	if(!isLeader){
		client.character.Party.removeCharacter(client.character.Name);
	}
}});
WorldPC.Set(0x1F, {
	Restruct: recvAskToJoin,
	function: function JoinPartyRequest(client, input){
		console.log("Inviter: "+input.CharacterName);
		console.log("Client: " + client.character.Name);
		
		var Inviter = world.findCharacterSocket(input.CharacterName);

		if(!Inviter){
			console.log("No inviter?");
		}else{
			var pObj = world.findParty(input.CharacterName);
			if(pObj && pObj.isInvited(client.character.Name)){
				console.log("Party is founded");
				if(client.character.Party){
					console.log("He has party somehow?");
					pObj.removeInvited(client.character.Name);
					Inviter.write(new Buffer(RequestRespond.pack(
						{
							"PacketID": 0x35,
							"Name": client.character.Name,
							"Result": 3
						}
					)));
				}else if(input.Result === 0){
					Inviter.write(new Buffer(RequestRespond.pack(
						{
							"PacketID": 0x35,
							"Name": client.character.Name,
							"Result": 0
						}
					)));
					
					pObj.addCharacter(client);
					pObj.broadcastPartyNames();
					client.character.Party = pObj;
				}else if(input.Result === 1){
					pObj.removeInvited(client.character.Name);
					Inviter.write(new Buffer(RequestRespond.pack(
						{
							"PacketID": 0x35,
							"Name": client.character.Name,
							"Result": 1
						}
					)));
				}else{
					console.log("Some input result does not match?");
				}
			}else{
				console.log("No party object with leader name " + input.CharacterName);
			}
		}
	}
});

WorldPC.Set(0x1E, {
	Restruct: recvAskerPressOk,
	function: function recvAskerPressCancel(client, input){
		console.log("Press ok func");
		console.log(input);
	}
});

var unknownPacket0E = restruct.
string("Name", 13).
pad(8);

var PartyChatRecv = restruct.
string('Name', 13).
string('Leader', 13).
string('Message', packets.MessageLength).
pad(9);

WorldPC.Set(0x0A, {
	Restruct: PartyChatRecv,
	function: function PartyChatRecv(client, input){
		var pObj = world.findParty(input.Leader);
		if(!pObj) return;
		if(client.character.Name !== input.Name) return;
		
		client.sendInfoMessage("Party chat not yet implemented");
	}
});