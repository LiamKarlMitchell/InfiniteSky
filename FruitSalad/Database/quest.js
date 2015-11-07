// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms('QuestInfo', [], function(){
    var questRewardTypeSchema = new mongoose.Schema({
      type: Number,
      value: Number,
    },{ _id : false });

// Type:
// 1 = [Monster] (1) Kill !   // Kill Amount of Monster
// 2 = [Item]
//     [Item]
//     Bring Them!
// 3 = [Item]
//     [Item]
//     [NPC]Deliver them to !
// 4 = [Item]
//     [Item]
// 5 = [Monster] Kill!       // Spawn monster and kill it.
// 6 = [Item] <-> [Item]
// 7 = Visit!
 
 
 
// Reward type
// 0 = Nothing
// 1 = Nothing2
// 2 = Silver Coins
// 3 = Honor Points
// 4 = EXP
// 5 = Skill point
// 6 = Item

	var questSchema = mongoose.Schema({
		id: { type: Number, index: true, unique: true },
        Clan: Number,
        QuestNumber: Number,  // 1 based number of quest for each clan.
        Level: Number,        // Can also be level of monster to drop item.
        Mandatory: Number,
        Type: Number,
        Zone: Number,
        X: Number, // The location of any spawned monster.
        Y: Number, // Its a point to spawn a monster at when the client character is in range (100 units).
        Z: Number,
        Name: { type: String, index: true },
        FromNPC: Number,
        NPC1: Number,
        NPC2: Number,
        NPC3: Number,
        NPC4: Number,
        NPC5: Number,
        ToNPC: Number,
        // These values can be Item ID or Monster Id for quest objectives depending on the quest type.
        // 
        // For type 1
        // A is the MonsterID to kill.
        // B is the amount to kill.
        // 
        // For type 2, 3, 4 it is the item id's to obtain for the npc.
        A: Number, // Can also be item that the monster of level will drop.
        B: Number, // Used for item oramount to killl depending on quest type.
        C: Number,
        D: Number,
        Rewards: [questRewardTypeSchema],
        NextQuest: Number,
        Texts: Array
	});

    questSchema.toString = function(kind) {
		switch (kind) {
			case 'small':
                return this.ID+" - "+this.Name;
            break;
			default:
				return this.ID+" - "+this.Name+' Lv: '+this.Level;
			break;
		}
	}

	//Constructor
	delete mongoose.models['quest'];
	var Quest = db.mongoose.model('quest', questSchema);

	db.Quest = Quest;

	db.Quest.findById = function(id, callback){
		db.Quest.findOne({
			id: id
		}, callback);
	};
});
