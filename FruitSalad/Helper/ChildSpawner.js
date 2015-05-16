// Setup easy to use module for spawning child processes.
// Attaching smith.js and allow supplying of an api.

var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var Agent = require('smith').Agent;
var Transport = require('smith').Transport;
var path = require('path');

function ChildSpawner(api) {
	this.api = api || {};
	this.childrens = {};

	var self = this;

	this.api.invalidateAPI = function(pid){
		if(pid && self.childrens[pid]){
			self.childrens[pid].agent
			.send(["ready", self.childrens[pid].agent._onReady]);
		}else{
			for(var c in self.childrens){
				if(!self.childrens[c]) continue;
				var children_thread = self.childrens[c].thread;
				if(!children_thread) continue;

				if(pid === children_thread.pid){
					self.childrens[c].agent
					.send(["ready", self.childrens[c].agent._onReady]);
				}
			}
		}
	}
}

ChildSpawner.prototype.spawnChild = function(opts){
	var self = this;
	var processEnv = path.resolve(__dirname, '..\\Processes\\process.js');
	var child = spawn(process.execPath, [processEnv]);

	child.stderr.pipe(process.stderr);

	var transport = new Transport([child.stdout, child.stdin]);
	var agent = new Agent(this.api);
	agent.connect(transport, function (err, api) {
		if (err) {
			console.log(err);
			return;
		}

		if(!self.childrens[opts.name]){
			api.spawnScript(opts.script);
			self.childrens[opts.name] = {
				agent: agent,
				thread: child
			};
		}
	});
}

var ChildSpawnerClient = function(){
	this.agent = new Agent(global.api);

	process.stdin.resume();
	console.log = console.error;

	this.transport = new Transport([process.stdin, process.stdout]);

	var self = this;
	this.agent.connect(this.transport, function (err, api) {
		if (err) {
			console.log(err);
			return;
		}

		global.api = self.agent.api;
		global.spawner_api = api;
	});
}

module.exports = {
	Spawner: ChildSpawner,
	Resume: ChildSpawnerClient
};