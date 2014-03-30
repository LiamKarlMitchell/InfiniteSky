// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: clearitems
// Clears every item off the ground on the zone client is on
GMCommands.AddCommand(new Command('clearitems',80,function command_clearitems(string,client){
		client.Zone.clearItems();
}));