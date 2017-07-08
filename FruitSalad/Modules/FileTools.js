var fs = require('fs');
var zlib = require('zlib');

var FileTools = {};

// Flush Settings
FileTools.compress_flush = zlib.Z_FULL_FLUSH;
// zlib.Z_NO_FLUSH
// zlib.Z_PARTIAL_FLUSH
// zlib.Z_SYNC_FLUSH
// zlib.Z_FULL_FLUSH
// zlib.Z_FINISH
// zlib.Z_BLOCK
// zlib.Z_TREES

// Compression levels.
FileTools.compress_level = zlib.Z_BEST_COMPRESSION;
// zlib.Z_NO_COMPRESSION
// zlib.Z_BEST_SPEED
// zlib.Z_BEST_COMPRESSION
// zlib.Z_DEFAULT_COMPRESSION

// Compression strategy.
FileTools.compress_strategy = zlib.Z_DEFAULT_STRATEGY;
// zlib.Z_FILTERED
// zlib.Z_HUFFMAN_ONLY
// zlib.Z_RLE
// zlib.Z_FIXED
// zlib.Z_DEFAULT_STRATEGY

FileTools.trace = false;

// returns true or false if a buffer is considered compressed
FileTools.isBufferCompressed = function isBufferCompressed(buffer) {
	if (!(buffer instanceof Buffer)) {
		throw new Error('Expecting buffer as first argument to isBufferCompressed.');
	}

	if (buffer.length < 9) {
		return false;
	}

	var uncompressedSize = buffer.readUInt32LE(0);
	var compressedSize = buffer.readUInt32LE(4);
	var c = buffer.readUInt8(8);

	// "x" magic byte for all deflate compressed buffers.
	if (c === 120 && compressedSize + 8 === buffer.length) {
		return true;
	}

	return false;
}

// uncompresses a buffer with the uncompressed size adn cmopressed size header. Will return err, data in the func callback.
FileTools.uncompressBuffer = function uncompressBuffer(buffer, func) {
	if (!(buffer instanceof Buffer)) {
		throw new Error('Expecting buffer as first argument to uncompressBuffer.');
	}

	if (!(func instanceof Function)) {
		throw new Error('Expecting function as third argument to uncompressBuffer.');
	}

	var uncompressedSize = buffer.readUInt32LE(0);
	var compressedSize = buffer.readUInt32LE(4);

	if (uncompressedSize == 0) {
		return func(null, new Buffer(0));
	}

	if (buffer.length-8 !== compressedSize) {
		return func('File size is not large enough to have that much data.\nCompressedSize: '+compressedSize+'\nBufferLength: '+buffer.length+'\nUncompressedSize: '+uncompressedSize, null);
	}

	zlib.unzip(buffer.slice(8), func);
}

// compresses a buffer. Will return err, data in the func callback.
FileTools.compressBuffer = function compressBuffer(buffer, func) {
	if (!(buffer instanceof Buffer)) {
		throw new Error('Expecting buffer as first argument to compressBuffer.');
	}

	if (!(func instanceof Function)) {
		throw new Error('Expecting function as third argument to compressBuffer.');
	}

	var uncompressedSize = buffer.length;
	zlib.deflate(buffer, {
							flush: FileTools.compress_flush,
							level: FileTools.compress_level,
							strategy: FileTools.compress_strategy
						}, function(err, data) {
		if (err) {
			return func(err, null);
		}

		var header = new Buffer(8);
		header.writeUInt32LE(uncompressedSize, 0);
		header.writeUInt32LE(data.length, 4); // But OBJECT files not compressed with this padding... They have a strange -8 value somewhere else though.
		func(null, Buffer.concat([header, data], 8 + data.length));
	});
};

// TODO: Split these functions into multiple.
//       One for to a function and another that does to file.

