// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#ifndef __TSX_CLIENT_H
#define __TSX_CLIENT_H

#include "stdafx.h"
#include "..\SpawnInfoManager\SpawnInfoManager.h"
//class SpawnInfoManager
//class Account
//class Character

enum Screen {
	Screen_Init,
	Screen_Login,
	Screen_ServerSelect,
	Screen_PinEntry,
	Screen_CharacterSelect,
	Screen_ZoneTransfer,
	Screen_World,
};

typedef uint (*PacketRecvFunctor)(uint);
//DWORD OurRecvPacketFunction(byte* Buffer);
typedef int (*uncompress_functor)(void*,uint*,void*,uint);

/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
#define Z_OK            0
#define Z_STREAM_END    1
#define Z_NEED_DICT     2
#define Z_ERRNO        (-1)
#define Z_STREAM_ERROR (-2)
#define Z_DATA_ERROR   (-3)
#define Z_MEM_ERROR    (-4)
#define Z_BUF_ERROR    (-5)
#define Z_VERSION_ERROR (-6)

uint MyNPCPacket(uint Length);
uint MyMonsterPacket(uint Length);
uint MyChatPacket(uint length);
uint MyGameguardKeyPacket(uint length);
uint hookRecvLogPacket(uint length);


// Structures
#pragma pack(push, 1)
struct sItemInfo
{
  DWORD ID;
  char Name[28];
  DWORD Rareness;
  DWORD ItemType;
  DWORD DisplayItem2D;
  DWORD _1;
  DWORD _2;
  DWORD _3;
  DWORD _4;
  DWORD _5;
  DWORD _6;
  DWORD _7;
  DWORD _8;
  DWORD _9;
  DWORD _10;
  DWORD _11;
  DWORD _12;
  DWORD PurchasePrice;
  DWORD SalePrice;
  DWORD _13;
  DWORD Capacity;
  DWORD LevelRequirement;
  DWORD HonorPointReq;
  DWORD _15a;
  DWORD Strength;
  DWORD Dexterity;
  DWORD Vitality;
  DWORD Chi;
  DWORD Luck;
  DWORD Damage;
  DWORD Defense;
  DWORD LightDamage;
  DWORD ShadowDamage;
  DWORD DarkDamage;
  DWORD LightResistance;
  DWORD ShawdowResistance;
  DWORD DarkResistance;
  DWORD ChancetoHit;
  DWORD ChancetoDodge;
  DWORD PercentToDeadlyBlow;
  DWORD SkillBonusID1;
  DWORD SkillBonusID2;
  DWORD SkillBonusID3;
  DWORD SkillBonusAmount1;
  DWORD SkillBonusAmount2;
  DWORD SkillBonusAmount3;
  DWORD _15;
  DWORD ValueType1;
  DWORD Value1;
  DWORD _16;
  DWORD _17;
  DWORD Refinement;
  DWORD ChancetoEarnExperiencePointsfromFinalhit;
  DWORD ExperiencePointEarnedfromFinalhit_PERCENTBONUS_;
  DWORD _18;
  DWORD _19;
  DWORD DecreaseChiConsumption;
  DWORD DodgeDeadlyBlow;
  DWORD IncreaseAllSKillMastery;
  DWORD _20;
  DWORD _21;
  DWORD _22;
  DWORD _23;
  char Description1[25];
  char Description2[25];
  char Description3[25];
  char _pad;
};
#pragma pack(pop)


