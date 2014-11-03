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
var path = require('path');
var util = require('util');
var jshint = require('jshint').JSHINT;
var events = require('events');

var loadedScriptNamespaces = {};

function getNamespace(name) {
  return loadedScriptNamespaces[name] || null;
}
// TODO: Make vmscript use fixed version of chokidir or some sort of implementation similar so it can have files and directorys added/removed at runtime.

function dumpError(err) {
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
}
global.dumpError = dumpError;

// TODO: Make this sync? so that callback can be done when everythings finished loading. Or figure out how to do that async...
function vmscript(vmscript_name,directory) {
  this.LastAdded = null;

  var scripts = global['scripts_'+vmscript_name] = this;
  this.unload = {};
  scripts.__fileTimes = [];

  this.Loaded  = [];
  this.Waiting = [];

  loadedScriptNamespaces[vmscript_name] = this;
  // TODO: Fix unloading so it actually works as expected, maybe create a better interface if possible such as commands/scripts registering

this.class = function(name) {

},
this.singleton = function(name) {

},
// Can be used like this
// Nameless Depends
// vms.depends('1,2,3', function() { Your Code } )
// Named Depends with dependencies
// vms.depends({ name: 'Test', dependencies: '1,2,3' }, function() { Your Code } )
// You can use depends for shorter name instead of dependencies
// dependencies can be array of string or a comma delimited string.
// It is expected that dependencies exist in global.
// To trigger a check simply call your vmscripts .emit('dependent_loaded')
this.depends = function(opts, code) {  
  if (code === undefined) {
    throw new Error('Please define code as 2nd argument in '+__filename);
  } else if (typeof(code)==='string') {
    code = new Function(code);
  }
  var dep = new Dependent(opts,code);
  dep.vms = this;
  this.addDependent(dep);
},
this.addDependent = function(dependent) {
  // if dependent name and file already exist in waiting then remove old ones.
  var len = this.Waiting.length;
  while (len--) {
    if (this.Waiting[len].name === dependent.name && this.Waiting[len].file === dependent.file) {
      this.Waiting[len].removeListeners();
      this.Waiting.splice(len,1);
    }
  }
  if (dependent.tryExecute() === null) {
    this.Waiting.push(dependent);
  }
},  
  this.Unload = function(file) {
    if (scripts.__fileTimes[vmscript_name+'_'+file]) {
      if (typeof(scripts.unload[vmscript_name+'_'+file]) === 'function') {
        scripts.unload[vmscript_name+'_'+file]();
        console.log('Unloaded '+file);
      }
    }
  }

  this.Load = function(file,callback) {
    // this.Unload(file);
    if (typeof(scripts.__fileTimes[vmscript_name+'_'+file])==='undefined') {
      scripts.__fileTimes[vmscript_name+'_'+file] = new Date(0);
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
        dumpError(err);
        return;
      }
          if(stats.mtime.valueOf() === scripts.__fileTimes[vmscript_name+'_'+file].valueOf()){
              //console.log("File Update Callback Stopped (same revision time)");
              return;
          }
          scripts.__fileTimes[vmscript_name+'_'+file] = stats.mtime;

          // do your interesting stuff down here
      fs.readFile(file,function(err,data) {
        if (data.length === 0) { return; }
        console.log(vmscript_name+' loading: '+file);

        if (err) {
          //console.log(err);
          dumpError(err);
          if (callback) callback(err,file);
        }
        else
        {
              // Backup things in global in case they are used
              var backup = {
                __filename: global.__filename,
                __dirname: global.__dirname,
                module: global.module,
                vms: global.vms
              }
          try {

              global.__filename = file;
              global.__dirname = path.dirname(file);
              global.module = {};
              global.vms = scripts;


              
              var result = vm.runInThisContext(data.toString(), path.normalize(file));
              if (global.module.exports !== undefined) {
                // TODO: Store exports from a script o.O could do an unload too :)
                // require.cache[require.resolve(file)]
                //console.log(module.exports);
                //console.log(module.exports.prototype);
                console.log('module exports is set');
                if (global.module.name) {
                  console.log('Named module found');
                  var transfer;
                  if (global.module.merge) {
                    if (global[global.module.name] !== undefined) {
                      if (typeof(global[global.module.name].transfer) === 'function' ) {
                        transfer = global[global.module.name].transfer();
                        console.log(global[global.module.name].transfer());
                      }
                      // If prototype is set
                      global[global.module.name].__proto__ = module.exports.prototype;

                      if (typeof(module.exports.transfer) === 'function' ) {
                        console.log('giving transfer data',transfer);
                        global.module.exports.transfer(transfer);
                      }

                      console.log('module '+module.name+' reloaded');
                    } else {

                      global[global.module.name] = module.exports;
                      console.log('module '+module.name+' loaded');

                    }
                  }
                  else
                  {
                    if (global.module.name === undefined && typeof(global.module.exports) === 'function' && global.module.name) {
                      global.module.name = module.exports.name;
                    }

                    if (typeof(global[global.module.name].transfer) === 'function' ) {
                        transfer = global[global.module.name].transfer();
                    }

                    global[global.module.name] = module.exports;
                    if (typeof(global[global.module.name].transfer) === 'function' ) {
                        global[global.module.name].transfer(transfer);
                      }

                    console.log('module '+module.name+' loaded');

                  }
                }
                
              }
              
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

              // Restore things in global that we backed up
              global.__filename = backup.__filename;
              global.__dirname = backup.__dirname;
              global.module = backup.module;
              global.vms = backup.vms;

          }
          if (callback) callback(null,file);
      });
      
      scripts.emit('dependent_loaded',file);
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

function Dependent(opts, code) {
  if (typeof(opts)==='string') {
    opts = { dependencies: opts };
  }

  this.name = opts.name || '';
  this.dependencies = opts.dependencies || opts.depends || []; // TODO: Make dependencies work with more formats eg function or string to seprate.

  if (typeof(this.dependencies) === 'string') {
    this.dependencies = this.dependencies.split(/[\s,]+/);
  }

  // TODO: Handle code being string or function to execute of code.
  this.file = global.__filename;
  this.dir = global.__dirname;
  this.code = code;
  this.executed = false;
  this.loadedDependencies = [];

  this._onDependentLoaded = function(info) { _this.tryExecute(); };

  var _this = this;
  vms.emit('dependent_init', { name: this.name, file: this.file, dir: this.dir });

  vms.on('dependent_loaded',  function(info){
    var loaded = _this.loadedDependencies.length;
    var need = _this.dependencies.length;

    if(loaded === need){
      return;
    }

    if(!info){
      _this.executeCode();
      return;
    }

    for(var i=0; i < need; i++){
      var depName = _this.dependencies[i];
      if(depName === info.name){
        loaded++;
        _this.loadedDependencies.push(info.name);
      }
    }

    if(need === loaded && !_this.executed){
      _this.executeCode();
    }
  }); // TODO: See about listening for events only for dependents we are interested in
}
Dependent.prototype = {
  checkDependencies: function(info) {
    // Assume this.dependencies is an array of strings for defined objects in global for now.
    for (var i=0;i<this.dependencies.length;i++) {
      var deppath = this.dependencies[i].split('.');
      var obj = global[deppath[0]];
      
      if (obj === undefined) return false;

      if (deppath.length>1) {
          for (var j=1;j<deppath.length;j++) {
            if (deppath[j].indexOf('()') === deppath[j].length-2) {
              obj = obj[deppath[j].substr(0,deppath[j].length-2)]();
            } else {
              obj = obj[deppath[j]];
            }
            if (!obj) return false;
          }
      }
    }
    return true;
  },
  tryExecute: function() {
    if (this.checkDependencies()) {
      return this.executeCode();
    }
    return null;
  },
  removeListeners: function() {
    if (this.vms) {
      this.vms.removeListener('dependent_loaded', this._onDependentLoaded);
    }
  },
  executeCode: function() {
    if (this.executed) return;

    var success = false;
    try {
      this.code();
      success=true;
    } catch (ex) {
      console.error('\x1b[31;1m' +'Problem in "'+this.name+'" '+this.file+'\x1b[0m');
      dumpError(ex);
    }

    this.vms.Waiting.splice(this.vms.Waiting.indexOf(this),1);
    this.removeListeners();
    if (success) {
      this.vms.emit('dependent_loaded', { name: this.name, file: this.file, dir: this.dir });
    }
    this.executed = true;
    delete this._onDependentLoaded;
    delete this.code;
    delete this.vms;
    return false;
  }
}

util.inherits(vmscript, require('events').EventEmitter);

vmscript.getNamespace = getNamespace;
module.exports = vmscript;

// function loadModule(moduleInfo) {
//   // If it can be loaded just fine
//   vmscriptEventEmitter.emit('loadedModule', moduleInfo);
//   global[moduleInfo.name] = moduleInfo.exports;
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
