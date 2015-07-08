// Used for a key value packet
Zone.send.KeyValue = restruct.
    int8lu('PacketID').
    int32lu('Key').
    int32ls('Value');

Zone.send.KeyValueUnsigned = restruct.
    int8lu('PacketID').
    int32lu('Key').
    int32lu('Value');
