global.rpc = new (require('./Modules/rpc.js'))();
global.rpc.topLevel = true; // This must be done for the very first process only so that child processes stdout which we piped to stderr goes to stdout of this process.
bunyan = require('bunyan');
log = bunyan.createLogger({name: 'InfiniteSky'});

// winston.profile('Startup');
path = require('path');
var util = require('./Modules/util.js');

// var startTime = new Date().getTime();
// util.setupUncaughtExceptionHandler();
util.outputHeaderText();

// var ChildSpawner = require('./Helper/ChildSpawner.js');
// var spawner = new ChildSpawner.Spawner({});

//var repl = require("repl");
var vm = require('vm');

// Prevent the following warning about possible memory leak with the EventEmitters.
// (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
// process.setMaxListeners(0);

// spawner.spawnChild({name: 'Login', script: 'Processes/Login/Login.js'});
// spawner.spawnChild({name: 'World', script: 'Processes/World/World.js'});
// TODO Check existance of configs / have defaults?
var children = require('./Config/processes.json');

global.api = {};

// NOTE: Anything after second param is consider as arguments called on function name.
/**
 * Calls a function on a child process by name.
 * @param  {string}
 * @param  {string} The function name to call
 */
global.api.call = function(process_name, fn){
	// console.log("Calling function");
	var p = global.rpc.children[process_name];
	// TODO: Comment what this does behind the scenes.
	if(p && p.api[fn]){
		// console.log(fn,"Calling", process_name);
		var args = [];
		for(var i=2; i<arguments.length; i++){
			args.push(arguments[i]);
		}
		p.api[fn].apply(global.rpc, args);
	}
};
// global.api.test = function(){
// 	console.log("calling test from child process");
// }

for(var child in children){
	global.rpc.join(child, './Processes/process.js');
}

global.rpc.on('invalidated', function(child){
	if(!global.rpc.children[child].spawned){
		global.rpc.children[child].api.spawnScript(children[child].script);
		global.rpc.children[child].spawned = true;
	}
	global.rpc.add(global.api); // Need to have these children pipe stderr to stdout and stdout to stdout. They does xd
});

// rpc.join('Login', 'Processes/Login/Login.js');
// rpc.join('World', 'Processes/World/World.js');


// TODO: Get this sorted, commit uncommented lines only when its ready and bugless.

// vmscript = require('./VMScript.js');
//
// global.config = {};
//
// var v = new vmscript();
// v.watch('Config/login.json');

// spawner.onReady(function(){
// 	console.log("Server loaded in", (new Date().getTime() - startTime), "ms");
// });

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
