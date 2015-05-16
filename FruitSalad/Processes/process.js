// setup enviorment for child process
fs = require('fs');
// vm = require('vm');
// path = require('path');

vmscript = new (require('../vmscript.js'))();
vms = global.vmscript.vms;
api = {};

api.spawnScript = vmscript.watch;

ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();