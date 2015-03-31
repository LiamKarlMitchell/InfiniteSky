GMCommands.AddCommand(new Command('refill',0,function command_refill(string,client){
	console.log("Refilling the bottle");
	client.character.state.CalbashBottle.Capacity = 10;
	
	client.write(new Buffer(client.character.state.getPacket()));
}));