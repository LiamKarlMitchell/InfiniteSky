// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('Exp', [], function(){
	var expSchema = mongoose.Schema({
	    Level: Number,
	    EXPStart: Number,
	    EXPEnd: Number,
	    Unknown1: Number,
	    Unknown2: Number, // Level Requirement
	    SkillPoint: Number,
	    GuanyinDamage: Number,
	    FujinDamage: Number,
	    JinongDamage: Number,
	    GuanyinDefense: Number,
	    FujinDefense: Number,
	    JinongDefense: Number,
	    GuanyinHitrate: Number,
	    FujinHitrate: Number,
	    JinongHitrate: Number,
	    GuanyinDodge: Number,
	    FujinDodge: Number,
	    JinongDodge: Number,
	    LightDamage: Number,
	    ShadowDamage: Number,
	    DarkDamage: Number,
	    GuanyinHP: Number,
	    FujinHP: Number,
	    JinongHP: Number,
	    GuanyinChi: Number,
	    FujinChi: Number,
	    JinongChi: Number
	});

	

	//Constructor
	delete mongoose.models['exp'];
	var Exp = db.mongoose.model('exp', expSchema);
	db.Exp = Exp;

	db.Exp.getByLevel = function(level, callback){
		db.Exp.findOne({
			Level: level
		}, callback);
	};
});