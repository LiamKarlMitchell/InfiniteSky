fs = require('fs');
var vm = require('vm');

vmscript = new (require('../VMScript.js'))();
api = {};

api.spawnScript = vmscript.watch;
// api.runInContext = function(code){
// 	try{
// 		vm.runInThisContext(code);
// 	}catch(e){
// 		console.log(e);
// 	}
// };
console.log = console.error;
console.dir = console.error;


ChildSpawner = require('../Helper/ChildSpawner.js');

// Prevent the following warning about possible memory leak with the EventEmitters.
// (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
process.setMaxListeners(0);

var client = ChildSpawner.Resume();