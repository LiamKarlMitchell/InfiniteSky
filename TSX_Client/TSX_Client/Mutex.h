// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Another thing I made ages ago feel free to use :)

#ifndef __MUTEX_H
#define __MUTEX_H

#include "stdafx.h"

// To make this cross platform I need to read this
// http://www.comptechdoc.org/os/linux/programming/c/linux_pgcmutex.html

// Required for cross platform
// Windows
typedef HANDLE MutexHandle;

// Linux
//typedef pthread_mutex_t MutexHandle;

// Mac
class Mutex
{
private:
	MutexHandle* h;
	bool Released;
public:
	Mutex(MutexHandle* _h) 
	{
		h=_h;
		if (*h==NULL)
		{
			*h=CreateMutex(NULL,TRUE,NULL);
			Released=false;
		}
		else
		{
			Aquire();
		}
	}
	Mutex(MutexHandle* _h,LPCWSTR lpName) 
	{
		h=_h;		
		if (*h==NULL)
		{
			*h=CreateMutexW(NULL,TRUE,lpName);
			Released=false;
		}
		else
		{
			Aquire();			
		}		
	}	
	Mutex(MutexHandle* _h,LPCSTR lpName) 
	{
		h=_h;		
		if (*h==NULL)
		{
			*h=CreateMutexA(NULL,TRUE,lpName);
			Released=false;
		}
		else
		{
			Aquire();			
		}		
	}	
	~Mutex()
	{
		Release();
	}	
	void Release()
	{
		if (!Released)
		{		
			ReleaseMutex(*h);	
			Released=true;
		}
	}	
	void Aquire()
	{
		WaitForSingleObject(*h,INFINITE);
		Released=false;
	}
};

#endif // __MUTEX_H