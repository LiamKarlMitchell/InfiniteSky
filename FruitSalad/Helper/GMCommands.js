//Constructor
var Command = function(Name, Level, Execute, AllowTerm) {
    this.Name = Name;
    this.Level = Level;
    this.Execute = Execute;
    this.AllowTerm = AllowTerm ? true : false;
    this.Alias = function(Name) {
        return new Command(Name, this.Level, this.Execute, this.AllowTerm);
    }
}

var GMCommands = function() {
        // TODO: Use object for storing commands in rather than array.
        // Add the Command Object refrence to this object so other modules can use it if needed
        this.Command = Command;
        this.Commands = [];
        // Adds support for Commands to be added from other modules
        this.AddCommand = function(command) {
            for(var i = 0; i < this.Commands.length; i++) {
                if(this.Commands[i].Name == command.Name) {
                    this.Commands.splice(i, 1);
                }
            }
            this.Commands.push(command);
        }
        // this.RemoveCommand = function(name)
        //  {
        //  	// Find the command by name
        //  	// Remove it from the Commands by using splice trick.
        // }
        this.GetCommandInfo = function() {
            // Get the command info from db for setting levels of commands dynamically?
        }
        this.getCommand = function(CommandName) {
            var command = null;
            for(var i = 0; i < this.Commands.length; i++) {
                if(this.Commands[i].Name == CommandName) {
                    command = this.Commands[i];
                    break;
                }
            }
            return command;
        }
        // If client is undefined and the command has AllowTerm set it can be executed.
        this.Execute = function(string, client) {
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
        }
    }
module.exports = new GMCommands();