// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({
	name: 'Items',
	depends: []
}, function(){
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
	    Rareness: { type: Number, default: 0 },
	    ItemType: { type: Number, default: 0 },
	    DisplayItem2D: { type: Number, default: 0 },
	    _1: { type: Number, default: 0 },
	    Level: { type: Number, default: 0 }, // Level Requirement
	    Clan: { type: Number, default: 0 },
	    _4: { type: Number, default: 0 },
	    _5: { type: Number, default: 0 },
	    _6: { type: Number, default: 0 },
	    _7: { type: Number, default: 0 },
	    _8: { type: Number, default: 0 },
	    _9: { type: Number, default: 0 },
	    _10: { type: Number, default: 0 },
	    _11: { type: Number, default: 0 },
	    _12: { type: Number, default: 0 },
	    PurchasePrice: { type: Number, default: 0 },
	    SalePrice: { type: Number, default: 0 },
	    _13: { type: Number, default: 0 },
	    Capacity: { type: Number, default: 0 },
	    LevelRequirement: { type: Number, default: 0 },
	    HonorPointReq: { type: Number, default: 0 },
	    _15a: { type: Number, default: 0 },
	    Strength: { type: Number, default: 0 },
	    Dexterity: { type: Number, default: 0 },
	    Vitality: { type: Number, default: 0 },
	    Chi: { type: Number, default: 0 },
	    Luck: { type: Number, default: 0 },
	    Damage: { type: Number, default: 0 },
	    Defense: { type: Number, default: 0 },
	    LightDamage: { type: Number, default: 0 },
	    ShadowDamage: { type: Number, default: 0 },
	    DarkDamage: { type: Number, default: 0 },
	    LightResistance: { type: Number, default: 0 },
	    ShawdowResistance: { type: Number, default: 0 },
	    DarkResistance: { type: Number, default: 0 },
	    ChancetoHit: { type: Number, default: 0 },
	    ChancetoDodge: { type: Number, default: 0 },
	    PercentToDeadlyBlow: { type: Number, default: 0 },
	    SkillBonusID1: { type: Number, default: 0 },
	    SkillBonusID2: { type: Number, default: 0 },
	    SkillBonusID3: { type: Number, default: 0 },
	    SkillBonusAmount1: { type: Number, default: 0 },
	    SkillBonusAmount2: { type: Number, default: 0 },
	    SkillBonusAmount3: { type: Number, default: 0 },
	    _14: { type: Number, default: 0 },
	    ValueType: { type: Number, default: 0 },
	    Value1: { type: Number, default: 0 },
	    _16: { type: Number, default: 0 },
	    _17: { type: Number, default: 0 },
	    Refinement: { type: Number, default: 0 },
	    ChancetoEarnExperiencePointsfromFinalhit: { type: Number, default: 0 },
	    ExperiencePointEarnedfromFinalhit_PERCENTBONUS_: { type: Number, default: 0 },
	    _18: { type: Number, default: 0 },
	    _19: { type: Number, default: 0 },
	    DecreaseChiConsumption: { type: Number, default: 0 },
	    DodgeDeadlyBlow: { type: Number, default: 0 },
	    IncreaseAllSKillMastery: { type: Number, default: 0 },
	    _20: { type: Number, default: 0 },
	    _21: { type: Number, default: 0 },
	    _22: { type: Number, default: 0 },
	    _23: { type: Number, default: 0 },

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



	//Constructor
	delete mongoose.models['item_mongoose'];
	var Item = db.mongoose.model('item', itemSchema);

	db.Item = Item;
	//module.exports = Item;

	// NEEDS TO BE LAST THING IN FILE!!!
	main.events.emit('schema_loaded', 'item');
});