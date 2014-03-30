// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

function CVec3(X,Y,Z) {
	this.X=X || 0;
	this.Y=Y || 0;
	this.Z=Z || 0;
};

CVec3.prototype = {
	setN: function CVec3_setN(other) {
		this.X=other;
		this.Y=other;
		this.Z=other;
	},

	set: function CVec3_set(other) {
		this.X=other.X;
		this.Y=other.Y;
		this.Z=other.Z;
	},

	copy: function CVec3_copy() {
		return new CVec3(this.X,this.Y,this.Z);
	},

	divide: function CVec3_divide(other){
		var n = new CVec3();
		n.X = this.X/other.X;
		n.Y = this.Y/other.Y;
		n.Z = this.Z/other.Z;
		return n;
	},

	add: function CVec3_add(other) {
		this.X+=other.X;
		this.Y+=other.Y;
		this.Z+=other.Z;
	},

	subtract: function CVec3_subtract(other) {
		this.X-=other.X;
		this.Y-=other.Y;
		this.Z-=other.Z;
	},

	getVectorDifference: function CVec3_getVectorDifference(other) {
		var n = new CVec3();
		n.X = this.X-other.X;
		n.Y = this.Y-other.Y;
		n.Z = this.Z-other.Z;
		return n;
	},

	getDifference: function CVec3_getDifference(other) {
		return Math.sqrt(
			((other.X - this.X)*(other.X - this.X)) + 
			((other.Y - this.Y)*(other.Y - this.Y)) +
			((other.Z - this.Z)*(other.Z - this.Z))
			);
	},

	getDistance: function CVec3_getDistance(other) {
		return Math.abs(this.getDifference(other));
	},

	get2DDirection: function CVec3_get2DDirection(other)
	{
		// Uses Z because koreans..
		return Math.atan2(other.X - this.X, other.Z - this.Z) * (180 / Math.PI);
	},

	apply3DVelocity: function CVec3_apply3DVelocity(velocity,delta)
	{
		this.X += velocity.X*delta;
		this.Y += velocity.Y*delta;
		this.Z += velocity.Z*delta;
	},

	apply2DVelocity: function CVec3_apply2DVelocity(velocity,delta)
	{
		this.X += velocity.X*delta;
		//console.log(velocity.X+"MARK:");
		//this.Y += velocity.Y*delta; // Because korean
		this.Z += velocity.Z*delta;
	},	

	toString: function CVec3_toString() {
		return this.X.toFixed(2)+', '+this.Y.toFixed(2)+', '+this.Z.toFixed(2);
	},

	inspect: function() {
		return this.toString();
	}
}

module.exports = CVec3;