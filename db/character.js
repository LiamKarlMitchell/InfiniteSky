// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Shorthand Types
//var String = db.mongoose.Schema.Types.String;
//var Number = db.mongoose.Schema.Types.Number;
var Bool = db.mongoose.Schema.Types.Boolean;
//var Array = db.mongoose.Schema.Types.Array;
//var Date = db.mongoose.Schema.Types.Date;
var ObjectId = db.mongoose.Schema.Types.ObjectId;
var Mixed = db.mongoose.Schema.Types.Mixed;

// Actuall definitions here
var itemEquip = {
	ID: {type: Number, default: 0 },
	Enchant: {type: Number, default: 0 },
	Combine: {type: Number, default: 0 },
};

var petEquip = {
	ID: {type: Number, default: 0 },
	Activity: {type: Number, default: 0 },
	Growth: {type: Number, default: 0 },
};

var storageItemSchema = mongoose.Schema({
	ID: {type: Number, default: 0 },
	Column: {type: Number, default: 0 },
	Row: {type: Number, default: 0 },
	Amount: {type: Number, default: 0 },
	Enchant: {type: Number, default: 0 },
});

storageItemSchema.methods.toString = function()
{
	return this.ID+', '+this.Column+', '+this.Row+', '+this.Amount+', '+this.Enchant;
}

var quickUseItemSchema = mongoose.Schema({
	ID: {type: Number, default: 0 },
	Ammount: {type: Number, default: 0 },
});

var skillItemSchema = mongoose.Schema({
	ID: {type: Number, default: 0 },
	Level: {type: Number, default: 0 },
});

var characterSchema = mongoose.Schema({
	_id: { type: Number, unique: true, index: true },
	AccountID: Number,
	ServerName: String,

	Guild: { type: String, index: true },
	Title: { type: String },

	IsGM: {type: Number, default: 0 },
	PlayTime: {type: Number, default: 0 },
	Name: { type: String, unique: true, index: true },

	Clan: {type: Number, min: 0, max: 2, default: 0 },
	Gender: {type: Number, default: 0 },
	Hair: {type: Number, default: 0 },
	Face: {type: Number, default: 0 },
	Level: {type: Number, default: 1 },
	Experience: {type: Number, default: 0 },
	OtherIngame: {type: Number, default: 0 },
	StatBonus: {type: Number, default: 0 },
	Honor: {type: Number, default: 0 },
	SkillPoints: {type: Number, default: 0 },
	StatPoints: {type: Number, default: 0 },

	PlayTime: { type: Number, default: 0 },
	Honor: { type: Number, default: 0 },
	CP: { type: Number, default: 0 },

	Name: { type: String, unique: true, index: true },

	StatStrength: {type: Number, default: 0 },
	StatChi: {type: Number, default: 0 },
	StatDexterity: {type: Number, default: 0 },
	StatVitality: {type: Number, default: 0 },
// Maybe Ring: {type: itemEquip, default: null}
// or default 0 hmm... how very odd
	Ring: {type: itemEquip, default: null}, // 0
	Cape: {type: itemEquip, default: null}, // 1
	Armor: {type: itemEquip, default: null}, // 2
	Glove: {type: itemEquip, default: null}, // 3
	Amulet: {type: itemEquip, default: null}, // 4
	Boot: {type: itemEquip, default: null}, // 5
	CalbashBottle: {type: itemEquip, default: null}, // 6
	Weapon: {type: itemEquip, default: null}, // 7
	Pet: {type: petEquip, default :null}, // 8

	StorageUse: { type: Number, default: 0 },
	Silver: { type: Number, default: 0 },
	StorageSilver: { type: Number, default: 0 },
	BankSilver: { type: Number, default: 0 },

	Inventory: [Mixed], //storageItemSchema
	QuickUseItems: [Mixed],
	SkillList: [Mixed],
	Skills: [Mixed],
	SkillBar: [Mixed],
	Storage: [Mixed],
	Friends: [String],

	MapID: Number,
	RealX: Number,
	RealY: Number,
	RealZ: Number,
	Health: Number,
	Chi: Number,

	StrBonus: { type: Number, default: 0 },
	DexBonus: { type: Number, default: 0 },
	LuckBuff: { type: Number, default: 0 },
	StrengthBuff: { type: Number, default: 0 },
	ExperienceBuff: { type: Number, default: 0 },
	AutoPillHP: { type: Number, default: 0 },
	AutoPillChi: { type: Number, default: 0 },
	ElementalDamage: { type: Number, default: 0 },
	ElementalDefense: { type: Number, default: 0 },
	DarkDamage: { type: Number, default: 0 },
	FactionDefenseBonus: { type: Number, default: 0 },
	ChanceDodge_Hit: { type: Number, default: 0 },
	DamageBonus: { type: Number, default: 0 },
	SilverBig: { type: Number, default: 0 },
	Daily1: { type: Number, default: 0 },
	DailyPvPKill: { type: Number, default: 0 },
	DailyUnknown: { type: Number, default: 0 },
	DailyUnknown2: { type: Number, default: 0 }	,

	LastUpdated: { type: Date, default: Date.now },

	Deaths: { type: Number, min: 0, default: 0 },
	MonstersKilled: {}, // A hash to store monsters killed
	//DuelWins: Number,
	//DuelLosses: Number,
	//TotalEnemyFactionKills: Number
	// Misc data
});

