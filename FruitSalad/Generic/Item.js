// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms('ItemObj', [], function() {
	if(typeof global.ItemObjNextID === 'undefined') global.ItemObjNextID = 0;
	global.ItemObj = function(){
		this.NodeID = 0;
		this.UniqueID = ++global.ItemObjNextID;
		this.Location = new CVec3();
		this.OwnerName = 'Ane';
		this.ItemObjID = 0;
		this.Amount = 0;
		this.JustSpawned = 1;
		var self = this;
		setTimeout(function(){
			self.JustSpawned = 0;
		}, 1000);
		this.obj = null;
		this.Rotation = Math.round(Math.random()*360);

		this.deleteTimmer = setTimeout(function(){
			console.log("removed item");
			self.remove();
		}, 5000);

		this.StatePacket = restruct.
		    int32lu('NodeID').
		    int32lu('UniqueID').
		    int32lu('ItemObjID').
		    int32lu('Life').
		    int32lu('unknown1').
		    int32lu('Enchant').
		    int32lu('Amount').
		    int32lu('Combine').
		    struct('Location',structs.CVec3).
		    string('OwnerName',Zone.CharName_Length+1).
		    pad(3).
		    float32l('Rotation').
		    float32l('Rotation').
		    int32lu('JustSpawned');
	}

	global.ItemObj.prototype.getPacket = function(){
		return packets.makeCompressedPacket(0x1B, new Buffer(this.StatePacket.pack(this)));
	};

	global.ItemObj.prototype.setNode = function(node){
		this.node = node;
		this.NodeID = node.id;
	};

	global.ItemObj.prototype.setObj = function(invItem){
		this.obj = clone(invItem, false);
		if(invItem.Enchant) this.Enchant = invItem.Enchant;
		if(invItem.Combine) this.Combine = invItem.Combine;
		if(invItem.Amount) this.Amount = invItem.Amount;
		if(invItem.ID) this.ItemObjID = invItem.ID;
		delete this.obj.Column;
		delete this.obj.Row;

		console.log(this.obj);
	};

	global.ItemObj.prototype.setLocation = function(location){
		this.Location.set(location);
	};

	global.ItemObj.prototype.remove = function(){
		Zone.QuadTree.removeNode(this.node);
	};


	// ItemObj = function ItemObj(info) {
	// 	this.OwnerName = '';
	// 	this.Enchant = 0;
	// 	this.Combine = 0;

	// 	if (typeof(info) === 'number') {
	// 		info = { ID: info };
	// 	} else {
	// 		this.OwnerName = info.Owner || '';
	// 		this.Enchant = info.Enchant || 0;
	// 		this.Combine = info.Combine || 0;
	// 	}

	// 	this.info = infos.ItemObj[info.ID];
	// 	if (!this.info) {
	// 		dumpError(new Error('ItemObj ID '+ID+' does not exist in ItemObj Info.'));
	// 		return null;
	// 	}

	// 	this.UniqueID = 0; // Set to node.id we receive from QuadTree
	// 	this._ID = 0; // Faction ID?

	// 	this.ItemObjID = info.ID || 1;
	// 	this.Amount = info.Amount || 1;

	// 	this.Life = 1;
	// 	this.Frame = 0;
	// 	this.Location = new CVec3();
	// 	this.Direction = 0;
	// 	this.FacingDirection = Math.round(Math.random()*360);
	// 	this.HP = 1; // Find out max hp for this ItemObj and set it.
	// 	this.JustSpawned = 1;
	// };

	// ItemObj.prototype = ItemObj_Prototype;


	// ItemObj_Prototype.getPacket = function() {
	// 	return packets.makeCompressedPacket(0x1B, new Buffer(this.StatePacket.pack(this)));
	// }

	// ItemObj_Prototype.onDelete = function() {
	// 	// Remove references/timers we might have
	// 	clearInterval(this.updateInterval);
	// 	clearTimeout(this.itemDeathTimer);
	// 	clearTimeout(this.itemOwnerTimer);
	// 	// TODO: clear timeout for the owner removal timer.
	// }

});