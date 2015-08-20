// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('ItemInfo', [], function(){
	var itemSchema = mongoose.Schema({
		_id: { type: Number, unique: true, index: true, default: 0 },
	    Name: String,
	    Rareness: Number,
	    ItemType: Number,
	    DisplayItem2D: Number,
	    // _1: Number,
	    Level: Number, // Level Requirement
	    Clan: Number,
	    // _4: Number,
	    // _5: Number,
	    // _6: Number,
	    // _7: Number,
	    // _8: Number,
	    // _9: Number,
	    // _10: Number,
	    // _11: Number,
	    // _12: Number,
	    PurchasePrice: Number,
	    SalePrice: Number,
	    // _13: Number,
	    Capacity: Number,
	    LevelRequirement: Number,
	    HonorPointReq: Number,
	    // _15a: Number,
	    Strength: Number,
	    Dexterity: Number,
	    Vitality: Number,
	    Chi: Number,
	    Luck: Number,
	    Damage: Number,
	    Defense: Number,
			ElementalDamage: Array,
	    // LightDamage: Number,
	    // ShadowDamage: Number,
	    // DarkDamage: Number,
	    ElementalDefense: Array,
			// LightResistance: Number,
	    // ShawdowResistance: Number,
	    // DarkResistance: Number,
	    HitRate: Number,
	    DodgeRate: Number,
	    DeadlyRate: Number,
	    Mastery1: Number,
	    Mastery2: Number,
	    Mastery3: Number,
	    Mastery1_Amount: Number,
	    Mastery2_Amount: Number,
	    Mastery3_Amount: Number,
	    // _14: Number,
	    ValueType: Number,
	    Value1: Number,
	    // _16: Number,
	    // _17: Number,
	    Refinement: Number,
	    ChancetoEarnExperiencePointsfromFinalhit: Number,
	    ExperiencePointEarnedfromFinalhit_PERCENTBONUS_: Number,
	    // _18: Number,
	    // _19: Number,
	    DecreaseChiConsumption: Number,
	    DodgeDeadlyBlow: Number,
	    IncreaseAllSkillMastery: Number,
	    // _20: Number,
	    // _21: Number,
	    // _22: Number,
	    // _23: Number,

	    Description1: String,
	    Description2: String,
	    Description3: String,
			
			Pet: {type: Object, default: null}

	});



	itemSchema.index({ Name: 1, ItemType: 1 });

	itemSchema.methods.isDroppable = function(){
		//TODO: Check if item is droppable
		return true;
	};

	itemSchema.methods.getItemType = function() {
		var ItemType;
		switch (this.ItemType)
		{
			case 1: ItemType = 'SilverCoins'; break; // SilverCoins
			case 2: ItemType = 'Common'; break;      // Stackable to 99
			case 3: ItemType = 'Assist'; break;      // Assist seems like its grouped to 2, It contains a different kind of pills,
				                                     // couple books and enchanting mats of different quality They are not stacked
			case 4: ItemType = 'Mission'; break;
			case 5: ItemType = 'SkillBook'; break;
			case 6: ItemType = 'CalabashBottle'; break; //testing
			case 7: ItemType = 'Necklace'; break;
			case 8: ItemType = 'Cape'; break;
			case 9: ItemType = 'Outfit'; break; // Outfit
			case 10: ItemType = 'Glovess'; break;
			case 11: ItemType = 'Ring'; break;
			case 12: ItemType = 'Boots'; break; // Bootss
			case 13: ItemType = 'Sword'; break;
			case 14: ItemType = 'Blade'; break;
			case 15: ItemType = 'Marble'; break;
			case 16: ItemType = 'Katana'; break;
			case 17: ItemType = 'DoubleBlade'; break; // test
			case 18: ItemType = 'Lute'; break;
			case 19: ItemType = 'LightBlade'; break;
			case 20: ItemType = 'LongSpear'; break;
			case 21: ItemType = 'Scepter'; break;
			case 22: ItemType = 'Pet'; break; // Sacred Animal
			case 23: ItemType = 'AssistStackable'; break; // Seems like crafting materials at herb master
			case 24: ItemType = 'Common'; break;
			default: ItemType = ''; break;
		};
		return ItemType;
	};

	itemSchema.methods.getInventoryItemType = function() {
		var ItemType;
		switch (this.ItemType)
		{
			case 6: ItemType = 'Bottle'; break;
			case 7: ItemType = 'Amulet'; break;
			case 8: ItemType = 'Cape'; break;
			case 9: ItemType = 'Outfit'; break;
			case 10: ItemType = 'Gloves'; break;
			case 11: ItemType = 'Ring'; break;
			case 12: ItemType = 'Boots'; break;
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
				ItemType = 'Weapon';
			break;
			case 22: ItemType = 'Pet'; break;
		};
		return ItemType;
	};

	itemSchema.methods.getRareness = function() {
		var Rareness;
		switch (this.Rareness)
		{
			case 1: Rareness = 'Common'; break;
			case 2: Rareness = 'Unique'; break;
			case 3: Rareness = 'Rare'; break;
			case 4: Rareness = 'Elite'; break;
		}
		return Rareness;
	};

	itemSchema.toString = function(kind) {
		switch (kind) {
			case 'small':
				return this.ID+' - '+this.Name;
			break;
			case 'raretype':
				return this.ID+' - '+this.Name+' ('+this.getRareness()+')'+' '+this.getItemType();
			break;
	  		default:
				return this.ID+' - '+this.Name+' ('+this.getRareness()+')'+' '+this.getItemType()+' B:'+this.PurchasePrice+' S:'+this.SalePrice+' Lv:'+this.LevelRequirement;
			break;
		}
	};

	itemSchema.methods.getSlotSize = function() {
		var t = this.ItemType;
	    if (t === 2 || t === 7 || t === 11) {
	        return 0;
	    } else {
	        return 1;
	    }
	};

	itemSchema.methods.isStackable = function() {
		return this.ItemType === ItemType.Common || this.ItemType === ItemType.AssistStackable;
	}

	itemSchema.methods.isAllowedByClan = function(clan){
		clan += 2;
		return this.Clan === 1 || this.Clan === clan;
	};

	itemSchema.methods.getWeaponModIndex = function(clan){
		var baseClan = clan === 0 ? 12 : clan === 1 ? 15 : 18;
		var weaponMod = this.ItemType - baseClan;
		return weaponMod < 0 || weaponMod > 2 ? 0 : weaponMod;
	};

	global.ItemType = {
		SilverCoins: 1,
		Common: 2,
		Assist: 3,
		Mission: 4,
		SkillBook: 5,
		CalabashBottle: 6,
		Necklace: 7,
		Cape: 8,
		Outfit: 9,
		Gloves: 10,
		Ring: 11,
		Shoes: 12,
		Sword: 13,
		Blade: 14,
		Marble: 15,
		Katana: 16,
		DoubleBlade: 17,
		Lute: 18,
		LightBlade: 19,
		LongSpear: 20,
		Scepter: 21,
		Pet: 22,
		AssistStackable: 23,
		AssistAgain: 24
	};


	itemSchema.index({ Name: 1, ItemType: 1 });

	delete mongoose.models['item'];
	var ItemInfo = db.mongoose.model('item', itemSchema);

	ItemInfo.getById = function(id, callback){
		db.Item.findOne({
			_id: id
		}, callback);
	};

	ItemInfo.findById = function(id, callback){
		db.Item.findOne({
			_id: id
		}, callback);
	};

	db.Item = ItemInfo;
});
