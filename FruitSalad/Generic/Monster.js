// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms('Monster', [
	'Structs'
], function() {
	if(typeof global.MonsterNextID === 'undefined') global.MonsterNextID = 0;
		var Monster = function(ID) {
		// this.info = infos.Monster[ID];
		// if (!this.info) {
		// 	dumpError(new Error('Monster ID '+ID+' does not exist in Monster Info.'));
		// 	return null;
		// }

		this.infos = {
			Damage: this.info.Damage,
			Defense: this.info.Defense,
			LightDamage: 0,
			ShadowDamage: 0,
			DarkDamage: 0,
		};

		AIObject.call(this);
		this.Attackers = new AttackerCollection();
		this.WalkSpeed = this.info.WalkSpeed;

		this.RunSpeed = this.info.RunSpeed;
		this.UniqueID = 0;
		this.OtherID = this.info.ID;

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
		this.MaxHP = this.info.Health;
		this.HP = this.info.Health;

		this.MonsterStatePacket = restruct.
		    int32lu('ID').
		    int32lu('UniqueID').
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

		// console.log("Added Monster:", ID);
	}

	Monster.prototype.getPacket = function() {
		return packets.makeCompressedPacket(0x1A, new Buffer(this.MonsterStatePacket.pack(this)));
	};

	Monster.prototype.setNode = function(node){
		if(!node){
			return;
		}
		this.UniqueID = node.id;
	};

	global.Monster = Monster;
});