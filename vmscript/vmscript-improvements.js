vmscript.class('Name',function() {
  this.prototype.method = function() {
    console.log('Hi');
  }
});

vmscript.class('Name', {
  test: function(){}
});

vmscript.class('Name', {
  PrototypeMethodsHere: function(){};
}, [ 'ClassNameDependsOn' ]);

// Class with a function to check if dependencys are all loaded
// Given a script name and array of classes in that script
vmscript.class('Name', function(script, classes){
  if (typeof(infos) !== 'undefined' && typeof(infos.Item) !== 'undefined' && infos.Item.Loaded) {
    return true;
  }
  return false;
})

// Constructed only once but the prototype can be updated
vmscript.singleton('Name', Prototype, Dependencies);

// Reloadable json file could be used for configs
vmscript.json('Name', 'FilePath')

Events are emitted such as json_loaded

// Adds directory if not already added
vmscript.watchDirectory('Directory Name');

// Adds file if not added
vmscript.watchFile('Filename')

// Stops watching a directory
vmscript.unwatchDirectory('Directory Name')

// Stops watching file
vmscript.unwatchFile('Filename')

// Can I do a promises like function?

vmscript.class('Name',Prototype,Dependencies).on('unload', function() {
  // When script is unloaded
})

// Evets
vmscript.on('load',function(scriptname, classes) {

});

vmscript.on('unload',function(scriptname, classes))

// Special Methods in prototype
Constructor - // Called when create object
Deconstructor - // Called when remove object
Seralize - // A way to turn your object into json or binary export
           // Can pass a string as paramater
Unseralize - // A way to load object from previously saved variables
             // Give either json or buffer
// See about adding support/plugin for jsdoc to handle dependencies and names.


vmscript.deppendencies('blah.blah')
    .class('Name',Prototype)
    .class('Name',Prototype);

 // Can I support production making functionality? Eg building vmscripts into final scripts to use with require?
 npm install -g vmscript
 vmscript build /directory/path/to/main.js /output/directory
 // Parse all vmscripts and find their dependencies.
 // For each class name create files in similar directoryt structure to origional vmscripts
 // For each 

// When a dependencie is reloaded do I have to reload that script?