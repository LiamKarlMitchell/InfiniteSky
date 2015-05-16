// var vms = new vmscript.reciever(process);

// // console.log(process.env);

// vms.depends([
//  'config.network.json',
//  'Test',
//  'Packets_Login'
// ], function(){ // Callback with argument for reloading/loading a module?
//  console.log("Login server code 123123", config.network.motd);
// });


// vms.depends([
//  'config.network.json',
//  'Packets_Login'
// ], function(){ // Callback with argument for reloading/loading a module?
//  console.log("cos tam 2");
// });


// vms.once('load', function(){
//  console.log("Loaded all modules");
// });


// config('Network', {
// 	port: 1234,
// 	ip: '127.0.0.1' // Put your IP to listen to here.
// });

// emit('config', 'Network', {});



// vms('World', [], function() {
//   ..... most the same as origional.
//   World_Prototype.sendToClan = function World_sendToClan(msg) {

//   };

//   if (typeof(world) === 'undefined') {
//   	world = new World();
//   }

//   api.sendToClan = World_Prototype.sendToClan.bind(world,1,2,3);

//   api.blah = function() {
//   	world.blah();
//   }

// })

// vms('Login', [], function(){

// })

// console.log(process.env.test());

// var ChildSpawner = require('../../Helper/ChildSpawner.js');
// ChildSpawner.resume();

// var spawner = ChildSpawner.Spawner();


console.log("Login Server Instance running");