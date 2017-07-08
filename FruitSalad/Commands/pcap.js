// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: pacap
// Sends a stream of packets that were captured with wireshark/tcpdump etc.
// to the client if it exists in data/packets/ extension of .pcap not needed
var pcapp = require('pcap-parser');

function parse_pcap_tcp(buffer) {
    if (buffer.length <= 0x35) {
        return null;
    }

    // Is it TCP Version 4?
    if (buffer.readUInt8(14) != 0x45) {
        return null;
    }

    // Read Source IP
    var sourceIP = buffer.readUInt8(0x1A).toString() + '.' +
        buffer.readUInt8(0x1B).toString() + '.' +
        buffer.readUInt8(0x1C).toString() + '.' +
        buffer.readUInt8(0x1D).toString();

    var destinationIP = buffer.readUInt8(0x1E).toString() + '.' +
        buffer.readUInt8(0x1F).toString() + '.' +
        buffer.readUInt8(0x20).toString() + '.' +
        buffer.readUInt8(0x21).toString();

    var sourcePort = buffer.readUInt16BE(0x22);
    var destinationPort = buffer.readUInt16BE(0x24);

    var data = buffer.slice(0x36);

    return {
        sourceIP: sourceIP,
        destinationIP: destinationIP,
        sourcePort: sourcePort,
        destinationPort: destinationPort,
        data: data
    }
}


