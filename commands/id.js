// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

GMCommands.AddCommand(new Command('id', 80, function(string, client) {
	client.sendInfoMessage(client.toString());
}));