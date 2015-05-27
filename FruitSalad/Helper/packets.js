module.exports.makeCompressedPacket = function(packetID,buffer) {
    var CompressHairerSize = Zone.send.Compress_Hairer.size;
    var tmpbuffer = new Buffer(CompressHairerSize+buffer.length);
    var cbuf = new Buffer(Zone.send.Compress_Hairer.pack({
                        packetID: packetID,
                        isCompressed: false,
                    }));

    cbuf.copy(tmpbuffer);
    buffer.copy(tmpbuffer,CompressHairerSize);
    return tmpbuffer;
};  