// Uncompresses a file.
FileTools.uncompressFile = function uncompressFile(fileNameInput, fileNameOutput, func) {
	if (func && !(func instanceof Function)) {
		throw new Error('Expecting function as third argument to compressBuffer.');
	}

	fs.readFile(fileNameInput, function(err, data) {
		if (err) {
			if (func) {
				func(err, null);
				return;
			}
			throw new Error(err);
		}

		FileTools.uncompressBuffer(data, function(err, data) {
			if (err) {
				if (func) {
					func(err, null);
					return;
				}
				throw new Error(err);
			}

			fs.writeFile(fileNameOutput, data, func);
		});
	});
};

// Compresses a file.
FileTools.compressFile = function compressFile(fileNameInput, fileNameOutput, func) {
	if (func && !(func instanceof Function)) {
		throw new Error('Expecting function as third argument to compressFile.');
	}

	fs.readFile(fileNameInput, function(err, data) {
		if (err) {
			if (func) {
				func(err, null);
				return;
			}
			throw new Error(err);
		}

		FileTools.compressBuffer(data, function(err, data) {
			if (err) {
				if (func) {
					func(err, null);
					return;
				}
				throw new Error(err);
			}

			fs.writeFile(fileNameOutput, data, func);
		});
	});
};

// Reads a compressed file into a buffer.
FileTools.uncompressFileToBuffer = function uncompressFileToBuffer(fileNameInput, func) {
	if (!(func instanceof Function)) {
		throw new Error('Expecting function as second argument to uncompressFile.');
	}

	fs.readFile(fileNameInput, function(err, data) {
		if (err) {
			func(err, null);
			return;
		}

		FileTools.uncompressBuffer(data, func);
	});
};

// Reads ddsh and dds from IMG file.
FileTools.uncompressDDSFromIMG = function uncompressDDSFromIMG(fileNameInput, func) {
	if (!(func instanceof Function)) {
		throw new Error('Expecting function as second argument to uncompressFile.');
	}

	fs.readFile(fileNameInput, function(err, data) {
		if (err) {
			func(err, null);
			return;
		}

		FileTools.uncompressBuffer(data, function(err, data){
			if (err) {
				func(err, null);
				return;
			}

			var ddsh = new DDSH(data);
			func(null, ddsh);
		});
	});
};

// unsigned int width;   // Width and Height of the image inside the dds that we want to show
// unsigned int height;  // This of this as the clipped region as DDS files in a power of 2 size.
// unsigned int unknown1; // 0x1
// unsigned int unknown2; // 0x1
// unsigned int compression; // (0x14 DXT1, 0x15 DXT3)
// unsigned int unknown3; // 0x3
// unsigned int unknown4; // 0x2
// char ddsType[4]; // (mismatched in some dds headers)
// unsigned int ddsFileSize;
// BYTE DDS[ddsFileSize]; // follows and is the size of ddsFileSize

// DDS are stored in power of 2 so in the DDSH (DDS Header) we store the actual width and height of the image.
// options should contain the following things:
//   width: should be integer of the width of the image.
//   height: should be integer of the height of the image.
//   type: should be either 'DXT1' or 'DXT3'.
//   data: should be a buffer of the dds file.
// after the constructor is called .error could be checked for potential errors.
// options could also be a dds buffer or the ddsh buffer.
// data could be the rest of the dds buffer.
function DDSH(options, data) {
	if (options instanceof Buffer) {
		if (data instanceof Buffer) {
			this.fromBuffer(Buffer.concat(options, data));
			return this;
		}
		this.fromBuffer(options);
		return this;
	}
	if (!options) options = {};
	this.width = options.width || 0;
	this.height = options.height || 0;
	this.unknown1 = 0x01;
	this.unknown2 = 0x01;

	if (options.type.indexOf('DXT') !== 0) {
		this.error = 'type is not a value of DXT1 or DXT3';
	}

	// 0x14 DXT1
	// 0x15 DXT3
	this.ddsType = options.type || 'DXT3';
	this.compression = this.typeToValue(this.ddsType) || 0x15;

	this.unknown3 = 0x03;
	this.unknown4 = 0x02;

	if (options.data && options.data instanceof Buffer) {
		this.ddsFileSize = options.data.length || 0;
		this.dds = options.data;
	} else {
		this.ddsFileSize = 0;
		this.dds = new Buffer();
	}
}
FileTools.DDSH = DDSH;

