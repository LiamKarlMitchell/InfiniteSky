// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('Character', [], function(){
	// Shorthand Types
	//var String = db.mongoose.Schema.Types.String;
	//var Number = db.mongoose.Schema.Types.Number;
	var Bool = db.mongoose.Schema.Types.Boolean;
	//var Array = db.mongoose.Schema.Types.Array;
	//var Date = db.mongoose.Schema.Types.Date;
	var ObjectId = db.mongoose.Schema.Types.ObjectId;
	var Mixed = db.mongoose.Schema.Types.Mixed;
	// var Object = db.mongoose.Schema.Types.Object;

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
		// Column: {type: Number, default: 0 },
		// Row: {type: Number, default: 0 },
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
		Slot: Number,
		AccountID: Number,
		ServerName: String,

		GuildName: { type: String, index: true, default: null },
		GuildAccess: { type: Number, default: 2 },
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
		ContributionPoints: { type: Number, default: 0 },

		Name: { type: String, unique: true, index: true },

		Stat_Strength: {type: Number, default: 0 },
		Stat_Chi: {type: Number, default: 0 },
		Stat_Dexterity: {type: Number, default: 0 },
		Stat_Vitality: {type: Number, default: 0 },
	// Maybe Ring: {type: itemEquip, default: null}
	// or default 0 hmm... how very odd
		Ring: {type: itemEquip, default: null}, // 0
		Cape: {type: itemEquip, default: null}, // 1
		Outfit: {type: itemEquip, default: null}, // 2
		Gloves: {type: itemEquip, default: null}, // 3
		Amulet: {type: itemEquip, default: null}, // 4
		Boots: {type: itemEquip, default: null}, // 5
		Bottle: {type: itemEquip, default: null}, // 6
		Weapon: {type: itemEquip, default: null}, // 7
		Pet: {type: petEquip, default :null}, // 8

		StorageUse: { type: Number, default: 0 },
		Silver: { type: Number, default: 0 },
		StackedSilver: { type: Number, default: 0 },
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

		// Usable items table
		Usable_ProtectionCharm: {type: Number, default: 0},
		Usable_GuildInsignia: {type: Number, default: 0},
		Usable_LuckyEnchanting: {type: Number, default: 0},
		Usable_LuckyUpgrading: {type: Number, default: 0},
		Usable_LuckyCombining: {type: Number, default: 0},
		Usable_HermitValut: {type: Number, default: 0},
		Usable_StorageValut: {type: Number, default: 0}

		// StrBonus: { type: Number, default: 0 },
		// DexBonus: { type: Number, default: 0 },
		// LuckBuff: { type: Number, default: 0 },
		// StrengthBuff: { type: Number, default: 0 },
		// ExperienceBuff: { type: Number, default: 0 },
		// AutoPillHP: { type: Number, default: 0 },
		// AutoPillChi: { type: Number, default: 0 },
		// ElementalDamage: { type: Number, default: 0 },
		// ElementalDefense: { type: Number, default: 0 },
		// DarkDamage: { type: Number, default: 0 },
		// FactionDefenseBonus: { type: Number, default: 0 },
		// ChanceDodge_Hit: { type: Number, default: 0 },
		// DamageBonus: { type: Number, default: 0 },
		// SilverBig: { type: Number, default: 0 },
		// Daily1: { type: Number, default: 0 },
		// DailyPvPKill: { type: Number, default: 0 },
		// DailyUnknown: { type: Number, default: 0 },
		// DailyUnknown2: { type: Number, default: 0 }	,
		// LastUpdated: { type: Date, default: Date.now },
		// Deaths: { type: Number, min: 0, default: 0 }
		// MonstersKilled: {}, // A hash to store monsters killed
		//DuelWins: Number,
		//DuelLosses: Number,
		//TotalEnemyFactionKills: Number
		// Misc data
	});

	characterSchema.methods.giveEXP = function(value) {
			if(!value){
				return;
			}

			this.character.Experience += value;
			if(this.character.Experience > 2000000000) this.character.Experience = 2000000000;



			// if(value <= 0) return; // If no exp given or - amount
			//
			// var expinfo = infos.Exp[this.character.Level];
			// if (expinfo==null || infos.Exp[145].EXPEnd === this.character.Experience) return;
			//
			// this.character.Experience += value;
			// if(this.character.Experience > infos.Exp[145].EXPEnd) this.character.Experience = infos.Exp[145].EXPEnd;
			//
			// var reminder = expinfo.EXPEnd - this.character.Experience;
			// var levelGained = 0;
			//
			// while(reminder < 0){
			// 		levelGained++;
			//
			// 		expinfo = infos.Exp[this.character.Level + levelGained];
			// 		if(!expinfo) break;
			//
			// 		this.character.Experience += 1;
			// 		this.character.SkillPoints += expinfo.SkillPoint;
			// 		this.character.StatPoints += (this.character.Level + levelGained) > 99 && (this.character.Level + levelGained) <= 112 ? 0 : (this.character.Level + levelGained) > 112 ? 30 : 5;
			// 		reminder = (expinfo.EXPEnd - expinfo.EXPStart) + reminder;
			// }
			//
			//
			// this.send2FUpdate();
			//
			// if((this.character.Level + levelGained) > 145 || this.character.Experience > infos.Exp[145].EXPEnd){
			// 		levelGained = 145 - this.character.Level;
			// 		this.character.Experience = infos.Exp[145].EXPEnd;
			// 		this.character.Level = 145;
			// }else{
			// 		this.character.Level += levelGained;
			// }
			//
			// console.log(this.character.Name + "' gained "+value+" experience");
			//
			// if(levelGained > 0){
			// 		this.character.state.CurrentHP = this.character.infos.MaxHP;
			// 		this.character.state.CurrentChi = this.character.infos.MaxChi;
			// 		this.character.Health = this.character.infos.MaxHP;
			// 		this.character.Chi = this.character.infos.MaxChi;
			//
			// 		this.character.state.Level = this.character.Level;
			// 		this.character.infos.updateAll();
			//
			// 		this.Zone.sendToAllArea(this, true, new Buffer(packets.LevelUpPacket.pack({
			// 				PacketID: 0x2E,
			// 				LevelsGained: levelGained,
			// 				CharacterID: this.character._id,
			// 				NodeID: this.node.id
			// 		})), config.viewable_action_distance);
			// }
			//
			// this.character.save();
	};

	characterSchema.methods.nextInventoryIndex = function() {
		for(var i=0; i<64; i++){
			if(this.Inventory[i] === undefined || this.Inventory[i] === null) return i;
		}

		return null;
	};

	characterSchema.methods.inventoryIntersection = function(slotSizes, x, y, size){
		// TODO: Add ignore to item that is currently moving.
		if( x >= 8 || y >= 8 || (x + size) >= 8 || (y + size) >= 8 ) return true;
		var item;
		for(var i=0; i<this.Inventory.length; i++){
			item = this.Inventory[i];
			if(item === undefined || item === null) continue;
			var itemSize = slotSizes[item.ID];
			if((
          item.Row >= x && item.Row <= (x + size) ||
          (item.Row + itemSize) >= x && (item.Row + itemSize) <= (x + size)
        ) && (
          item.Column >= y && item.Column <= (y + size) ||
          (item.Column + itemSize) >= y && (item.Column + itemSize) <= (y + size)
      )) return item;
		}
		return null;
	};

	characterSchema.methods.restruct = function(buffer){
		// TODO: Cut chunks rather than recreating a buffer and fix needed elements.
		var inventoryBuffer = new Buffer(structs.StorageItem.size * 64);
		inventoryBuffer.fill(0);

		for(var i=0; i<64; i++){
			var item = this.Inventory[i];
			if(item){
				new Buffer(structs.StorageItem.pack(item)).copy(inventoryBuffer, structs.StorageItem.size * i);
			}
		}

		inventoryBuffer.copy(buffer, 350);

		var storageBuffer = new Buffer(structs.SmallStorageItem.size * 28);
		storageBuffer.fill(0);
		for(var i=0; i<28; i++){
			var item = this.Storage[i];
			if(item){
				new Buffer(structs.SmallStorageItem.pack(item)).copy(storageBuffer, structs.SmallStorageItem.size * i);
			}
		}

		storageBuffer.copy(buffer, 1666);

		// TODO: Fix bank, maybe pass a bank array into this function?

		// var bankBuffer = new Buffer(structs.SmallStorageItem.size * 28);
		// bankBuffer.fill(0);
		// for(var i=0; i<56; i++){
		// 	var item = this.Bank[i];
		// 	if(item){
		// 		var offset = structs.SmallStorageItem.size * i;
		// 		var itemBuf = new Buffer(structs.SmallStorageItem.pack(item));
		// 		itemBuf.copy(bankBuffer, offset);
		// 	}
		// }
		// bankBuffer.copy(buffer, 1666);
		return buffer;
	};


	//Constructor
	delete db.mongoose.models['characters'];
	var Character = db.mongoose.model('characters', characterSchema);

	db.Character = Character;
});
