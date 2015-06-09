// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms('ItemObj', [], function() {
	if(typeof global.ItemObjNextID === 'undefined') global.ItemObjNextID = 0;
	global.ItemObj = function(){
		this.NodeID = 0;
		this.UniqueID = ++global.ItemObjNextID;
		this.Location = new CVec3();
		this.OwnerName = '';
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
			self.remove();
		}, 20000);

		this.unk = 1;
		this.Enchant = 0;
		this.Combine = 0;


		this.StatePacket = restruct.
		    int32lu('NodeID'). // +2
		    int32lu('UniqueID'). // +6
		    int32lu('ItemObjID'). // +10
		    int32lu('unk').
		    int32lu('unk').
		    int32lu('unk').
		    int32lu('Amount').
		    int8lu('Enchant').
		    int8lu('Combine').
		    int16lu('unk').
		    struct('Location',structs.CVec3).
		    int32lu('unk').
		    int32lu('unk').
		    int32lu('unk').
		    int32lu('unk').
		    int32lu('unk').
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

	global.ItemObj.prototype.setOwner = function(name){
		this.OwnerName = name;
	};

	global.ItemObj.prototype.setObj = function(invItem){
		this.obj = clone(invItem, false);
		if(invItem.Enchant) this.Enchant = invItem.Enchant;
		if(invItem.Combine) this.Combine = invItem.Combine;
		if(invItem.Amount) this.Amount = invItem.Amount;
		if(invItem.ID) this.ItemObjID = invItem.ID;
		delete this.obj.Column;
		delete this.obj.Row;
	};

	global.ItemObj.prototype.setLocation = function(location){
		this.Location.set(location);
	};

	global.ItemObj.prototype.remove = function(){
		clearTimeout(this.deleteTimmer);
        var found = Zone.QuadTree.query({ CVec3: this.Location, radius: config.network.viewable_action_distance, type: ['client'] });
        for(var i=0; i<found.length; i++){
            var f = found[i];
            f.object.write(this.getPacket());
        }
		console.log("Clearing item from the floor #" + this.NodeID);
		Zone.QuadTree.removeNode(this.node);
	};
});