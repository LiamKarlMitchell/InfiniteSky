// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Setup easy to use module for spawning child processes.
// Attaching smith.js and allow supplying of an api.

// var spawn = require('child_process').spawn;
// var fork = require('child_process').fork;
// var Agent = require('smith').Agent;
// var Transport = require('smith').Transport;
// var path = require('path');
//
// function ChildSpawner(api) {
// 	this.api = api || {};
// 	this.childrens = {};
// 	this.totalChildrens = 0;
// 	this.totalReadyChildrens = 0;
// 	this.callback = null;
//
// 	var self = this;
//
// 	this.api.invalidateAPI = function(pid){
// 		// TODO: Consider a timeout.
// 		if(pid && self.childrens[pid]){
// 			self.childrens[pid].agent
// 			.send(["ready", self.childrens[pid].agent._onReady]);
// 		}else{
// 			for(var c in self.childrens){
// 				if(!self.childrens[c]) continue;
// 				var children_thread = self.childrens[c].thread;
// 				if(!children_thread) continue;
//
// 				if(pid === children_thread.pid){
// 					self.childrens[c].agent
// 					.send(["ready", self.childrens[c].agent._onReady]);
// 				}
// 			}
// 		}
// 	}
//
// 	this.api.run = function(){
// 		self.totalReadyChildrens++;
// 		if(self.totalChildrens === self.totalReadyChildrens){
// 			if(typeof self.callback === 'function'){
// 				self.callback();
// 				delete self.callback;
// 			}
// 		}
// 	}
//
// 	/**
// 	 * Calls a function on a child process by name.
// 	 * @param  {string}
// 	 * @param  {string} The function name to call
// 	 */
// 	this.api.call = function(process_name, fn){
// 		var p = self.childrens[process_name];
// 		// TODO: Comment what this does behind the scenes.
// 		if(p && p.api[fn]){
// 			console.log({ process_name: process_name },"Calling");
// 			var args = [];
// 			for(var i=2; i<arguments.length; i++){
// 				args.push(arguments[i]);
// 			}
// 			p.api[fn].apply(self, args);
// 		}
// 	};
//
// 	/**
// 	 * Calls a function on all child processes matching the filter.
// 	 * @param  {(string|regex)} '*' for all
// 	 * @param  {string} The function name to call
// 	 */
// 	this.api.callAll = function(filter, fn) {
// 		var childrenNames = Object.keys(self.childrens);
// 		var args = [];
//
// 		for(var j=2; j<arguments.length; j++){
// 			args.push(arguments[j]);
// 		}
// 		// TODO: Optimize
// 		for (var i = 0; i<childrenNames.length; i++) {
// 			if (filter === '*' || (filter instanceof RegExp && filter.match(childrenNames[i])) || filter == childrenNames[i]) {
// 				var zone = self.childrens(childrenNames[i]);
// 				if (zone && zone.api[fn]) {
// 					console.log({ child: childrenNames[i], fn: fn },"Calling function on Child.");
// 					zone.api[fn].apply(self.zoneSpawner, arguments);
// 				}
//
// 			}
// 		}
// 	}
// }
//
// ChildSpawner.prototype.onReady = function(callback){
// 	this.callback = callback;
// };
//
// ChildSpawner.prototype.spawnChild = function(opts, callback, args){
// 	args = args || [];
//
// 	var self = this;
// 	var processEnv = path.resolve(__dirname, '../Processes/process.js');
// 	var child = fork(processEnv, args, {silent: true});
//
// 	// console.log(child);
// 	if(opts.pipeErrorToStdout) {
// 		child.stderr.pipe(process.stdout);
// 	} else if(opts.pipeError === undefined || opts.pipeError === true) {
// 		child.stderr.pipe(process.stderr);
// 	}
//
// 	var transport = new Transport([child.stdout, child.stdin]);
// 	transport.on('error', function (err) {
// 		console.error('smith error: '+err);
// 	});
// 	transport.on('disconnect', function (err) {
// 		console.error('smith disconnect: '+err);
// 	});
//
// 	var agent = new Agent(this.api);
// 	agent.connectionTimeout = 0;
//
// 	this.totalChildrens++;
// 	agent.connect(transport, function (err, api) {
// 		if (typeof(child.onLoaded) === 'function') {
// 			child.onLoaded(err);
// 		}
// 		if (err) {
// 			self.totalChildrens--;
// 			console.log(err);
// 			return;
// 		}
// 		if(!self.childrens[opts.name]){
// 			if(opts.script) {
// 				api.spawnScript(opts.script);
// 			}
// 			// if(opts.manual === undefined || opts.manual === true) self.totalReadyChildrens++;
// 			// if(self.totalChildrens === self.totalReadyChildrens){
// 			// 	if(typeof self.callback === 'function'){
// 			// 		self.callback();
// 			// 		delete self.callback;
// 			// 	}
// 			// }
//
// 			self.childrens[opts.name] = {
// 				agent: agent,
// 				thread: child,
// 				api: api
// 			};
// 		}
// 	});
//
// 	return child;
// };
//
// var ChildSpawnerClient = function(){
// 	this.agent = new Agent(global.api);
// 	this.agent.connectionTimeout = 0;
//
// 	process.stdin.resume();
// 	console.log = console.error;
//
// 	this.transport = new Transport([process.stdin, process.stdout]);
// 	this.transport.on('error', function (err) {
// 		console.error('smith error: '+err);
// 	});
// 	this.transport.on('disconnect', function (err) {
// 		console.error('smith disconnect: '+err);
// 	});
// 	var self = this;
// 	this.agent.connect(this.transport, function (err, api) {
// 		if (err) {
// 			console.error(err);
// 			return;
// 		}
//
// 		global.api = self.agent.api;
// 		process.api = api;
// 	});
// }
//
// module.exports = {
// 	Spawner: ChildSpawner,
// 	Resume: ChildSpawnerClient
// };

var ChildSpawner = function(api){

}

ChildSpawner.prototype.spawnChild = function(opts){
	global.rpc.join(opts.name, './Processes/process.js', null);
};

module.exports = {
	Spawner: ChildSpawner
};