#pragma pack(push, 1)
struct SkillData {
		int ChiCost;
		int DegreeOfDefensiveSkill;
		int ChiRecovery;
		int ChanceToAcupressure;
		int ChanceToUnstun;
		int AirWalkDistance;
		int EnergyBall;
		int DamageIncreased;
		int Unk1;
		int AttackRangeApplied;
		int DamageApplied;
		int OnlyForLightDamage;
		int OnlyForShadowDamage;
		int OnlyForDarkDamage;
		int ChanceToHitApplied;
		int EffectiveDuration;
		int IncreasedDamage;
		int IncreasedDefense;
		int Unk2;
		int CastTime;
		int IncreasedLightResistance;
		int IncreasedShadowResistance;
		int IncreasedDarkResistance;
		int IncreasedChanceToHit;
		int IncreasedChanceToDodge;
		int IncreasedMovementSpeed;
		int IncreasedAttackSpeed;
		int IncreasedLuck;
		int EnchancedChanceToDeadlyBlow;
		int ChanceToReturnDamage;
		int IncreasedAcupressureDefense;
		int ChanceToRemoveIncreaseEffect;
		int HPRegenerationPoints;
		int ChiRegenerationPoints;
};

struct sSkillInfo {
	DWORD ID;
	char Name[28];
	// Categories
	// 1 = General
	// 3 and 4 = Support
	// 2 = Attack
	DWORD Category;
	DWORD Unknown36;
	DWORD SpriteStartID;
	DWORD Clan;
	DWORD Weapon;
	char Description1[51];
	char Description2[51];
	char Description3[50];
	int Unknown204;
	int Unknown208;
	int Unknown212;
	int Unknown216;
	int Unknown220;
	int Unknown224;
	int Unknown228;
	int Unknown232;
	int Unknown236;
	int Unknown240;
	int Unknown244;
	int Unknown248;
	int Unknown252;
	int Unknown256;
	int Unknown260;
	int Unknown264;
	int Unknown268;
	int Unknown272;
	int Unknown276;
	int Unknown280;
	int Unknown284;
	int Unknown288;
	int Unknown292;
	int Unknown296;
	int Unknown300;
	int Unknown304;
	int Unknown308;
	int Unknown312;
	int Unknown316;
	int Unknown320;
	int Unknown324;
	int Unknown328;
	int Unknown332;
	int ChiUsage;
	int Unknown340;
	int Unknown344;
	int Unknown348;
	int Unknown352;
	int Unknown356;
	int Unknown360;
	int Unknown364;
	int Unknown368;
	int Unknown372;
	int Unknown376;
	int Unknown380;
	int Unknown384;
	int Unknown388;
	int Unknown392;
	int Unknown396;
	int Unknown400;
	int Unknown404;
	int Unknown408;
	int Unknown412;
	int Unknown416;
	int Unknown420;
	int Unknown424;
	int Unknown428;
	int Unknown432;
	int Unknown436;
	int Unknown440;
	int Unknown444;
	int Unknown448;
	int Unknown452;
	int Unknown456;
	int Unknown460;
	int Unknown464;
	int Unknown468;
	int Unknown472;
	int Unknown476;
	int Unknown480;
	int Unknown484;
	int Unknown488;
	int Unknown492;
	int Unknown496;
	int Unknown500;
	int Unknown504;
	int Unknown508;
	int Unknown512;
	int Unknown516;
	int Unknown520;
	int Unknown524;
	int Unknown528;
	int Unknown532;
	int Unknown536;
	int Unknown540;
	int Unknown544;
	int Unknown548;
	int Unknown552;
	int Unknown556;
	int Unknown560;
	int Unknown564;
	DWORD PointsToLearn;
	DWORD MaxSkillLevel;
	int Unknown572;
	SkillData ModifiersStart;
	SkillData ModifiersEnd;
};
#pragma pack(pop)

