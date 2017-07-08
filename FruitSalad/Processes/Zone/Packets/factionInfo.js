Zone.recv.showFactionInfo = restruct.
string('yangCaptured_HHMM', 6).
string('guanyinCaptured_HHMM', 6).
string('fujinCaptured_HHMM', 6).
string('jinongCaptured_HHMM', 6).
string('yaoguaiCaptured_HHMM', 6).
pad(941). // Unknown Data
int32lu('yangOwner').
int32lu('guanyinOwner').
int32lu('fujinOwner').
int32lu('jinongOwner').
int32lu('yaoguaiOwner');

Zone.send.factionInfo = restruct.
int8lu('PacketID').
int8lu('unknown1').
int32lu('unknown2').
string('yangCaptured_HHMM', 6).
string('guanyinCaptured_HHMM', 6).
string('fujinCaptured_HHMM', 6).
string('jinongCaptured_HHMM', 6).
string('yaoguaiCaptured_HHMM', 6).
pad(941). // Unknown Data
int32ls('yangOwner').
int32ls('guanyinOwner').
int32ls('fujinOwner').
int32ls('jinongOwner').
int32ls('yaoguaiOwner');

// Recv request for Faction Info.
ZonePC.Set(0x7C, {
  Restruct: Zone.recv.showFactionInfo,
  function: function(client, input) {

    client.write(new Buffer(Zone.send.factionInfo.pack({
      PacketID: 0x6A,
      yangCaptured_HHMM: '',
      guanyinCaptured_HHMM: '',
      fujinCaptured_HHMM: '',
      jinongCaptured_HHMM: '',
      yaoguaiCaptured_HHMM: '',
      yangOwner: -1,
      guanyinOwner: -1,
      fujinOwner: -1,
      jinongOwner: -1,
      yaoguaiOwner: -1
    })));

  }
});