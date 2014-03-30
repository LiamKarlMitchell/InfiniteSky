// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
"use strict";

var repl = require('repl');
var vm = require('vm');
var sys = require('sys')
var exec = require('child_process').exec;

function handleShellOutput(error, stdout, stderr) { sys.puts(stdout) }

var command_args_regex = /^\(\/([\w\-]+)[ ]?(.*)\s\)$/;

function CommandLineInterface(scope) {

  scope.cli = {};
  scope._cli = this;

  this.scripts = new scope.vmscript('cli', 'cli', scope);

  function handleInput(code, context, file, callback) {
  var result
    , err;

    if (code.length===3) { return };
    
    // Allows executing shell commands for example on windows
    // #notepad test.txt
    // #ipconfig
    // you shouldnt run anything with a terminal interface though.. that could get tricky
    // very experimental feature
    if (code.charAt(1)==='#') {
      exec(code.substr(2,code.length-4),handleShellOutput);
      return;
    }

    var command_args = code.match(command_args_regex);
    if (command_args) {
      if (typeof (scope.cli[command_args[1]]) === "function") {
        scope.cli[command_args[1]](command_args[2]);
      } else {
        console.log('\x1b[31;1m'+ 'Invalid command: `' + command_args[1] + '`' +'\x1b[0m');
      }
      return;
    }

    try {
      result = vm.runInNewContext(code, scope, file);
    } catch (err) {

      console.error('\x1b[31;1m'+ err+'\x1b[0m');
    }
  
    callback(err, result);
  }

  console.log('InfiniteSky CLI is now awaiting your input.');
  console.log('Type /help for listing of commands you can also execute JS or #.');
  var r = repl.start('', process, handleInput, true, true).on('exit', function () {
    scope.main.shutdown();
  });
  scope.repl = r;
}

module.exports = CommandLineInterface;