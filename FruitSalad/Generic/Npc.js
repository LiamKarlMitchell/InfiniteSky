// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms('Npc', [
	'Structs'
], function() {
	if(typeof global.NpcNextID === 'undefined') global.NpcNextID = 0;
	var Npc = function(data) {
		// this.info = infos.Npc[ID];
		// if (!this.info) {
		// 	dumpError(new Error('NPC ID '+ID+' does not exist in Npc Info.'));
		// 	return null;
		// }
// npc.ID = this.NPCNextID;

// this.NPCNextID++;

// if (this.NPCNextID > this.NPCMaxLength) {
// 	this.NPCNextID = 0; // Could find next free slot and if none free overwrite older items?
// 	// Quick sort ftw.
// }

// npc.Location.set(spawninfo.Location);
// npc.FacingDirection = spawninfo.Direction;
		this.UniqueID = 0; // Set to node.id we receive from QuadTree
		this._ID = global.NpcNextID; // Faction ID?
		global.NpcNextID++;
		this.OtherID = data.ID;

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
		this.HP = 1; // Find out max hp for this Npc and set it.

		this.NpcStatePacket = restruct.
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

		// console.log("Added Npc:", ID);
	}

	Npc.prototype.getPacket = function() {
		return packets.makeCompressedPacket(0x19, new Buffer(this.NpcStatePacket.pack(this)));
	};

	Npc.prototype.setNode = function(node){
		if(!node){
			return;
		}
		this.UniqueID = node.id;
	};

	global.Npc = Npc;
});