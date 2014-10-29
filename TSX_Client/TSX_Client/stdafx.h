// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//
#ifndef __stdafx_H
#define __stdafx_H

#pragma once

#include "targetver.h"

#define NOMINMAX
#define WIN32_LEAN_AND_MEAN             // Exclude rarely-used stuff from Windows headers
// Windows Header Files:
#include <windows.h>



// TODO: reference additional headers your program requires here
#include <iomanip>
#include <ios>
#include <iostream>
#include <ostream>
#include <fstream>
#include <string>
#include <stdio.h>
#include <time.h>

#include <list>
#include <stdarg.h>

#include <map>
#include <vector>
#include <sstream>
#include <stack>

#include <psapi.h>

#include "TypeDefines.h"

#include "CVec3.h"
#include "packets.h"
#include "dump.h"
#include "CLog.h"
#include "SpawnInfoManager.h"
#include "Mutex.h"
#include "Thread.h"
#include "SignitureScanner.h"
#include "Ini.h"

// NtHookEngine
#include "NtHookEngine.h"

#include <winsock2.h>
#include <ws2tcpip.h>

#endif