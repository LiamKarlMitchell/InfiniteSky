fs = require('fs');

vmscript = new (require('../VMScript.js'))();
api = {};

api.spawnScript = vmscript.watch;

ChildSpawner = require('../Helper/ChildSpawner.js');
var client = ChildSpawner.Resume();