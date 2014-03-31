// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// dllmain.cpp : Defines the entry point for the DLL application.
#include "stdafx.h"
#include "TSX_Client.h"

//TSX_Client DLL;

BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
					 )
{
	DisableThreadLibraryCalls((HMODULE)hModule);
	switch (ul_reason_for_call)
	{
	case DLL_PROCESS_ATTACH:
		DLL.Start();
		break;
	case DLL_THREAD_ATTACH:
	case DLL_THREAD_DETACH:
	case DLL_PROCESS_DETACH:
		DLL.Stop();
		break;
	}
	return TRUE;
}

