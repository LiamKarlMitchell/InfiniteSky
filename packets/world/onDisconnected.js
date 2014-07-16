// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.onDisconnected = function (client) {
	clearTimeout(socket.character.timeOuts.ChiUpdate);
}