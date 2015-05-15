var vms = new vmscript.reciever(process);

// console.log(process.env);

vms.depends([
 'config.network.json',
 'Test',
 'Packets_Login'
], function(){ // Callback with argument for reloading/loading a module?
 console.log("Login server code 123123", config.network.motd);
});


vms.depends([
 'config.network.json',
 'Packets_Login'
], function(){ // Callback with argument for reloading/loading a module?
 console.log("cos tam 2");
});


vms.once('load', function(){
 console.log("Loaded all modules");
});
