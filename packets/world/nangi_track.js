// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// To set Nangi Track status to started/betting just do this.
// zones[119].zone_script.nangi_race_track_status = 0;

// Nangi Track Place Bet Request Reply
// Use this as t.pac to figure out what the packet contains.
/*
6A 02 01 00 00 00 6B 00 00 00 5F 00 00 00 60 00
00 00 64 00 00 00 E8 03 00 00 02 00 00 00 6B 00
00 00 67 00 00 00 62 00 00 00 64 00 00 00 E8 03
00 00 03 00 00 00 61 00 00 00 62 00 00 00 5F 00
00 00 64 00 00 00 E8 03 00 00 04 00 00 00 5E 00
00 00 63 00 00 00 66 00 00 00 64 00 00 00 E8 03
00 00 05 00 00 00 63 00 00 00 62 00 00 00 6A 00
00 00 64 00 00 00 E8 03 00 00 06 00 00 00 5C 00
00 00 69 00 00 00 5F 00 00 00 64 00 00 00 E8 03
00 00 07 00 00 00 6A 00 00 00 5A 00 00 00 69 00
00 00 64 00 00 00 E8 03 00 00 08 00 00 00 67 00
00 00 60 00 00 00 5E 00 00 00 64 00 00 00 E8 03
00 00 01 00 00 00 02 00 00 00 01 00 00 00 02 00
00 00 01 00 00 00 00 00 00 00 00 00 00 00 01 00
00 00 90 BD 98 00 00 00 00 00 80 96 98 00 10 27
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 00
00 00 01 00 00 00 10 27 00 00               
*/

var NangiTrackStatusPacket = restruct.
int8lu('PacketID').
int8lu('status').
pad(312);

var NangiTrack_PlaceBetRequestPacket = restruct.
int32lu("Unknown1"). // 04 00 00 00
int32lu("Unknown2"); // 01 00 00 00
WorldPC.Set(0x4F, {
	Restruct: NangiTrack_PlaceBetRequestPacket,
	function: function NangiTrack_PlaceBetRequest(client, input) {
		if (client.Zone.ID != 119) {
			console.log('Character '+client.character.Name+' is trying to use NangiTrack Place Bet Request without being on the Nangi Track Map.');
			console.log('Nangi Track Place Bet Request',input);
			return;
		}

		var zone = zones[119];
		if (zone === undefined || zone.Loaded === false) {
			console.log('Zone is not loaded.');
			return;
		}

	
		console.log('Nangi Track Place Bet Request',input);
		switch (input.Unknown1) {
			case 2:
				var packet = getNangiTrackStatusPacket();
				if (packet) {
					client.write(new Buffer(NangiTrackStatusPacket.pack(packet)));
				}
			break;
		}
	}
});


var NangiTrack_PlaceBetRefreshPacket = restruct.
int32lu("Unknown1"). // 02 00 00 00
int32lu("Unknown2"); // 01 00 00 00

WorldPC.Set(0x50, {
	Restruct: NangiTrack_PlaceBetRequestPacket,
	function: function NangiTrack_PlaceBetRefresh(client, input) {
		if (client.Zone.ID != 119) {
			console.log('Character '+client.character.Name+' is trying to use NangiTrack Place Bet Refresh without being on the Nangi Track Map.');
			console.log('Nangi Track Refresh',input);
			return;
		}

		console.log('Nangi Track Refresh',input);
		var packet = getNangiTrackStatusPacket();

		if (packet) {
			client.write(new Buffer(NangiTrackStatusPacket.pack(packet)));
		}
	}
});

// TODO: Return values to set in 6A packet for Nangi Track stats.
function getNangiTrackStatusPacket() {
	var packet = { PacketID: 0x6A, status: 1 };

	var zone = zones[119];
	if (zone === undefined || zone.Loaded === false) {
		console.log('Nangi Track Zone 119 is not loaded.');

		return packet;
	}

	// nangi_race_track_status
	// 0 | Open for betting.
	// 1 | The [Nangi Track] is taking a break.
	// 2 | The [Nangi Track] is in progress.

	// This switch case is temporary until zone scripts are coded to initialize this value.
	// and we have a scheduling system.
	var status = 1;
	switch (zone.zone_script.nangi_race_track_status) {
		case 0:
			status = 0;
		break;
		case 1:
			status = 1;
		break;
		case 2:
			status = 2;
		break;
		default:
			status = 1;
		break;
	}

	packet.status = status;

	return packet;
}


var NangiTrack_PlaceBetPacket = restruct.
int32lu("Place"). // 1-8
int32lu("Unknown1").
int32lu("Silver").
int32lu("Unknown2").
int32lu("Unknown3");

WorldPC.Set(0x4D, {
	Restruct: NangiTrack_PlaceBetPacket,
	function: function NangiTrack_PlaceBet(client, input) {
		if (client.Zone.ID != 119) {
			console.log('Character '+client.character.Name+' is trying to use NangiTrack Place Bet without being on the Nangi Track Map.');
			console.log('Nangi Track Refresh',input);
			return;
		}

		if (input.Place < 1 || input.Place > 8) {
			// TODO: Hack Attempt ++
			client.sendInfoMessage('Cat of place '+input.Place+' does not exist.');
			return;
		}

		if (client.character.Silver < input.Silver) {
			// TODO: Hack Attempt ++
			client.sendInfoMessage('You do not have enough silver to place this bet.');
			return;
		}

		client.sendInfoMessage('You put a bet on Nangi Cat #'+input.Place+' of '+input.Silver);

		console.log('Nangi Track Place',input);
	}
});