packetInfos = [];
packetInfos[0x00] = { address: 0x00000000, size: 0 };
packetInfos[0x01] = { address: 0x00407990, size: 1 };
packetInfos[0x02] = { address: 0x00000000, size: 0 };
packetInfos[0x03] = { address: 0x004079C0, size: 41 };
packetInfos[0x04] = { address: 0x00407CB0, size: 2 };
packetInfos[0x05] = { address: 0x00407D00, size: 4387 };
packetInfos[0x06] = { address: 0x00408280, size: 5 };
packetInfos[0x07] = { address: 0x00408330, size: 4386 };
packetInfos[0x08] = { address: 0x00408440, size: 2 };
packetInfos[0x09] = { address: 0x004084E0, size: 2 };
packetInfos[0x0A] = { address: 0x00408560, size: 22 };
packetInfos[0x0B] = { address: 0x00408780, size: 1 };
packetInfos[0x0C] = { address: 0x00408790, size: 85 };
packetInfos[0x0D] = { address: 0x00408820, size: 5 };
packetInfos[0x0E] = { address: 0x00000000, size: 0 };
packetInfos[0x0F] = { address: 0x004088E0, size: 9 };
packetInfos[0x10] = { address: 0x004089A0, size: 9 };
packetInfos[0x11] = { address: 0x00408B50, size: 2 };
packetInfos[0x12] = { address: 0x0041FD40, size: 10 };
packetInfos[0x13] = { address: 0x0041FDC0, size: 10 };
packetInfos[0x14] = { address: 0x0041FEA0, size: 5 };
packetInfos[0x15] = { address: 0x00000000, size: 0 };
packetInfos[0x16] = { address: 0x00408D60, size: 4386 };
packetInfos[0x17] = { address: 0x00408FC0, size: 406 };
packetInfos[0x18] = { address: 0x004093F0, size: 1050 };
packetInfos[0x19] = { address: 0x004097C0, size: 102 };
packetInfos[0x1A] = { address: 0x004099E0, size: 102 };
packetInfos[0x1B] = { address: 0x0040AE70, size: 74 };
packetInfos[0x1C] = { address: 0x0040B040, size: 52 };
packetInfos[0x1D] = { address: 0x0040B0D0, size: 23 };
packetInfos[0x1E] = { address: 0x0040B340, size: 22 };
packetInfos[0x1F] = { address: 0x00000000, size: 0 };
packetInfos[0x20] = { address: 0x0040B660, size: 82 };
packetInfos[0x21] = { address: 0x0040B8B0, size: 78 };
packetInfos[0x22] = { address: 0x0040B9A0, size: 82 };
packetInfos[0x23] = { address: 0x0040BB00, size: 82 };
packetInfos[0x24] = { address: 0x0040BBD0, size: 1 };
packetInfos[0x25] = { address: 0x0040BC50, size: 14 };
packetInfos[0x26] = { address: 0x0040BD80, size: 14 };
packetInfos[0x27] = { address: 0x0040BEF0, size: 14 };
packetInfos[0x28] = { address: 0x0040C060, size: 79 };
packetInfos[0x29] = { address: 0x0040C1C0, size: 1 };
packetInfos[0x2A] = { address: 0x0040C260, size: 65 };
packetInfos[0x2B] = { address: 0x0040C3A0, size: 61 };
packetInfos[0x2C] = { address: 0x0040C780, size: 58 };
packetInfos[0x2D] = { address: 0x0040C860, size: 109 };
packetInfos[0x2E] = { address: 0x0040C990, size: 10 };
packetInfos[0x2F] = { address: 0x0040CB60, size: 29 };
packetInfos[0x30] = { address: 0x00000000, size: 0 };
packetInfos[0x31] = { address: 0x0040CD10, size: 117 };
packetInfos[0x32] = { address: 0x0040CD90, size: 6 };
packetInfos[0x33] = { address: 0x0040CE00, size: 14 };
packetInfos[0x34] = { address: 0x0040CF40, size: 14 };
packetInfos[0x35] = { address: 0x0040CF90, size: 15 };
packetInfos[0x36] = { address: 0x0040D0E0, size: 15 };
packetInfos[0x37] = { address: 0x0040D300, size: 14 };
packetInfos[0x38] = { address: 0x0040D350, size: 16 };
packetInfos[0x39] = { address: 0x0040D490, size: 3 };
packetInfos[0x3A] = { address: 0x0040D5B0, size: 1 };
packetInfos[0x3B] = { address: 0x0040D600, size: 11 };
packetInfos[0x3C] = { address: 0x0040D680, size: 2 };
packetInfos[0x3D] = { address: 0x00420F60, size: 14 };
packetInfos[0x3E] = { address: 0x00000000, size: 0 };
packetInfos[0x3F] = { address: 0x0040D830, size: 18 };
packetInfos[0x40] = { address: 0x0040D990, size: 14 };
packetInfos[0x41] = { address: 0x0040D9E0, size: 15 };
packetInfos[0x42] = { address: 0x0040DB20, size: 1 };
packetInfos[0x43] = { address: 0x0040DB70, size: 1 };
packetInfos[0x44] = { address: 0x0040DBC0, size: 1394 };
packetInfos[0x45] = { address: 0x0040DCA0, size: 3 };
packetInfos[0x46] = { address: 0x0040DCF0, size: 1290 };
packetInfos[0x47] = { address: 0x0040DDD0, size: 14 };
packetInfos[0x48] = { address: 0x00000000, size: 0 };
packetInfos[0x49] = { address: 0x0040DF20, size: 6 };
packetInfos[0x4A] = { address: 0x0040E120, size: 5 };
packetInfos[0x4B] = { address: 0x0040E200, size: 6 };
packetInfos[0x4C] = { address: 0x0040E690, size: 529 };
packetInfos[0x4D] = { address: 0x0040E720, size: 1 };
packetInfos[0x4E] = { address: 0x0040E760, size: 79 };
packetInfos[0x4F] = { address: 0x0040EB00, size: 538 };
packetInfos[0x50] = { address: 0x0040EBC0, size: 66 };
packetInfos[0x51] = { address: 0x0040ECC0, size: 26 };
packetInfos[0x52] = { address: 0x0040ED70, size: 18 };
packetInfos[0x53] = { address: 0x00000000, size: 0 };
packetInfos[0x54] = { address: 0x0040F0E0, size: 105 };
packetInfos[0x55] = { address: 0x00414DA0, size: 10 };
packetInfos[0x56] = { address: 0x00000000, size: 0 };
packetInfos[0x57] = { address: 0x00414EC0, size: 66 };
packetInfos[0x58] = { address: 0x00414FD0, size: 14 };
packetInfos[0x59] = { address: 0x00415110, size: 14 };
packetInfos[0x5A] = { address: 0x00415160, size: 15 };
packetInfos[0x5B] = { address: 0x00415280, size: 26 };
packetInfos[0x5C] = { address: 0x004158F0, size: 13 };
packetInfos[0x5D] = { address: 0x00000000, size: 0 };
packetInfos[0x5E] = { address: 0x00419C00, size: 27 };
packetInfos[0x5F] = { address: 0x00415960, size: 30 };
packetInfos[0x60] = { address: 0x00415B30, size: 21 };
packetInfos[0x61] = { address: 0x00415B70, size: 17 };
packetInfos[0x62] = { address: 0x00415C40, size: 25 };
packetInfos[0x63] = { address: 0x00415DE0, size: 22 };
packetInfos[0x64] = { address: 0x00415F90, size: 13 };
packetInfos[0x65] = { address: 0x00416060, size: 9 };
packetInfos[0x66] = { address: 0x00416140, size: 14 };
packetInfos[0x67] = { address: 0x00416210, size: 22 };
packetInfos[0x68] = { address: 0x00416330, size: 14 };
packetInfos[0x69] = { address: 0x00416450, size: 2 };
packetInfos[0x6A] = { address: 0x00416500, size: 314 };
packetInfos[0x6B] = { address: 0x00416770, size: 74 };
packetInfos[0x6C] = { address: 0x00416930, size: 505 };
packetInfos[0x6D] = { address: 0x00416AA0, size: 13 };
packetInfos[0x6E] = { address: 0x00000000, size: 0 };
packetInfos[0x6F] = { address: 0x00000000, size: 0 };
packetInfos[0x70] = { address: 0x00416B10, size: 6 };
packetInfos[0x71] = { address: 0x00416BB0, size: 9 };
packetInfos[0x72] = { address: 0x00416CA0, size: 18 };
packetInfos[0x73] = { address: 0x00416DB0, size: 13 };
packetInfos[0x74] = { address: 0x00416E50, size: 18 };
packetInfos[0x75] = { address: 0x00416F80, size: 25 };
packetInfos[0x76] = { address: 0x00417460, size: 10 };
packetInfos[0x77] = { address: 0x00417540, size: 14402 };
packetInfos[0x78] = { address: 0x004175C0, size: 18 };
packetInfos[0x79] = { address: 0x004176E0, size: 18 };
packetInfos[0x7A] = { address: 0x004177C0, size: 6 };
packetInfos[0x7B] = { address: 0x00417860, size: 1 };
packetInfos[0x7C] = { address: 0x00417880, size: 17 };
packetInfos[0x7D] = { address: 0x00417930, size: 13 };
packetInfos[0x7E] = { address: 0x004179B0, size: 13 };
packetInfos[0x7F] = { address: 0x00417B80, size: 18 };
packetInfos[0x80] = { address: 0x00417C80, size: 5 };
packetInfos[0x81] = { address: 0x00417CB0, size: 25 };
packetInfos[0x82] = { address: 0x00417DF0, size: 13 };
packetInfos[0x83] = { address: 0x00417E90, size: 10 };
packetInfos[0x84] = { address: 0x00418030, size: 9 };
packetInfos[0x85] = { address: 0x00418D60, size: 73 };
packetInfos[0x86] = { address: 0x00418E20, size: 26 };
packetInfos[0x87] = { address: 0x00419010, size: 9 };
packetInfos[0x88] = { address: 0x00419AD0, size: 13 };
packetInfos[0x89] = { address: 0x00419B00, size: 5 };
packetInfos[0x8A] = { address: 0x00419B20, size: 9 };
packetInfos[0x8B] = { address: 0x00419B90, size: 13 };
packetInfos[0x8C] = { address: 0x00000000, size: 0 };
packetInfos[0x8D] = { address: 0x00000000, size: 0 };
packetInfos[0x8E] = { address: 0x0041D030, size: 9 };
packetInfos[0x8F] = { address: 0x0041D0A0, size: 14 };
packetInfos[0x90] = { address: 0x0041D1B0, size: 14 };
packetInfos[0x91] = { address: 0x0041D200, size: 15 };
packetInfos[0x92] = { address: 0x0041D360, size: 1 };
packetInfos[0x93] = { address: 0x0041D380, size: 5 };
packetInfos[0x94] = { address: 0x0041D390, size: 21 };
packetInfos[0x95] = { address: 0x0041D430, size: 9 };
packetInfos[0x96] = { address: 0x0041DAD0, size: 5 };
packetInfos[0x97] = { address: 0x0041DBA0, size: 1 };
packetInfos[0x98] = { address: 0x00000000, size: 0 };
packetInfos[0x99] = { address: 0x0041DBD0, size: 1 };
packetInfos[0x9A] = { address: 0x0041DC20, size: 17 };
packetInfos[0x9B] = { address: 0x0041DC50, size: 13 };
packetInfos[0x9C] = { address: 0x0041DCB0, size: 6 };
packetInfos[0x9D] = { address: 0x0041DD10, size: 1370 };
packetInfos[0x9E] = { address: 0x0041E380, size: 5 };
packetInfos[0x9F] = { address: 0x0041E490, size: 9 };
packetInfos[0xA0] = { address: 0x00424140, size: 1 };
packetInfos[0xA1] = { address: 0x00000000, size: 0 };
packetInfos[0xA2] = { address: 0x0041E550, size: 5 };
packetInfos[0xA3] = { address: 0x0041E590, size: 5 };
packetInfos[0xA4] = { address: 0x0041E5B0, size: 402 };
packetInfos[0xA5] = { address: 0x0041E600, size: 1179 };
packetInfos[0xA6] = { address: 0x0041E7E0, size: 30 };
packetInfos[0xA7] = { address: 0x0041E970, size: 214 };
packetInfos[0xA8] = { address: 0x0041E9D0, size: 15 };
packetInfos[0xA9] = { address: 0x0041EA70, size: 10 };
packetInfos[0xAA] = { address: 0x0041EBC0, size: 18 };
packetInfos[0xAB] = { address: 0x0041ECE0, size: 14 };
packetInfos[0xAC] = { address: 0x0041EF80, size: 79 };
packetInfos[0xAD] = { address: 0x0041F1A0, size: 2 };
packetInfos[0xAE] = { address: 0x0041F270, size: 22 };
packetInfos[0xAF] = { address: 0x0041F360, size: 10 };
packetInfos[0xB0] = { address: 0x0041F410, size: 5 };
packetInfos[0xB1] = { address: 0x00421030, size: 125 };
packetInfos[0xB2] = { address: 0x0041F890, size: 22 };
packetInfos[0xB3] = { address: 0x0041F9B0, size: 137 };
packetInfos[0xB4] = { address: 0x0041FAF0, size: 30 };
packetInfos[0xB5] = { address: 0x0041FCB0, size: 9 };
packetInfos[0xB6] = { address: 0x0041F460, size: 961 };
packetInfos[0xB7] = { address: 0x0041F660, size: 961 };
packetInfos[0xB8] = { address: 0x00000000, size: 0 };
packetInfos[0xB9] = { address: 0x00000000, size: 0 };
packetInfos[0xBA] = { address: 0x0041FF10, size: 9 };
packetInfos[0xBB] = { address: 0x00420110, size: 25 };
packetInfos[0xBC] = { address: 0x00420200, size: 17 };
packetInfos[0xBD] = { address: 0x00420300, size: 55 };
packetInfos[0xBE] = { address: 0x00420A60, size: 31 };
packetInfos[0xBF] = { address: 0x00420B80, size: 13 };
packetInfos[0xC0] = { address: 0x00420BF0, size: 10 };
packetInfos[0xC1] = { address: 0x00420CB0, size: 17 };
packetInfos[0xC2] = { address: 0x00420DA0, size: 429 };
packetInfos[0xC3] = { address: 0x00420DD0, size: 9 };
packetInfos[0xC4] = { address: 0x00420E30, size: 22 };
packetInfos[0xC5] = { address: 0x00420EE0, size: 5 };
packetInfos[0xC6] = { address: 0x00000000, size: 0 };
packetInfos[0xC7] = { address: 0x00000000, size: 0 };
packetInfos[0xC8] = { address: 0x00000000, size: 0 };
packetInfos[0xC9] = { address: 0x00000000, size: 0 };
packetInfos[0xCA] = { address: 0x00000000, size: 0 };
packetInfos[0xCB] = { address: 0x00000000, size: 0 };
packetInfos[0xCC] = { address: 0x00000000, size: 0 };
packetInfos[0xCD] = { address: 0x00000000, size: 0 };
packetInfos[0xCE] = { address: 0x00000000, size: 0 };
packetInfos[0xCF] = { address: 0x00000000, size: 0 };
packetInfos[0xD0] = { address: 0x00000000, size: 0 };
packetInfos[0xD1] = { address: 0x00000000, size: 0 };
packetInfos[0xD2] = { address: 0x00000000, size: 0 };
packetInfos[0xD3] = { address: 0x00000000, size: 0 };
packetInfos[0xD4] = { address: 0x00000000, size: 0 };
packetInfos[0xD5] = { address: 0x00000000, size: 0 };
packetInfos[0xD6] = { address: 0x00000000, size: 0 };
packetInfos[0xD7] = { address: 0x00000000, size: 0 };
packetInfos[0xD8] = { address: 0x00000000, size: 0 };
packetInfos[0xD9] = { address: 0x00000000, size: 0 };
packetInfos[0xDA] = { address: 0x00000000, size: 0 };
packetInfos[0xDB] = { address: 0x00000000, size: 0 };
packetInfos[0xDC] = { address: 0x00000000, size: 0 };
packetInfos[0xDD] = { address: 0x00000000, size: 0 };
packetInfos[0xDE] = { address: 0x00000000, size: 0 };
packetInfos[0xDF] = { address: 0x00000000, size: 0 };
packetInfos[0xE0] = { address: 0x00000000, size: 0 };
packetInfos[0xE1] = { address: 0x00000000, size: 0 };
packetInfos[0xE2] = { address: 0x00000000, size: 0 };
packetInfos[0xE3] = { address: 0x00000000, size: 0 };
packetInfos[0xE4] = { address: 0x00000000, size: 0 };
packetInfos[0xE5] = { address: 0x00000000, size: 0 };
packetInfos[0xE6] = { address: 0x00000000, size: 0 };
packetInfos[0xE7] = { address: 0x00000000, size: 0 };
packetInfos[0xE8] = { address: 0x00000000, size: 0 };
packetInfos[0xE9] = { address: 0x00000000, size: 0 };
packetInfos[0xEA] = { address: 0x00000000, size: 0 };
packetInfos[0xEB] = { address: 0x00000000, size: 0 };
packetInfos[0xEC] = { address: 0x00000000, size: 0 };
packetInfos[0xED] = { address: 0x00000000, size: 0 };
packetInfos[0xEE] = { address: 0x00000000, size: 0 };
packetInfos[0xEF] = { address: 0x00000000, size: 0 };
packetInfos[0xF0] = { address: 0x00000000, size: 0 };
packetInfos[0xF1] = { address: 0x00000000, size: 0 };
packetInfos[0xF2] = { address: 0x00000000, size: 0 };
packetInfos[0xF3] = { address: 0x00000000, size: 0 };
packetInfos[0xF4] = { address: 0x00000000, size: 0 };
packetInfos[0xF5] = { address: 0x00000000, size: 0 };
packetInfos[0xF6] = { address: 0x00000000, size: 0 };
packetInfos[0xF7] = { address: 0x00000000, size: 0 };
packetInfos[0xF8] = { address: 0x00000000, size: 0 };
packetInfos[0xF9] = { address: 0x00000000, size: 0 };
packetInfos[0xFA] = { address: 0x00000000, size: 0 };
packetInfos[0xFB] = { address: 0x00000000, size: 0 };
packetInfos[0xFC] = { address: 0x00000000, size: 0 };
packetInfos[0xFD] = { address: 0x00000000, size: 0 };
packetInfos[0xFE] = { address: 0x00000000, size: 0 };
packetInfos[0xFF] = { address: 0x00000000, size: 0 };

