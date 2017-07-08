var FileTools = require('./FileTools.js');
var path = require('path');

if (process.argv.length < 2) {
	console.log('Please run like this.');
	console.log('node hex2img input.hex output.img');
	process.exit(1);
}

var infilename = path.normalize(process.argv[2]);
var outfilename = '';
if (process.argv.length == 3) {
	outfilename = infilename.replace('.hex','')+'.img';
} else {
	outfilename = path.normalize(process.argv[3]);
}

console.log('Going to compress '+infilename+' to '+outfilename+'.');

FileTools.compressFile(infilename, outfilename, function(err){
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('Done');
	process.exit(0);
})