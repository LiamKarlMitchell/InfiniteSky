// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY


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

if(typeof global.Zone !== 'undefined')
vms('Monster', [
	'Structs'
], function() {
	Zone.send.MonsterStatePacket = restruct.
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
    int32lu('CurrentHP');

	var Monster = function(id) {
		if(typeof global.MonsterNextID === 'undefined') global.MonsterNextID = 0;

		this.MonsterID = id;

		this.CurrentHP = 0;
		this.MaxHP = 0;

		this.Stance = 0;
		this.Skill = 0;
		this.Frame = 0;
		this.Location = new CVec3();
		this.LocationTo = new CVec3();
		this.Direction = 0;

		this.NodeID = null;
		this.UniqueID = ++Zone.UniqueID;
		this.FacingDirection = 0;

		this.Target = null;

		this.node = null;
		this.info = null;
		this.motion = null;
		this.motionFrames = 0;

		this.isAlive = false;

		console.log("Created monster ("+id+")");
	}

	Monster.prototype.getPacket = function() {
		if(this.motionFrames){
			this.Frame = this.motionFrames / this.motion[this.Skill+1].length * (new Date().getTime() - this.motionStart);
		}
		return packets.makeCompressedPacket(0x1A, new Buffer(Zone.send.MonsterStatePacket.pack(this)));
	};

	Monster.prototype.setNode = function(node){
		this.node = node;
		this.NodeID = node.id;
	};

	Monster.prototype.spawn = function(location){
		this.Location = location.copy();
		this.node.update();
		this.CurrentHP = 0;

		this.transition(1, function(){
			this.isAlive = true;
			this.CurrentHP = this.MaxHP;
			Zone.sendToAllAreaLocation(this.Location, config.network.viewable_action_distance, this.getPacket());
		});

		Zone.sendToAllAreaLocation(this.Location, config.network.viewable_action_distance, this.getPacket());
	};

	Monster.prototype.hit = function(amount){
		if(!this.isAlive) return;

		this.CurrentHP -= amount;
		if(!this.CurrentHP){
			this.die();
		}
	};

	Monster.prototype.die = function(){
		this.Skill = 12;
		this.Frame = 0;
		this.isAlive = false;
		// TODO: Add drop items.

		this.transition(13, function(){
			Zone.QuadTree.remove(this.node);
			Zone.Monsters.splice(Zone.Monsters.indexOf(this), 1);
		});

		Zone.sendToAllAreaLocation(this.Location, config.network.viewable_action_distance, this.getPacket());
	};

	Monster.prototype.transition = function(nextSkill, callback){
		this.motionFrames = this.motion[this.Skill+1].frames;
		this.motionStart = new Date().getTime();
		setTimeout((function(nextSkill, callback){
			this.Skill = nextSkill;
			this.motionFrames = 0;
			if(typeof callback === 'function') callback.call(this);

		}).bind(this, nextSkill, callback), this.motion[this.Skill+1].length);
	};

	Monster.prototype.despawn = function(){
		this.Skill = 19;
		this.Frame = 0;
		this.CurrentHP = 0;
		this.isAlive = false;

		this.transition(20, function(){
			Zone.QuadTree.remove(this.node);
		});
		Zone.sendToAllAreaLocation(this.Location, config.network.viewable_action_distance, this.getPacket());
	};

	Monster.prototype.setInfos = function(info){
		this.info = info;
		console.log("Health:", info.Health);
		this.MaxHP = info.Health;
		this.ModelID = info.ModelID;
		this.motion = config.motion_monster[info.ModelID];
	};

	global.MonsterObj = Monster;
});
