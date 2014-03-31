// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#include "Launcher.h"

#define UserID_Length 13
#define Password_Length 32
//#define SessionID_Length 16
#define ResX_Default "1027"
#define ResY_Default "768"
#define ScreenMode_Default 1

char UserID[UserID_Length+1];
char Password[Password_Length+1];
char ResX[5];
char ResY[5];
int ScreenMode=0;
char* EXEPath="TwelveSky.exe";
char* DLLPath="TSX_Client.dll";
char* DLLManifestPath="PrivateServerDLL.dll.manifest";

char* ClientConnectString="alt1games.twelvesky1:";

//Ini* ini;

int WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance,LPSTR lpCmdLine,int nCmdShow)
{
	//ini = new Ini("Option.INI");
	//char* buf = new char[strlen(lpCmdLine)]();
	
	//MessageBox (NULL, lpCmdLine, "CmdLine Is", 0) ;

	// The paramaters depends on what method we wish to use
	// /K0000USERID/PHPSessionID/0/0/ScreenMode/ResX/ResY
	// These should be in a class or static.

	// get username and password set
	//sprintf(UserID,"%.*s",UserID_Length,"Administrator");
	//sprintf(Password,"%.*s",Password_Length,"Password");	
	
	//sprintf(ResX,"%.*s",5,ini->GetString("x",ResX_Default).c_str());
	//sprintf(ResY,"%.*s",5,ini->GetString("y",ResY_Default).c_str());
	
	// Screen Mode should be 1 for full screen and 2 for window mode 0 could be testing debug stuff	
	//if (ini->GetString("fullscreen","TRUE")=="TRUE")
	//{
		//ScreenMode=1;
	//}
	//else
	//{
		//ScreenMode=2;
	//}	

	// Load screen res and mode from options.ini

	// Allow setting paramaters	
	// Yeah I know its slightly big but should be big enough
	//char* LaunchString=new char[strlen(EXEPath)+1+strlen(ClientConnectString)+1+UserID_Length+1+Password_Length+30]();
	char* LaunchString=new char[255];

	//sprintf(LaunchString,"%s %s/%s/%s/0/18/0/%i/%s/%s",EXEPath,ClientConnectString,UserID,Password,ScreenMode,ResX,ResY);
	if (strlen(lpCmdLine)>0)
	{
		sprintf(LaunchString,"%s %s",EXEPath,lpCmdLine);
	}
	
	//sprintf(LaunchString,"TwelveSky.exe alt1games.twelvesky1:/Username/Password/0/0/0/2/1024/768");

	HWND hDlg=0; // This would be set to the dialog eventually when we create one
	STARTUPINFO info={sizeof(info)};
	PROCESS_INFORMATION processInfo;

	//MessageBoxA(0,LaunchString,"Launching with this string",0);
	if(CreateProcessA(NULL,LaunchString, NULL, NULL, FALSE, CREATE_SUSPENDED, NULL, NULL, &info, &processInfo))
	{
		//ACTCTX actctx = {sizeof(actctx)};
		//ZeroMemory(&actctx, sizeof(actctx));
		//actctx.cbSize = sizeof(actctx);
		//
		//actctx.lpSource = static_cast<LPCSTR>(DLLManifestPath);
		//HANDLE hActCtx = CreateActCtx( &actctx );
		//ULONG_PTR cookie = 0;

// Disabled manifest shit
		//if ( ActivateActCtx( hActCtx, &cookie ) )
		//{
		//
		
		//if (MapRemoteModule(processInfo.dwProcessId,DLLPath))
		if (InjectDLL(processInfo.dwProcessId,DLLPath))
		{
			ResumeThread((HANDLE)processInfo.hThread);
		}
		else
		{
			MessageBox(hDlg,"Cannot inject into TwelveSky.exe\r\nYou may have to run this launcher as Administrator\r\nRight click the shortcut and go Run As Administrator\r\n If this works you can change the preference in the properties.","Error injecting TSX Client!",MB_OK | MB_ICONERROR);
			// Kill the process if its running			
			TerminateProcess(processInfo.hProcess,1);
		}
		// Disabled manifest shit
		//// Need to do everything in this function here
		//DeactivateActCtx( 0, cookie );
		//ReleaseActCtx( hActCtx );
		//}
		//else
		//{
		//	MessageBox(hDlg,"Cannot inject into TwelveSky.exe Unable to find the dll manifest\r\nYou may have to reinstall our files.","Error injecting TSX Client!",MB_OK | MB_ICONERROR);
		//	// Kill the process if its running			
		//	TerminateProcess(processInfo.hProcess,1);
		//}
	}
	else
	{
		MessageBox(hDlg,"Failed to launch game","Error",MB_OK | MB_ICONERROR);
	}
	
	delete[] LaunchString;
	// We would call this to exit launcher
	//PostQuitMessage( 0 );

	//delete ini;
	return 0 ;
}

//void btnStartGame_OnClick(HWND hDlg)
//{
//	STARTUPINFO info={sizeof(info)};
//	PROCESS_INFORMATION processInfo;
//	if (!FileExists("TwelveSky2.exe"))
//	{
//		MessageBox(hDlg,"TwelveSky2.exe not found","Error launching game!",MB_OK | MB_ICONERROR);
//		PostQuitMessage( 0 );
//		return;
//	}
//	if (!FileExists("TSX\\TSXClient.dll"))
//	{
//		MessageBox(hDlg,"TSX\\TSXClient.dll not found","Error launching game!",MB_OK | MB_ICONERROR);
//		PostQuitMessage( 0 );
//		return;
//	}
//
//	if(!CreateProcessA(NULL,"TwelveSky2.exe /0/US/2/1024/768", NULL, NULL, FALSE, CREATE_SUSPENDED, NULL, NULL, &info, &processInfo))
//	{
//		//Global.Log.Write("CreateProcess ERROR: %i",GetLastError());	
//		MessageBox(hDlg,"Cannot start TwelveSky2.exe","Error launching game!",MB_OK | MB_ICONERROR);
//		PostQuitMessage( 0 );
//		return;
//	}	
//	if (!InjectDLL(processInfo.dwProcessId,"TSX\\TSXClient.dll"))
//	{
//		MessageBox(hDlg,"Cannot inject into TwelveSky2.exe\r\nYou may have to run TSXLauncher.exe as Administrator\r\nRight click the shortcut and go Run As Administrator\r\n If this works you can change the preference in the properties.","Error injecting TSX Client!",MB_OK | MB_ICONERROR);
//		PostQuitMessage( 0 );
//		return;
//	}
//
//	ResumeThread((HANDLE)processInfo.hThread);
//
//	PostQuitMessage( 0 );
//}