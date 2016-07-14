// TODO: Consider more consistent way of setting those.
// TODO: Registering callbacks.
// TODO: Add timeout for a callback to fire.

console.log = console.error;
console.dir = console.error;

var fork = require('child_process').fork;
var path = require('path');
var ee = require('events').EventEmitter;
var util = require('util');
var bson = require('bson');
var BSON = new bson.BSONPure.BSON;
var clone = require('clone');
var crypto = require('crypto');

function rpc(resume){
  this.EventEmitter = new ee();

  this.children = {};
  this.data = new Buffer([]);
  this.reminder = 0;

  this.hasChildren = false;
  this.isChildren = false;
  this.invalidatedChildrenCalls = [];
  this.invalidatedParentCalls = [];
  this.callOnReady = [];
  this.processesWaitingForInvalidationTable = {};
  this.pendingCallbacks = {};

  if(resume){
    this.isChildren = true;

    this.process = process;
    this.api = {};
    this.name = process.argv[2];

    var outputStream = this.getOutputStream(process);

    if(!outputStream){
      this.EventEmitter.emit('err', '');
      return;
    }

    var self = this;
    outputStream.on('readable', function(){
      outputStream.on('data', function(chunk){
        self.onChunk(chunk);
      });
    });
  }

  this.functions = {};
  // TODO: Make a function that will be callable on other side to call a callback.
}

rpc.prototype.getCallback = function(callback){
  var callback = this.pendingCallbacks[callback];
  if(!callback || typeof callback !== 'function'){
    console.log("Callback does not exists");
    return;
  }

  return callback;
  //
  // try{
  //   callback.apply(t, args);
  //   delete this.pendingCallbacks[callback];
  // }catch(e){
  //   // TODO: Logging
  // }
}

rpc.prototype.on = function(name, callback){
  this.EventEmitter.on(name, callback);
}

rpc.prototype.join = function(opts, processPath, args){
  // NOTE: args must be an array or leave it undefined.
  var name = opts.name;
  if(this.children[name]){
    // TODO (Ane): Logging in appropriate format.
    this.EventEmitter.emit('warning', 'Children ' + name + ' is already in array of children.');
    return;
  }

  processPath = path.resolve(processPath);

  // TODO: Consider listetning to error and end events. And removal of children
  // from rpc.
  // TODO: Check if the path to the file exists.
  
  // If debug mode enabled then allow children processes to listen on a new debug port.
  if (withDebug = process.execArgv.indexOf('--debug') > -1 || process.execArgv.indexOf('--debug-brk') > -1) {
      var debugPortOffset = opts.debugPortOffset;
      if (debugPortOffset === undefined) {
        console.error('Debug Port offset not defined for child process '+name+'.');
        debugPortOffset = 0;
      }
      var debugPort = (5858) + debugPortOffset;
      console.log('Debug port for child process '+name+' is '+debugPort+'.');
      process.execArgv.push('--debug=' + debugPort); 
  }

  var childProcess = fork(processPath, args ? args : [name], {silent: true});
  this.hasChildren = true;

  if (this.topLevel) {
    childProcess.stderr.pipe(process.stdout);
  } else {
    childProcess.stderr.pipe(process.stderr);
  }

  this.children[name] = {
    process: childProcess,
    api: {},
    name: name
  };

  var outputStream = this.getOutputStream(childProcess);
  var inputStream = this.getInputStream(childProcess);

  if(!outputStream || !inputStream){
    this.EventEmitter.emit('err', '');
    return;
  }


  var self = this;
  outputStream.on('readable', function(){
    outputStream.on('data', function(chunk){
      self.onChunk(chunk);
    });
  });

  var funcNames = [];

  for(var name in this.functions){
    funcNames.push(name);
  }

  // When connecting new child, push current api object
  obj = {};
  obj.id = 'API Invalidation';
  obj.functions = funcNames;

  inputStream.write(this.objectToBuffer(obj));
};

rpc.prototype.bufferToHex = function(buffer){
  var output = "";
  for(var i=0, length=buffer.length; i < length; i++){
    output += buffer[i].toString(16);
  }

  return output;
};

rpc.prototype.getInputStream = function(process){
  if(process.stdin && process.stdin.writable) return process.stdin;
  if(process.stdout && process.stdout.writable) return process.stdout;
  return null;
};

rpc.prototype.getOutputStream = function(process){
  if(process.stdin && process.stdin.readable) return process.stdin;
  if(process.stdout && process.stdout.readable) return process.stdout;
  return null;
};

rpc.prototype.objectToBuffer = function(obj){
  var data = BSON.serialize(obj, false, true, false);
  var size = data.length;
  size += 4;
  var buffer = new Buffer(size);
  var offset = 0;

  buffer.writeUIntLE(data.length, 0, 4); // Writing 32int unsigned size of data
  data.copy(buffer, 4); // Writing data string at offset 4
  return buffer;
};

