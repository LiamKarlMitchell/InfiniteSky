// Work around discovered for using prototypes in a vmscript....
// They were not overwriting old objects prototypes.
// https://www.youtube.com/watch?v=QigNwFntPSY

vms.depends({Name: 'Item', depends: [
	'structs',
	'AIObject',
	'AttackerCollection',
	'infos.Item.Loaded'
	] }, function() {
if (typeof(Item_Prototype)==='undefined') {
	Item_Prototype = {};
}

Item_Prototype.StatePacket = restruct.
    int32lu('UniqueID').
    int32lu('SomeID').
    int32lu('ItemID').
    int32lu('Life').
    int32lu('unknown1').
    int32lu('Enchant').
    int32lu('Amount').
    int32lu('Combine').
    struct('Location',structs.CVec3).
    string('Owner_Name',packets.CharName_Length+1).
    int8lu('unknown3',3).
    int32lu('Rotation',2).
    int32lu('JustSpawned');


Item = function(info) {
	this.UniqueID = 0;
	this.SomeID = 0;
	this.ItemID = info.ID || 1;
	this.Amount = info.Amount || 1;
	this.Life = 0;
	//this.unknown1
	this.Enchant = 0;
	//this.unknown2
	this.Location = new CVec3();
	this.Owner_Name = info.Owner || '';
	//this.unknown3
	//this.Direction
	this.JustSpawned = 1;

	this.getPacket = function() {
		var packet = packets.makeCompressedPacket(0x1B, new Buffer(packets.ItemObject.pack(this)));
		return packet;
	}

	this.onDelete = function() {
		// Remove timers and intervals to free up references
		clearInterval(this.updateInterval);
	}

	this.setLocationRandomOffset = function(Location, Radius) {
		// Set the location to random spot in a circle? :D
	}
}

Item = function Item(info) {
	this.Owner_Name = '';
	this.Enchant = 0;
	this.Combine = 0;

	if (typeof(info) === 'number') {
		info = { ID: info };
	} else {
		this.Owner_Name = info.Owner || '';
		this.Enchant = info.Enchant || 0;
		this.Combine = info.Combine || 0;
	}

	this.info = infos.Item[info.ID];
	if (!this.info) {
		dumpError(new Error('Item ID '+ID+' does not exist in Item Info.'));
		return null;
	}

	this.UniqueID = 0; // Set to node.id we receive from QuadTree
	this._ID = 0; // Faction ID?

	this.ItemID = info.ID || 1;
	this.Amount = info.Amount || 1;

	this.Life = 1;
	this.Frame = 0;
	this.Location = new CVec3();
	this.Direction = 0;
	this.FacingDirection = 0;
	this.HP = 1; // Find out max hp for this Item and set it.
}

Item.prototype = Item_Prototype;


Item_Prototype.getPacket = function() {
	return packets.makeCompressedPacket(0x1B, new Buffer(this.StatePacket.pack(this)));
}

Item_Prototype.onDelete = function() {
	// Remove references/timers we might have
	clearInterval(this.updateInterval);
}

});