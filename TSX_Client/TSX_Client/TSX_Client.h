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
struct sNPCInfo
{
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

	float* GameTimeAddress;
	float GameTimeAdjust;
	bool SpeedHackEnabled;

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