#pragma pack(push, 1)
struct sNPCInfo {
  int ID;
  char Name[28];
  int Unknown1;
  int Unknown2;
  int Unknown3;
  int Unknown4;
  int Unknown5;
  int Unknown6;
  int Unknown7;
  int Unknown8;
  int Unknown9;
  int Unknown10;
  int Unknown11;
  int Unknown12;
  int Unknown13;
  int Unknown14;
  int Unknown15;
  int Unknown16;
  int Unknown17;
  int PageCount;
  char Chat1[51];
  char Chat2[51];
  char Chat3[51];
  char Chat4[51];
  char Chat5[51];
  int Unknown18;
  int Unknown19;
  int Unknown20;
  int Unknown21;
  int Unknown22;
  int Unknown23;
  int Unknown24;
  int Unknown25;
  int Unknown26;
  int Unknown27;
  int Unknown28;
  int Unknown29;
  int Unknown30;
  int Unknown31;
  int Unknown32;
  int Unknown33;
  int Unknown34;
  int Unknown35;
  int Unknown36;
  int Unknown37;
  int Unknown38;
  int Unknown39;
  int Unknown40;
  int Unknown41;
  int Unknown42;
  int Unknown43;
  int Unknown44;
  int Unknown45;
  int Unknown46;
  int Unknown47;
  int Unknown48;
  int Unknown49;
  int Unknown50;
  int Unknown51;
  int Unknown52;
  int Unknown53;
  int Unknown54;
  int Unknown55;
  int Unknown56;
  int Unknown57;
  int Unknown58;
  int Unknown59;
  int Unknown60;
  int Unknown61;
  int Unknown62;
  int Unknown63;
  int Unknown64;
  int Unknown65;
  int Unknown66;
  int Unknown67;
  int Unknown68;
  int Unknown69;
  int Unknown70;
  int Unknown71;
  int Unknown72;
  int Unknown73;
  int Unknown74;
  int Unknown75;
  int Unknown76;
  int Unknown77;
  int Unknown78;
  int Unknown79;
  int Unknown80;
  int Unknown81;
  int Unknown82;
  int Unknown83;
  int Unknown84;
  int Unknown85;
  int Unknown86;
  int Unknown87;
  int Unknown88;
  int Unknown89;
  int Unknown90;
  int Unknown91;
  int Unknown92;
  int Unknown93;
  int Unknown94;
  int Unknown95;
  int Unknown96;
  int Unknown97;
  int Unknown98;
  int Unknown99;
  int Unknown100;
  int Unknown101;
  int Unknown102;
  int Unknown103;
  int Unknown104;
  int Unknown105;
  int Unknown106;
  int Unknown107;
  int Unknown108;
  int Unknown109;
  int Unknown110;
  int Unknown111;
  int Unknown112;
  int Unknown113;
  int Unknown114;
  int Unknown115;
  int Unknown116;
  int Unknown117;
  int Unknown118;
  int Unknown119;
  int Unknown120;
  int Unknown121;
  int Unknown122;
  int Unknown123;
  int Unknown124;
  int Unknown125;
  int Unknown126;
  int Unknown127;
  int Unknown128;
  int Unknown129;
  int Unknown130;
  int Unknown131;
  int Unknown132;
  int Unknown133;
  int Unknown134;
  int Unknown135;
  int Unknown136;
  int Unknown137;
  int Unknown138;
  int Unknown139;
  int Unknown140;
  int Unknown141;
  int Unknown142;
  int Unknown143;
  int Unknown144;
  int Unknown145;
  int Unknown146;
  int Unknown147;
  int Unknown148;
  int Unknown149;
  int Unknown150;
  int Unknown151;
  int Unknown152;
  int Unknown153;
  int Unknown154;
  int Unknown155;
  int Unknown156;
  int Unknown157;
  int Unknown158;
  int Unknown159;
  int Unknown160;
  int Unknown161;
  int Unknown162;
  int Unknown163;
  int Unknown164;
  int Unknown165;
  int Unknown166;
  int Unknown167;
  int Unknown168;
  int Unknown169;
  int Unknown170;
  int Unknown171;
  int Unknown172;
  int Unknown173;
  int Unknown174;
  int Unknown175;
  int Unknown176;
  int Unknown177;
  int Unknown178;
  int Unknown179;
  int Unknown180;
  int Unknown181;
  int Unknown182;
  int Unknown183;
  int Unknown184;
  int Unknown185;
  int Unknown186;
  int Unknown187;
  int Unknown188;
  int Unknown189;
  int Unknown190;
  int Unknown191;
  int Unknown192;
  int Unknown193;
  int Unknown194;
  int Unknown195;
  int Unknown196;
  int Unknown197;
  int Unknown198;
  int Unknown199;
  int Unknown200;
  int Unknown201;
  int Unknown202;
  int Unknown203;
  int Unknown204;
  int Unknown205;
  int Unknown206;
  int Unknown207;
  int Unknown208;
  int Unknown209;
  int Unknown210;
  int Unknown211;
  int Unknown212;
  int Unknown213;
  int Unknown214;
  int Unknown215;
  int Unknown216;
  int Unknown217;
  int Unknown218;
  int Unknown219;
  int Unknown220;
  int Unknown221;
  int Unknown222;
  int Unknown223;
  int Unknown224;
  int Unknown225;
  int Unknown226;
  int Unknown227;
  int Unknown228;
  int Unknown229;
  int Unknown230;
  int Unknown231;
  int Unknown232;
  int Unknown233;
  int Unknown234;
  int Unknown235;
  int Unknown236;
  int Unknown237;
  int Unknown238;
  int Unknown239;
  int Unknown240;
  int Unknown241;
  int Unknown242;
  int Unknown243;
  int Unknown244;
  int Unknown245;
  int Unknown246;
  int Unknown247;
  int Unknown248;
  int Unknown249;
  int Unknown250;
  int Unknown251;
  int Unknown252;
  int Unknown253;
  int Unknown254;
  int Unknown255;
  int Unknown256;
  int Unknown257;
  int Unknown258;
  int Unknown259;
  int Unknown260;
  int Unknown261;
  int Unknown262;
  int Unknown263;
  int Unknown264;
  int Unknown265;
  int Unknown266;
  int Unknown267;
  int Unknown268;
  int Unknown269;
  int Unknown270;
  int Unknown271;
  int Unknown272;
  int Unknown273;
  int Unknown274;
  int Unknown275;
  int Unknown276;
  int Unknown277;
  int HealthMax;
  int Entrance;
  int Teach;
  int Storage;
  int MakeGuild;
  int Trade;
  int Refine;
  int Craft;
  int Move;
  int Bank;
  int Enchant;
  int Refill;
  int Antique;
  int ResetStat;
  int ExpGuild;
  int CombineScrolls;
  int JoinBattle;
  int Leave;
  int Upgrade;
  int PlaceBet;
  int Move2;
  int Buy;
  int Extract;
  int ListItems;
  int Unknown01;
  int Withdraw;
  int DownGrade;
  int CombineItems;
  int DiceMatch;
  int Leader;
  int Gift;
  int Reward;
  int Exchange;
  int Track;
  int Isolation;
  int Convert;
  int Unknown278;
  int Unknown279;
  int Unknown280;
  int CraftWeapon;
  int CraftArmor;
  int Buff;
  int Unknown281;
  int ConvertCP;
  int Unknown282;
  int Unknown283;
  int Unknown284;
  int CombinePet;
  int Unknown285;
  int Unknown286;
  int ENDOFLIST;
  int Unknown287;
  char Unk1;
  int Items[168];
  char Unk3[3];
  int Shift8Bytes[2];
  char CellFile[6025];
};
#pragma pack(pop)

