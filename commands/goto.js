// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: goto
// Takes you to another characters location
GMCommands.AddCommand(new Command('goto',50,function command_goto(string,client){
		console.log(client.character.Name+' wants to goto '+string+'\'s location');
		var otherName = string; // Need to get name from string
		other = world.findCharacterSocket(otherName);
		if (other==null)
		{
			client.sendInfoMessage(otherName+' could not be found');
			return;
		}
		
		client.sendInfoMessage('Going to '+otherName);
		// Teleport them to us
		if (client.Teleport(other.character.state.Location,other.character.MapID)==false) client.sendInfoMessage('Goto Failed');
}));