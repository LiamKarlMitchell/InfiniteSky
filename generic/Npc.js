// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms.depends({Name: 'Npc', depends: [
	'Structs',
	// 'AIObject',
	// 'AttackerCollection',
	'Info_Npc'
	] }, function() {
if (typeof(Npc_Prototype)==='undefined') {
	Npc_Prototype = {};
}

// console.log("test");

Npc_Prototype.StatePacket = restruct.
	int32lu('UniqueID').
	int32lu('ID').
	int32lu('OtherID').
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
	int32lu('HP');

Npc = function Npc(ID) {
	this.info = infos.Npc[ID];
	if (!this.info) {
		dumpError(new Error('NPC ID '+ID+' does not exist in Npc Info.'));
		return null;
	}

	AIObject.call(this);
	this.Attackers = new AttackerCollection();

	this.UniqueID = 0; // Set to node.id we receive from QuadTree
	this._ID = 0; // Faction ID?
	this.OtherID = ID;

	this.Life = 1;
	this.Stance = 0;
	this.Skill = 0;
	this.Frame = 0;
	this.Location = new CVec3();
	this.LocationTo = new CVec3();
	this.Direction = 0;
	this.TargetDirection = 0;
	this.TargetObjectIndex = -1;

	this.FacingDirection = 0;
	this.HP = 1; // Find out max hp for this Npc and set it.
}

Npc.prototype = Npc_Prototype;


Npc_Prototype.getPacket = function() {
	return packets.makeCompressedPacket(0x19, new Buffer(this.StatePacket.pack(this)));
}

Npc_Prototype.onDelete = function() {
	// Remove references/timers we might have
	clearInterval(this.updateInterval);
}

});