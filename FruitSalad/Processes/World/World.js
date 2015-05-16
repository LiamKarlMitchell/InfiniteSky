console.log("World instance");

var ChildSpawner = require('../Helper/ChildSpawner.js');
var zone_spawner = new ChildSpawner.Spawner({});

zone_spawner.spawnChild({name: 'Z001', script: 'Processes\\Zone\\Zone.js'});
zone_spawner.spawnChild({name: 'Z002', script: 'Processes\\Zone\\Zone.js'});
zone_spawner.spawnChild({name: 'Z003', script: 'Processes\\Zone\\Zone.js'});
zone_spawner.spawnChild({name: 'Z004', script: 'Processes\\Zone\\Zone.js'});