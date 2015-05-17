fs = require('fs');

vmscript = new (require('../vmscript.js'))();
vms = global.vmscript.vms;
api = {};

api.spawnScript = vmscript.watch;

ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();