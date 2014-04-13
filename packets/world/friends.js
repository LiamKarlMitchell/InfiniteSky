// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.Set(0x38,{
	Restruct: restruct.
	string('Friends',13,10).
	int32lu('Value1').
	int32lu('Value2'),
	function: function(socket, pac) {
		for (var i=0;i<10;i++)
		{
			socket.character.Friends[i] = pac.Friends[i];
			if (socket.character.Friends[i]!='') {
				SendCharacterOnlineStatus(socket,socket.character.Friends[i]);
			}
		}

		socket.character.markModified('Friends');	
		socket.character.save();
	}
});


WorldPC.FriendOnlineReply = restruct.
	int8lu('PacketID').
	string('Name',13).
	int8lu('IsOffline').
	int32lu('MapID').
	int32lu('Value');

function SendCharacterOnlineStatus(socket, Name) {
	var Friend = null;
	// Get friends onlinestate/locations etc
	for (var i=0;i<10;i++)
	{
		if (socket.character.Friends[i]===Name) {
			Friend = world.findCharacterSocket(socket.character.Friends[i]);
			break;
		}
	}

	socket.write(new Buffer(WorldPC.FriendOnlineReply.pack({
		PacketID: 0x1D,
		Name: Name,
		IsOffline: Friend ? 0 : 1,
		MapID: Friend ? Friend.Zone.ID : 0,
		Value2: 0
	})));
}

WorldPC.Set(0x07,{  // Client asking for Refresh (Friends));
	Restruct: restruct.
	string('Name',13).
	int32lu('Value1').
	int32lu('Value2'),
	function: function(socket, pac) {
		SendCharacterOnlineStatus(socket,pac.Name);
	}
});
