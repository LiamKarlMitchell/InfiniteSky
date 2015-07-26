Zone.IPAddressLength = 15;
Zone.recv.zoneChange = restruct.
  int32lu('MapID').
  pad(12);

Zone.send.zoneChange = restruct.
  int8lu('packetID').
  int8lu("Status").
  string("IP", Zone.IPAddressLength + 1).
  int32lu("Port");

// TODO: Set a flag on old zone to stop reading data of it.
// TODO: Prevent teleport map Hack

ZonePC.Set(0x08, {
  Restruct: Zone.recv.zoneChange,
  function: function(client, input){
    // TODO: Check if we got that zone in array.

    client.transferZone = input.MapID;
    // TODO: Callback with error arg to send and status 1 respond
    // telling that it was unable to connect to the other zone.

    rpc.api.isZoneAlive(input.MapID, Zone.id, client.hash, function(){
      this.character.MapID = this.transferZone;
      rpc.api.getMoveRegions(Zone.id, input.MapID, this.hash, function(moveRegions){
        var client = this;
        var portal = moveRegions[0];

        client.character.RealX = portal.X;
        client.character.RealY = portal.Y;
        client.character.RealZ = portal.Z;

        client.character.save(function(err){
          if(err){
            log.error('Could not save character on move zone.');
            return;
          }

          console.log("This is zoneChange callback for", client.character.Name);

          var transferObj = {
      			username: client.account.Username,
      			accountID: client.account._id,
      			character: client.character._id,
      			to: client.transferZone
      		};

          rpc.api.sendSocketToTransferQueue(transferObj);

          // TODO: Ip translations to be done.

          client.write(new Buffer(Zone.send.zoneChange.pack({
    					packetID: 0x0A,
    					Status: 0,
    					IP: '127.0.0.1',
    					Port: config.network.ports.world
    			})));
        });
      });
    });
  }
});
