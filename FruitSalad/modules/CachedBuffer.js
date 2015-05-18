// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
// Need to setup testing :).
var hexy = require('hexy').hexy;
var util = require('./util.js');

var clc = require('cli-color');
var colors = {orange: clc.xterm(202), info: clc.xterm(33)};

var CachedBuffer = function(collection, opts){
    this.data = new Buffer([]);

    this.size = 0;
    this.step = 0;
    this.id = 0;

    this.reminder = 0;
    this.packet = null;

    this.onData = function(chunk){
        this.data = Buffer.concat([this.data, chunk]);

        while(this.data.length > 0){
            if(this.reminder === 0 && this.data.length >= 9){
                this.size = this.data.readUInt16LE(0);
                this.step = this.data.readUInt16LE(4);
                this.id = this.data.readUInt8(8);
                this.reminder = this.size - 9;
                this.data = this.data.slice(9, this.data.length);
                this.packet = collection.Get(this.id);

                if(this.reminder === 0){
                    if(this.packet === null){
                        console.log(colors.info('Unrecognized PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                    }else{
                        // console.log(this.packet);
                        if(this.packet.function){
                            if(this.packet.Restruct){
                                this.packet.function(this, this.packet.Restruct.unpack(content));
                            }else{
                                this.packet.function(this, content);
                            }
                        }else{
                            console.log(colors.info('Unrecognized function for PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                        }
                    }
                }
            }

            if(this.reminder > 0 && this.data.length >= this.reminder){
                var content = this.data.slice(0, this.reminder);
                this.data = this.data.slice(this.reminder, this.data.length);
                this.reminder = 0;

                if(this.packet === null){
                    console.log(colors.info('Unrecognized PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                    console.log(hexy(content));
                }else{
                    if(this.packet === null){
                        console.log(colors.info('Unrecognized PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                    }else{
                        // console.log(this.packet);
                        if(this.packet.function){
                            if(this.packet.Restruct){
                                this.packet.function(this, this.packet.Restruct.unpack(content), content);
                            }else{
                                this.packet.function(this, content);
                            }
                        }else{
                            console.log(colors.info('Unrecognized function for PacketID: 0x' + util.padLeft(this.id.toString(16).toUpperCase(),'0',2) + " Size: " + content.length));
                        }
                    }
                }
                break;
            }else{
                break;
            }
        }
    }

    this.on('data', this.onData);
}

module.exports = CachedBuffer;