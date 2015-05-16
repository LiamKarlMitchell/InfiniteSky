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

global.vmscript = new (require('../vmscript.js'))();
global.vms = global.vmscript.vms;
global.api = {};

global.api.spawnScript = vmscript.watch;

ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();