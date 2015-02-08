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

//var command_args_regex = /^\(\/([\w\-]+)[ ]?(.*)\s\)$/;
var command_args_regex = /^\/(\w+)\s?(.*)?$/;

function CommandLineInterface() {
  global.cli = {};
  this.scripts = new vmscript('cli', 'cli');

  function handleInput(code, context, file, callback) {
  var result
    , err;
    
    // Allows executing shell commands for example on windows
    // #notepad test.txt
    // #ipconfig
    // you shouldnt run anything with a terminal interface though.. that could get tricky
    // very experimental feature
    if (code.charAt(code.length-1) === '\n') {
      code = code.substr(0,code.length-1);
    }
    if (code.charAt(0)==='#') {  // TODO: Do an execute and get return code as err?
      exec(code.substr(2,code.length-4),handleShellOutput);
      callback(err, result);
      return;
    }

    var command_args = code.match(command_args_regex);
    console.log(command_args);
    if (command_args) {
      if (cli[command_args[1]] instanceof Function) {
        cli[command_args[1]](command_args[2]);
      } else {
        console.log('\x1b[31;1m'+ 'Invalid command: `' + command_args[1] + '`' +'\x1b[0m');
        callback('Invalid Command', result);
      }
      return;
    }

    // Execute Javascript if possible
    try {
      result = vm.runInThisContext(code, file);
    } catch (err) {
      console.error('\x1b[31;1m'+ err+'\x1b[0m');
    }
  
    callback(err, result);
  }

  console.log('InfiniteSky CLI is now awaiting your input.');
  console.log('Type /help for listing of commands you can also execute JS or #.');
  global.repl = repl.start('', process, handleInput, true, true).on('exit', function () {
    main.shutdown();
  });
}

module.exports = CommandLineInterface;