rpc.prototype.onChunk = function(chunk){
  this.data = Buffer.concat([this.data, chunk]);

  while(this.data.length > 0){
    if(this.reminder === 0 && this.data.length >= 4){
      this.reminder = this.data.readUInt32LE(0);
      this.data = this.data.slice(4, this.data.length);
    }

    if(this.reminder > 0 && this.data.length >= this.reminder){
      var content = this.data.slice(0, this.reminder);
      this.data = this.data.slice(this.reminder, this.data.length);
      this.reminder = 0;

      try{
        var bsonObject = BSON.deserialize(content);
        this.onData(bsonObject);
      }catch(e){
        // TODO: Propper error object!!!
        this.EventEmitter.emit('err', e);
        console.log(e);
      }

      if(this.data.length < 4){
        break;
      }
    }else{
      break;
    }
  }
};

var apiFunction = function(){
  var args = []; for (i = 0; i < arguments.length; i++){
    var argument = arguments[i];
    if(typeof argument === 'function'){
      var hash = rpc.prototype.bufferToHex(crypto.randomBytes(8));
      while(this.rpc.pendingCallbacks[hash]){
        hash = rpc.prototype.bufferToHex(crypto.randomBytes(8));
      }
      this.rpc.pendingCallbacks[hash] = argument;
      arguments[i] = hash;
    }

    args.push(arguments[i]);
  }

  this.input.write(rpc.prototype.objectToBuffer({
    "id": "call",
    f: this.name,
    a: args
  }));
}


rpc.prototype.onData = function(obj){
  if(!obj.id) return;
  var self = this;

  switch(obj.id){
    case 'API Invalidation':
    var inputStream = this.getInputStream(this.process);
    if(!inputStream){
      this.EventEmitter.emit('err', '');
      return;
    }

    for(var i=0, length=obj.functions.length; i<length; i++){
      var funcName = obj.functions[i];
      this.api[funcName] = apiFunction.bind({name: funcName, input: inputStream, rpc: this});
    }

    this.EventEmitter.emit('invalidated', null);

    for(var i=0; i<this.callOnReady.length; i++){
      var f = this.callOnReady[i];
      if(f.children) continue;
      if(this.api && this.api[f.name]){
        inputStream.write(self.objectToBuffer({
          "id": "call",
          f: f.name,
          a: f.args
        }));
        this.callOnReady.splice(i, 1);
        i = i-1;
      }
    }

    if(obj.hash)
      inputStream.write(self.objectToBuffer({
        "id": "decrementHashTable",
        h: obj.hash
      }));
    break;

    case 'Children API Invalidation':
    var children = this.children[obj.name];
    if(!children) return;

    var inputStream = this.getInputStream(children.process);
    if(!inputStream){
      this.EventEmitter.emit('err', '');
      return;
    }

    for(var i=0, length=obj.functions.length; i<length; i++){
      var funcName = obj.functions[i];
      children.api[funcName] = apiFunction.bind({name: funcName, input: inputStream, rpc: this});
    }

    this.EventEmitter.emit('invalidated', obj.name);

    for(var i=0; i<this.callOnReady.length; i++){
      var f = this.callOnReady[i];
      if(!f || !f.children) continue;
      var children = this.children[f.children];
      if(children && children.api && children.api[f.name]){
        var inStream = this.getInputStream(children.process);
        inStream.write(self.objectToBuffer({
          "id": "call",
          f: f.name,
          a: f.args
        }));
        this.callOnReady.splice(i, 1);
        i = i-1;
      }
    }

    if(obj.hash)
      inputStream.write(self.objectToBuffer({
        "id": "decrementHashTable",
        h: obj.hash
      }));
    break;


    case 'decrementHashTable':
    var hashTable = this.processesWaitingForInvalidationTable[obj.h];
    if(!hashTable) return;
    hashTable.processes--;
    if(!hashTable.processes && hashTable.callback){
      hashTable.callback();
    }

    delete this.processesWaitingForInvalidationTable[obj.h];
    break;

    case 'call':
    var func = this.functions[obj.f];
    if(func && typeof func === 'function'){
      try{
        func.apply(this, obj.a);
      }catch(e){
        // TODO: Logging
        this.EventEmitter.emit('err', e);
      }
    }else{
      this.EventEmitter.emit('warning', '');
    }
    break;
  }
};