#pragma pack(push, 1)
struct sMonsterInfo {
	DWORD ID; // 0
	char Name[24]; // 4
	int Unknown1C; //2E
	int Unknown32; // 32
	DWORD SpecialModelID; // 36
	DWORD ModelID; // 40
	int clickwidth; // 44
	int clickheight; // 48
	int clickdepth; // 52
	int Unknown56; // 56
	int Unknown60; // 60
	int Unknown64; // 64
	int Unknown68; // 68
	int Unknown72; // 72
	int Unknown76; // 76
	int Unknown80; // 80
	int Unknown84; // 84
	DWORD Level; // 88
	int Unknown92; // 92
	DWORD Health; // 96
	int Unknown100; // 100
	int Unknown104; // 104
	int Unknown108; // 108
	int Unknown112; // 112
	int Unknown116; // 116
	int Unknown120; // 120
	int Unknown124; // 124
	int Unknown128; // 128
	int RadiusInfo1; // 132
	int RadiusInfo2; // 136
	int WalkSpeed; // 140
	int RunSpeed; // 144
	int DeathSpeed; // 148
	int AttackPower; // 152
	int DefensePower; // 156
	int AttackSuccess; // 160
	int AttackBlock; // 164
	int ElementAttackPower; // 168
	int ElementDefensePower; // 172
	int Critical; // 176
	int Unknown180; // 180
	int Unknown184; // 184
	int Unknown188; // 188
	int Unknown192; // 192
	int Unknown196; // 196
	int Unknown200; // 200
	int Unknown204; // 204
	int Unknown208; // 208
	int Unknown212; // 212
	int Unknown216; // 216
	int Unknown220; // 220
	int Unknown224; // 224
	int Unknown228; // 228
	int Unknown232; // 232
	int Unknown236; // 236
	int Unknown240; // 240
	int Unknown244; // 244
	int Unknown248; // 248
	int Unknown252; // 252
	int Unknown256; // 256
	int Unknown260; // 260
	int Unknown264; // 264
	int Unknown268; // 268
	int Unknown272; // 272
	int Unknown276; // 276
	int Unknown280; // 280
	int Unknown284; // 284
	int Unknown288; // 288
	int Unknown292; // 292
	int Unknown296; // 296
	int Unknown300; // 300
	int Unknown304; // 304
	int Unknown308; // 308
	int Unknown312; // 312
	int Unknown316; // 316
	int Unknown320; // 320
	int Unknown324; // 324
	int LightATK; // 328
	int ShadowATK; // 332
	int DarkATK; // 336
	int Unknown340; // 340
	int Unknown344; // 344
	int Unknown348; // 348
	int Unknown352; // 352
	int Unknown356; // 356
	int Unknown360; // 360
	int Unknown364; // 364
	int Unknown368; // 368
	int Unknown372; // 372
	// Money Info
	int Unknown376; // 376 // Min
	int Unknown380; // 380 // Max
	int Unknown384; // 384 // Chance
	// Potion Info
	int Unknown388; // 388
	int Unknown392; // 392
	int Unknown396; // 396
	int Unknown400; // 400
	int Unknown404; // 404
	int Unknown408; // 408
	int Unknown412; // 412
	int Unknown416; // 416
	int Unknown420; // 420
	int Unknown424; // 424
	// Item Info
	int Unknown428; // 428
	int Unknown432; // 432
	int Unknown436; // 436
	int Unknown440; // 440
	int Unknown444; // 444
	int Unknown448; // 448
	int Unknown452; // 452
	int Unknown456; // 456
	int Unknown460; // 460
	int Unknown464; // 464
	int Unknown468; // 468
	int Unknown472; // 472
	// Quest Item Info
	int Unknown476; // 476
	int Unknown480; // 480
	// Extra Item Info
	int Unknown484; // 484
	int Unknown488; // 488
	int Unknown492; // 492
	int Unknown496; // 496
	int Unknown500; // 500
	int Unknown504; // 504
	int Unknown508; // 508
	int Unknown512; // 512
	int Unknown516; // 516
	int Unknown520; // 520
	int Unknown524; // 524
	int Unknown528; // 528
	int Unknown532; // 532
	int Unknown536; // 536
	int Unknown540; // 540
	int Unknown544; // 544
	int Unknown548; // 548
	int Unknown552; // 552
	int Unknown556; // 556
	int Unknown560; // 560
	int Unknown564; // 564
	int Unknown568; // 568
	int Unknown572; // 572
	int Unknown576; // 576
	int Unknown580; // 580
	int Unknown584; // 584
	int Unknown588; // 588
	int Unknown592; // 592
	int Unknown596; // 596
	int Unknown600; // 600
	int Unknown604; // 604
	int Unknown608; // 608
	int Unknown612; // 612
	int Unknown616; // 616
	int Unknown620; // 620
	int Unknown624; // 624
	int Unknown628; // 628
	int Unknown632; // 632
	int Unknown636; // 636
	int Unknown640; // 640
	int Unknown644; // 644
	int Unknown648; // 648
	int Unknown652; // 652
	int Unknown656; // 656
	int Unknown660; // 660
	int Unknown664; // 664
	int Unknown668; // 668
	int Unknown672; // 672
	int Unknown676; // 676
	int Unknown680; // 680
	int Unknown684; // 684
	int Unknown688; // 688
	int Unknown692; // 692
	int Unknown696; // 696
	int Unknown700; // 700
	int Unknown704; // 704
	int Unknown708; // 708
	int Unknown712; // 712
	int Unknown716; // 716
	DWORD Unknown720; // 720
	int ImproveStone1_Chance; // 724
	int ImproveStone1_ID; // 728
	int ImproveStone2_Chance; // 732
	int ImproveStone2_ID; // 736
	int Unknown740; // 740
	int PetDropChance; // 744
	int PetID1; // 748
	int PetID2; // 752
	int Unknown756; // 756
	int Unknown760; // 760
	int Unknown764; // 764
	int Unknown768; // 768
	int Unknown772; // 772
	int Unknown776; // 776
	int Unknown780; // 780
	int Unknown784; // 784
	int Unknown788; // 788
	int Unknown792; // 792
	int Unknown796; // 796
	int Unknown800; // 800
	int Unknown804; // 804
	int Unknown808; // 808
	int Unknown812; // 812
	int Unknown816; // 816
	int Unknown820; // 820
	int Unknown824; // 824
	int Unknown828; // 828
	int Unknown832; // 832
	int Unknown836; // 836
	int Unknown840; // 840
	int Unknown844; // 844
	int Unknown848; // 848
	int Unknown852; // 852
	int Unknown856; // 856
	int Unknown860; // 860
	int Unknown864; // 864
	int Unknown868; // 868
	int Unknown872; // 872
	int Unknown876; // 876
	int Unknown880; // 880
};
#pragma pack(pop)


