vms('Command',[], function(){
    if (typeof(CommandPrototype) === 'undefined') {
        CommandPrototype = {};
    }


    global.Command = function Command(Name, Level, Execute, AllowTerm) {
        this.Name = Name;
        this.Level = Level;
        this.Execute = Execute;
        this.AllowTerm = AllowTerm ? true : false;
    };

    CommandPrototype.Alias = function Command_Alias(Name) {
        return new Command(Name, this.Level, this.Execute, this.AllowTerm);
    };

    global.Command.prototype = CommandPrototype;
});



vms('GMCommands', ['Command'], function(){
    if (typeof(GMCommandsPrototype) === 'undefined') {
        GMCommandsPrototype = {};
    }

    GMCommandsPrototype.AddCommand = function GMCommands_addCommand(command) {
        for(var i = 0; i < this.Commands.length; i++) {
            if(this.Commands[i].Name == command.Name) {
                this.Commands.splice(i, 1);
            }
        }
        this.Commands.push(command);
    };

    GMCommandsPrototype.getCommand = function GMCommands_getCommand(CommandName) {
        var command = null;
        for(var i = 0; i < this.Commands.length; i++) {
            if(this.Commands[i].Name == CommandName) {
                command = this.Commands[i];
                break;
            }
        }
        return command;
    };

    // If client is undefined and the command has AllowTerm set it can be executed.
    GMCommandsPrototype.Execute = function GMCommands_Execute(string, client) {
        if(string == "") return;
        // Get CommandName
        // String split for first space if no space found use whole string
        var indexofSpace = string.indexOf(' ');
        var CommandName = indexofSpace > -1 ? string.substr(0, indexofSpace).toLowerCase() : string;
        var CommandText = indexofSpace > -1 ? string.substr(indexofSpace + 1) : "";
        //console.log('GMCommand String: '+CommandName);
        //console.log('GMCommand Text: '+CommandText);
        // Check for the command here
        var command = this.getCommand(CommandName);
        if(command) {
            if (client !== undefined) {
                // Check if character level is high enough
                if(client.account.Level < command.Level) {
                    // Cannot execute tell client too bad
                    client.sendInfoMessage('account.Level too low for this command');
                    return;
                }
            } else {
                if (command.AllowTerm === false) {
                    return;
                }
            }
            try {
                command.Execute.call(this, CommandText, client);
            } catch(ex) {
                dumpError(ex);
                if (client !== undefined && client.account.Level >= 80) {
                    client.sendInfoMessage(ex.toString());
                }
            }
        } else {
            client.sendInfoMessage('Invalid Command');
        }
    };

    if (typeof(global.GMCommands) === 'undefined') {
        global.GMCommands = new (function GMCommands() {
                                this.Command = Command;
                                this.Commands = [];
                            })();
    }
    global.GMCommands.__proto__ = GMCommandsPrototype;
});