rpc.prototype.add = function(obj, callback){
  if(!obj){
    this.EventEmitter.emit('err', 'Adding a function to rpc, requires first argument');
    return;
  }

  var hash = crypto.randomBytes(8);
  hash = this.bufferToHex(hash);

  var functions = clone(this.functions, false);
  var funcNames = [];
  var functionName;

  functions.call = function(regex, function_name){
    var args = [];
    for(var i=2; i<arguments.length; i++){
      console.log(i);
    }
  };

  if(Array.isArray(obj)){
    for(var i=0, length=obj.length; i<length; i++){
      var fn = obj[i];
      if(typeof fn !== 'function') continue;
      functionName = fn.name;
      funcNames.push(functionName);
      functions[functionName] = fn;
    }
  }else if(typeof obj === 'object'){
    for(functionName in obj){
      if(typeof obj[functionName] !== 'function') continue;
      funcNames.push(functionName);
      functions[functionName] = obj[functionName];
    }
  }else if(typeof obj === 'function'){
    functionName = obj.name;
    funcNames.push(functionName);
    functions[functionName] = obj;
  }else{
    return;
  }

  var invalidated = 0;
  for(var i in functions){
    var v1 = functions[i];
    var v2 = this.functions[i];

    if(v1 && !v2 || !v1 && v2) invalidated++;
    else if(v1 && v2 && v1.toString() !== v2.toString()) invalidated++;
  }

  if(!invalidated){
    // TODO: Logging
    return;
  }

  this.functions = functions;
  var obj;
  if(typeof callback === 'function')
    var invalidationTable = this.processesWaitingForInvalidationTable[hash] = {
      processes: 0,
      callback: callback
    };

  if(this.hasChildren){
    for(var child in this.children){
      var c = this.children[child];
      var inStream = this.getInputStream(c.process);
      if(!inStream){
        console.log("No input stream");
        this.EventEmitter.emit('err', '');
        return;
      }

      obj = {};
      obj.id = 'API Invalidation';
      obj.functions = funcNames;


      if(invalidationTable){
        invalidationTable.processes++;
        obj.hash = hash;
      }

      inStream.write(this.objectToBuffer(obj));
    }
  }

  if(this.isChildren){
    var inStream = this.getInputStream(process);
    if(!inStream){
      this.EventEmitter.emit('err', '');
      return;
    }

    obj = {};
    obj.id = 'Children API Invalidation';
    obj.functions = funcNames;
    obj.name = this.name;

    if(invalidationTable){
      invalidationTable.processes++;
      obj.hash = hash;
    }

    inStream.write(this.objectToBuffer(obj));
  }
};

rpc.prototype.remove = function(name){
  if(name && typeof name === 'string' && this.functions[name]){
    delete this.functions[name];
    var functions = [];
    for(var name in this.functions){
      functions.push(name);
    }

    if(this.hasChildren){
      for(var child in this.children){
        var c = this.children[child];
        var inStream = this.getInputStream(c.process);
        if(!inStream){
          this.EventEmitter.emit('err', '');
          return;
        }

        inStream.write(this.objectToBuffer({
          id: 'API Invalidation',
          functions: functions
        }));
      }
    }

    if(this.isChildren){
      var inStream = this.getInputStream(process);
      if(!inStream){
        this.EventEmitter.emit('err', '');
        return;
      }

      inStream.write(this.objectToBuffer({
        id: 'Children API Invalidation',
        name: this.name,
        functions: functions
      }));
    }
  }
};

rpc.prototype.invalidateAPI = function(api){
  console.log("rpc.invalidateAPI is depracted", this.name);
  console.trace();
};


rpc.prototype.safeCall = function(obj){
  // TODO: typeof function check, before call.
  // TODO: Add timeouts.

  var args = []; for (i = 1; i < arguments.length; i++){
    var argument = arguments[i];
    if(typeof argument === 'function'){
      var hash = this.bufferToHex(crypto.randomBytes(8));
      while(this.pendingCallbacks[hash]){
        hash = this.bufferToHex(crypto.randomBytes(8));
      }
      this.pendingCallbacks[hash] = argument;
      arguments[i] = hash;
    }

    args.push(arguments[i]);
  }

  var type = typeof obj;
  var self = this;

  if(type === 'string'){
    if(!this.api[obj]){
      this.callOnReady.push({name: obj.name, args: args});
      return;
    }

    try{
      this.api[obj].apply(null, args);
    }catch(e){
      //TODO: Logging
    }
  }else if(type === 'object'){
    // TODO: Make timeout to remove pending call.
    if(!obj.name && !obj.child){
      // TODO: Logging, when we dont have a function name to call.
      return;
    }

    var callChild = obj.child;
    var callParent = obj.name;
    var timeout = obj.timeout || 0;

    // Hash will be used to clear the timeout if called before.
    var hash = crypto.randomBytes(8);
    hash = this.bufferToHex(hash);

    if(callChild && !this.children){
      // console.log("We got a call on children that does not exists");
      this.callOnReady.push({name: obj.name, args: args, children: obj.child, hash: hash});
      return;
    }

    if(callChild && this.children && !this.children[callChild]){
      // console.log('Call on children that does not exists');
      this.callOnReady.push({name: obj.name, args: args, children: obj.child, hash: hash});
      return;
    }

    if(callChild
      && this.children
      && this.children[callChild]
      && (!this.children[callChild].api || !this.children[callChild].api[obj.name])
    ){
      // console.log("Calling on children that has no api or does not have a function yet");
      this.callOnReady.push({name: obj.name, args: args, children: obj.child, hash: hash});
      return;
    }

    if(callChild){
      try{
        this.children[callChild].api[obj.name].apply(null, args);
      }catch(e){
        // TODO: Logging
      }
      return;
    }

    if(!callParent){
      // TODO: Logging
      return;
    }

    if(!this.api || !this.api[obj.name]){
      this.callOnReady.push({name: obj.name, args: args, hash: hash});
      return;
    }

    try{
      this.api[obj].apply(null, args);
    }catch(e){
      //TODO: Logging
    }
  }
}

module.exports = rpc;
