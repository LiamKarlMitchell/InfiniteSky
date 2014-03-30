// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */

cli.createaccount = function CLI_CreateAccount(input) {
 if (input === '') {
 	return console.log(cli.createaccount.help(1));
 }

 var info = util.sep(['Username','Password','Level'], input.split(' '));
 if (info.Username === undefined || info.Password === undefined) {
 	console.log('Username and Password required');
 	return;
 }

 if (info.Level === undefined) {
 	info.Level = 0;
 } else {
 	info.Level*=1;
 	if (Number.isNaN(info.Level) || info.Level != Math.floor(info.Level) || !(info.Level >= 0 && info.Level <=100)) {
 		return console.log('Account level should be a whole number from 0 to 100 inclusive.');
 	}
 }

 if (!db) {
 	console.log('Database not loaded yet');
 	return;
 }
 
  db.getNextSequence('accountid',function(id) {
  	info._id = id;
  	var newaccount = new db.mongoose.Account(info);
  	newaccount.save(function (err) {
  		  if (err) { // Assuming account already exists
  		    util.dumpError('Error making account already exists or there was an error.');
  		  	return;
  		  }
  		  console.log('Account '+info.Username+' has been created.');
  	});
  });

};

cli.createaccount.help = function CLI_CreateAccount_help(input) {
  var basicDescription = 'Lets you create an account.';
  if (!input) {
  	return basicDescription;
  }
  return basicDescription + '\nUsage: createaccount username password gmlevel\nExample: createaccount bobby tables 100\n\nLevel is optional default is 0.\nAccount will have no email set.';
};