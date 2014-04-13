// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// This file is to be used by server owners to import accounts.
/////////////////////////////////////////////////////////////
// Command: importaccounts
// Creates an account
GMCommands.AddCommand(new Command('importaccounts',100,function command_importaccounts(string,client){
		
	var Level = 60;

	function CreateAnAccount(username,password,email_address,level) {
		// Make an account
		db.getNextSequence('accountid',function(id) {

			newaccount = new db.Account({Username: username, Password: password, Email: email_address, Level: level, _id: id});
			newaccount.save(function (err) {
				  if (err) {
				  	//console.log(err);
				  	//client.sendInfoMessage('Error making account '+username+' already exists');
				  	return;
				  }

				  client.sendInfoMessage('Account '+username+' has been created');

				  // Send email here
				  var mail = {
				    from: config.smtpTransport.auth.name+" <"+config.smtpTransport.auth.user+">", // sender address
				    to: email_address, // list of receivers
				    subject: "Welcome to TSX Private Server", // Subject line
				    text: "Hello "+username+', you have been chosen to access the TSX Server.\n\nPlease follow the instructions here: http://inifintiesky.blogspot.co.nz/2013/10/tsx-oct-25th-pserver-cb-launch.html\n\nYou can login with the following:\n\tUsername: '+username+'\n\tPassword: '+password+'\n\nHave a good day.' // plaintext body
				  }
				  /// TODO: Improve mail sending with email queue and use email templating.
				  
				  //email.sendMail(mail);
			});
		});
	}

	fs.readFile('./accounts.json',function(err,data) {

		if (err) {
			client.sendInfoMessage('Error reading accounts.json');
			dumpError(err);
			return;
		}

		var accountsImport = JSON.parse(data.toString());
		for (var i=0;i<accountsImport.accounts.length;i++) {
			CreateAnAccount(accountsImport.accounts[i].Username,accountsImport.accounts[i].Password,accountsImport.accounts[i].Email,Level);
		}
});

}));