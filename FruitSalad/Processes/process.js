// setup enviorment for child process

// looks at arguments, first is script name to run as entrypoint.
// other arguments could be passed to its constructor.
// 'Login'
// Login/Login.js
//  etc...

// vms.loadFile(entrypoint);

// global api;
var fs = require('fs');
var vm = require('vm');
var path = require('path');

global.api = {};

global.api.runInContext = function(file_path){
	// vms.loadFIle(entrypoint) instead
	// client.agent.api.test = function(){
	// 	console.log("Altered api function");
	// }

	// global.spawner_api.validateAPI(process.pid);

	fs.readFile(file_path, function(err, content){
		if(err){

			console.log(err);
			return;
		}


		var code = content.toString();
		global.vms = function(name, depends, callback){

		}
		global.require = require;
		vm.runInThisContext(code);
	});
}

var ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();