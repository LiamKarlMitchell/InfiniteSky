// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#ifndef _SPAWN_INFO_MANAGER_H
#define _SPAWN_INFO_MANAGER_H

#include <iostream>
#include <map>
#include <fstream>

using namespace std;

class SpawnInfo
{
public:
	unsigned int UniqueID;
	unsigned int ID;
	float X,Y,Z,Direction;

	SpawnInfo(unsigned int _UniqueID,unsigned int _ID, float _X, float _Y, float _Z, float _Direction)
	{
		UniqueID = _UniqueID;
		ID = _ID;
		X = _X;
		Y = _Y;
		Z = _Z;
		Direction = _Direction;
	}
};

typedef map<unsigned int,SpawnInfo*>::iterator InfosIterator;
typedef pair<unsigned int,SpawnInfo*> InfoPair;

class SpawnInfoManager
{
private:
	map<unsigned int,SpawnInfo*> Infos;
	char FileName[255];
	char* Data;
public:
	SpawnInfoManager(unsigned int ZoneID, const char* Path, const char* Extension);
	SpawnInfoManager(unsigned int ZoneID, const char* Extension);
	~SpawnInfoManager();

	void Load();
	void Save();
	void Remove();

	void AddSpawnInfo(unsigned int UniqueID, unsigned int ID,float X, float Y, float Z, float Direction);
	void AddSpawnInfo(const SpawnInfo* SI);
	int Count();

	SpawnInfo* GetInfo(unsigned int index);
};
#endif