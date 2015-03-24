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

	var items = infos.Item.getByNameLike(string);
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



GMCommands.AddCommand(new Command('iteminfo2',0,function command_iteminfo(string,client){
	var i = 0;
	var row = 0;
	var column = 0;
	for(var item in infos.Item){
		if(infos.Item[item] && infos.Item[item].ItemType === 22){
			console.log(infos.Item[item].ID + " , ");
			if(i >= 1 && i % 4 == 0){
				row = 0;
				column += 2;
			}
			client.character.Inventory[i] = {
				Row: column,
				Column: row,
				ID: infos.Item[item].ID,
				Growth: Math.floor(infos.Item[item].PetStats.MaxGrowth),
				Activity: 1
			};
			row += 2;
			i++;

		}
	}

	client.character.markModified("Inventory");
	client.character.save();
}));


GMCommands.AddCommand(new Command('iteminfo3',0,function command_iteminfo(string,client){
	for(var item in infos.Item){
		if(infos.Item[item] && infos.Item[item].ItemType === 22){
			if(infos.Item[item].ID === client.character.Pet.ID){
				for(var i in infos.Item[item]){
					var val = parseInt(infos.Item[item][i]);
					if(!isNaN(val)){
						console.log(i + " : " + val);
					} 
				}
			}
		}
	}
}));