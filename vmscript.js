/*    Copywrite Liam Mitchell 2014
 *    This file is part of vmscript.
 *
 *    vmscript is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    vmscript is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with vmscript.  If not, see <http://www.gnu.org/licenses/>.
 */

// I will be making this into its own library avaliable on NPM sometime soon.

/* jslint node: true */
"use strict";

var fs = require('fs');
var vm = require('vm');
var util = require('./util');
var path = require('path');
var jshint = require('jshint').JSHINT;
var events = require('events');

var loadedScriptNamespaces = {};

function getNamespace(name) {
  return loadedScriptNamespaces[name] || null;
}

var vmscriptEventEmitter = new events.EventEmitter();

// TODO: Make this sync? so that callback can be done when everythings finished loading. Or figure out how to do that async...
// vmscript can watch a directory and you can pass a sandbox to it such as this
function vmscript(name,directory,sandbox) {
  this.LastAdded = null;
  if (!sandbox) {
    sandbox = {};
  }
  this.eventEmitter = vmscriptEventEmitter;
  var scripts = sandbox['scripts_'+name] = this;
  this.unload = {};
  sandbox.console = console;
  sandbox.Buffer = Buffer;
  scripts.__fileTimes = [];

  loadedScriptNamespaces[name] = this;
  // TODO: Fix unloading so it actually works as expected, maybe create a better interface if possible such as commands/scripts registering
  // functions by name which can be auto removed if required eg delete sandbox[name][functionname];
  this.Unload = function(file) {
    if (scripts.__fileTimes[name+'_'+file]) {
      if (typeof(scripts.unload[name+'_'+file]) === 'function') {
        scripts.unload[name+'_'+file]();
        console.log('Unloaded '+file);
      }
    }
  }

  this.Load = function(file,callback) {
    // this.Unload(file);
    if (typeof(scripts.__fileTimes[name+'_'+file])==='undefined') {
      scripts.__fileTimes[name+'_'+file] = new Date(0);
      if (!directory && fs.existsSync(file)) {
        fs.watch(file, function (event) {
          if (event==="change") {
            if (file[0]!='_' && file.indexOf('.js', file.length - 3) != -1)
            {
              scripts.Load(file);
            }
          }
       });
      }
    }

    fs.stat(file, function(err, stats){
      if (err) {
        util.dumpError(err);
        return;
      }
          if(stats.mtime.valueOf() === scripts.__fileTimes[name+'_'+file].valueOf()){
              //console.log("File Update Callback Stopped (same revision time)");
              return;
          }
          scripts.__fileTimes[name+'_'+file] = stats.mtime;

          // do your interesting stuff down here
      fs.readFile(file,function(err,data) {
        if (data.length === 0) { return; }
        console.log('vmscript loading: '+file);

        if (err) {
          //console.log(err);
          util.dumpError(err);
          if (callback) callback(err,file);
        }
        else
        {
          try {
              sandbox.__filename = file;
              sandbox.__dirname = path.dirname(file);
              sandbox.module = {};
              //var context = vm.createContext(sandbox);
              var result = vm.runInNewContext(data.toString(), sandbox, path.normalize(file));
              if (sandbox.module.exports !== undefined) {
                // TODO: Store exports from a script o.O could do an unload too :)
                // require.cache[require.resolve(file)]
                //console.log(sandbox.module.exports);
                //console.log(sandbox.module.exports.prototype);
                if (sandbox.module.name) {
                  console.log('Named module found');
                  var transfer;
                  if (sandbox.module.merge) {
                    if (sandbox[sandbox.module.name] !== undefined) {
                      if (typeof(sandbox[sandbox.module.name].transfer) === 'function' ) {
                        transfer = sandbox[sandbox.module.name].transfer();
                        console.log(sandbox[sandbox.module.name].transfer());
                        console.log(sandbox[sandbox.module.name].testa());
                      }
                      // If prototype is set
                      sandbox[sandbox.module.name].__proto__ = sandbox.module.exports.prototype;

                      if (typeof(sandbox.module.exports.transfer) === 'function' ) {
                        console.log('giving transfer data',transfer);
                        sandbox.module.exports.transfer(transfer);
                      }

                      console.log('module '+sandbox.module.name+' reloaded');
                    } else {

                      sandbox[sandbox.module.name] = sandbox.module.exports;
                      console.log('module '+sandbox.module.name+' loaded');

                    }
                  }
                  else
                  {
                    if (sandbox.module.name === undefined && typeof(sandbox.module.exports) === 'function' && sandbox.module.name) {
                      sandbox.module.name = sandbox.module.exports.name;
                    }

                    if (typeof(sandbox[sandbox.module.name].transfer) === 'function' ) {
                        transfer = sandbox[sandbox.module.name].transfer();
                    }

                    sandbox[sandbox.module.name] = sandbox.module.exports;
                    if (typeof(sandbox[sandbox.module.name].transfer) === 'function' ) {
                        sandbox[sandbox.module.name].transfer(transfer);
                      }

                    console.log('module '+sandbox.module.name+' loaded');

                  }
                }
                console.log(file);
              }
              //console.log('Loaded '+file);
            }
            catch (ex) {
              console.error('\x1b[31;1mFailed to load script: ' + file+'\x1b[0m');
              console.error('\x1b[33;1mReason: ' + ex.message+'\x1b[0m');
              console.error(ex);

              if (!jshint(data.toString())) {
                for (var i=0;i<jshint.errors.length;i++) {
                  var e = jshint.errors[i];
                  console.error('\x1b[31;1m' + '#'+(i+1)+' Line: '+e.line+' Col: '+e.character+' '+e.reason+'\x1b[0m');
                }
              }

            }
          }
          if (callback) callback(null,file);
      });
      });   
    return this;
  }

  if (directory) {
    // Get all files ending in .js
    console.log('Trying to load vmscripts from Directory: '+directory);
    fs.readdir(directory, function(err, files) {
      if (err) {
        console.log('Error loading directory'+directory);
      }
      else
      {
        for (var i=0;i<files.length;i++) {
          var file = files[i];
          if (file[0]!='_' && file.indexOf('.js', file.length - 3) != -1)
          {
            scripts.Load(directory+'/'+file);
          }
        }
      }
    })

    // Watch directory for changes
    fs.watch(directory, function (event, file) {
      if (event==="change" || event==="rename") {
        //console.log('event is: '+event);
      if (file) {
          //console.log('file provided: ' + file);
        if (file[0]!='_' && file.indexOf('.js', file.length - 3) != -1)
        {
          scripts.Load(directory+'/'+file);
        }
      }
    }
    });
  }
};

vmscript.getNamespace = getNamespace;
module.exports = vmscript;

// function loadModule(moduleInfo) {
//   // If it can be loaded just fine
//   vmscriptEventEmitter.emit('loadedModule', moduleInfo);
//   sandbox[moduleInfo.name] = moduleInfo.exports;
//   if (typeof (moduleInfo.exports.onModuleLoaded) === 'function') {
//     moduleInfo.exports.onModuleLoaded();
//   }
// }

// function Waiter(moduleInfo) {
//   var waiter = this;
//   Waiters.push(waiter);

//   function onModuleLoaded(moduleInfo) {
//     if (moduleInfo.dependencies[moduleInfo.name]) {
//       moduleInfo.dependencies[moduleInfo.name] = true;

//       var canLoad= true;
//       for (var depends in moduleInfo.dependencies) {
//         if (moduleInfo.dependencies[depends] === false) {
//           canLoad = false;
//           break;
//         }
//       }

//       if (canLoad) {
//         vmscriptEventEmitter.removeListener('loadedModule', onModuleLoaded);
//         Waiters.splice(Waiters.indexOf(waiter));
//         loadModule(moduleInfo);
//       }

//     }
//   }

//   vmscriptEventEmitter.on('loadedModule', onModuleLoaded);
// }