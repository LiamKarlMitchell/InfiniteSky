function createAccount(username, password, level, email, pin) {
  var done = this.async();

  // Sort out arguments.
  username = username || '';
  password = password || '';
  level = parseInt(level) || 0;
  email = email || '';

  if (username === '') {
    console.error('Expecting username to be a string.');
    return done(false);
  }

  if (password === '') {
    console.error('Expecting password to be a string.');
    return done(false);
  }

  var usepin = false;
  if (pin !== undefined) {
    if ('^\d{4}$'.exec(pin) === null) {
      console.error('Expecting pin to be four numbers such as "0000".');
      return done(false);
    }
    usepin = true;
  }

  if (username === '' || password === '') {
    console.error('Expecting username and password.');
    return done(false);
  }

  // Load up VMScript and Database.
  vmscript = new (require('../VMScript.js'))();
  Database = require('../Modules/db.js');

  // This function will be executed when the config file is loaded.
  function onceConfigLoaded() {
    if (!config.login) {
    console.error('Expecting config.login to be set.');
      return done(false);
    }

    if (!config.login.database || !config.login.database.connection_string) {
      console.error('Expecting config.login.database.connection_string to be set.');
      return done(false);
    }

    // Attempt a database connection.
    Database(config.login.database.connection_string, function(){
      console.log("Database connected.");
      vmscript.watch('Database/account.js');
      vmscript.watch('Database/counter.js');

      // When loaded nessecarry database model/schemas.
      vmscript.once(['Account', 'Counter'], function(){

        db.getNextSequence('accountid', function(id) {
          if (id === null) {
            console.log('Error getting next sequence id.');
            return done(false);
          }

          // Make a document for our new account.
          var newaccount = new db.Account({
            _id: id,
            Username: username,
            Password: password,
            Email: email,
            Level: level,
            UsePin: usepin,
            Pin: pin
          });

          newaccount.save(function (err) {
              if (err) {
                console.error('Error creating account.', err);
                return done(false);
              }

              console.log('Account '+username+' has been created.');
              return done(true);
          });
        });

      });

    });

  }


  // When the config has been loaded.
  vmscript.once(['config'], onceConfigLoaded);
  
  // Load the login.json config.
  vmscript.watch('Config/login.json');
}

module.exports = function(grunt) {
  grunt.registerTask('createAccount', 'Creates a game account.', createAccount);
};
