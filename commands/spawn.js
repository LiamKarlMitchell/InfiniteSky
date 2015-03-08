// Monster_Prototype.StatePacket


var MonsterStatePacket = restruct.
    //int8lu('Status').
    int32lu('UniqueID').
    int32lu('NodeID').
    int32lu('MonsterID').
    int32lu('Life').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    int32lu('Unknown3',3).
    float32l('Direction').
    float32l('TargetDirection').
    int32ls('TargetObjectIndex').
    int32lu('Unknown3',4).
    struct('LocationTo',structs.CVec3).
    float32l('FacingDirection').
    int32lu('Health');


var companionObject = function(monsterID, client){
	this.Location = {};
    this.Location.X = client.character.state.Location.X;
    this.Location.Y = client.character.state.Location.Y;
    this.Location.Z = client.character.state.Location.Z;
	// this.Location.X = client.character.state.Location;
	this.LocationTo = client.character.state.Location;
	this.client = client;

	this.Skill = 0;

	// If the mob has 0 hp, it cannot be targetted.

	// 0 = spawn
	// 1 - 3= idle
	// 4 = move
	// 5 - 7 = on dmg
	// 8 - 10 = on hit
	// 11 = stun
	// 12 - 15 = dead animation, and waits to be finished off
	// 16 = waits to be finished off, used when dead animation is done, on state update so there will be no glitches
	// 17 = dead animation I think, when hp 0 the mob is untargetable
	// 18 = dead animation, and waits to be finsihed off
	// 19 = despawn
	// 20 = underfloor


	this.UniqueID = 140;
	this.NodeID = 2;
	this.MonsterID = monsterID;
	this.Health = infos.Monster[monsterID].Health;
	this.statePacket = MonsterStatePacket;
	this.FacingDirection = 360;
	this.TargetDirection = 0;
	this.TargetObjectIndex = 0;
	this.Direction = 0;
	this.Frame = 0;
}

companionObject.prototype.move = function(direction, FacingDirection, location, locationTo){
	this.Skill = 4;
	this.Location = location;
	this.LocationTo = locationTo;
	this.FacingDirection = direction;
	this.Direction = direction;
}

companionObject.prototype.getPacket = function(){
	// var packet = new Buffer(MonsterStatePacket.pack({
	// 	UniqueID: 140, // For addressing the monster we want from packet to change their state
	// 	NodeID: 2, // For queries
	// 	MonsterID: 842,
	// 	Life: 0,
	// 	Stance: 2,
	// 	Skill: 4, // 0 Makes animation for spawn
	// 	Frame: 0,
	// 	Location: client.character.state.Location,
	// 	Direction: 0,
	// 	TargetDirection: 0,
	// 	TargetObjectIndex: 0,
	// 	LocationTo: client.character.state.LocationNew,
	// 	FacingDirection: 360,
	// 	HP: 1
	// }));
	
	var packet = packets.makeCompressedPacket(0x1A, new Buffer(MonsterStatePacket.pack(this)));
	if(this.Skill === 0) this.Skill = 1;
	return packet;
}

GMCommands.AddCommand(new Command('spawn',0,function command_send(string,client){
	console.log('Spawning a companion');

	client.character.companion = new companionObject(842, client);
	client.write(client.character.companion.getPacket());
	// client.Zone.sendToAllArea(client, true, client.character.companion.getPacket(), config.viewable_action_distance);
}));

GMCommands.AddCommand(new Command('remove',0,function command_send(string,client){
	// console.log('Spawning a companion');

	client.character.companion = null;
	// client.Zone.sendToAllArea(client, true, client.character.companion.getPacket(), config.viewable_action_distance);
}));