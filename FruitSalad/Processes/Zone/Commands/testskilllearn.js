GMCommands.AddCommand(new Command('ts',60,function command_testskilllearn(string, client){
	console.log("testskill command used.");

  	var value = 1;
  	var status = 0;
  	var args = string.split(' ');
	if (args.length > 0) {
  		value = parseInt(args[0]);
	}
	if (args.length > 1) {
		status = parseInt(args[1]);
	}

	client.write(
		new Buffer(
			Zone.send.learnSkillBookReply.pack({
				PacketID: 0x49,
				Status: status,
				Value: value
			})
		)
	);
  
}));

