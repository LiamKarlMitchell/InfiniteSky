//Constructor
var Command = function(Name, Level, Execute) {
        this.Name = Name;
        this.Level = Level;
        this.Execute = Execute;
        this.Alias = function(Name) {
            return new Command(Name, this.Level, this.Execute);
        }
    }
    // Need to inherit from Comand here.
    // Command.prototype = {
    // }
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
        this.Start = function() {
            if(typeof(gmscripts) === 'undefined') gmscripts = new vmscript('commands', 'commands');
        }
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
                if(client.account.Level < command.Level) {
                    // Cannot execute tell client too bad
                    client.sendInfoMessage('account.Level too low for this command');
                    return;
                }
                try {
                    command.Execute.call(this, CommandText, client);
                } catch(ex) {
                    dumpError(ex);
                    if(client.account.Level >= 80) {
                        client.sendInfoMessage(ex.toString());
                    }
                }
            } else {
                client.sendInfoMessage('Invalid Command');
            }
            // Check if character level is high enough
        }
    }
module.exports = new GMCommands();