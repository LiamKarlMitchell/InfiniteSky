var FileTools = require('./Modules/FileTools');

if (process.argv.length < 3) {
	console.error('Please specify a Twelve Sky/Alt1Games.IMG file name to extract the dds from.');
} else {
	FileTools.uncompressDDSFromIMG(process.argv[2], function(err, ddsh){
		if (err) {
			console.error(err);
			return;
		}

		console.log(ddsh);
	});
}