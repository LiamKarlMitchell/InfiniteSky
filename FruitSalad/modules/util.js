// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
var fs = require('fs');

function dumpError(err) {
    if (typeof err === 'object') {
      if (err.message) {
        console.error('\n\x1b[31;1m'+ (err.name || 'Error') +': ' + err.message+'\x1b[0m')
      }
        console.log(new Date());
      if (err.stack) {
        console.error('\x1b[31;1mStacktrace:\x1b[0m','\n',err.stack.split('\n').splice(1).join('\n'));
      }
    } else {
      console.error('\x1b[31;1m' + err+'\x1b[0m');
    }
    // Push to redis if required for logging etc
}

var util = {
  package: require('../package.json'),
  toHexString: function(array){
    var key = "";
    for(var i=0; i<array.length; i++){
      key += array[i].toString(16);
    }
    return key;
  },

  dumpError: dumpError,

  logHex: function(data) {
    console.log(hexy(data));

    // console.log("\n");
    // var testSplit = data.toString("hex");
    // testSplit = testSplit.match(/../g);

    // var lineVal = "";
    // var hexCounter = 0;
    // for(var i = 0; i < testSplit.length; i++) {
    //   lineVal += testSplit[i] + " ";
    //   hexCounter++;
    //   if(hexCounter == 15) {
    //     console.log(lineVal);
    //     lineVal = "";
    //     hexCounter = 0;
    //   }
    // }
  },

    // If for some reason an IPv6 address is given we want to strip off the
    // junk and just get our IPv4 address
    cleanIP: function(ip) {
      return ip.substr(ip.lastIndexOf(':')+1);
    },

  setupUncaughtExceptionHandler: function () {
    process.on('uncaughtException',function(exception) {
      dumpError(exception);
    });
  },

  padLeft: function(string,pad,amount) {
    return (new Array(amount).join(pad)+string).slice(-amount);
  },
  // TODO: Make Async?
  loadConfig: function(name) {
    if (name !== undefined) configFile = name;
    if (configFile === undefined) {
      return dumpError("loadConfig requires a config file name to be passed as an argument.");
    }
    console.log('Attempting to load config file: '+configFile);
    try {
      config = JSON.parse(fs.readFileSync(configFile,{ encoding: 'ascii' }));
      //console.log(config.natTranslations);
      main.events.emit('config_loaded');
      return config;
    } catch(ex) {
      dumpError(ex);
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

global.dumpError = dumpError;
global.logHex = util.logHex;

module.exports = util;
