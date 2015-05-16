// var winston = require('winston');

// var config = {};

// if (config.logFile) {
// 	winston.add(winston.transports.File, { filename: config.logFile })
// }

// // For information on Winston please see https://github.com/winstonjs/winston
// winston.profile('Startup');
// winston.info('Starting InfiniteSky', { datetime: new Date() });

// //
// // Configure CLI output on the default logger
// //
// winston.cli();



// //
// // Handle errors
// //
// // logger.on('error', function (err) { /* Do Something */ });



// winston.profile('Startup');

// var vms = new vmscript.emitter();
// var fork = require('child_process').fork;

// // Watching for single file, pass: file path
// vms.watch('./config/network.json');
// vms.watch('./config/general.json');
// vms.watch('./database/character.js');
// vms.watch('./database/zone.js');

// // Watching dir, pass: name and dir path
// vms.watch('Packets_Login', './processes/packets_login');
// vms.watch('Packets_World', './processes/packets_world');

// // Watching thread, pass: name, file path and process
// vms.watch('Login Server', './processes/login.js', fork('processes/login'));
// vms.watch('World Server', './processes/world.js', fork('processes/world'));

var ChildSpawner = require('./Helper/ChildSpawner.js');
var spawner = new ChildSpawner.Spawner({});

spawner.spawnChild({name: 'Login', script: 'Processes\\Login\\Login.js'});
spawner.spawnChild({name: 'World', script: 'Processes\\World\\World.js'});