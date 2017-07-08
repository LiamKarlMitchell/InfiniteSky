var FileTools = require('./FileTools.js');
var path = require('path');

if (process.argv.length < 2) {
	console.log('Please run like this.');
	console.log('node img2hex input.img output.hex');
	process.exit(1);
}

var infilename = path.normalize(process.argv[2]);
var outfilename = '';
if (process.argv.length == 3) {
	outfilename = infilename.replace('.img','')+'.hex';
} else {
	outfilename = path.normalize(process.argv[3]);
}

console.log('Going to uncompress '+infilename+' to '+outfilename+'.');

FileTools.uncompressFile(infilename, outfilename, function(err){
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('Done');
	process.exit(0);
})