// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/////////////////////////////////////////////////////////////
// Command: giveskills
// gives character some skills to test
GMCommands.AddCommand(new Command('setskills',20,function command_giveskills(string,client){
   for (var i=0;i<30;i++) {
     client.character.SkillList[i] = { ID: i+1, Level: 1 }
   }
   client.character.markModified('SkillList');
   client.character.save();
   client.sendInfoMessage('Please log out and back in for changes to apply.');
}));
