// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: report
// Command to issue a report
GMCommands.AddCommand(new Command('report',0,function command_report(string,client){
	// Can be used to report players or track bugs etc.
	// All active GM's above level 80 should see the report.
	// Should make socket list gathering functions? to gather list of sockets with account of level >= a certian amount or < depending on filters?
	// Log report to db
	console.log(client.character.Name+' wants to issue a report '+string);
	client.sendInfoMessage('Your report has been set #'+'3'); // Report_id
	client.sendInfoMessage('Thankyou for your report a GM will see it when possible.');
}));