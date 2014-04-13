// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

LoginPC.GiftPacketReply = restruct.
	int8lu('packetID'). // 0C
	int32lu('code').
	struct('items',structs.GiftItem,10);

LoginPC.Set(0x0B, {
	Restruct: restruct.
	string('Username',8),
	function: function ReceiveGiftRequest(socket,data) {
	if (socket.authenticated == false || !socket._handle) return;
	console.log('Receive Gifts for '+data.Username);
	// Check if they have gifts on account
	// Can get Items from DB
	var Items = [];
	
	Items.push({ID: 83751, Amount: 1});
	Items.push({ID: 83754, Amount: 1});
	Items.push({ID: 83757, Amount: 1});

	Items.push({ID: 99204, Amount: 1});

	Items.push({ID: 99209, Amount: 1});
	Items.push({ID: 99230, Amount: 1});

	// Values for code to be
	// 0 = Can use
	// 1 = It cant be used right now
	// 2 = No items to be paid
	socket.write(new Buffer(LoginPC.GiftPacketReply.pack({packetID: 0x0C, code: 0, items: Items})));
	}
});

LoginPC.Set(0x0C, {
	Restruct: restruct.
	string('Username',8),
	function: function ClaimGiftRequest(socket,data) {
	if (socket.authenticated == false || !socket._handle) return;
	console.log('Try Claim Gifts for '+data.Username);
	// Check if they can claim the gifts
	// if so give them :).
	// return success/fail probably ID of 0D
	// Value can be
	// 0 = The new item has been paid to anterior // Items are removed from list and put elsewhere?
	// 1 = It cant be used right now
	// 2 = No items to be paid
	socket.write(new Buffer(LoginPC.Value.pack({PacketID: 0x0D, Value: 1})));
	}
});