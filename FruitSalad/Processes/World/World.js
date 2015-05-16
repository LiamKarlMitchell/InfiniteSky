vmscript.watch('Config');
vmscript.watch('test_dependency.js');
vmscript.watch('Database');

vms('World Server', ['Config/jsdoc.json', 'Test'], function(){
	console.log("World instance");

	function World(){
		this.is = "WOrld object yay!";
		this.runningZones = false;
	}

	World.prototype.sendToClan = function World_sendToClan(msg) {

	};


	if(typeof world === 'undefined') world = new World();

	if(!world.runningZones){
		var zone_spawner = new ChildSpawner.Spawner({});

		zone_spawner.spawnChild({name: 'Z001', script: 'Processes\\Zone\\Zone.js'});
		zone_spawner.spawnChild({name: 'Z002', script: 'Processes\\Zone\\Zone.js'});
		zone_spawner.spawnChild({name: 'Z003', script: 'Processes\\Zone\\Zone.js'});
		zone_spawner.spawnChild({name: 'Z004', script: 'Processes\\Zone\\Zone.js'});

		world.runningZones = true;
	}

	global.api.sendToClan = World.prototype.sendToClan;
	global.spawner_api.invalidateAPI(process.pid);

	console.log("jsdoc plugins:", config.jsdoc.plugins);
});