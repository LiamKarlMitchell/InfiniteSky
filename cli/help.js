// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */
"use strict";

cli.help = function CLI_Help(input) {  
  // TODO: Get command name from input etc....
  if (input !== '') {
    if (typeof (cli[input]) === 'function') {
      console.log(input + ' help');
      if (typeof (cli[input].help) === 'function') {
        console.log('description: ' + cli[input].help(input));
      }
    }
    return;
  }

  var name, output;
  for (name in cli) {
    if (cli.hasOwnProperty(name)) {
      output = name;
      if (typeof (cli[name]) === 'function' && typeof (cli[name].help) === 'function') {
        output += ' - ' + cli[name].help();
      }
      console.log(output);
    }
  }
};

cli.help.help = function CLI_Help_help(input) {
  return 'Shows a list of commands you can enter.';
};
