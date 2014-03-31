#ifndef DLLINJECTOR_H
#define DLLINJECTOR_H

#include <Windows.h>

BOOL InjectDLL(DWORD dwProcessId, LPCSTR lpszDLLPath);

#endif