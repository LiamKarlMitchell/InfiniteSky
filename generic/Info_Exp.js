// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the ExpInfo data

// Incase we ever make an editor we could have constructor?

vms.depends({
  name: 'Info_Exp',
  depends: []
}, function(){
  function ExpInfo(){};
  ExpInfo.prototype = {
  	inspect: safeguard_cli.inspect,

  	toString: function(kind) {
  		switch (kind) {
  			default:
  			   return 'Lv: '+this.Level+' EXPRange: '+this.EXPStart+'-'+this.EXPEnd;
  			break;
  		}
  	}

  };

  LoadExpInfo = function() {
  	// Could wrap in try catch and remove infos.Exp if failed load for some error in structure etc/
  	infos.Exp = new GameInfoLoader('005_00001.IMG',
    restruct.
    int32lu("Level").
    int32lu("EXPStart").
    int32lu("EXPEnd").
    int32lu("Unknown1").
    int32lu("Unknown2").
    int32lu("SkillPoint").
    int32lu("GuanyinDamage").
    int32lu("FujinDamage").
    int32lu("JinongDamage").
    int32lu("GuanyinDefense").
    int32lu("FujinDefense").
    int32lu("JinongDefense").
    int32lu("GuanyinHitrate").
    int32lu("FujinHitrate").
    int32lu("JinongHitrate").
    int32lu("GuanyinDodge").
    int32lu("FujinDodge").
    int32lu("JinongDodge").
    int32lu("LightDamage").
    int32lu("ShadowDamage").
    int32lu("DarkDamage").
    int32lu("GuanyinHP").
    int32lu("FujinHP").
    int32lu("JinongHP").
    int32lu("GuanyinChi").
    int32lu("FujinChi").
    int32lu("JinongChi"),

    function onRecordLoad(record) {
    	if (record.Level) {
    		// Change the prototype so that we have access to methods we want.
    		record.__proto__ = ExpInfo.prototype;
        record.ID = record.Level; // Because GameLoadInfo requires an ID... maybe this should be changed.
    	}
    	return record;
    });
  }

  // If we have not loaded the item info yet then load it
  if (infos.Exp === undefined) LoadExpInfo();
    
});