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
var util = require('./Modules/util.js');

var startTime = new Date().getTime();
util.setupUncaughtExceptionHandler();
util.outputHeaderText();


var ChildSpawner = require('./Helper/ChildSpawner.js');
var spawner = new ChildSpawner.Spawner({});

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
var vm = require('vm');


spawner.spawnChild({name: 'Login', script: 'Processes\\Login\\Login.js'});
spawner.spawnChild({name: 'World', script: 'Processes\\World\\World.js'});


spawner.onReady(function(){
	console.log("Server loaded in", (new Date().getTime() - startTime), "ms");
	// rl.setPrompt('> ');
	// rl.prompt();

	rl.on('line', function(line) {
	 	try{
	 		console.log(vm.runInThisContext(line.trim()));
	 	}catch(e){
	 		console.log(e);
	 	}
		// rl.prompt();
	}).on('close', function() {
		process.exit(0);
	});
});