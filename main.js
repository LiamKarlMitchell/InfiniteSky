#!/usr/bin/env node
/*  Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL  
 *
 *    InfiniteSky is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    InfiniteSky is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with InfiniteSky.  If not, see <http://www.gnu.org/licenses/>.
 */

// TODO: Clean up code
// TODO: Write documentation everywhere

/* jslint node: true */
/*global vmscript, util*/

/**
* @fileOverview
* Entrypoint to start an InfiniteSky server
* main.js should require all the things needed in vmscripts
* and start the vmscripts up.
*/

// TODO: Make an install script which could ask for the game directory to copy required information files
console.time('init-server');
var begin = new Date().getTime();
// Require anything that should be global here.
vmscript = require('./vmscript/vmscript');
csv = require('fast-csv');
_util = require('./util');
zlib = require('zlib');
extend = require("xtend");
GMCommands = require("./GMCommand");
Command = GMCommands.Command;
QuadTree = require('./QuadTree');
// TODO: See if we can replace CLI's inspect with eyes.inspect as its nicer and can be formatted nicely
// TODO: Rewrite restruct to use buffer when in node.js enviroment
restruct = require('./restruct');
async = require('async');
protoload = require('./protoload');
repl = require("repl");
jshint = require('jshint').JSHINT;
events = require('events');
hexy = require('hexy').hexy;
PacketCollection = require('./PacketCollection');
CachedBuffer = require('./CachedBuffer');
eyes = require('eyes');

// TODO: Make an improved way to save guard our inspect, we should be able to navigate the servers objects
// in a nice way. To see their members and propertys but not lag out the console with heaps of useless JSON output.
safeguard_cli = {
  // Prevent problem where someone types infos in the CLI
  // As it would output for ages... lets just output what we have as children
  // in the infos object
  inspect: function() {
    var output = [];
    for (var a in this) {
      if (this.hasOwnProperty(a)) {
        output.push(a);
      }
    }
    return '[ '+output.join(', ')+' ]';
  }
};

infos = {};
infos.__proto__ = safeguard_cli;

Netmask = require('netmask').Netmask;
net = net = require('net');
io = io = require('socket.io');
http = http = require('http');
fs = require('fs');
Server = require('./server');
GameInfoLoader = require('./GameInfoLoader');

// Constants/vars for multi purpose
var temp;

// Methods to call when shutting down server can be put into this array.
var shutdownMethods = [];
var shuttingDown = false;
main = {
  events: new events.EventEmitter(),
  addShutdownMethod: function(m) {
    shutdownMethods.push(m);
  },
  shutdown: function Main_Shutdown() {
    if (shuttingDown === true) return;
    shuttingDown = true;
    main.events.emit('Shutdown');
    console.log('The server is shutting down!');
    for (var i=0;i<shutdownMethods.length;i++) {
      try {
        shutdownMethods[i]();
      } catch (ex) {
        dumpError(ex);
      }
    }
    process.exit(0);
  }
};
natTranslations = [];

/** A function that is triggered when config.json is reloaded */
main.events.on('config_loaded', function Config_Reloaded() {
  // Handle reloading config things?
  // Currently anything that accesses the config values at runtime will be changed but the server
  // will not change the ports its listening on.
});

// Setup our uncaught exception handler and output our header text message.
_util.setupUncaughtExceptionHandler();
_util.outputHeaderText();

// Load Config
if (!_util.loadConfig('./config.json')) {
  console.log('Error loading config file.');
  process.exit(1);
}

// TODO: Config file watching for reload
fs.watchFile('./config.json', function(curr, perv) {
  if (!_util.loadConfig('./config.json')) { // TODO: Get config from arg but default to this
    console.log('Error loading config file.');
  }
})

natTranslations.length = 0;
config.natTranslations.forEach(function(natTranslation,index) {
  natTranslations[index] = new Netmask(natTranslation.mask);
  natTranslations[index].ip = natTranslation.ip;
});

db = new (require('./db'))(config.mongodb.connectString);
generic = new vmscript('Generic','generic');

var plugin_scripts = [];
plugin_scripts.push('login.js');
plugin_scripts.push('zone.js');
plugin_scripts.push('world.js');

console.log('Plugins to Load: ',config.plugins);
for (var i=0;i<config.plugins.length;i++) {
  plugin_scripts.push(config.plugins[i]);
}

plugins = {};

new GameInfoLoader().on('load', function(){
    plugins = new vmscript('plugins', plugin_scripts);
});

cli = new (require('./cli'));
console.timeEnd('init-server');
main.events.once('db_accounts_schema_loaded', clearLoggedInAccounts);
main.events.once('world_started', function() {
  GMCommands.Start();
});

function clearLoggedInAccounts() {
  console.log("Function clearLoggedInAccounts() is depracted");
}

var GameStep = require('./GameStep');

main.events.once('ready', function(){
  var timeTookToLoad = (new Date().getTime() - begin) / 1000;
  console.log("Total loading time: " + timeTookToLoad + "s");
  // var GameStep = require('./GameStep');
  var gs = new GameStep(function(delta){
   main.events.emit('step',delta);
  });

  gs.start();
});

// generic = new vmscript('generic','generic');




// // Get external ip address from external source and warn if config external ip is incorrect
// try {
//   generic = new vmscript('generic','generic');
//   plugins = new vmscript('plugins',null);

//   plugins.Load('login.js');
//   plugins.Load('zone.js');
//   plugins.Load('world.js');

//   // TEMP SOLUTION TO GET VMSCRIPT TRIGGER LOADING...
//   setInterval(function(){
//     plugins.emit('dependent_loaded');
//     generic.emit('dependent_loaded');
//     if (typeof(login) !== 'undefined') {
//       login.packets.scripts.emit('dependent_loaded');
//     }
//     if (typeof(world) !== 'undefined') {
//       world.packets.scripts.emit('dependent_loaded');
//     }
//   },5000);

//   console.log('Plugins to Load: ',config.plugins);
//   for (var i=0;i<config.plugins.length;i++) {
//     plugins.Load(config.plugins[i]);
//   }
// }
// catch (ex) {
//   console.error('Problem loading up basic scripts');
//   dumpError(ex);
// }

// function clearLoggedInAccounts() {
//   console.log('Clearing all accounts that are logged in.');
//   db.Account.logoutAll();

//   db.scripts.on('dependent_loaded',function(info){ plugins.emit('dependent_loaded',info); });
//   plugins.emit('dependent_loaded','db.js');
// }

// main.events.once('db_accounts_schema_loaded', clearLoggedInAccounts);
// main.events.once('world_started', function() {
//   GMCommands.Start();
// });
// main.events.on('gameinfo_loaded',function(info){
//   console.log('GameInfo LOADED: '+info);
//   plugins.emit('dependent_loaded',info);
// });
// var db = new (require('./db'))(config.mongodb.connectString);

// // Start up Command Line Interface

// console.timeEnd('init-server');

// var GameStep = require('./GameStep');
// var gs = new GameStep(function(delta){
//  main.events.emit('step',delta);
// });

// gs.start();

// TODO: Handle exiting server gracefully when signal received to close
process.on('SIGINT', function() {
    console.log('Received Signal');
    setTimeout(function() {
        console.log('Exit');
        process.exit(1);
    }, 10000);
});

process.on('exit', function(code) {
  // Use sync operations only to shutdown server.
});