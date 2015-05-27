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

ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();