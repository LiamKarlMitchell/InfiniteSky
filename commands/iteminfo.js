// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder/////////////////////////////////////////////////////////////

// Command: iteminfo
// Finds all items and logs out info where name is like what is entered
GMCommands.AddCommand(new Command('iteminfo',0,function command_iteminfo(string,client){
	if (string.length==0) return;

	var ID = parseInt(string,10)
	if (ID)
	{
		client.sendInfoMessage("Finding item where ID is "+ID);
		var item = infos.Item[ID];
		if (item)
		{
			client.sendInfoMessage(item.toString());
		}
		else
		{
			client.sendInfoMessage("Not Found");
		}
		return;
	}

	var items = ItemInfo.getByNameLike(string);
	client.sendInfoMessage("Finding items where name is like "+string);
	for(var i=0;i<items.length;i++)
	{
		var item = items[i];
		client.sendInfoMessage(item.toString());
	}
	client.sendInfoMessage(items.length+" found");
}));

/////////////////////////////////////////////////////////////
// Command: iteminfo alias
GMCommands.AddCommand(GMCommands.getCommand('iteminfo').Alias('ii'));