#pragma pack(push, 1)
struct PlayerState {
};
#pragma pack(pop)

#pragma pack(push, 1)
struct MonsterState {
	unsigned int Identifier; // Offset 0
	unsigned int UniqueID; // Offset 4
	unsigned int NodeID; // Offset 8
	unsigned int Life; // Offset 12
	unsigned int MonsterID; // Offset 16
	unsigned int Skill; // Offset 20
	float Unknown_24; // Offset 24
	float Unknown_28; // Offset 28
	float Frame; // Offset 32
	CVec3 Location;//float x; // Offset 36
	//float y; // Offset 40
	//float Z; // Offset 44
	unsigned int Unknown_48; // Offset 48
	unsigned int Unknown_52; // Offset 52
	unsigned int Unknown_56; // Offset 56
	unsigned int Unknown_60; // Offset 60
	unsigned int Unknown_64; // Offset 64
	unsigned int HP; // Offset 68
	unsigned int Unknown_72; // Offset 72
	unsigned int Unknown_76; // Offset 76
	unsigned int Unknown_80; // Offset 80
	unsigned int Unknown_84; // Offset 84
	unsigned int Unknown_88; // Offset 88
	unsigned int Unknown_92; // Offset 92
	unsigned int Unknown_96; // Offset 96
	unsigned int Unknown_100; // Offset 100
	unsigned int Unknown_104; // Offset 104
	unsigned int Unknown_108; // Offset 108
	unsigned int Unknown_112; // Offset 112
	unsigned int Unknown_116; // Offset 116
	unsigned int Unknown_120; // Offset 120
	unsigned int Unknown_124; // Offset 124
	unsigned int Unknown_128; // Offset 128
	unsigned int Unknown_132; // Offset 132
	unsigned int Unknown_136; // Offset 136
	unsigned int Unknown_140; // Offset 140
	unsigned int Unknown_144; // Offset 144
	unsigned int Unknown_148; // Offset 148
	unsigned int Unknown_152; // Offset 152
	unsigned int Unknown_156; // Offset 156
	unsigned int Unknown_160; // Offset 160
	unsigned int Unknown_164; // Offset 164
	unsigned int Unknown_168; // Offset 168
	unsigned int Unknown_172; // Offset 172
	unsigned int Unknown_176; // Offset 176
	unsigned int Unknown_180; // Offset 180
	unsigned int Unknown_184; // Offset 184
};

