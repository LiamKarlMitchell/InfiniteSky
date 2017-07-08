// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms('Npc', [
	'Structs'
], function() {
	if(typeof Zone !== 'undefined') Zone.send.npcStatePacket = restruct.
		int32lu('NodeID').
		int32lu('UniqueID').
		int32lu('NpcID').
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

	var Npc = function(data) {
		this.UniqueID = ++Zone.UniqueID;
		this.NodeID = 0;
		this.NpcID = data.ID;

		this.Life = 1;
		this.Stance = 0;
		this.Skill = 0;
		this.Frame = 0;
		this.Location = new CVec3();
		this.Location.set(data.Location);
		this.LocationTo = new CVec3();
		this.Direction = 0;
		this.TargetDirection = 0;
		this.TargetObjectIndex = -1;

		this.FacingDirection = data.Direction;
		this.HP = 1;
	};

	Npc.prototype.getPacket = function() {
		return packets.makeCompressedPacket(0x19, new Buffer(Zone.send.npcStatePacket.pack(this)));
	};

	Npc.prototype.setNode = function(node){
		if(!node){
			return;
		}
		this.NodeID = node.id;
		Zone.NpcNodesHashTable[this.NpcID] = node;
	};

	global.Npc = Npc;
});
