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