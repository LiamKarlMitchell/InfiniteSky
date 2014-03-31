// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// This program merges two spawn info files together.
// For example if I collect hallf of map 1 and you collect other half of map 1.
// We might want to merge our data so we have full map.
// TODO: Test this and make sure its actually working as 001 spawn info got broken somehow.

#include "stdafx.h"

#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
#include "..\SpawnInfoManager\SpawnInfoManager.h"

using namespace std;

SpawnInfoManager* SIBase;
SpawnInfoManager* SIMerge;

SpawnInfo* SI;

const char* TypeMOB = "MOB";
const char* TypeNPC = "NPC";


int main()
{
	const char* Type = NULL;
	printf("Merging Spawn Infos\n");
	printf("Please make sure you have the following directorys\ndata\\spawninfo\\merge and data\\spawninfo\\ they should have the MOB or NPC spawn files in them\n\n");

	for (int i=0;i<300;i++)
	{
		for (int a=0;a<2;a++)
		{
			if (a==0)
			{
				Type = TypeMOB;
			}
			else if (a==1)
			{
				Type = TypeNPC;
			}

			SIMerge = new SpawnInfoManager(i, "data\\spawninfo_merge", Type);
			int MergeCount = SIMerge->Count();
			if (MergeCount>0)
			{
				printf("Found info to merge in %i.%s\n",i,Type);
				// Merge them into the Base
				SIBase = new SpawnInfoManager(i, Type);
				for (int x = 0; x<MergeCount; x++)
				{
					SI = SIMerge->GetInfo(x);
					if (SI!=NULL)
					{
						//printf("Merging %i\n",x);
						SIBase->AddSpawnInfo(SI);
					}
				}
				SIBase->Save();
				delete SIBase;
			}
			else
			{
				SIBase = new SpawnInfoManager(i, Type);
				if (SIBase->Count()==0) SIBase->Remove();
				delete SIBase;
			}
			SIMerge->Remove();

			delete SIMerge;
		}
		
	}

	printf("Done... Will exit in 3 seconds.");
	Sleep(3000);
	
	return 0;
}