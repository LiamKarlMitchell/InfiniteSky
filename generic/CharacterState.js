// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/**
 * Used to store the state of a character in world.
 * @class
 * @classdesc This is a description of the MyClass class.
 */
var CVec3 = require('./generic/CVec3');

function EquipItem() {
	this.ID = 0;
	this.Enchant = 0; 
	this.Combine = 0;
}

function StorageItem() {
	this.ID = 0;
	this.Column = 0; 
	this.Row = 0; 
	this.Amount = 0; 
	this.Enchant = 0; 
}

function QuickUseItem() {
	this.ID = 0;
	this.Amount = 0;
}

function SkillItem() {
	this.ID = 0;
	this.Level = 0;
}


function CharacterState() {
	// Varables here
	this.AccountID = -1; //?? // Account ID/Client Index??
	this.CharacterID = -1; //???    // Character ID ???? our new method dosnt use Integer for id.. lawl
	// Will need to make a map of character._id to integer ID thats unique, like its array index
	// Can probably handle it same way im thinking of handling items and monsters actually :)
	// And how I already handle Client # :P
	// AccountID would be SocketID
	// CharacterID would be CharacterIndex hmm... not makey sense ill have to just code it and see
	// Do they both have to be unique? i think TS2 used the Server's Index in Array
	// And the accounts index in array.
	//yesh both or wierd tings happen when your aroind other characters :()
	// One of the annoying things about mongodb is not having integer id's
	// They are some weird object hash id thats unique per system at any time.
	//or reg id... 1st char = id1 and etc in the db...
	// not reliable if characters are added or deleted
	// yesh it it, thier will be number to infinity, just use a 16byte container, you will run out of memeory before you ru out of dspace 
	// When an account is logged in I will give it an AccountID and increment that value by 1 so the next login gets next id.
	// When we make a character state and set it with data from zone server on connect
	// ill do similar thing bassed on the number in that zone :D
	// This way they will be unique in zone and unique over whole server for both.
	// Solveds :D:3
	this.Name = '';
	this.Master = ''; // Master??
	this.Student = ''; // Student??
	this.FactionCapeThing = 0; //01 girl 02 boy
	this.TraitorFlag = 0; //Change to 03 for traitor?
	this.GlowItems = 0; // can make fist glow, weapon, and face (like ts2 vanity)
	this.Clan = 0; // Should use enum?
	this.Gender = 0; // Should use enum?	
	this.Hair = 0;
	this.Face = 0;
	this.Level = 0;
	this.Honor = 0;

	// Equips
	this.Necklace = new EquipItem();
	this.Cape = new EquipItem();
	this.Armor = new EquipItem();
	this.Glove = new EquipItem();
	this.Ring = new EquipItem();
	this.Boot = new EquipItem();
	this.CalbashBottle = new EquipItem();
	this.Weapon = new EquipItem();
	this.Pet = new EquipItem();

	this.GuildName = '';

	this.TagExist = 0; //0000 false anything greater than 0000 is true
	this.ClanTag = '';

	this.Stance=0; //??????seems to only change player from fighting to regualr
	this.Skill=0; //???? or action
	this.Frame = 0; //
	this.Location = new CVec3(); // Current location
	this.LocationTo = new CVec3(); // Magnitude/where it is walking
	this.Direction = 0; // as a float you can now go from 0-360 :D and it works right
	this.TargetObjectIndex = -1;
	this.TargetObjectUniqueNumber = -1;

	this.LocationNew = new CVec3(); // New location it should be after direction*speed
	this.FacingDirection = 0; // Direction it faces cause koreans
	this.CurrentHP = 0;
	this.MaxHP = 0;
	this.CurrentChi = 0;
	this.MaxChi = 0;

	// Other misc vars here
	this.hidden = false;

	// Public Functions
	this.setAccountID = function(ID) {
		this.AccountID = ID;
	};

	this.setCharacterID = function(ID) {
		this.CharacterID = ID;
	};

	this.setHP = function(HP) {
		this.HP = HP;
	};

	this.respawn = function() {
		// Respawn
	};

	this.setFromCharacter = function(character) {
		character.updateInfos(true);
		// Set the varables from a character's data
		this.Name = character.Name;

		//this.FactionCapeThing = 0;//01 girl 02 boy	
		//this.TraitorFlag = 0;//Change to 03 for traitor?
		//this.GlowItems = 0;// can make fist glow, weapon, and face (like ts2 vanity)
		this.Clan = character.Clan;
		this.Gender = character.Gender;
		this.Hair = character.Hair;
		this.Face = character.Face;
		this.Level = character.Level;
		this.Honor = character.Contribution;

		// Equips
		this.Necklace = character.Necklace;
		this.Cape = character.Cape;
		this.Armor = character.Armor;
		this.Glove = character.Glove;
		this.Ring = character.Ring;
		this.Boot = character.Boot;
		this.CalbashBottle = character.CalbashBottle;
		this.Weapon = character.Weapon;
		this.Pet = character.Pet;

		this.GuildName = character.GuildName;

		this.TagExist = character.GuildTag !== '' ? true : false;
		this.GuildTag = character.GuildTag;

		this.Stance = 0; // seems to only change player from fighting to regualr
		this.Skill = 0; // or action
		this.Frame = 0; //
		this.Location = new CVec3(); // Current location

		this.Location.X = character.RealX;
		this.Location.Y = character.RealY;
		this.Location.Z = character.RealZ;

		this.LocationTo = new CVec3();

		this.Direction = Math.floor(Math.random() * 360);
		
		this.TargetObjectIndex = -1;
		this.TargetObjectUniqueNumber = -1;

		this.LocationNew = new CVec3();
		this.FacingDirection = this.Direction;

		this.CurrentHP = character.Health;
		this.MaxHP = character.statInfo.HP;
		this.CurrentChi = character.Chi;
		this.MaxChi = character.statInfo.Chi;
	};

	// Returns a compressed packet for us to send to whomever
	this.getPacket = function() {
		return packets.makeCompressedPacket(0x18,
			new Buffer(
				packets.ActionReplyPacket.pack(this)
			)
		);
	};
}