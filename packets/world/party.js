if(world.Party === undefined){
	world.Party = [];
}


var read1D = restruct.
string('CharacterName', 13).
pad(8);

var sendRequestToJoingParty = restruct.
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
string('CharacterName', 13);

var LeaveParty = restruct.
int8lu('PacketID'). // 0x26
string('CharacterName', 13);

var showParty = restruct. //Total = 79
int8lu("PacketID").
string("Char1", 13).
string("Char2", 13).
string("Char3", 13).
string("Char4", 13).
string("Char5", 13).
string("Char6", 13);

console.log(showParty.size);

var party = restruct.
int8lu("PacketID").
pad(77);

var partyObject = function(){
	return {
		"Characters": [],
		"Leader": null
	}
}

WorldPC.Set(0x1D, {
	Restruct: read1D,
	function: function handlePartyInvite(client, input){
		var InvitedSocket = world.findCharacterSocket(input.CharacterName);
		if(!InvitedSocket){

		}else{
			var partyID = world.Party.length+1;
			client.character.Party = partyID;
			world.Party[partyID] = new partyObject();
			world.Party[partyID].Characters[0] = client;
			world.Party[partyID].Leader = 0;

			InvitedSocket.write(new Buffer(
				sendRequestToJoingParty.pack(
				{
					"PacketID": 0x33,
					"CharacterName": client.character.Name
				}
				)
			));
		}
	}
});

var RequestRespond = restruct.
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

WorldPC.Set(0x12, {Size: 8, function: function partyDisbanded(){

}});
WorldPC.Set(0x0F, {Size: 8, function: function leaveParty(){
	
}});
WorldPC.Set(0x1F, {
	Restruct: recvAskToJoin,
	function: function JoinPartyRequest(client, input){
		console.log("Inviter: "+input.CharacterName);
		console.log("Client: " + client.character.Name);
		console.log("Input: " + JSON.stringify(input));
		var Inviter = world.findCharacterSocket(input.CharacterName);
		if(!Inviter){

		}else{
			if(input.Result === 0){
				console.log("Writing respond to a inviter!");
				Inviter.write(new Buffer(RequestRespond.pack(
					{
						"PacketID": 0x35,
						"Name": client.character.Name,
						"Result": 0
					}
				)));

				client.character.state.InParty = 1;
				Inviter.character.state.InParty = 1;

				client.character.state.setFromCharacter(client.character);
				Inviter.character.state.setFromCharacter(Inviter.character);

					client.write(new Buffer(
						showParty.pack({
							"PacketID": 0x28,
							"Char1": Inviter.character.Name,
							"Char2": Inviter.character.Name,
							"Char3": client.character.Name,
							"Char4": Inviter.character.Name,
							"Char5": client.character.Name,
							"Char6": Inviter.character.Name
						})
					));

					Inviter.write(new Buffer(
						showParty.pack({
							"PacketID": 0x28,
							"Char1": Inviter.character.Name,
							"Char2": Inviter.character.Name,
							"Char3": client.character.Name,
							"Char4": Inviter.character.Name,
							"Char5": client.character.Name,
							"Char6": Inviter.character.Name
						})
					));
			}else if(input.Result === 1){

			}else{

			}
		}
	}
});

WorldPC.Set(0x1E, {
	Restruct: recvAskerPressOk,
	function: function recvAskerPressCancel(client, input){
		//console.log(input);
	}
});