// var winston = require('winston');

// var config = {};

// if (config.logFile) {
// 	winston.add(winston.transports.File, { filename: config.logFile })
// }

// // For information on Winston please see https://github.com/winstonjs/winston
// winston.profile('Startup');
// winston.info('Starting InfiniteSky', { datetime: new Date() });

// //
// // Configure CLI output on the default logger
// //
// winston.cli();



// //
// // Handle errors
// //
// // logger.on('error', function (err) { /* Do Something */ });


/**
 * Represents a book.
 * @constructor
 */
function Book(title, author) {
}

// winston.profile('Startup');

var ChildSpawner = require('./Helper/ChildSpawner.js');
var spawner = new ChildSpawner.Spawner({});

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);



spawner.spawnChild({name: 'Login', script: 'Processes\\Login\\Login.js'});
spawner.spawnChild({name: 'World', script: 'Processes\\World\\World.js'});


spawner.onReady(function(){
	rl.setPrompt('> ');
	rl.prompt();

	rl.on('line', function(line) {
	 	console.log(line.trim());
		rl.prompt();
	}).on('close', function() {
		process.exit(0);
	});
});