#include "DLLInjector.h"

BOOL InjectDLL(DWORD dwProcessId, LPCSTR lpszDLLPath)
{
	HANDLE  hProcess, hThread;
	LPVOID  lpBaseAddr, lpFuncAddr;
	DWORD   dwMemSize, dwExitCode;
	BOOL    bSuccess = FALSE;
	HMODULE hUserDLL;

	if((hProcess = OpenProcess(PROCESS_CREATE_THREAD|PROCESS_QUERY_INFORMATION|PROCESS_VM_OPERATION
		|PROCESS_VM_WRITE|PROCESS_VM_READ|THREAD_QUERY_INFORMATION, FALSE, dwProcessId)))
	{		
		dwMemSize = lstrlenA(lpszDLLPath) + 1;
		if((lpBaseAddr = VirtualAllocEx(hProcess, NULL, dwMemSize, MEM_COMMIT, PAGE_READWRITE)))
		{			
			if(WriteProcessMemory(hProcess, lpBaseAddr, lpszDLLPath, dwMemSize, NULL))
			{				
				if((hUserDLL = LoadLibrary(TEXT("kernel32.dll"))))
				{					
					if((lpFuncAddr = GetProcAddress(hUserDLL, "LoadLibraryA")))
					{						
						if((hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)lpFuncAddr, lpBaseAddr, 0, NULL)))
						{
							WaitForSingleObject(hThread, INFINITE);
							if(GetExitCodeThread(hThread, &dwExitCode)) {
								bSuccess = (dwExitCode != 0) ? TRUE : FALSE;
							}
							CloseHandle(hThread);
						}
					}
					FreeLibrary(hUserDLL);
				}
			}
			VirtualFreeEx(hProcess, lpBaseAddr, 0, MEM_RELEASE);
		}
		CloseHandle(hProcess);
	}
	return bSuccess;
}