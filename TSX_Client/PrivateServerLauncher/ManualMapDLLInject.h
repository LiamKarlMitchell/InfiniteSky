#ifndef __ManualMapDLLInject_H
#define __ManualMapDLLInject_H
//         ManualMap - by Darawk
//        Featured @ www.RealmGX.com & www.Darawk.com
//
//   The purpose of ManualMap is to "manually map" a dll
//   module into a remote process's address space.  This
//   means that instead of just manipulating the remote
//   process into calling the LoadLibrary function, we
//   have our own emulation of what LoadLibrary does
//   without all those annoying detectability issues ^^.
//   The advantage of this method over using something
//   like my CloakDll function, is that this method never
//   has to call a function like LoadLibrary inside the
//   remote process.  Since LoadLibrary can be hooked,
//   the dll   could still be caught at the injection stage.
//   Or possibly also through the weakness I discussed in
//   the comment header of that file, which is not present
//   when using this technique.
#include <Windows.h>
#include <TlHelp32.h>
#include <Shlwapi.h>

#pragma comment(lib, "shlwapi.lib")

#define IMAGE_DIRECTORY_ENTRY_IMPORT 1
#define IMAGE_DIRECTORY_ENTRY_BASERELOC 5

//   Pietrek's macro
//
//   MakePtr is a macro that allows you to easily add to values (including
//   pointers) together without dealing with C's pointer arithmetic.  It
//   essentially treats the last two parameters as DWORDs.  The first
//   parameter is used to typecast the result to the appropriate pointer type.
#define MakePtr( cast, ptr, addValue ) (cast)( (DWORD_PTR)(ptr) + (DWORD_PTR)(addValue))

//   This one is mine, but obviously..."adapted" from matt's original idea =p
#define MakeDelta(cast, x, y) (cast) ( (DWORD_PTR)(x) - (DWORD_PTR)(y))

bool MapRemoteModule(unsigned long, char *);

unsigned long GetProcessIdByName(char *);
HMODULE GetRemoteModuleHandle(unsigned long, char *);
FARPROC GetRemoteProcAddress(unsigned long, char *, char *);

bool FixImports(unsigned long, void *, IMAGE_NT_HEADERS *, IMAGE_IMPORT_DESCRIPTOR *);
bool FixRelocs(void *, void *, IMAGE_NT_HEADERS *, IMAGE_BASE_RELOCATION *, unsigned int);
bool MapSections(HANDLE, void *, void *, IMAGE_NT_HEADERS *);

PIMAGE_SECTION_HEADER GetEnclosingSectionHeader(DWORD, PIMAGE_NT_HEADERS);
LPVOID GetPtrFromRVA(DWORD, PIMAGE_NT_HEADERS, PBYTE);

bool MapRemoteModule(unsigned long pId, char *module);
bool MapSections(HANDLE hProcess, void *moduleBase, void *dllBin, IMAGE_NT_HEADERS *ntHd);
bool FixImports(unsigned long pId, void *base, IMAGE_NT_HEADERS *ntHd, IMAGE_IMPORT_DESCRIPTOR *impDesc);
bool FixRelocs(void *base, void *rBase, IMAGE_NT_HEADERS *ntHd, IMAGE_BASE_RELOCATION *reloc, unsigned int size);

FARPROC GetRemoteProcAddress(unsigned long pId, char *module, char *func);
unsigned long GetProcessIdByName(char *process);
HMODULE GetRemoteModuleHandle(unsigned long pId, char *module);

//   Matt Pietrek's function
PIMAGE_SECTION_HEADER GetEnclosingSectionHeader(DWORD rva, PIMAGE_NT_HEADERS pNTHeader);
//   This function is also Pietrek's
LPVOID GetPtrFromRVA( DWORD rva, IMAGE_NT_HEADERS *pNTHeader, PBYTE imageBase );

#endif