DDSH.prototype.fromBuffer = function DDSH_fromBuffer(buffer) {
	if (buffer.length < 36) {
		this.error = 'DDSH Buffer length too small.';
		return false;
	}

	this.width = buffer.readUInt32LE(0);
	this.height = buffer.readUInt32LE(4);
	this.unknown1 = buffer.readUInt32LE(8);
	this.unknown2 = buffer.readUInt32LE(12);
	this.compression = buffer.readUInt32LE(16);
	this.unknown3 = buffer.readUInt32LE(20);
	this.unknown4 = buffer.readUInt32LE(24);
	this.type = buffer.toString('utf8', 28, 32);
	if (this.type !== 'DXT1' || this.type !== 'DXT3') {
		this.error = 'DDSH type "'+this.type+'" does not match a handled type.';
	}
	if (this.compression !== this.typeToValue(this.ddsType)) {
		this.error = 'DDSH Compression value not what we expect for the dds type "'+this.type+'".';
	}
	this.ddsFileSize = buffer.readUInt32LE(32);

	this.dds = buffer.splice(36);
	if (this.dds.length !== this.ddsFileSize) {
		this.error = 'DDS file size does not match that specified in the DDSH.';
	}
}

DDSH.prototype.toBuffer = function DDSH_toBuffer() {
	this.ddsFileSize = this.dds.length;
	var b = new Buffer(26+this.ddsFileSize);
	b.writeUInt32LE(this.width, 0);
	b.writeUInt32LE(this.height, 4);
	b.writeUInt32LE(this.unknown1, 8);
	b.writeUInt32LE(this.unknown2, 12);
	b.writeUInt32LE(this.compression, 16);
	b.writeUInt32LE(this.unknown3, 20);
	b.writeUInt32LE(this.unknown4, 24);
	b.write(this.type, 28, 4, 'utf8');
	b.writeUInt32LE(this.ddsFileSize, 32);
	this.dds.copy(b, 36, 0, 0);
	return b;
}

DDSH.prototype.saveDDSToDisk = function DDSH_saveDDS(filename, callback) {
	fs.writeFile(filename, this.dds, callback);
}

DDSH.prototype.loadDDSFromDisk = function DDSH_loadDDS(filename, callback) {
	fs.readFile(filename, function(err, data){
		if (err) {
			callback(err, null);
			return;
		}

		this.dds = data;
		this.ddsFileSize = data.length;
		callback(null, data);
	})
}

// Uncompress a single DDS from IMG.
FileTools.uncompressDDSIMGFileToBuffer = function uncompressDDSIMGFileToBuffer(fileNameInput, func) {
	if (!(func instanceof Function)) {
		throw new Error('Expecting function as second argument to uncompressFile.');
	}

	fs.readFile(fileNameInput, function(err, data) {
		if (err) {
			func(err, null);
			return;
		}

		FileTools.uncompressBuffer(data, function(err, data) { 
			if (err) {
				func(err, null);
				return;
			}

			var ddsh = new DDSH(data);
			func(null, data);
		});
	});
};

// Compress buffer to a file.
FileTools.compressBufferToFile = function compressBufferToFile(buffer, fileNameOutput, func) {
	if (!(buffer instanceof Buffer)) {
		throw new Error('Expecting buffer as first argument to compressBufferToFile.');
	}

	if (func && !(func instanceof Function)) {
		throw new Error('Expecting function as third argument to compressBufferToFile.');
	}

	FileTools.compressBuffer(buffer, function(err, data) {
		if (err) {
			if (func) {
				func(err, null);
				return;
			}
			throw new Error(err);
		}

		fs.writeFile(fileNameOutput, data, func);
	});
};

module.exports = FileTools;