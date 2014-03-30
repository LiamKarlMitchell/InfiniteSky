// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: shutdown
// Command to shutdown the server
GMCommands.AddCommand(new Command('shutdown',80,function command_shutdown(string,client){
	// Ask the database
	client.sendInfoMessage('Shutting down server');
	// Create an object to keep track of server shutdown.
	// Put world server and login server into a shutdown state, don't accept new connections
	// Remove their listeners
	// Disconnect all clients at countdown
	// Saving all their info etc.
	// Call process.exit
}));