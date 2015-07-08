// TODO: Consider more consistent way of setting those.
console.log = console.error;
console.dir = console.error;

function dumpError(err) {
  if (err instanceof Error) {
    if (err.message) {
      console.error('\n\x1b[31;1m'+ (err.name || 'Error') +': ' + err.message+'\x1b[0m')
    }
    if (err.stack) {
      console.error('\x1b[31;1mStacktrace:\x1b[0m','\n',err.stack.split('\n').splice(1).join('\n'));
    }
  } else {
      console.error('\x1b[31;1m' + err+'\x1b[0m');
  }
}


var fork = require('child_process').fork;
var path = require('path');
var ee = require('events').EventEmitter;
var util = require('util');

function rpc(resume){
  this.EventEmitter = new ee();

  this.childrens = {};
  this.data = new Buffer([]);
  this.reminder = 0;

  this.hasChildrens = false;
  this.isChildren = false;

  if(resume){
    this.isChildren = true;

    this.process = process;
    this.api = {};
    this.name = process.argv[2];

    var outputStream = this.getOutputStream(process);
    if(!outputStream){
      this.EventEmitter.emit('error', '');
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
}

rpc.prototype.on = function(name, callback){
  this.EventEmitter.on(name, callback);
}

rpc.prototype.join = function(name, processPath, args){
  // NOTE: args must be an array or leave it undefined.

  if(this.childrens[name]){
    // TODO (Ane): Logging in appropriate format.
    this.EventEmitter.emit('warning', 'Children ' + name + ' is already in array of childrens.');
    return;
  }

  processPath = path.resolve(processPath);

  // TODO: Consider listetning to error and end events. And removal of children
  // from rpc.
  // TODO: Check if the path to the file exists.
  var childProcess = fork(processPath, args ? args : [name], {silent: true});
  this.hasChildrens = true;

  childProcess.stderr.pipe(process.stderr);

  this.childrens[name] = {
    process: childProcess,
    api: {},
    name: name
  };

  var outputStream = this.getOutputStream(childProcess);
  if(!outputStream){
    this.EventEmitter.emit('error', '');
    return;
  }

  var self = this;
  outputStream.on('readable', function(){
    outputStream.on('data', function(chunk){
      self.onChunk(chunk);
    });
  });
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
  var dataString = new Buffer(JSON.stringify(obj));
  var size = dataString.length;
  size += 4;
  var buffer = new Buffer(size);
  var offset = 0;

  var val = dataString.length;
  buffer[offset++] = val & 0xff;
  buffer[offset++] = (val >> 8) & 0xff;
  buffer[offset++] = (val >> 16) & 0xff;
  buffer[offset++] = (val >> 24) & 0xff;

  // buffer.writeUIntLE(dataString.length, 0, 4); // Writing 32int unsigned size of data
  dataString.copy(buffer, 4); // Writing data string at offset 4
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
        var jsonObject = JSON.parse(content.toString());
        this.onData(jsonObject);
      }catch(e){
        // TODO: Propper error object!!!
        this.EventEmitter.emit('error', e);
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

rpc.prototype.onData = function(obj){
  // console.log(obj, process.pid);
  if(!obj.id) return;
  var self = this;

  switch(obj.id){
    case 'API Invalidation':
    var inputStream = this.getInputStream(this.process);
    if(!inputStream){
      this.EventEmitter.emit('error', '');
      return;
    }

    for(var i=0, length=obj.functions.length; i<length; i++){
      var funcName = obj.functions[i];
      this.api[funcName] = function(){
        var args = []; for (i = 0; i < arguments.length; i++) args.push(arguments[i]);

        inputStream.write(self.objectToBuffer({
          "id": "call",
          f: funcName,
          a: args
        }));
      }
    }

    this.EventEmitter.emit('invalidated', null);
    break;
    case 'Children API Invalidation':
    var children = this.childrens[obj.name];
    if(!children) return;

    var inputStream = this.getInputStream(children.process);
    if(!inputStream){
      this.EventEmitter.emit('error', '');
      return;
    }

    for(var i=0, length=obj.functions.length; i<length; i++){
      var funcName = obj.functions[i];
      children.api[funcName] = function(){
        var args = []; for (i = 0; i < arguments.length; i++) args.push(arguments[i]);

        inputStream.write(self.objectToBuffer({
          "id": "call",
          f: funcName,
          a: args
        }));
      }
    }

    this.EventEmitter.emit('invalidated', obj.name);
    break;

    case 'call':
    var func = this.functions[obj.f];
    if(func && typeof func === 'function'){
      try{
        func.apply(this, obj.a);
      }catch(e){
        // TODO: Logging
        this.EventEmitter.emit('error', e);
      }
    }else{
      this.EventEmitter.emit('warning', '');
    }
    break;
  }
};

rpc.prototype.invalidateAPI = function(api){
  // TODO: Decide when to refresh the API. Leave if nothing will change to the
  // children and manage a better way to let know other of freshly unvalidated API.
  var functions = [];
  var filteredFunctions = {};
  for(var funcName in api){
    if(api[funcName] && typeof api[funcName] !== 'function') continue;

    if(functions.indexOf(funcName) === -1){
      functions.push(funcName);
      filteredFunctions[funcName] = api[funcName];
    }
  }

  this.functions = filteredFunctions;

  if(this.hasChildrens){
    for(var child in this.childrens){
      var c = this.childrens[child];
      var inStream = this.getInputStream(c.process);
      if(!inStream){
        this.EventEmitter.emit('error', '');
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
      this.EventEmitter.emit('error', '');
      return;
    }

    inStream.write(this.objectToBuffer({
      id: 'Children API Invalidation',
      name: this.name,
      functions: functions
    }));
  }
};

module.exports = rpc;
