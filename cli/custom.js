// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Attempt at a reloadable 'module'
// You can modify the prototypes functions such as test and change the text in the repl
// it will change to what you put in and save
// Try executing Custom.test();
function Custom() {
  this.number = 1;
  this.testa = function(){ return 2; }
}

Custom.prototype = {
  transfer: function(input) { // A way to transfer stored data out if required when reloading
    if (input === undefined) {
      // Output info
      // console.log('output info');
    } else {
      // Input info
      // console.log('input info ',input);
    }
  },
  test: function() {
    // console.log('The Cake is not a lie!');
  }
}

module.exports = Custom;
module.name = 'Custom';
module.merge = true;