// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: n
// Notice command to send to all players in world
GMCommands.AddCommand(new Command('n',50,function command_n(string,client){
	world.sendNotice(string);
}));