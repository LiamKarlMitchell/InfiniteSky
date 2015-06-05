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


// winston.profile('Startup');
var util = require('./Modules/util.js');

var startTime = new Date().getTime();
util.setupUncaughtExceptionHandler();
util.outputHeaderText();


var ChildSpawner = require('./Helper/ChildSpawner.js');
spawner = new ChildSpawner.Spawner({});

var repl = require("repl");
var vm = require('vm');

// Prevent the following warning about possible memory leak with the EventEmitters.
// (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
process.setMaxListeners(0);

spawner.spawnChild({name: 'Login', script: 'Processes\\Login\\Login.js'});
spawner.spawnChild({name: 'World', script: 'Processes\\World\\World.js'});
// Database = require('./Modules/db.js');
// vmscript = require('./vmscript/vmscript.js');
// vmscript.watch('./Config/login.json');
// Database()

// function createaccount(user, pass, level){
// 	console.log("test");
// };

spawner.onReady(function(){
	console.log("Server loaded in", (new Date().getTime() - startTime), "ms");
	repl.start({
	  prompt: "main> ",
	  input: process.stdin,
	  output: process.stdout
	});
});