struct MonsterCollection {
	unsigned int Count;
	MonsterState Monsters[10000];
};
#pragma pack(pop)

#pragma pack(push, 1)
struct NPCState {
};
#pragma pack(pop)

#pragma pack(push, 1)
struct ItemState {
};
#pragma pack(pop)

#pragma pack(push, 1)
struct initPacket {
	char packetID;
	unsigned int authID; // Not used
	char username[20]; // Length 20
};

struct initPacketReply {
	char packetID;
	unsigned int authID;
};

struct emptyPacket {
	char packetID;
	unsigned int authID;
};
#pragma pack(pop)

#pragma pack(push, 1)
struct spawnPacket {
	char packetID;
	unsigned int authID;
	unsigned int uniqueID1;
	unsigned int uniqueID2;
	unsigned int id;
	float x;
	float y;
	float z;
	float direction;
	unsigned int zoneID;
};
#pragma pack(pop)

class TSX_Client
{
private:
	bool Loaded;

	void Init();
	void Uninit();
public:
	Thread<TSX_Client> thread;
	bool RunDLL;

	HANDLE ProcessHandle;
	DWORD ProcessID;
	HANDLE GameMainThread;
	signature_scanner* sig;
	Ini* ini;

	uint ScreenID;
	uint ZoneID;
	uint PreviousScreenID;
	uint PreviousZoneID;
	uint* ScreenAddress;
	uint* ZoneAddress;
	struct sockaddr_in si_other;
	struct sockaddr_in si_recv;
	SOCKET sd;
	bool logServerActive;
	uint authID;