// Add methods to the schema
// Could make a character can talk function to check if they have any sort of chat/time ban.
characterSchema.methods.talk = function() {
	console.log(this.Name);
}
// TODO: See why this is not working correctly with the vmscript...
characterSchema.methods.updateInfos = function(reloadEXPInfo) {
	generic.calculateCharacterStatInfo.call(this,reloadEXPInfo);
}

characterSchema.methods.getHP = function() {
	return this.state.CurrentHP;
}

characterSchema.methods.setHP = function(value) {
		this.state.CurrentHP = value;
		if (this.state.CurrentHP > this.state.MaxHP) {
			this.state.CurrentHP = this.state.MaxHP;
		}

		if (this.state.CurrentHP<=0) {
			this.Kill();
		}
	}

characterSchema.methods.Kill = function(value) {
	if (this.state.CurrentHP>0) this.state.CurrentHP = 0;

	this.state.Skill = 12;
	this.state.Frame = 0;
					

	//this.state.Stance = 8; // Sheathed weapon
	//this.state.Stance = 9; // Unsheathed weapon
	// After dead probably set stance to 1 or 2 respectfully so that other players who see you don't see you constantly dieing?
}	

characterSchema.methods.giveEXP = function(exp) {
	if (this.expinfo==null) return;

	this.do2FPacket=1; // Say we need to send update for exp/level/hp/chi

	this.Experience += exp; // Max check etc
	var LevelsGained = 0;

	console.log('Giving '+this.Name+' lots of exp points: '+exp);

	//console.log(this.Experience,this.expinfo.EXPEnd);
	//eyes.inspect(this.expinfo);
	while(this.Experience>this.expinfo.EXPEnd)
	{
		// If at max level break out.
		//console.log(this.Experience,expinfo.EXPEnd);
		// Gained a Level
		if (this.Level>105) return;
		this.Level++;
		LevelsGained++;

		this.SkillPoints+=this.expinfo.SkillPoint;
		this.StatPoints+=5; // Do per level statpoint giving here etc.

		// Give the character statpoints and exp points required
		// Need to store skill and statpoints in db too...

		// Update stats eg MaxHP, MaxCHI Damage etc.

		//this.expinfo = infos.Exp.getByLevel(this.Level);
		//eyes.inspect(this);
		characterSchema.methods.updateInfos.call(this,true);
		if (this.expinfo==null) break; // Should cap Experience to startEXP?
	}
	return LevelsGained;
}

