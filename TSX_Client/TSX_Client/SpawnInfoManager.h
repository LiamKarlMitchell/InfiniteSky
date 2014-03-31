#ifndef _SPAWN_INFO_MANAGER_H
#define _SPAWN_INFO_MANAGER_H

#include "stdafx.h"

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
	SpawnInfoManager(unsigned int ZoneID, const char* Extension);
	~SpawnInfoManager();

	void Load();
	void Save();

	void AddSpawnInfo(unsigned int UniqueID, unsigned int ID,float X, float Y, float Z, float Direction);
};
#endif