// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#include "SpawnInfoManager.h"

SpawnInfoManager::SpawnInfoManager(unsigned int ZoneID, const char* Path, const char* Extension)
{
	sprintf(FileName,"%s\\%03u.%s",Path,ZoneID,Extension);
	Load();
}

SpawnInfoManager::SpawnInfoManager(unsigned int ZoneID, const char* Extension)
{
	sprintf(FileName,"data\\spawninfo\\%03u.%s",ZoneID,Extension);
	Load();
}

SpawnInfoManager::~SpawnInfoManager()
{   // Save SpawnInfo
	//Save();
	// Remove all SpawnInfo
	for(InfosIterator it = Infos.begin();it != Infos.end();it++)
	{
		delete it->second;
	}
}

void SpawnInfoManager::AddSpawnInfo(unsigned int UniqueID, unsigned int ID,float X, float Y, float Z, float Direction)
{
	// Add the Spawn Info if possible
	InfosIterator it = Infos.find(UniqueID);
	if(it != Infos.end())
	{
		//printf("Already stored updating");
		//it->second->UniqueID = UniqueID;
		//it->second->ID = ID;
		//it->second->X = X;
		//it->second->Y = Y;
		//it->second->Z = Z;
		//it->second->Direction = Direction;	
		return;
	}

	//Log.Write("Spawn Info: UniqueID %u ID %u { %.2f, %.2f, %.2f } %.2f",UniqueID,ID,X,Y,Z,Direction);
	Infos[UniqueID] = new SpawnInfo(UniqueID,ID,X,Y,Z,Direction);
}

void SpawnInfoManager::AddSpawnInfo(const SpawnInfo* SI)
{
	AddSpawnInfo(
		SI->UniqueID,
		SI->ID,
		SI->X,
		SI->Y,
		SI->Z,
		SI->Direction
	);
}

void SpawnInfoManager::Load()
{
	unsigned int FileSize;

	fstream myfile;
	myfile.open(FileName,ios_base::in | ios_base::binary);
	//check to make sure file is open
	if(myfile==NULL)
	{
		//printf("ERROR: File unsuccessfully opened");
		return;
	}
	//goes to end of file, gets file size, reads data, closes file
	myfile.seekg(0,ios::end);
	FileSize = myfile.tellg();
	myfile.seekg(0,ios::beg);

	Data = new char[FileSize];
	myfile.read(Data,FileSize);

	myfile.close();

	if (FileSize<=4)
	{
		//printf("ERROR: File is empty");
		return;
	}

	unsigned int RecordCount = *(unsigned int*)Data;
	//Log.Write("Record Count: %u",RecordCount);

	SpawnInfo* spawninfo = (SpawnInfo*)(Data+4);

	for (unsigned int i = 0; i < RecordCount; i++)
	{
		AddSpawnInfo(spawninfo[i].UniqueID,spawninfo[i].ID,spawninfo[i].X,spawninfo[i].Y,spawninfo[i].Z,spawninfo[i].Direction);
	}

	delete[] Data;
}

void SpawnInfoManager::Save()
{
	// Work out the file size
	unsigned int RecordCount = Infos.size();
	if (RecordCount==0) return;
	//Log.Write("Record Count: %u",RecordCount);

	unsigned int FileSize = 4 + (RecordCount * sizeof(SpawnInfo));

	// Open file
	fstream myfile;
	myfile.open(FileName,ios_base::out | ios_base::binary | ios_base::trunc);
	if(myfile==NULL)
	{
		//printf("ERROR:File unsuccessfully opened");
		return;
	}

	// Save out the count of infos stored
	myfile.write((const char*)&RecordCount,4);

	// iterate through the infos stored and save them out
	for(InfosIterator it = Infos.begin();it != Infos.end();it++)
	{
		myfile.write((const char*)it->second,sizeof(SpawnInfo));
	}

	myfile.close();
}

void SpawnInfoManager::Remove()
{
	remove(FileName);
}

int SpawnInfoManager::Count()
{
	return Infos.size();
}

SpawnInfo* SpawnInfoManager::GetInfo(unsigned int index)
{
	if (index<Infos.size())
	{
		return Infos[index];
	}
	return NULL;
}