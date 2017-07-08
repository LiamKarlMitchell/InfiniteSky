GMCommands.AddCommand('sm', 100, function spawnMonster(string, client){
	var args = string.getArgs();

	console.log("Spawning monster", args);
});