module.exports.makeCompressedPacket = function(packetID,buffer) {
    var CompressHairerSize = World.send.Compress_Hairer.size;
    var tmpbuffer = new Buffer(CompressHairerSize+buffer.length);
    var cbuf = new Buffer(World.send.Compress_Hairer.pack({
                        packetID: packetID,
                        isCompressed: false,
                    }));

    cbuf.copy(tmpbuffer);
    buffer.copy(tmpbuffer,CompressHairerSize);
    return tmpbuffer;
};  