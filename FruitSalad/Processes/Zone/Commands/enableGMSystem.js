GMCommands.AddCommand(new Command('gm',60,function command_test(string, client){
  var test = restruct.
    int8lu('PacketID').
    int8lu('Result').
    int32lu('unk');

    client.write(new Buffer(test.pack({
      PacketID: 0x9C,
      Result: 0
    })));
}));
