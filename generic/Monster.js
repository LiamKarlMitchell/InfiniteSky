// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms.depends({Name: 'Monster', depends: [
	'structs',
	'AIObject',
	'AttackerCollection',
	'infos.Monster.Loaded'
	] }, function() {
if (typeof(Monster_Prototype)==='undefined') {
	Monster_Prototype = {};
}

Monster_Prototype.StatePacket = restruct.
    //int8lu('Status').
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

Monster = function Monster(ID) {
	this.info = infos.Monster[ID];
	if (!this.info) {
		dumpError(new Error('Monster ID '+ID+' does not exist in Monster Info.'));
		return null;
	}

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
}

Monster.prototype = Monster_Prototype;

Monster_Prototype.getPacket = function() {
	return packets.makeCompressedPacket(0x1A, new Buffer(this.StatePacket.pack(this)));
}

Monster_Prototype.onDelete = function() {
	// Remove references/timers we might have
	clearInterval(this.updateInterval);
	this.Clear();
	Attackers.Clear();
	this.delete();
}


Monster_Prototype.getOnlineAliveAttackers = function() {
		var attackers = this.Attackers.sort();
		var tmp = [];
		var a = null;

		if (attackers.length) {
			for (var i in attackers) {
				a = zone.QuadTree.nodesHash[attackers[i].ID];
				if (a && a.type === 'client') {
					if (a.object.character.state.CurrentHP > 0) {
						tmp.push({
							index: i,
							ID: a.id,
							client: a.object,
							Damage: attackers[i].Damage,
						});
					}
				}
			}
		}
		return tmp;
	}

Monster_Prototype.fullHeal = function() {
	this.HP = this.info.Health;
}

Monster_Prototype.onDeath = function(Killer) {
		if (Killer) {
			// Killed by player, monster, npc?
			switch (typeof(Killer.constructor.name)) {
			case "monster":
				break;
			case "npc":
				break;
			case "client":
				// Handle Item Drop and Giving EXP/Silver/CP
				break;
			default:
				// Do nothing probably gm or script/world event kill.
				break;
			}
		}
	}
});