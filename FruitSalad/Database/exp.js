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

			Damage: Array,
	    // GuanyinDamage: Number,
	    // FujinDamage: Number,
	    // JinongDamage: Number,

			Defense: Array,
	    // GuanyinDefense: Number,
	    // FujinDefense: Number,
	    // JinongDefense: Number,

			HitRate: Array,
	    // GuanyinHitrate: Number,
	    // FujinHitrate: Number,
	    // JinongHitrate: Number,

			Dodge: Array,
	    // GuanyinDodge: Number,
	    // FujinDodge: Number,
	    // JinongDodge: Number,

			ElementalDamage: Array,
	    // LightDamage: Number,
	    // ShadowDamage: Number,
	    // DarkDamage: Number,

			BaseHP: Array,
	    // GuanyinHP: Number,
	    // FujinHP: Number,
	    // JinongHP: Number,

			BaseChi: Array,
	    // GuanyinChi: Number,
	    // FujinChi: Number,
	    // JinongChi: Number
	});



	//Constructor
	delete mongoose.models['exp'];
	var Exp = db.mongoose.model('exp', expSchema);
	db.Exp = Exp;

	Exp.getByLevel = function(level, callback){
		db.Exp.findOne({
			Level: level
		}, callback);
	};
});