characterSchema.methods.checkItemSlotFree = function(Column,Row,SlotSize,ItemID) {
	console.log('Checking Slots Free for Column: '+Column+' Row: '+Row+' SlotSize: '+SlotSize);

	var ColumnMin = 0;
	var ColumnMax = Column;

	var RowMin = 0;
	var RowMax = Row;

	if (SlotSize==4)
	{
		ColumnMax++;
		RowMax++;
	}
    
    console.log('ColumnMin: '+ColumnMin+' ColumnMax: '+ColumnMax+' RowMin: '+RowMin+' RowMax: '+RowMax);

	if (Column > 7 || Row > 7 ) return 1;

	if (Column>0) ColumnMin=Column-1;
	if (Column==7) ColumnMax = 7;

	if (Row>0) RowMin=Row-1;
	if (Row==7) RowMax = 7;

	// Prevent placing on edges bottom, right
	if (SlotSize==4 && (Column==7 || Row==7)) return 2;

	for (var i=0;i<64;i++)
	{
		var item = this.Inventory[i];

		if (item==null || item.ID==0) continue;

		// Find items with Row between Row-1, Row and Row+1 taking into consideration boundrys of inventory
		if (item.Column >= ColumnMin && item.Column <= ColumnMax && item.Row >= RowMin && item.Row <= RowMax)
		{
			// Item overlaps in same spot
			if (item.Column == Column && item.Row == Row)
			{
				if (item.ID != ItemID || 0)
				{
					return false;
				}
			}

			var ii = infos.item[item.ID];
			if (ii==null)
			{
				console.log('checkItemSlotFree() Unknown ItemID: '+item.ID);
				continue;
			}

			var itemSlotSize = ii.GetSlotCount();

			// Overlaps top left
			if (itemSlotSize == 4 && item.Column<Column && item.Row<Row) return false;

			// Overlaps left side
			if (itemSlotSize == 4 && item.Column<Column) return false;

			// Overlaps from top
			if (itemSlotSize == 4 && item.Row<Row) return false;

			if (SlotSize==4)
			{
				// Check if there are no collisions bottom right sides
				if (item.Column>Column || item.Row>Row || (item.Column>Column && item.Row>Row)) return false;
			}

		}
	}
	return true;
}

characterSchema.methods.checkInventoryItemCollision = function checkInventoryItemCollision(page, x1, y1, s1) {
    if(x1 < 0 || y1 < 0) return false;
    var inventory = this.Inventory;

    var reservedSlots = [];

    var pageSize = 8;
    for(var initArraySize8 = 0; initArraySize8 < pageSize; initArraySize8++){
        reservedSlots[initArraySize8] = [];
        for(var initArraySize8Row = 0; initArraySize8Row < pageSize; initArraySize8Row++){
            reservedSlots[initArraySize8][initArraySize8Row] = false;
        }
    }
    var freeInventoryIndex;
    for (var i = 0; i < 32+(page*32); i++) {
        var object = inventory[i + (page * 32)];
        if (object !== undefined && object !== null) {
            var itemInfo = infos.Item[object.ID];
            if (itemInfo !== undefined) {
                var size = itemInfo.getSlotCount();
                var posX = object.Column;
                var posY = object.Row;

                reservedSlots[posX][posY] = true;
                if(size===4){
                    reservedSlots[posX][posY+1] = true;
                    reservedSlots[posX+1][posY] = true;
                    reservedSlots[posX+1][posY+1] = true;
                }
            }

        }else if(freeInventoryIndex === undefined && object === null){
            freeInventoryIndex = i;
        }
    }

    if(s1 === 1 && reservedSlots[x1][y1]) return false;
    if(s1 === 4 && (reservedSlots[x1][y1] === undefined || reservedSlots[x1+1][y1] === undefined || reservedSlots[x1][y1+1] === undefined || reservedSlots[x1+1][y1+1] === undefined)) return false;
    if(s1 === 4 && (reservedSlots[x1][y1] || reservedSlots[x1+1][y1] || reservedSlots[x1][y1+1] || reservedSlots[x1+1][y1+1])) return false;


    return {index: freeInventoryIndex, x: x1, y: y1, page: page};
}

//Constructor
delete mongoose.models['character_mongoose'];
var Character = db.mongoose.model('character_mongoose', characterSchema);

db.Character = Character;
//module.exports = Character;

// NEEDS TO BE LAST THING IN FILE!!!

main.events.emit('db_character_schema_loaded');