	PlayerState* players;
	MonsterCollection* mobs;
	NPCState* npcs;
	ItemState* items;

	unsigned long * PlayersAddress;
	CVec3 RecordedPoint;

	float* GameTimeAddress;
	float GameTimeAdjust;
	bool SpeedHackEnabled;
	bool VacHackEnabled;
	bool LiveUpdateRecordedPosition;

	char* IPAddress;
	unsigned long GameEncryptAddress;


	SpawnInfoManager* MOBSpawns;
	SpawnInfoManager* NPCSpawns;

	//Account* account;
	//Character* character;

	// Addresses and signitures here

	// Could define Game Function Pointers here
	size_t* GameRecvPacketSize;
	unsigned long GameNetworkInfo;
	byte** GameRecvBufferPointer;
	PacketRecvFunctor* GameRecvPacketFunctor;

	TSX_Client()
	{
		Loaded = false;

		ScreenID=-1;
		ZoneID=-1;
		PreviousScreenID=-1;
		PreviousZoneID=-1;
		ScreenAddress = NULL;
		ZoneAddress = NULL;
		MOBSpawns = NULL;
		NPCSpawns = NULL;
	}
	~TSX_Client()
	{
		delete MOBSpawns;
		delete NPCSpawns;
		delete ini;
		delete sig;
	}

	void Start();
	void Stop();
	DWORD Run();
	void LoadTranslationCSVs();

	void ScreenChanged();
	void ZoneChanged();

	DWORD RecvPacket(byte* Buffer,uint PacketSize);
	uint onMOBPacket(MonsterObject* mob);
	uint onNPCPacket(MonsterObject* npc);

	// Helper Functions
	void OutputToChatBox(const char* Message, unsigned int Color=0);
	void ShowNotice(const char* Message);
};

extern TSX_Client DLL;


uint hookRecvMonsterAction( MonsterObject* mob );
uint hookRecvNPCAction( MonsterObject* npc );

#endif
