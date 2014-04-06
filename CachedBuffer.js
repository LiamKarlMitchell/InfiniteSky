// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
// Need to setup testing :).
var hexy = require('hexy').hexy;
var util = require('./util');
// function logHex(data) {
//   if (data===null || data.length==0) return;
//   console.log("\n");
//   console.log(data);
//   var testSplit = data.toString("hex");
//   console.log(testSplit);
//   testSplit = testSplit.match(/../g);
//   console.log(testSplit);
//   var lineVal = "";
//   var asciiVal = "";
//   var hexCounter = 0;
//   var c = "";
//   for(var i = 0; i < testSplit.length; i++) {
//     lineVal += testSplit[i] + " ";
//     c = String.fromCharCode(data[i]);
//     asciiVal += c;
//     hexCounter++;
//     if(hexCounter == 15) {
//       console.log(lineVal + ' - ' + asciiVal);
//       lineVal = "";
//       hexCounter = 0;
//     }
//   }
// }
// Should add in a way to test different packet id's.
var CachedBuffer = function(packet_collection, options) {
        this.BufferSize = 10240;
        this.HeaderSize = 9;
        this.PacketIDPos = 8;
        this.data = new Buffer(this.BufferSize); // 1MB Buffer Size ought to be enough?
        this.bufferLength = 0;
        this.badCount = 0;
        this.badLimit = 0;
        var onDataInProgress = false;
        if(options) {
            this.BufferSize = options.BufferSize;
            this.HeaderSize = options.HeaderSize;
            this.PacketIDPos = options.PacketIDPos;
            this.badLimit = options.badLimit;
        }
        // PacketIDPos should not be > HeaderSize
        this.onData = function(newData) {
            if(newData === null) return;
            var position = 0;
            if(this.bufferLength + newData.length > this.BufferSize) {
                throw('Data to large for buffer');
                return;
            }
            newData.copy(this.data, this.bufferLength);
            this.bufferLength += newData.length;
            if(onDataInProgress) return;
            onDataInProgress = true;
            var packet;
            do {
                packet = null;
                if(this.bufferLength - position >= this.HeaderSize) // If has enough space for header and packet id
                {
                    // Could read header here if we cared.
                    var PositionBeforePacketID = position;
                    var packetID = this.data.readUInt8(position + this.PacketIDPos);
                    //console.log('Position: '+position+' IDPos: '+ (position + this.PacketIDPos));
                    //console.log('DATA HEADER RECV: ',this.data.slice(position,position+10));
                    position += this.HeaderSize;
                    packet = packet_collection.Get(packetID);
                    if(packet != null) {
                        if (this.debug) {
                        if(packetID === packet_collection.LastAdded) {
                            console.log('\x1b[31;5m---------------- Last Added Packet ----------------\x1b[0m');
                        }
                        console.log('PacketID: ' + packetID + ' ' + packetID.toString(16).toUpperCase() + ' bufsize: ' + (this.bufferLength - position) + ' ' + packet.
                        function.name);
                        }
                        //console.log('PacketFunction: '+packet.function.name);
                        if(!packet.Restruct) { // Check if not a restruct packet
                            // Check if not a packet with data, for example this packet would only have a header/ID no data.
                            if(!packet.Size || packet.Size == 0) {
                                try {
                                    packet.
                                    function(this, packetID);
                                } catch(ex) {
                                    // For testing only...
                                    this.bufferLength = 0;
                                    util.dumpError(ex)
                                }
                                this.badCount = 0;
                            } else if(packet.Size && this.bufferLength - position >= packet.Size) { // Check for a packet with Size
                                if(this.debug) {
                                    console.log('PacketSize: ' + packet.Size);
                                }
                                try {
                                    packet.
                                    function(this, this.data.slice(position, position + packet.Size), packetID);
                                } catch(ex) {
                                    // For testing only...
                                    this.bufferLength = 0;
                                    util.dumpError(ex)
                                }
                                position += packet.Size;
                                this.badCount = 0;
                            } else { // No check matched, maybe not enough data or bad packet definition?
                                packet = null;
                            }
                        } else if(packet.Restruct && this.bufferLength - position >= packet.Restruct.size) {
                            // Read the data for the packet and pass it into the function
                            if(this.debug) {
                                console.log('PacketSize: ' + packet.Restruct.size);
                            }
                            try {
                                packet.
                                function(this, packet.Restruct.unpack(this.data.slice(position, position + packet.Restruct.size)), packetID);
                            } catch(ex) {
                                // For testing only...
                                this.bufferLength = 0;
                                util.dumpError(ex)
                            }
                            position += packet.Restruct.size;
                            this.badCount = 0;
                        } else {
                            packet = null;
                        }
                    } else {
                        // unreconized packet id
                        if(this.onUnrecognizedPacket) this.onUnrecognizedPacket(packetID);
                        console.log('Unreconized PacketID: ' + packetID + ' ' + packetID.toString(16).toUpperCase() + ' Size: ' + (this.bufferLength - position));
                        //logHex(this.data.slice(position,this.bufferLength));
                        console.log(hexy(this.data.slice(position, this.bufferLength)));
                        // For testing only this will reset buffer to empty.
                        // Which may have packet data loss but meh
                        this.bufferLength = 0;
                        // Output to log file or something?
                        // Throw away buffer data
                        //this.bufferLength = 0;
                        //position = 0;
                        this.badCount++;
                    }
                    if(packet === null) {
                        position = PositionBeforePacketID;
                        this.badCount++;
                    }
                    if(this.badLimit && this.badCount >= this.badLimit) {
                        if(this.onBadfunction) this.onBadfunction();
                    }
                }
                // If socket is closed now
                if(!this._handle) break;
                // break;
            }
            while (packet != null);
            onDataInProgress = false;
            // If there is data left over here then it would be waiting for more data.
            // we should do some sort of check to make sure more data comes and that it is valid.
            if(this.bufferLength - position > 0) {
                this.data.copy(this.data, 0, this.bufferLength - position, this.bufferLength);
                this.bufferLength = this.bufferLength - position;
            } else {
                // Reset to beginning of buffer to store data at
                this.bufferLength = 0;
            }
            if(this.afterPacketsHandled) this.afterPacketsHandled();
        };
        this.on('data', function(newData) {
            this.onData(newData);
        });
    }
module.exports = CachedBuffer;