GMCommands.AddCommand(new Command('pcap', 0, function command_send(string, client) {
    console.log('pcap packet used ' + string + '.pcap');
    if (string == '') string = 't';

    var parser = pcapp.parse(config.world.data_path + '/packets/' + string + '.pcap');
    var firstSendTimestamp_ms = 0;
    var packetCount = -1;
    var currentSendCount = 0;
    var timeouts = [];
    function sendToClientAtTime(packetIndex, data, time) {
        var t = setTimeout(function sendPacketToClient() {
            currentSendCount++;
            log.info('Sending No. '+packetIndex+' send No. '+currentSendCount+' from pcap '+string+' to client. ');
            util.logHex(data);

            var packetID = data.readUInt8(0x00);
            var pi = packetInfos[packetID];
            client.sendInfoMessage(packetIndex+' '+currentSendCount+' PacketID: 0x' + util.padLeft(packetID.toString(16).toUpperCase(),'0',2) + ' '+util.padLeft(pi.address.toString(16).toUpperCase(),'0',8)+' Size: '+data.length);

            client.write(data, function (err) {
                // If there was an error sending to client kill all our timeouts.
                if (err) {
                    for (var i=0;i<timeouts.length;i++) {
                        clearTimeout(timeouts[i]);
                    }
                }
            });
        }, time);
        timeouts.push(t);
    }

    parser.on('packet', function(packet) {
        var info = parse_pcap_tcp(packet.data);
        packetCount ++;
        // If the source port is not one of the zone ports we know we want to not send it.
        if (! (info.sourcePort >= 11092 && info.sourcePort <= 11240) ) {
            return false;
        }

        // Skip bad packets
        // NOTE: TODO: Does not merge packet datas together to send in one possibility to send malformed data.
        var packetID = info.data.readUInt8(0x00);
        var pi = packetInfos[packetID];

        if (packetID !== 0x1A && packetID !== 0x1B && packetID !== 0x18)
        if (info.data.length != pi.size) {
            console.log('Not enough bytes for packet No. '+packetCount+' PacketID: 0x' + util.padLeft(packetID.toString(16).toUpperCase(),'0',2)+' requires '+pi.size+' bytes we only have '+info.data.length+'.');
            return;
        }

        switch (packetID) {
            case 0xF4:
            case 0xCE:
            case 0xBB:
            case 0x7A:
            return false;
            break;
        }

        var timestamp_ms = (packet.header.timestampSeconds * 1000) + (packet.header.timestampMicroseconds / 1000);
        if (firstSendTimestamp_ms === 0) {
            firstSendTimestamp_ms = timestamp_ms;
        }

        var time = timestamp_ms - firstSendTimestamp_ms;
        console.log('PacketID: 0x' + util.padLeft(packetID.toString(16).toUpperCase(),'0',2) + ' game recv at: '+util.padLeft(pi.address.toString(16).toUpperCase(),'0',8)+' queued for send in '+time+'ms');

        sendToClientAtTime(packetCount, info.data, time);

    }).on('end', function() {
        console.log('Finished reading packets for pcap.');
    });
}));

/////////////////////////////////////////////////////////////
// Command: send alias
GMCommands.AddCommand(GMCommands.getCommand('pcap').Alias('p'));