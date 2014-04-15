// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */

// Should be an object with keys as the reloadable thing
// Each reloadable thing should consist of a description and a function. Lets store these in an array.
vms.depends({name: "CLI_Reload", depends: 'infos.Item,infos.Npc,infos.Monster,infos.Skill'},function (){
var reloadables = {
  'config': [ 'Reloads config file: '+_util.configFile, _util.loadConfig() ],
  'item': [ 'Reloads item info: ', infos.Item.Reload ],
  'npc': [ 'Reloads npc info: ', infos.Npc.Reload ],
  'monster': [ 'Reloads monster info: ', infos.Monster.Reload ],
  'skill': [ 'Reloads skill info: ', infos.Skill.Reload ]
};

// TODO: Reload other things
// Not Implemented - infos - Reloads all game infos\n\
// Not Implemented - monsterinfo - Reloads monster info\n\
// Not Implemented - iteminfo - Reloads item info\n\
// Not Implemented - spawns - Reloads monster and npc spawns\n';
cli.reload = function CLI_Reload(input) {
  if (reloadables[input] !== undefined) {
    console.log('Reloading '+input);
    return reloadables[input][1]();
  } else {
    console.log('Please choose something to reload:');
    console.log(cli.reload.help(1));
  }
};

cli.reload.help = function CLI_Reload_help(input) {
  var help = "A command that can be used to reload things.";
  if (input) {
    var help_advanced = "Options:\n";

    for (var option in reloadables) {
      help_advanced+= "\t"+option+" - "+reloadables[option][0]+"\n";
    }
    return help+'\n'+help_advanced;
  }
  return help;
};
});