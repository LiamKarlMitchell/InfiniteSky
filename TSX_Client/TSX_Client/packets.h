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
	uint MonsterID; //Unique ID or Smthing // UniqueID // Index *Server's index :D*
	uint UniqueID;  //UNique Attack ID like Unique ID except its unique to all mobs we can attack.
	uint AttackID;  //Non Unique ID
	uint Life;// ??? i think 
	uint Stance;
	uint animation;
	float Frame;	//28
    CVec3 Location;
	CVec3 TargetLocation;
	float Direction;
	float TargetDirection;
	
	int TargetObjectIndex;//FF FF FF FF
	//uint TargetObjectUniqueNumber;

	uint Unknown3[4];//
	CVec3 LocationTo;
	float FacingDirection;
	uint HP;//cant attack them w/o this?
};

#pragma pack(pop)
#endif;