// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#ifndef __PACKETS_H
#define __PACKETS_H

#include "stdafx.h"
#pragma pack(push, 1)

typedef byte PacketID;

class Packet
{
private:
public:
	Packet();
	PacketID GetID();
	void SetID(PacketID _PacketID);
protected:
	PacketID ID;
};

static const PacketID MonsterUpdatePacketID=0x1A;
class MonsterObject
{
public:
	uint UniqueID;//Unique ID or Smthing // UniqueID // Index *Server's index :D*
	uint AttackID;//UNique Attack ID like Unique ID except its unique to all mobs we can attack.
	uint MonsterID;//Non Unique ID
	uint Life;// ??? i think 
	uint Stance;
	uint animation;
	float Frame;	
    CVec3 Location;
	CVec3 TargetLocation;

	//float Frame;
	float Direction;
	float TargetDirection;
	//CVec3 Location;
	//CVec3 TargetLocation;
	
	int TargetObjectIndex;//FF FF FF FF
	//uint TargetObjectUniqueNumber;

	////-------------------------------------------------------------------------------------------------
	////ACTION_INFO
	////-------------------------------------------------------------------------------------------------
	//class ACTION_INFO
	//{
	//public:
	//	BYTE        aType               :   3;
	//	BYTE        aTargetObjectSort   :   3;
	//	BYTE        aSort;;
	//	short       aSkillValue;
	//
	//	float Frame;
	//	CVec3 Location;
	//	CVec3 TargetLocation;
	//	float Direction;
	//	float TargetDirection;
	//	int TargetObjectIndex;
	//	DWORD TargetObjectUniqueNumber;
	//	short       SkillNumber;
	//	BYTE        SkillGradeNum1;
	//	BYTE        SkillGradeNum2;
	//};

	uint Unknown3[7];//
	float FacingDirection;
	uint HP;//cant attack them w/o this?
};

#pragma pack(pop)
#endif;