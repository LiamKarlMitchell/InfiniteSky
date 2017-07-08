Zone.recv.duelRequest = restruct.
  string('Name', 13).
  int8lu('usingPills').
  pad(8);

Zone.send.duelRequest = restruct.
  int8lu('PacketID').
  string('Name', 13).
  int8lu('Mode');

ZonePC.Set(0x20, {
  Restruct: Zone.recv.duelRequest,
  function: function(client, input){
    if(input.usingPills > 2 || input.usingPills === 0){
      return;
    }

    var invited = Zone.clientNameTable[input.Name];
    if(!invited){
      return;
    }


    if(!client.character.state.duelInvitations)
      client.character.state.duelInvitations = {};

    client.character.state.duelInvitations[invited.character.Name] = input.usingPills;

    invited.write(new Buffer(Zone.send.duelRequest.pack({
      PacketID: 0x36,
      Name: client.character.Name,
      Mode: input.usingPills
    })));
  }
});

ZonePC.Set(0x21, {
  function: function(client, input){
    // Pressing ok on invitation.
  }
});

Zone.recv.duelRequestResponse = restruct.
  string('Name', 13).
  int8lu('Denied').
  pad(9);

Zone.send.duelRequestResponse = restruct.
  int8lu("PacketID").
  string('Name', 13).
  int8lu('Status').
  int8lu('Status2');

Zone.send.startDuel = restruct.
  int8lu('PacketID').
  pad(2);

Zone.send.endDuel = restruct.
  int8lu('PacketID').
  pad(2);

ZonePC.Set(0x22, {
  Restruct: Zone.recv.duelRequestResponse,
  function: function(client, input){
    var invitedBy = Zone.clientNameTable[input.Name];
    if(!invitedBy){
      return;
    }

    if(input.Denied){
      invitedBy.write(new Buffer(Zone.send.duelRequestResponse.pack({
        PacketID: 0x38,
        Name: client.character.Name,
        Status: 1
      })));
      return;
    }

    invitedBy.write(new Buffer(Zone.send.duelRequestResponse.pack({
      PacketID: 0x38,
      Name: client.character.Name,
      Status: 0
    })));

    var usingPills = invitedBy.character.state.duelInvitations[client.character.Name];
    if(!usingPills){
      return;
    }

    delete invitedBy.character.state.duelInvitations[client.character.Name];

    var obj = {};
    obj.PacketID = 0x39;

    invitedBy.write(new Buffer(Zone.send.startDuel.pack(obj)));
    client.write(new Buffer(Zone.send.startDuel.pack(obj)));

    invitedBy.character.state.InDuel = usingPills;
    invitedBy.character.state.InDuelChallenger = 1;

    client.character.state.InDuel = usingPills;
    client.character.state.InDuelChallenger = 0;

    Zone.sendToAllArea(invitedBy, true, invitedBy.character.state.getPacket(), config.network.viewable_action_distance);
    Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.network.viewable_action_distance);
  }
});

ZonePC.Set(0x23, {
  function: function(client, input){
    // On duell accept some confirmation?
  }
});

ZonePC.Set(0x24, {
  function: function(client, input){
    // When timed out of a duel
  }
});
