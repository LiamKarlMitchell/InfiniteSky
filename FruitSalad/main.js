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

bunyan = require('bunyan');
log = bunyan.createLogger({name: 'InfiniteSky',
});

// winston.profile('Startup');
path = require('path');
var util = require('./Modules/util.js');

var startTime = new Date().getTime();
util.setupUncaughtExceptionHandler();
util.outputHeaderText();


var ChildSpawner = require('./Helper/ChildSpawner.js');
spawner = new ChildSpawner.Spawner({});

//var repl = require("repl");
var vm = require('vm');

// Prevent the following warning about possible memory leak with the EventEmitters.
// (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
process.setMaxListeners(0);

spawner.spawnChild({name: 'Login', script: 'Processes/Login/Login.js', pipeErrorToStdout: true});
spawner.spawnChild({name: 'World', script: 'Processes/World/World.js', pipeErrorToStdout: true});
vmscript = require('./VMScript.js');

global.config = {};

var v = new vmscript();
v.watch('Config/login.json');

spawner.onReady(function(){
	console.log("Server loaded in", (new Date().getTime() - startTime), "ms");
});

// repl_context = repl.start({
// 	  prompt: "main> ",
// 	  input: process.stdin,
// 	  output: process.stdout
// }).context;

// // Expose things to the repl.
// repl_context.vmscript = v;
// repl_context.spawner = spawner;
// repl_context.api = spawner.api;

// // A function we can call once at runtime to grant REPL access to the database.
// // It will load the scripts in the Database directory.
// repl_context.loadDB = function loadDB() {
// 	if (global.db !== undefined) {
// 		return;
// 	}
// 	var Database = require('./Modules/db.js');
// 	repl_context.db = Database(config.login.database.connection_string, function(){
// 		console.log("Database connected @", config.login.database.connection_string);
// 		v.watch('Database');
// 	});
// };