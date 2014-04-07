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

// Require anything that should be global here.
vmscript = require('./vmscript');
util = require('./util');
zlib = require('zlib');
extend = require("xtend");

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
structs = require('./generic/structs');

Netmask = require('netmask').Netmask;
net = net = require('net');
io = io = require('socket.io');
http = http = require('http');
fs = require('fs');
Server = require('./server');
GameInfoLoader = require('./GameInfoLoader');

// Constants/vars for multi purpose
var temp;

/**
 * Our sandbox object.
 * This is used for vmscript code to run with.
 * Anything in here can be accessed by the vmscripts
 * Also there is a trick below which will take anything
 * in our global scope and put it into the sandbox object.
 * @dict
 */
var sandbox = require('./sandbox');

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
        util.dumpError(ex);
      }
    }
    process.exit(0);
  }
};
sandbox.main = main;
natTranslations = [];

/** A function that is triggered when config.json is reloaded */
main.events.on('config_loaded', function Config_Reloaded() {
  // Handle reloading config things?
  // Currently anything that accesses the config values at runtime will be changed but the server
  // will not change the ports its listening on.
});

// Get main to require some module and put it in sandbox. only valid in next load of script
// main_require = function(name,path) {
//   sandbox[name] = require(path);
//   console.log(sandbox);
// };

// Setup our uncaught exception handler and output our header text message.
util.setupUncaughtExceptionHandler();
util.outputHeaderText();

// Load Config
if (!util.loadConfig('./config.json')) {
  console.log('Error loading config file.');
  process.exit(1);
}

// TODO: Config file watching for reload
fs.watchFile('./config.json', function(curr, perv) {
  if (!sandbox.util.loadConfig('./config.json')) {
    console.log('Error loading config file.');
  }
})

natTranslations.length = 0;
util.config.natTranslations.forEach(function(natTranslation,index) {
  natTranslations[index] = new Netmask(natTranslation.mask);
  natTranslations[index].ip = natTranslation.ip;
});

// Get external ip address from external source and warn if config external ip is incorrect
try {
  generic = new vmscript('generic','generic',sandbox);
  plugins = new vmscript('plugins',null,sandbox);

  console.log(util.config.plugins);  
  for (var i=0;i<util.config.plugins.length;i++) {
    plugins.Load(util.config.plugins[i]);
  }
}
catch (ex) {
  console.error('Problem loading up basic scripts');
  util.dumpError(ex);
}

// Populate sandbox with any global things
for (temp in global) {
  if (global.hasOwnProperty(temp)) {
    sandbox[temp] = global[temp];
  }
}
// Assign things we may need to use in sandbox
sandbox.require = require;
sandbox.buffer = Buffer; // lower cased because something keeps turning my Buffer object into a SchemaBuffer. // TODO: Fix sandbox.Buffer to work.

function clearLoggedInAccounts() {
  console.log('Clearing all accounts that are logged in.');
  db.Account.logoutAll();
}
main.events.once('db_accounts_schema_loaded', clearLoggedInAccounts);

var db = new (require('./db'))(util.config.mongodb.connectString);

// Start up Command Line Interface
var cli = new (require('./cli'))(sandbox);

console.timeEnd('init-server');

var GameStep = require('./GameStep');
var gs = new GameStep(function(delta){
 main.events.emit('step',delta);
});

gs.start();

// TODO: Handle exiting server gracefully and pass a function through to sandbox
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