// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var fs = require('fs');
var vm = require('vm');
var util = require('./util');
var vmscript = require('./vmscript');

function defaultPacketFunction(data) {

}

// Use Set to add a packet to the collection
// Usage:
// var p = new PacketCollection();

// // When packet is just packet id no data
// p.Set(0x00,{ function: function _Packet_00() {
// 	// Do something
// } });


// // When packet is going to use restruct/structure
// // Should use 
// p.Set(0x01,{
// 	Restruct: restruct.
// 		string('Name', 20).
// 		int32lu('Age'),
// 	function: function _Packet_01(p) {
// 	// Do something with p
// 	console.log(p.Name+' is '+p.Age+' years old.');

// } });

// // When packet is a id and size without restruct
// p.Set(0x02,{
// 	Size: 10, function: funciton _Packet_02(data) {
// 		// data will be a buffer with size of 10 bytes.
// 		console.log(data.toString());
// 	}
// });

// // If you don't know the function or data structure yet and just want to add it for starts so server dosnt complain.
// p.Set(0x03,{Size: 50});

// PacketCollection can watch a directory and you can pass a scope to it such as this
function PacketCollection(directory,PacketCollectionName) {
	this.LastAdded = null;

	global[PacketCollectionName] = this;
	
	this.Packets = {};
	this.Get = function(ID) {
		return this.Packets[ID] || null;
	}

	// This is for use with restruct, for using with regular buffer functions replace Restruct with a function to decode the packet data into object you can use.
	// Arguments for the function should be ID, Packet
	this.Set = function(ID,options) {
		var p = {ID: ID, function: defaultPacketFunction};
		
		if (options) {
			if (options.function) p.function = options.function;
			if (options.Restruct) p.Restruct = options.Restruct;
			if (options.Size) p.Size = options.Size;
			if (options.SizeFunction) p.SizeFunction = options.SizeFunction;
		}

		this.Packets[ID] = p;

		this.LastAdded = ID;
	}

	this.Remove = function(ID) {
		delete this.Packets[ID];
	}

	this.scripts = new vmscript(PacketCollectionName,directory);

};

module.exports = PacketCollection;

// TODO: Code in a way to have a variable packet size bassed on the packet data or some other value/function.
// 
// p.Set(0x00,{Sizefunction: function(data) {
// 	// data is access to buffer from the byte after packet id to end as much as we have recieved
// 	if (data.length>4) { // If room for packet size + data
// 		return  data.readUInt(0);
// 	}
// 	return null;
// }, function: function Custom_Packet(data) {
// 	// Do stuff with our chunk of data...
// }};