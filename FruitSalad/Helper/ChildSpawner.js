// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

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
	this.totalChildrens = 0;
	this.totalReadyChildrens = 0;
	this.callback = null;

	var self = this;

	this.api.invalidateAPI = function(pid){
		// TODO: Consider a timeout.
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

	this.api.run = function(){
		self.totalReadyChildrens++;
		if(self.totalChildrens === self.totalReadyChildrens){
			if(typeof self.callback === 'function'){
				self.callback();
				delete self.callback;
			}
		}
	}

	this.api.call = function(process_name, callback, args){
		// console.log(process_name, callback, args);

		var p = self.childrens[process_name];

		if(p.api[callback]){
			console.log("Calling", process_name, 'for', callback);
			p.api[callback].apply(self, args);
		}
	};
}

ChildSpawner.prototype.onReady = function(callback){
	this.callback = callback;
};

ChildSpawner.prototype.spawnChild = function(opts, callback, args){
	args = args || [];
	
	var self = this;
	var processEnv = path.resolve(__dirname, '..\\Processes\\process.js');
	var child = fork(processEnv, args, {silent: true});

	// console.log(child);
	if(opts.pipeError === undefined || opts.pipeError === true) {
		child.stderr.pipe(process.stderr);
	}

	var transport = new Transport([child.stdout, child.stdin]);
	var agent = new Agent(this.api);
	agent.connectionTimeout = 0;

	this.totalChildrens++;
	agent.connect(transport, function (err, api) {
		if (typeof(child.onLoaded) === 'function') {
			child.onLoaded(err);
		}
		if (err) {
			self.totalChildrens--;
			console.log(err);
			return;
		}
		if(!self.childrens[opts.name]){
			if(opts.script) {
				api.spawnScript(opts.script);
			}
			// if(opts.manual === undefined || opts.manual === true) self.totalReadyChildrens++;
			// if(self.totalChildrens === self.totalReadyChildrens){
			// 	if(typeof self.callback === 'function'){
			// 		self.callback();
			// 		delete self.callback;
			// 	}
			// }

			self.childrens[opts.name] = {
				agent: agent,
				thread: child,
				api: api
			};
		}
	});

	return child;
};

var ChildSpawnerClient = function(){
	this.agent = new Agent(global.api);
	this.agent.connectionTimeout = 0;

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
		process.api = api;
	});
}

module.exports = {
	Spawner: ChildSpawner,
	Resume: ChildSpawnerClient
};