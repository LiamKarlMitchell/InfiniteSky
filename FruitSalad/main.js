global.rpc = new (require('./Modules/rpc.js'))();

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

var childrens = {};
childrens['Login'] = {name: 'Login', script: 'Processes/Login/Login.js'};
childrens['World'] = {name: 'World', script: 'Processes/World/World.js'};

global.api = {};

// NOTE: Anything after second param is consider as arguments called on function name.
/**
 * Calls a function on a child process by name.
 * @param  {string}
 * @param  {string} The function name to call
 */
global.api.call = function(process_name, fn){
	// console.log("Calling function");
	var p = global.rpc.childrens[process_name];
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

for(var children in childrens){
	global.rpc.join(children, './Processes/process.js');
}

global.rpc.on('invalidated', function(children){
	if(!global.rpc.childrens[children].spawned){
		global.rpc.childrens[children].api.spawnScript(childrens[children].script);
		global.rpc.childrens[children].spawned = true;
	}
	global.rpc.invalidateAPI(global.api);
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
