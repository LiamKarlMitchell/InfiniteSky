// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: get
// gets some value
GMCommands.AddCommand(new Command('get',60,function command_get(string,client){
		if (string === '') {
			client.sendInfoMessage('Usage: /get Level');
			client.sendInfoMessage('Or some other key name from Character or Character state structure.');
			return;
		}

		var value;
		if (client.character[string] !== undefined) {
			client.sendInfoMessage('client.character.'+string+' = '+client.character[string]);
		} else if (client.character.state[string] !== undefined) {
			client.sendInfoMessage('client.character.state.'+string+' = '+client.character.state[string]);
		} else {
			client.sendInfoMessage(string+' is undefined or not found.');
		}
}));
