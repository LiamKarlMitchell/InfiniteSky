// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: sendmail
// Creates an account
GMCommands.AddCommand(new Command('sendmail',0,function command_sendmail(string,client){	
	var fromEmail = client.account.Email || config.smtpTransport.auth.user;
	var fromUser = client.account.Username + '/' + client.character.Name;

	var mail = {
	    from: fromUser+" <"+config.smtpTransport.auth.user+">", // sender address
	    to: config.smtpTransport.auth.user, // list of receivers
	    'reply-to': fromEmail,
	    subject: "In Game Mail", // Subject line
	    text: 'AccountID: '+client.account._id+'\nCharacterID: '+client.character._id+'\nCharacter Name: '+client.character.Name+'\nEmail: '+fromEmail+'\n\n'+string
	};
	email.sendMail(mail);
}));