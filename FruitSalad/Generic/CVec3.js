// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/**
 * CVec3 Module
 * @exports Generic/CVec3
 */

vms('CVec3', [], function(){

/**
 * [CVec3 description]
 * @param {Number} X
 * @param {Number} Y
 * @param {Number} Z
 * @constructor
 */
function CVec3(X,Y,Z) {
	this.X=X || 0;
	this.Y=Y || 0;
	this.Z=Z || 0;
};

/**
 * A cached value to assist in converting degrees to radians.
 */
var deg2rad = Math.PI/180;

/**
 * A cached value to assist in converting radians to degrees.
 */
var rad2deg = 180/Math.PI;

CVec3.prototype = {

	/**
	 * Sets the XYZ to the same value.
	 * @param {Number} n The number to set them to.
	 */
	setN: function CVec3_setN(n) {
		this.X=n;
		this.Y=n;
		this.Z=n;
	},

	/**
	 * Set the XYZ to another objects XYZ.
	 * @param {CVec3|object} other The other object.
	 */
	set: function CVec3_set(other) {
		this.X=other.X;
		this.Y=other.Y;
		this.Z=other.Z;
	},

	/**
	 * Return a clone of the CVec3 Object.
	 * @return {CVec3} A copy.
	 */
	copy: function CVec3_copy() {
		return new CVec3(this.X,this.Y,this.Z);
	},

	/**
	 * Divide this CVec3 by another CVec3.
	 * @param  {CVec3} other The other CVec3.
	 */
	divide: function CVec3_divide(other){
		this.X = this.X/other.X;
		this.Y = this.Y/other.Y;
		this.Z = this.Z/other.Z;
	},

	/**
	 * Add the other into this.
	 * @param  {CVec3} other The other CVec3.
	 */
	add: function CVec3_add(other) {
		this.X+=other.X;
		this.Y+=other.Y;
		this.Z+=other.Z;
	},

	/**
	 * Subtract the other from this.
	 * @param  {CVec3} other The other CVec3.
	 */
	subtract: function CVec3_subtract(other) {
		this.X-=other.X;
		this.Y-=other.Y;
		this.Z-=other.Z;
	},

	/**
	 * Return a vector of the difference between this and another CVec3.
	 * @param  {CVec3} other The other CVec3.
	 * @return {CVec3} The result.
	 */
	getVectorDifference: function CVec3_getVectorDifference(other) {
		var n = new CVec3();
		n.X = this.X-other.X;
		n.Y = this.Y-other.Y;
		n.Z = this.Z-other.Z;
		return n;
	},

	/**
	 * Return the distance between this and another CVec3 as a number..
	 * @param  {CVec3} other The other CVec3.
	 * @return {Number} The result.
	 */
	getDifference: function CVec3_getDifference(other) {
		return Math.sqrt(
			((other.X - this.X)*(other.X - this.X)) +
			((other.Y - this.Y)*(other.Y - this.Y)) +
			((other.Z - this.Z)*(other.Z - this.Z))
			);
	},

	/**
	 * Takes distance and an angle in degrees and moves in that direction by the distance.
	 * @param  {Number} distance The length to move.
	 * @param  {Number} angle    The angle to move on (in degrees).
	 */
	moveInDirection: function CVec3_moveInDirection( distance, angle )
	{
	   angle *= deg2rad;
	   this.X += distance * Math.cos(angle);
		   this.Z += distance * Math.sin(angle);
	},

	/**
	 * Return the absolute distance between this and another CVec3 as a number..
	 * This will always be a positive value.
	 * @param  {CVec3} other The other CVec3.
	 * @return {Number} The result.
	 */
	getDistance: function CVec3_getDistance(other) {
		return Math.abs(this.getDifference(other));
	},

	/**
	 * Gets the 2D direction in degrees. Ignores the Y value.
	 * @param  {CVec3} other The other CVec3.
	 * @return {Number}       The 2D direction between the vectors.
	 */
	get2DDirection: function CVec3_get2DDirection(other)
	{
		return Math.atan2(other.X - this.X, other.Z - this.Z) * rad2deg;
	},

	/**
	 * Applys a 3D Velocity to this vector with the time delta.
	 * @param  {CVec3} velocity The velocity vector. This should probably be normalized.
	 * @param  {Number} delta    The amount of time to move by.
	 */
	apply3DVelocity: function CVec3_apply3DVelocity(velocity,delta)
	{
		this.X += velocity.X*delta;
		this.Y += velocity.Y*delta;
		this.Z += velocity.Z*delta;
	},

	/**
	 * Applys a 2D Velocity to this vector with the time delta. Ignores the Y value.
	 * @param  {CVec3} velocity The velocity vector. This should probably be normalized.
	 * @param  {Number} delta    The amount of time to move by.
	 */
	apply2DVelocity: function CVec3_apply2DVelocity(velocity,delta)
	{
		this.X += velocity.X*delta;
		this.Z += velocity.Z*delta;
	},

	/**
	 * Returns a string of the CVec3.
	 * @return {String} To two DP for each coordinate seperated with ', '.
	 */
	toString: function CVec3_toString() {
		return this.X.toFixed(2)+', '+this.Y.toFixed(2)+', '+this.Z.toFixed(2);
	},

	/**
	 * Calls the toString method, to help with console.inspect.
	 * @return {String}
	 */
	inspect: function() {
		return this.toString();
	}
}

global.CVec3 = CVec3;
});
