// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('Item', [], function(){
	// Shorthand Types
	//var String = db.mongoose.Schema.Types.String;
	//var Number = db.mongoose.Schema.Types.Number;
	var Bool = db.mongoose.Schema.Types.Boolean;
	//var Array = db.mongoose.Schema.Types.Array;
	//var Date = db.mongoose.Schema.Types.Date;
	var ObjectId = db.mongoose.Schema.Types.ObjectId;
	var Mixed = db.mongoose.Schema.Types.Mixed;

	var itemSchema = mongoose.Schema({
		_id: { type: Number, unique: true, index: true, default: 0 },
	    Name: String,
	    Rareness: Number,
	    ItemType: Number,
	    DisplayItem2D: Number,
	    _1: Number,
	    Level: Number, // Level Requirement
	    Clan: Number,
	    _4: Number,
	    _5: Number,
	    _6: Number,
	    _7: Number,
	    _8: Number,
	    _9: Number,
	    _10: Number,
	    _11: Number,
	    _12: Number,
	    PurchasePrice: Number,
	    SalePrice: Number,
	    _13: Number,
	    Capacity: Number,
	    LevelRequirement: Number,
	    HonorPointReq: Number,
	    _15a: Number,
	    Strength: Number,
	    Dexterity: Number,
	    Vitality: Number,
	    Chi: Number,
	    Luck: Number,
	    Damage: Number,
	    Defense: Number,
	    LightDamage: Number,
	    ShadowDamage: Number,
	    DarkDamage: Number,
	    LightResistance: Number,
	    ShawdowResistance: Number,
	    DarkResistance: Number,
	    ChancetoHit: Number,
	    ChancetoDodge: Number,
	    PercentToDeadlyBlow: Number,
	    SkillBonusID1: Number,
	    SkillBonusID2: Number,
	    SkillBonusID3: Number,
	    SkillBonusAmount1: Number,
	    SkillBonusAmount2: Number,
	    SkillBonusAmount3: Number,
	    _14: Number,
	    ValueType: Number,
	    Value1: Number,
	    _16: Number,
	    _17: Number,
	    Refinement: Number,
	    ChancetoEarnExperiencePointsfromFinalhit: Number,
	    ExperiencePointEarnedfromFinalhit_PERCENTBONUS_: Number,
	    _18: Number,
	    _19: Number,
	    DecreaseChiConsumption: Number,
	    DodgeDeadlyBlow: Number,
	    IncreaseAllSKillMastery: Number,
	    _20: Number,
	    _21: Number,
	    _22: Number,
	    _23: Number,

	    Description1: String,
	    Description2: String,
	    Description3: String

	});

	itemSchema.getItemType = function() {
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
			case 9: ItemType = 'Outfit'; break; // Armor
			case 10: ItemType = 'Gloves'; break;
			case 11: ItemType = 'Ring'; break;
			case 12: ItemType = 'Shoes'; break; // Boots
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

	itemSchema.InventoryItemType = function() {
		var ItemType;
		switch (this.ItemType)
		{
			case 6: ItemType = 'CalbashBottle'; break;
			case 7: ItemType = 'Amulet'; break;
			case 8: ItemType = 'Cape'; break;
			case 9: ItemType = 'Armor'; break;
			case 10: ItemType = 'Glove'; break;
			case 11: ItemType = 'Ring'; break;
			case 12: ItemType = 'Boot'; break;
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

	itemSchema.getRareness = function() {
		var Rareness;
		switch (this.Rareness)
		{
			case 0: Rareness = 'Common'; break;
			case 1: Rareness = 'Uncommon'; break;
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

	itemSchema.getSlotCount = function() {
		var t = this.ItemType;
	    if (t === 2 || t === 7 || t === 11) {
	        return 1;
	    } else {
	        return 4;
	    }
	};

	itemSchema.isStackable = function() {
		return this.ItemType === infos.Item.Type.Common || this.ItemType === infos.Item.Type.AssistStackable;
	}

	itemSchema.isAllowedByClan = function(characterClanID){
		if (isNaN(characterClanID)) {
			switch (characterClanID) {
				case 'Guanyin':
				characterClanID = 0;
				break;
				case 'Fujin':
				characterClanID = 1;
				break;
				case 'Jinong':
				characterClanID = 2;
				break;
				default:
				return false;
				break;
			}
		}
		
		//TODO: Check up on actuall clan restriction value from Item Info
		if(this.Clan === 1 || this.Clan === (characterClanID +2)) return true;
		return false;
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


	//Constructor
	delete mongoose.models['item'];
	var Item = db.mongoose.model('item', itemSchema);

	db.Item = Item;

	db.Item.getById = function(id, callback){
		db.Item.findOne({
			_id: id
		}, callback);
	};
});
