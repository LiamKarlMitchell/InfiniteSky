// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
// Need to setup testing :).
var hexy = require('hexy').hexy;
var util = require('./util.js');

var jshint = require('jshint').JSHINT;
var clc = require('cli-color');
var colors = {orange: clc.xterm(202), info: clc.xterm(33)};

var CachedBuffer = function(collection, opts){
    this.data = new Buffer([]);

    this.size = 0;
    this.step = 0;
    this.id = 0;

    this.reminder = 0;
    this.packet = null;

    var self = this;
    this.onData = function(chunk){
        if(this.paused){
            //TODO: Preferably remove the listener for comming data.
            return;
        }
        // console.log("Chunk length:", chunk.length);
        // console.log(hexy(chunk));
        this.data = Buffer.concat([this.data, chunk]);

        while(this.data.length > 0){
            if(this.reminder === 0 && this.data.length >= 9){
                this.size = this.data.readUInt16LE(0);
                this.step = this.data.readUInt16LE(4);
                this.id = this.data.readUInt8(8);
                this.packet = collection.Get(this.id);
                this.data = this.data.slice(9, this.data.length);
                this.size = this.packet && this.packet.Size ? this.packet.Size : this.size;
                this.reminder = this.size - 9;

                if(this.reminder === 0){
                    if(this.packet === null){
                        console.log(colors.info('Unrecognised PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length) + " Chunk Length: " + (chunk.length - 9));
                        if (this.unhandledPacket) {
                            this.unhandledPacket('0x'+this.id.toString(16).toUpperCase()+' Size: '+content.length);
                        }
                    }else{
                        if(this.packet.function){
                            try{
                                if(this.packet.Restruct){
                                    this.packet.function(this, this.packet.Restruct.unpack(content));
                                }else{
                                    this.packet.function(this, content);
                                }
                            }catch(e){
                                util.dumpError(e);
                            }
                        }else{
                            console.log(colors.info('Unrecognised function for PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length) + " Chunk Length: " + (chunk.length - 9));
                        }
                    }
                }
            }

            if(this.reminder > 0 && this.data.length >= this.reminder){
                var content = this.data.slice(0, this.reminder);
                this.data = this.data.slice(this.reminder, this.data.length);
                this.reminder = 0;

                if(this.packet === null){
                    var hexPacketID = util.padLeft(this.id.toString(16).toUpperCase(),'0',2);
                    console.log(colors.info('Unrecognised PacketID: 0x' + hexPacketID + " Size: " + content.length) + " Chunk Length: " + (chunk.length - 9));
                    if (this.unhandledPacket) {
                        this.unhandledPacket('0x'+this.id.toString(16).toUpperCase()+' Size: '+content.length);
                    }
                    var hexData = hexy(content);
                    log.warn({data: hexData, id: hexPacketID, size: content.length },'Unrecognized PacketID');
                }else{
                    if(this.packet.function){
                        try{
                            if(this.packet.Restruct){
                                this.packet.function(this, this.packet.Restruct.unpack(content), content);
                            }else{
                                this.packet.function(this, content);
                            }
                        }catch(e){
                            util.dumpError(e);
                        }
                    }else{
                        console.log(colors.info('Unrecognised function for PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                        console.log(hexy(content));
                    }
                }

    
                if(this.data.length < 9){
                    break;
                }
            }else{
                break;
            }
        }

    }

    this.on('data', this.onData);
}

module.exports = CachedBuffer;