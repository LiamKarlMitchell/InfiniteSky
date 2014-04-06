// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

var pjson = require('./package.json');
var node_util = require('util');
var scope = require('./sandbox');
var fs = require('fs');

var util = {
  package: pjson,
  util: node_util,

  dumpError: function dumpError(err) {
    if (typeof err === 'object') {
      if (err.message) {
        console.error('\n\x1b[31;1mException: ' + err.message+'\x1b[0m')
      }
        console.log(new Date());
      if (err.stack) {
        console.error('\x1b[31;1mStacktrace:\x1b[0m','\n',err.stack.split('\n').splice(1).join('\n'));
      }
    } else {
      console.error('\x1b[31;1m' + err+'\x1b[0m');
    }
    // Push to redis if required for logging etc
  },

  logHex: function(data) {
    console.log("\n");
    var testSplit = data.toString("hex");
    testSplit = testSplit.match(/../g);

    var lineVal = "";
    var hexCounter = 0;
    for(var i = 0; i < testSplit.length; i++) {
      lineVal += testSplit[i] + " ";
      hexCounter++;
      if(hexCounter == 15) {
        console.log(lineVal);
        lineVal = "";
        hexCounter = 0;
      }
    }
  },


  setupUncaughtExceptionHandler: function () {
    process.on('uncaughtException',function(exception) {
      util.dumpError(exception);
    });
  },

  padLeft: function(string,pad,amount) {
    return (new Array(amount).join(pad)+string).slice(-amount);
  },
  // TODO: Make Async?
  loadConfig: function(name) {
    if (name !== undefined) util.configFile = name;
    if (util.configFile === undefined) {
      return util.dumpError("loadConfig requires a config file name to be passed as an argument.");
    }
    console.log('Attempting to load config file: '+util.configFile);
    try {
      util.config = JSON.parse(fs.readFileSync(util.configFile,{ encoding: 'ascii' }));
      //console.log(util.config.natTranslations);
      scope.main.events.emit('config_loaded');
      return util.config;
    } catch(ex) {
      util.dumpError(ex);
      return null;
    }
  },

  outputHeaderText: function () {
    var HeaderText = "\n\
 _____       __ _       _ _       _____ _          \n\
|_   _|     / _(_)     (_) |     /  ___| |         \n\
  | | _ __ | |_ _ _ __  _| |_ ___\\ `--.| | ___   _ \n\
  | || '_ \\|  _| | '_ \\| | __/ _ \\`--. \\ |/ / | | |\n\
 _| || | | | | | | | | | | ||  __/\\__/ /   <| |_| |\n\
 \\___/_| |_|_| |_|_| |_|_|\\__\\___\\____/|_|\\_\\\\__, |\n\
                                              __/ |\n\
   "+util.padLeft('v'+util.package.version+' - '+util.package.version_name,' ',41)+" |___/ \n";
    console.log(HeaderText);
    console.log('\x1b[36;1m'+ new Date() +'\n\x1b[0m');

    // Get last log message from git?

   console.log("InfiniteSky  Copyright (C) 2014  InfiniteSky Dev Teams\n\
 This program comes with ABSOLUTELY NO WARRANTY.\n\
 This is free software, and you are welcome to redistribute it\n\
 under certain conditions. For more information see LICENSE");
  },

  // a is array of key names
  // b is input array
  // returns object with keys set to b indexs in order of a key names
  sep: function (a,b) {
    var o = {};
    for (var i=0;i<a.length;i++) {
      if (i>b.length) {
        break;
      }
      o[a[i]] = b[i];
    }
    return o;
  }
}

module.exports = util;