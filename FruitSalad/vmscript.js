var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
EventEmitter = new EventEmitter();
var vm = require('vm');
var path = require('path');

var array = {};
var fileStats = {};
var dependencies = {};

function VMScriptObj(){
	var self = this;

	EventEmitter.on('file added', function(file_path){
		console.log("file added", file_path);
		self.parse(file_path);
	});

	EventEmitter.on('file changed', function(file_path){
		console.log("file changed", file_path);
		self.parse(file_path);
	});

	EventEmitter.on('file removed', function(file_path){
		console.log("file removed", file_path);
	});

	EventEmitter.on('check dependencies', function(){
		for(var dependent in dependencies){
			var d = dependencies[dependent];

			if(d.depends && !d.running && !d.hasError){
				var loaded = 0;
				for(var i=0; i<d.depends.length; i++){
					var dp = d.depends[i];
					if(dependencies[dp] && dependencies[dp].running){
						loaded++;
					}
				}

				if(loaded === d.depends.length){
					if(d.callback){
						try{
							d.callback();
							d.running = true;
							EventEmitter.emit('check dependencies');
						}catch(e){
							console.log(e);
							d.hasError = true;
						}
					}
				}
			}
		}
	});
};

/* Reading the file contents and runs the code in this context. */
VMScriptObj.prototype.parse = function(file_path){
	fs.readFile(file_path, function(err, content){
		if(err){
			console.log(err);
			return;
		}

		var infos = path.parse(file_path);
		var ext = infos.ext.toLowerCase();
		var code = content.toString();

		global.require = require;
		global.file_path = file_path;

		var split_dir = infos.dir.split('\\');
		var file_name = getFilename(infos);

		dependencies[file_name] = {
			running: false,
			file_path: file_path
		};

		switch(ext){
			case '.json':
			try{
				vm.runInThisContext(split_dir[split_dir.length-1].toLowerCase() + '.' + infos.name + ' = ' + code + ';');
				dependencies[file_name].running = true;
				EventEmitter.emit('check dependencies');
			}catch(e){
				try{
					vm.runInThisContext(split_dir[split_dir.length-1].toLowerCase() + ' = {};');
					vm.runInThisContext(split_dir[split_dir.length-1].toLowerCase() + '.' + infos.name + ' = ' + code + ';');
					dependencies[file_name].running = true;
					EventEmitter.emit('check dependencies');
				}catch(e){
					console.log(e);
				}
			}
			break;

			case '.js':
			try{
				vm.runInThisContext(code);
				EventEmitter.emit('check dependencies');
			}catch(e){
				console.log(e);
			}
			break;
		}

		delete global.file_path;
	});
};

/* Function to return a file name based on directory and name. */
function getFilename(infos){
	var split_dir = infos.dir.split('\\');
	// TODO: Consider adding a __dirname check if we wont name the file outside project directory.
	return split_dir[split_dir.length-1] + '/' + infos.name + infos.ext.toLowerCase();
}

/* Function used to watch the file or directory for changes. */
VMScriptObj.prototype.watch = function(file_path){
	
	file_path = path.resolve(file_path);
	if(array[file_path]) return;

	var directory = false;
	fs.stat(file_path, function(err, stats){
		if(err){
			console.log(err);
			return;
		}

		if(stats.isDirectory()){
			directory = true;
			array[file_path] = {
				files: []
			};

			fs.readdir(file_path, function(err, files){
				if(err){
					console.log(err);
					return;
				}

				for(var i=0; i<files.length; i++){
					var fp = file_path + '\\' + files[i];
					array[file_path].files.push(fp);
					fileStats[fp] = fs.statSync(fp);
					EventEmitter.emit('file added', fp);
				}
			});
		}else if(stats.isFile()){
			array[file_path] = {
				stats: stats
			};

			EventEmitter.emit('file added', file_path);
		}

		fs.watch(file_path, function(){
			if(directory){
				fs.readdir(file_path, function(err, files){
					if(err){
						console.log(err);
						return;
					}

					files = files.filter(function(file){
						var infos = path.parse(file_path + '\\' + file);
						return infos.ext !== '.tmp' && infos.ext !== '.TMP';
					});

					for(var i=0; i<files.length; i++){
						files[i] = file_path + '\\' + files[i];

						var stat = fs.statSync(files[i]);
						var index = array[file_path].files.indexOf(files[i]);
						if(index > -1){
							var prvStat = fileStats[files[i]];

							if(prvStat.mtime.getTime() !== stat.mtime.getTime()){
								fileStats[files[i]] = stat;
								EventEmitter.emit('file changed', files[i]);
							}
							continue;
						}

						array[file_path].files.push(files[i]);
						EventEmitter.emit('file added', files[i]);
					}

					for(var i=0; i<array[file_path].files.length; i++){
						var f = array[file_path].files[i];
						try{
							fs.statSync(f);
						}catch(err){
							EventEmitter.emit('file removed', err.path);
							array[file_path].files.splice(
								array[file_path].files.indexOf(err.path),
								1
							);
						}
					}
				});
			}else{
				if(array[file_path]){
					fs.stat(file_path, function(err, stat){
						if(err){
							// delete array[file_path];
							// localEmitter.emit('file remove', err.path);
							// console.log('Removed file:', err.path);
							return;
						}

						var prvStat = array[file_path].stats;

						if(prvStat.mtime.getTime() !== stat.mtime.getTime()){
							array[file_path].stats = stat;
							EventEmitter.emit('file changed', file_path);
						}
					});
				}
			}
		});
	});
};

/* Exposed function to global scope for registering dependencies. */
VMScriptObj.prototype.vms = function(name, depends, callback){
	// console.log(this.file_path);
	// console.log(name);
	dependencies[name] = {
		running: false,
		depends: depends,
		callback: callback
	};

	EventEmitter.emit('check dependencies');
};

/**
 * A module that exports methods to watch script files for changes.
 * And to load scripts at runtime.
 * @module vmscript
 */
module.exports = VMScriptObj;