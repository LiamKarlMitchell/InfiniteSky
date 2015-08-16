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
FileTools.compress_level = zlib.Z_DEFAULT_COMPRESSION;
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

	if (buffer.length !== compressedSize) {
		return func('File size is not large enough to have that much data.', null);
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
		header.writeUInt32LE(8 + data.length, 4);
		func(null, Buffer.concat([header, data], 8 + data.length));
	});
};

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