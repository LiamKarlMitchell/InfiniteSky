# Command Tutorial

Welcome to the command tutorial, this is for GM Commands used by the chat interface.

There are two main locations where commands may be loaded from.

```/Commands```

```/Processes/Zone/Commands```

# Command file structure.

Should look something like this. (Could change)

```
// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: commands
// Used to tell the user all of the commands they can execute
GMCommands.AddCommand(new Command('commands',0,function command_commands(string,client){
   // String is the input after the command.
   // Client is the connected socket.
   // Do code here.
}));

/////////////////////////////////////////////////////////////
// Command: commands alias
GMCommands.AddCommand(GMCommands.getCommand('commands').Alias('help'));
```


Sending text to the clients chat window.

```
client.sendInfoMessage('Message');
```

We suggest that you take a poke around at other command scripts to learn more.