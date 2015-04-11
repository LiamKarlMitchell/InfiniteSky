// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.NPCFunction = restruct.
int32lu('Key').
int32lu('Value');

WorldPC.TraderItem = restruct.
int32lu('Slot').
string('Username', 14).
int16lu('Unknown').
int32lu('ItemID').
int32lu('Amount').
int8lu('Enchant').
int8lu('Combine').
int16lu('Growth').
int32lu('Price');

WorldPC.TraderItems = restruct.struct('Items', WorldPC.TraderItem, 400);

WorldPC.Set(0x59, {
    Restruct: WorldPC.NPCFunction,

    function: function NPCFunctionRecv(client, input) {
        console.log("NPCFunction packet received: ", input);
	   	// Open Trader Items
		if (input.Key === 6 && input.Value === 1) {
		  // Send trader items to client.
		  client.write(
		  	packets.makeCompressedPacket( 0x77, 
		  	  new Buffer(
		  	  	WorldPC.TraderItems.pack(
		  	  		{ Items: [ 
		  	  			{ 
		  	  				Slot: 1,
		  	  				Username: 'Admin',
		  	  				ItemID: 1,
		  	  				Amount: 1337,
		  	  				Price: 1
		  	  			}]
		  	       }
		  	    )
		  	  )
		  	)
		  );
		} else {
		  client.sendInfoMessage('Unhandled NPCFunction Key '+input.Key+' '+input.Value);
		}}
});
