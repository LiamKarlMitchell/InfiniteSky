// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: bring
// Brings another character to your location
GMCommands.AddCommand(new Command('bring',50,function command_bring(string,client){
		console.log(client.character.Name+' wants to bring '+string+' to their location');
		var otherName = string; // Need to get name from string
		other = this.World.findCharacterSocket(otherName);
		if (other==null)
		{
			client.sendInfoMessage(otherName+' could not be found');
			return;
		}
		
		client.sendInfoMessage('Bringing '+otherName+' to your location');
		// Teleport them to us
		if (other.Teleport(client.character.state.Location,client.character.MapID)==false) client.sendInfoMessage('Bring Failed');
}));