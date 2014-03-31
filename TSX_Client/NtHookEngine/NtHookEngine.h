/*
 * NtHookEngine.h
 *
 * TO BE USED WITH NTHOOKENGINE.LIB
 *
 * Defines functions included in the NT Hook Engine
 *
 * Make sure to call SetupNTHE first!
 */
#ifndef __NTHOOKENGINE_H_
#define __NTHOOKENGINE_H_
 
#include <Windows.h>
#include <stdlib.h>
 
extern "C" void __cdecl SetupNTHE();
extern "C" BOOL __cdecl HookFunction(ULONG_PTR OriginalFunction, ULONG_PTR NewFunction);
extern "C" VOID __cdecl UnhookFunction(ULONG_PTR Function);
extern "C" ULONG_PTR __cdecl GetOriginalFunction(ULONG_PTR Hook);

#endif // __NTHOOKENGINE_H_