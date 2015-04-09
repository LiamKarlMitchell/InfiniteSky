// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// TSX_Client.cpp : Defines the exported functions for the DLL application.
//

#include "stdafx.h"
#include "TSX_Client.h"

#include "detourxs.h"
#include "csv-parser\csv_parser.hpp"


TSX_Client DLL;


typedef HANDLE ( WINAPI* tCreateFileW )(LPCWSTR lpFileName,DWORD dwDesiredAccess,DWORD dwShareMode,LPSECURITY_ATTRIBUTES lpSecurityAttributes,DWORD dwCreationDisposition,DWORD dwFlagsAndAttributes,HANDLE hTemplateFile);
HANDLE WINAPI hook_CreateFileW(LPCWSTR lpFileName,DWORD dwDesiredAccess,DWORD dwShareMode,LPSECURITY_ATTRIBUTES lpSecurityAttributes,DWORD dwCreationDisposition,DWORD dwFlagsAndAttributes,HANDLE hTemplateFile);
tCreateFileW oCreateFileW;

PacketRecvFunctor OrigionalPacketRecvFunctor[0xFF];
uncompress_functor uncompress=NULL;
byte* RecvBuffer=NULL;

int DevButtons = 0;
char* uncompressBuffer[1000];


//__declspec(naked) void RecvPacketHook()
//{
//	__asm
//	{
//		//PUSH EDX // Preserve EDX
//		PUSH EDX // PUSH PacketSize
//		SUB EDI,EDX // Get real buffer address
//		PUSH EDI // PUSH BUFFER
//		ADD EDI,EDX // Restore the address
//		CALL OurRecvPacketFunction // EAX will contain function address to goto
//
//		POP EDX // Clean up stack
//		POP EDX
//
//		//POP EDX // Restore EDX
//
//		JMP EAX
//	}
//}
DWORD oldProtection;
DWORD SetProtection(void* m_address, DWORD m_size, DWORD protection = PAGE_EXECUTE_READWRITE) {
	DWORD dwOldProtect;
	VirtualProtect((void*) m_address, m_size, PAGE_EXECUTE_READWRITE, &dwOldProtect);
	return dwOldProtect;
}

DWORD OurRecvPacketFunction(byte* Buffer,uint PacketSize)
{
	return DLL.RecvPacket(Buffer,PacketSize);
}

// Have the dll functions here
void TSX_Client::Start()
{
	RunDLL=true;

	if (GetAsyncKeyState(VK_F12))
	{
		MessageBox(0,"Paused","TSX Paused",MB_OK);
	}

	thread.set(this, &TSX_Client::Run);
	thread.start();
}

void TSX_Client::Stop()
{
	// Remove things done and free memory etc here
	RunDLL=false;
	thread.join();
}

HANDLE WINAPI hook_CreateFileW(LPCWSTR lpFileName,DWORD dwDesiredAccess,DWORD dwShareMode,LPSECURITY_ATTRIBUTES lpSecurityAttributes,DWORD dwCreationDisposition,DWORD dwFlagsAndAttributes,HANDLE hTemplateFile) {


	if (wcscmp(lpFileName,L"log.txt")!=0)
	{
	//	//Log.Write("CreateFileW: %s",lpFileName);
		//MessageBoxW(0,lpFileName,L"CreateFileW",0);
	//	Beep(1,1);
		HANDLE Result;

		// Get custom file path
		wchar_t CustomFile[MAX_PATH]=L"data\\";
		wcscat(CustomFile,lpFileName);

		// See if custom file exists (By setting CreationDisposition to OPEN_EXISTING the API will only open the file if it exists)
		if (oCreateFileW(CustomFile,dwDesiredAccess,dwShareMode,lpSecurityAttributes,OPEN_EXISTING,dwFlagsAndAttributes,hTemplateFile)!=INVALID_HANDLE_VALUE)
		{
			// Our File Exists
			Result = oCreateFileW(CustomFile,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);
		}
		else
		{
			// Use origional File
			Result=oCreateFileW(lpFileName,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);
		}
		return Result;
	}

	return oCreateFileW(lpFileName,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);
	//return detour_CreateFileW->GetOriginalFunction()(lpFileName,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);

	//HANDLE Result;

	//// Get custom file path
	//wchar_t CustomFile[MAX_PATH]=L"data\\";
	//wcscat(CustomFile,lpFileName);

	//// See if custom file exists (By setting CreationDisposition to OPEN_EXISTING the API will only open the file if it exists)
	//if (detour_CreateFileW->GetOriginalFunction()(CustomFile,dwDesiredAccess,dwShareMode,lpSecurityAttributes,OPEN_EXISTING,dwFlagsAndAttributes,hTemplateFile)!=INVALID_HANDLE_VALUE)
	//{
	//	// Our File Exists
	//	Result = detour_CreateFileW->GetOriginalFunction()(CustomFile,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);
	//}
	//else
	//{
	//	// Use origional File
	//	Result=detour_CreateFileW->GetOriginalFunction()(lpFileName,dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);
	//}
	//return Result;
}

void TSX_Client::LoadTranslationCSVs() {
	// Find spawninfos in game memory
	vector_unsigned_long infoLocations;
	infoLocations.clear();
	int index;
	char *infoKinds[] = { "Levels", "Items", "Skills", "Monsters", "NPCs", "Quests"};

	bool hadToWait = false;
TryToFindAllInfoLocations:
	Log.Write("Finding all info locations in game memory.");
	sig->find_all(infoLocations, "68????????B9XXXXXXXXE8????????85C075??68????????68????????68????????55FF15????????5B5F5E33C05D81C4????????C3",4);

	MEMORY_BASIC_INFORMATION meminfo;
	DWORD dwPage_Protection;

	// Check if infos are loaded
	index = 0;
	for(vector_unsigned_long::iterator it = infoLocations.begin(); it != infoLocations.end(); ++it) {
		if (index == 6) break;
		switch (index)
		{
			// TODO Check infos have loaded correctly.
			// This should probably check a flag somewhere... the game must set them right?
			case 1:
				Log.Write("Address of %s info is %08X which points too %08X",infoKinds[index],*it,(*(unsigned long*)*it));
			if ((*(unsigned long*)*it) == 0x00000000) {
					infoLocations.clear();
					Log.Write("Problem finding address for %s info maybe it is not yet loaded.",infoKinds[index]);
					hadToWait = true;
					Sleep(100);
					goto TryToFindAllInfoLocations;
			}
			break;
		}
		index++;
	}

	// Wait for 2 sec just to be sure I hope...
	if (hadToWait) {
		Sleep(2000);
	}

	index = 0;
	for(vector_unsigned_long::iterator it = infoLocations.begin(); it != infoLocations.end(); ++it) {
		if (index == 6) break;

		Log.Write("Infos %i %s at address %08X",index,infoKinds[index],*it);

		char FileName[255] = {0};

		//// Items.csv 005_00002.IMG
		//// Skills.csv 005_00004.IMG
		//// Monsters.csv 005_00004.IMG
		//// NPC.csv 005_00006.IMG
		//// Quests.csv 005_00007.IMG

		sprintf(FileName,"data\\translation\\%s.csv",infoKinds[index]);
		Log.Write("Opening Translation %s",FileName);

	    CSV_Parser csv_parser;
		CSV_FIELDS header;
		KEY_VAL_FIELDS output_map;
		STR line;

		// Open the CSV file
		std::ifstream test_file(FileName);
		if(test_file.is_open())
		{
			VirtualQuery((void*)(*(unsigned long*)*it), &meminfo, sizeof(MEMORY_BASIC_INFORMATION));
			VirtualProtect( ( PVOID )meminfo.BaseAddress, meminfo.RegionSize, PAGE_EXECUTE_READWRITE, &dwPage_Protection );

			unsigned int lineNumber = 1;
			while(getline(test_file, line))
			{
				//Log.Write("CSV line - %s",line.c_str());
				if (lineNumber == 1) {
					if (!csv_parser.parse_line(line, header)) {
						Log.Write("Error encountered while parsing the header input line: %u data: %s",line.c_str());
						break;
					}
					lineNumber++;
					continue;
				}

				if(csv_parser.parse_line(line, header, output_map))
				{
					switch (index) {
						case 1: { // Items
							// TODO Make this dynamically read the header and store the column titiles.
							// Then for each cell on rows if column title is name overwrite the item name and so on..
							//string ID,Name,Description1,Description2,Description3;
							unsigned int ItemID = atoi(output_map[header.front()].c_str());
							//string Name,Description1,Description2,Description3;
							//int Level,ItemType,Rareness,Clan,LevelRequirement,HonorPointReq,PurchasePrice,SalePrice,DisplayItem2D,Strength,Dexterity,Vitality,Chi,Luck,Damage,Defense,LightDamage,ShadowDamage,DarkDamage,LightResistance,ShawdowResistance,DarkResistance,ChancetoHit,ChancetoDodge,PercentToDeadlyBlow,ValueType,Value1,SkillBonusID1,SkillBonusID2,SkillBonusID3,SkillBonusAmount1,SkillBonusAmount2,SkillBonusAmount3;
							unsigned long addy = (*(unsigned long*)*it) + (sizeof(sItemInfo)*(ItemID-1));
							//// TODO optimize memory protection writing & reverting.
							Log.Write("[%04u] %s at address %08X", ItemID, output_map["Name"].c_str(), addy);

							sItemInfo* ii = (sItemInfo*)addy;
							////strncpy((char*)addy+4,Name.c_str(),28);


							//// TODO: iterate through header use it to get field from output_map and set it appropriately into the info in game memory
							//CONST_MAP_ITR it = output_map.begin();
							//   for (; it != output_map.end(); ++it) {
							//	Log.Write("Key - %s, Value - %s",it->first.c_str(),it->second.c_str());
							//}

							strncpy(ii->Name,output_map["Name"].c_str(),28);
							strncpy(ii->Description1,output_map["Description1"].c_str(),25);
							strncpy(ii->Description2,output_map["Description2"].c_str(),25);
							strncpy(ii->Description3,output_map["Description3"].c_str(),25);

							}
						break;
						case 2: { // Skills
							unsigned int SkillID = atoi(output_map[header.front()].c_str());
							unsigned long addy = (*(unsigned long*)*it) + (sizeof(sSkillInfo)*(SkillID-1));
							Log.Write("[%04u] %s at address %08X", SkillID, output_map["Name"].c_str(), addy);

							sSkillInfo* si = (sSkillInfo*)addy;
							strncpy(si->Name,output_map["Name"].c_str(),28);
							strncpy(si->Description1,output_map["Description1"].c_str(),51);
							strncpy(si->Description2,output_map["Description2"].c_str(),51);
							strncpy(si->Description3,output_map["Description3"].c_str(),50);
						}
						break;
						case 3: { // Monsters
							unsigned int MonsterID = atoi(output_map[header.front()].c_str());
							unsigned long addy = (*(unsigned long*)*it) + (sizeof(sMonsterInfo)*(MonsterID-1));
							Log.Write("[%04u] %s at address %08X", MonsterID, output_map["Name"].c_str(), addy);

							sMonsterInfo* mi = (sMonsterInfo*)addy;
							strncpy(mi->Name,output_map["Name"].c_str(),24);
						}
						break;
						case 4: {
							unsigned int ItemID = atoi(output_map[header.front()].c_str());
							unsigned long addy = (*(unsigned long*)*it) + (sizeof(sNPCInfo)*(ItemID-1));
							sNPCInfo* ni = (sNPCInfo*)addy;
							Log.Write("[%04u] %s at address %08X", ItemID, output_map["Name"].c_str(), addy);

							strncpy(ni->Name,output_map["Name"].c_str(),28);
							strncpy(ni->Chat1,output_map["Chat1"].c_str(),51);
							strncpy(ni->Chat2,output_map["Chat2"].c_str(),51);
							strncpy(ni->Chat3,output_map["Chat3"].c_str(),51);
							strncpy(ni->Chat4,output_map["Chat4"].c_str(),51);
							strncpy(ni->Chat5,output_map["Chat5"].c_str(),51);
						}
						break;
					}

				}
				else
				{
					Log.Write("Error encountered while parsing the input line: %u data: %s",line.c_str());
				}
				output_map.clear();
				lineNumber++;
			}
		}

		VirtualProtect( ( PVOID )meminfo.BaseAddress, meminfo.RegionSize, dwPage_Protection, NULL );

		header.clear();
		index++;
	}
}

DWORD TSX_Client::Run()
{
	Log.Remove();
	Log.Write("TSX_Client started: ");

	Init();

	do
	{
		//ScreenID = *ScreenAddress;
		//if (ScreenID!=PreviousScreenID) ScreenChanged();

		// If Zone Changed
		//ZoneID = *ZoneAddress;
		//if (ZoneID!=PreviousZoneID) ZoneChanged();

		if (DevButtons) {

		//if (GetAsyncKeyState(VK_F3)) {
			//LoadTranslationCSVs();
		//}
			
		if (GetAsyncKeyState(VK_CONTROL)!=0) {
			HWND hwnd = GetForegroundWindow();
			DWORD currentWindowProcessID;
			GetWindowThreadProcessId(hwnd, &currentWindowProcessID);
			// If the current window in foreground belongs to this process
			if (currentWindowProcessID == ProcessID) {

				if (GetAsyncKeyState(VK_F12)!=0)
				{
					Log.Write("Force Quit");
					RunDLL=false;
					// Terminate process
					Sleep(500);
					TerminateProcess(ProcessHandle,1);
				}

				//if (GetAsyncKeyState(VK_HOME)!=0)
				//{
				//	Log.Write("Load/Save Regions for ZoneID %u",ZoneID);
				//	Sleep(300);
				//	if (MOBSpawns) delete MOBSpawns;
				//	MOBSpawns = new SpawnInfoManager(ZoneID,"MOB");
				//	if (NPCSpawns) delete NPCSpawns;
				//	NPCSpawns = new SpawnInfoManager(ZoneID,"NPC");
				//}

				/*if (GetAsyncKeyState(VK_F2)!=0)
				{
					Sleep(100);
					LoadTranslationCSVs();
				}*/

				// Able to move window
		    
				if (GetAsyncKeyState(VK_HOME)!=0) {
					RECT rc;
					POINT p;
					if (GetCursorPos(&p)) {
					  GetWindowRect(hwnd, &rc);
					  Log.Write("Setting Window Position to (%d, %d)",p.x,p.y);
					  SetWindowPos(hwnd, HWND_TOP, p.x, p.y, NULL, NULL, SWP_NOSIZE);
					  //SetWindowLong(hwnd, GWL_STYLE, WS_POPUP);
					}
				}
				/*SetWindowPos(
				  _In_      HWND hWnd,
				  _In_opt_  HWND hWndInsertAfter,
				  _In_      int X,
				  _In_      int Y,
				  _In_      int cx,
				  _In_      int cy,
				  _In_      UINT uFlags
				)*/

				// TODO Monster Vac Hack :)

				if (GetAsyncKeyState(VK_END)!=0)
				{
					Sleep(300);
					SpeedHackEnabled=!SpeedHackEnabled;
					Log.Write("Speed Hack Toggled %s value %f",SpeedHackEnabled ? "On" : "Off",GameTimeAdjust);
				}

				if (GetAsyncKeyState(VK_F8)!=0)
				{
					Sleep(100);
					GameTimeAdjust-=0.0005f;
					if (GameTimeAdjust < 0) {
						GameTimeAdjust  = 0;
					} else {
					  Log.Write("Speed Hack Decreased to %f",GameTimeAdjust);
					}
				}

				if (GetAsyncKeyState(VK_F9)!=0)
				{
					Sleep(100);
					GameTimeAdjust+=0.0005f;
					Log.Write("Speed Hack Increased to %f",GameTimeAdjust);
				}
			}
		}


		if (SpeedHackEnabled)
		{
			*GameTimeAddress=*GameTimeAddress-GameTimeAdjust;
		}
	}

		Sleep(1);
	}while(RunDLL);

	Uninit();
	Log.Write("TSX_Client ended:");
	return 0;
}


void TSX_Client::ScreenChanged()
{
	// Could enable/disable diffrent gui's here.
	switch (ScreenID)
	{
	case Screen_Init:
		Log.Write("Screen: Game Init");
	break;
	case Screen_ServerSelect:
		Log.Write("Screen: Server Select");
	break;
	case Screen_Login:
		Log.Write("Screen: Login");
	break;
	case Screen_PinEntry:
		Log.Write("Screen: Pin Entry");
	break;
	case Screen_CharacterSelect:
		Log.Write("Screen: Character select");
	break;
	case Screen_ZoneTransfer:
		Log.Write("Screen: Zone Transfer");
		ZoneID = *ZoneAddress;
		if (ZoneID!=PreviousZoneID) ZoneChanged();
	break;
	case Screen_World:
		Log.Write("Screen: World");
	break;
	default:
		Log.Write("Unknown Screen: %u",ScreenID);
		break;
	}

	PreviousScreenID=ScreenID;
}

void TSX_Client::ZoneChanged()
{
	Log.Write("Zone Change: %03u<PreviousZone> %03u<NewZone>",PreviousZoneID,ZoneID); // Need to output zoneid's and names here.

	if (MOBSpawns) delete MOBSpawns;
	MOBSpawns = new SpawnInfoManager(ZoneID,"MOB");
	if (NPCSpawns) delete NPCSpawns;
	NPCSpawns = new SpawnInfoManager(ZoneID,"NPC");

	PreviousZoneID = ZoneID;
}

uint TSX_Client::onMOBPacket(MonsterObject* mob)
{
	//if (MOBSpawns) MOBSpawns->AddSpawnInfo(mob->UniqueID,mob->MonsterID,mob->Location.x,mob->Location.y,mob->Location.z,mob->FacingDirection);
	return 0;
}

uint TSX_Client::onNPCPacket(MonsterObject* npc)
{
	//if (NPCSpawns) NPCSpawns->AddSpawnInfo(npc->UniqueID,npc->MonsterID,npc->Location.x,npc->Location.y,npc->Location.z,npc->FacingDirection);
	return 0;
}

void TSX_Client::Init()
{
	ini = new Ini("PrivateServer.ini");
	sig = new signature_scanner();

	ProcessHandle = GetCurrentProcess();
	ProcessID = GetProcessId(ProcessHandle);
	Log.Write("ProcessID: %u %04X",ProcessID,ProcessID);

	Log.Write("Size of sSkillInfo is %u", sizeof(sSkillInfo));
	Log.Write("Monster Object size is %u",sizeof(MonsterObject));

	DevButtons = ini->GetInt("DevButtons",0);

	if (ini->GetInt("HookFileLoading",1))
	{
		Log.Write("Hooking File Loading");
		oCreateFileW = (tCreateFileW) DetourCreate("kernel32.dll", "CreateFileW", hook_CreateFileW, DETOUR_TYPE_JMP);
		if (oCreateFileW == NULL) {
			oCreateFileW = (tCreateFileW) DetourCreate("kernelbase.dll", "CreateFileW", hook_CreateFileW, DETOUR_TYPE_JMP);
		}

		if (oCreateFileW == NULL) {
			Log.Write("Error failed to hook file loading.");
		}
	}

	HMODULE rsaenh = NULL;
	do
	{
		rsaenh = GetModuleHandle("rsaenh.dll");
		Sleep(1);
	}
	while(rsaenh==NULL);
	Log.Write("Unpacked in Memory");
	//MessageBox(0,"TSX Paused","Paused",MB_OK);


	char* VersionString = (char*)sig->search("6A0168????????6A1268XXXXXXXX");
	if (VersionString)
	{
		Log.Write("Game Version: %s Found at %08X",VersionString,VersionString);
		//oldProtection = SetProtection(VersionString,50);
		//sprintf(VersionString, "%s TSX",VersionString); // Actually overwrites camera default zoom or something.
		//SetProtection(VersionString,50,oldProtection);
	}
	else
	{
		Log.Write("Game Version Not Found");
	}

	char* GGFile = "GameGuard.des";
	char* GGFileBackup = "GameGuard.des.bak";
	if (ini->GetInt("BypassGameGuard",1))
	{
		Log.Write("Attempting to bypass GameGuard");
		rename(GGFile,GGFileBackup);

		// STEP ZERO: By Tri407tiny!
		//005404ED   .  53                                PUSH EBX
		//005404EE   .  8BD9                              MOV EBX,ECX
		//005404F0   .  56                                PUSH ESI
		//005404F1   .  57                                PUSH EDI
		//005404F2   .  895D FC                           MOV DWORD PTR SS:[EBP-0x4],EBX
		//005404F5   .  EB 04                             JMP SHORT TwelveSk.005404FB
		//005404F7   .  EB 05                             JMP SHORT TwelveSk.005404FE
		//005404F9   .  3919                              CMP DWORD PTR DS:[ECX],EBX
		//005404FB   >  803B 00                           CMP BYTE PTR DS:[EBX],0x0
		//005404FE      0F85 181F0000                     JNZ TwelveSk.0054241C  << Change to JMP as shown below

		// The patch
		//005404FE     /E9 191F0000                       JMP TwelveSk.0054241C
		//00540503     |90                                NOP
		byte* GGZero = (byte*)sig->search("538BD95657895DFC",17);
		byte GGZeroBytes[] = {0xE9,0x19,0x1F,0x00,0x00,0x90};
		if (GGZero)
		{
			Log.Write("GGZero Found at %08X",GGZero);
			oldProtection = SetProtection(GGZero,10);
			memcpy(GGZero,GGZeroBytes,sizeof(GGZeroBytes));
			SetProtection(GGZero,10,oldProtection);

		}
		else
		{
			Log.Write("GGZero Not Found");
		}

		// STEP ONE:
		// Bypassing GameGuard Init
		// We want the third one *but maybe we can patch them all? or we should just get a stronger signiture.
		//byte* GGBypass1 = NULL;
		//byte GGBypass1Bytes[] = {0xE9,0x1E,0x01,0x00,0x00,0x90};
		//
		//while(GGBypass1 = (byte*)sig->search("0F851D010000",0,true,GGBypass1))
		//{
		//    memcpy(GGBypass1,GGBypass1Bytes,sizeof(GGBypass1Bytes));
		//}

		// I decided to make a stronger signiture but if we need to we can patch everything.

		// Cant remember what this patchs oh well change it to JMP
		//00541669   . /0F85 1D010000 JNZ TwelveSk.0054178C
		//0054166F   . |8D4D D8       LEA ECX,DWORD PTR SS:[EBP-0x28]
		//00541672   . |8D95 D8FEFFFF LEA EDX,DWORD PTR SS:[EBP-0x128]
		//00541678   . |51            PUSH ECX
		//00541679   . |52            PUSH EDX
		//0054167A   . |57            PUSH EDI
		//0054167B   . |57            PUSH EDI
		//0054167C   . |57            PUSH EDI
		//0054167D   . |6A 01         PUSH 0x1
		//0054167F   . |57            PUSH EDI
		//00541680   . |8D85 C0F4FFFF LEA EAX,DWORD PTR SS:[EBP-0xB40]
		//00541686   . |57            PUSH EDI
		//00541687   . |8D8D D0FCFFFF LEA ECX,DWORD PTR SS:[EBP-0x330]
		//0054168D   . |50            PUSH EAX
		//0054168E   . |51            PUSH ECX
		//0054168F   . |FF15 78C15500 CALL DWORD PTR DS:[0x55C178]
		//00541695   . |85C0          TEST EAX,EAX

		byte* GGBypass1 = (byte*)sig->search("0F851D0100008D4D");
		byte GGBypass1Bytes[] = {0xE9,0x1E,0x01,0x00,0x00,0x90};
		if (GGBypass1)
		{
			Log.Write("GGBypass1 Found at %08X",GGBypass1);
			oldProtection = SetProtection(GGBypass1,10);
			memcpy(GGBypass1,GGBypass1Bytes,sizeof(GGBypass1Bytes));
			SetProtection(GGBypass1,10,oldProtection);
		}
		else
		{
			Log.Write("GGBypass1 Not Found");
		}

		// STEP TWO:
		// Bypassing GameGuard Error MessageBox's
		//00401A70  /$  81EC E8030000 SUB ESP,0x3E8
		//00401A76  |.  E8 B5E11300   CALL TwelveSk.0053FC30    <<<< NOP THIS
		//00401A7B  |.  3D 55070000   CMP EAX,0x755
		//00401A80  |.  74 33         JE SHORT TwelveSk.00401AB5  <<<< MAKE JMP
		//00401A82  |.  50            PUSH EAX
		//00401A83  |.  8D4424 04     LEA EAX,DWORD PTR SS:[ESP+0x4]
		//00401A87  |.  68 B4C45500   PUSH TwelveSk.0055C4B4                   ;  ASCII "[GameGuard Error::%lu]"
		//00401A8C  |.  50            PUSH EAX
		//00401A8D  |.  E8 4B711400   CALL TwelveSk.00548BDD
		//00401A92  |.  83C4 0C       ADD ESP,0xC
		//00401A95  |.  68 00100000   PUSH 0x1000                              ; /Style = MB_OK|MB_SYSTEMMODAL
		//00401A9A  |.  68 A8C45500   PUSH TwelveSk.0055C4A8                   ; |Title = "TwelveSky"
		//00401A9F  |.  8D4C24 08     LEA ECX,DWORD PTR SS:[ESP+0x8]           ; |
		//00401AA3  |.  51            PUSH ECX                                 ; |Text
		//00401AA4  |.  6A 00         PUSH 0x0                                 ; |hOwner = NULL
		//00401AA6  |.  FF15 D0C25500 CALL DWORD PTR DS:[0x55C2D0]             ; \MessageBoxA
		//00401AAC  |.  33C0          XOR EAX,EAX
		//00401AAE  |.  81C4 E8030000 ADD ESP,0x3E8
		//00401AB4  |.  C3            RETN
		//00401AB5  |>  B8 01000000   MOV EAX,0x1
		//00401ABA  |.  81C4 E8030000 ADD ESP,0x3E8
		//00401AC0  \.  C3            RETN
		// Would be more awesome if we could detour this and log the messages to our log.
		byte* GGBypass2 = (byte*)sig->search("81ECE8030000E8????????3D55070000",6);
		if (GGBypass2)
		{
			Log.Write("GGBypass2 Found at %08X",GGBypass2);
			oldProtection = SetProtection(GGBypass2,30);
			memset(GGBypass2,0x90,5);
			GGBypass2[10]=0xEB;
			SetProtection(GGBypass2,30,oldProtection);
		}
		else
		{
			Log.Write("GGBypass2 Not Found");
		}

		// STEP THREE: Bypassing shitty IE errors and junk :)
		byte* ggErrorIEPatch = (byte*)sig->search("518B0D????????85C9750433C059C3",9);
		if (ggErrorIEPatch)
		{
			Log.Write("GG Error IE Patch found at %08X",ggErrorIEPatch);
			// Write Nops
			oldProtection = SetProtection(ggErrorIEPatch,10);
			ggErrorIEPatch[0]=0x90;
			ggErrorIEPatch[1]=0x90;
			SetProtection(ggErrorIEPatch,10,oldProtection);
		}
		else
		{
			Log.Write("Failed to find ggErrorIEPatch address");
		}

	}
	else
	{
		rename(GGFileBackup,GGFile);
	}

	if (ini->GetInt("MultiClient",1))
	{
		//00403AB6   > \6A 00         PUSH 0                                   ; /Title = NULL
		//00403AB8   .  68 A8845500   PUSH 005584A8                            ; |Class = "TwelveSky"
		//00403ABD   .  FF15 A0825500 CALL DWORD PTR DS:[5582A0]               ; \FindWindowA
		//00403AC3   .  85C0          TEST EAX,EAX
		//00403AC5   .  74 3F         JE SHORT 00403B06							; Patch me to JMP
		//6A 00 68 A8 84 55 00 FF 15 A0 82 55 00 85 C0 74 3F
		//x  x  x  ?  ?  ?  ?  x  x  ?  ?  ?  ?  x  x  x  x
		//6A 00 68 ?? ?? ?? ?? FF 15 ?? ?? ?? ?? 85 C0 74 3F
		byte* MultiClientPatch = (byte*)sig->search("6A0068????????FF15????????85C0743F");

		if (MultiClientPatch)
		{
			oldProtection = SetProtection(MultiClientPatch,20);
			Log.Write("MultiClientPatch found at %08X",MultiClientPatch);
			MultiClientPatch[15]=0xEB;
			SetProtection(MultiClientPatch,20,oldProtection);
		}
		else
		{
			Log.Write("Error finding MultiClientPatch");
		}
	}

	if (ini->GetInt("ChangeIP",1))
	{
		Log.Write("Trying to patch IP");
		// Find IP address
		//004873AC   .  57            PUSH EDI
		//004873AD   .  BF 28B5EC00   MOV EDI,00ECB528                         ;  ASCII "110.45.184.130"
		//004873B2   >  8B04B5 68BBEC>MOV EAX,DWORD PTR DS:[ESI*4+ECBB68]
		//004873B9   .  50            PUSH EAX                                 ; /Arg2
		//004873BA   .  57            PUSH EDI                                 ; |Arg1
		//004873BB   .  B9 20B5EC00   MOV ECX,00ECB520                         ; |
		//004873C0   .  E8 8BA8FFFF   CALL 00481C50                            ; \TwelveSk.00481C50
		//004873C5   .  8904B5 F8BCEC>MOV DWORD PTR DS:[ESI*4+ECBCF8],EAX
		//004873CC   .  A1 20B5EC00   MOV EAX,DWORD PTR DS:[ECB520]
		//004873D1   .  46            INC ESI
		//004873D2   .  83C7 10       ADD EDI,10
		//004873D5   .  3BF0          CMP ESI,EAX
		//004873D7   .^ 7C D9         JL SHORT 004873B2

		IPAddress = (char*)sig->search_text(ini->GetString("OrigionalIP","110.45.184.130").c_str());
		if (IPAddress)
		{
			//00401930 <FuckupIP>/$  83EC 08                    SUB ESP,8
			//00401933           |.  55                         PUSH EBP
			//00401934           |.  56                         PUSH ESI
			//00401935           |.  57                         PUSH EDI
			//00401936           |.  8B7C24 18                  MOV EDI,DWORD PTR SS:[ESP+18]
			//0040193A           |.  8BC7                       MOV EAX,EDI
			//0040193C           |.  33ED                       XOR EBP,EBP
			//0040193E           |.  66:C74424 0C 3000          MOV WORD PTR SS:[ESP+C],30
			//00401945           |.  33D2                       XOR EDX,EDX
			//00401947           |.  8D70 01                    LEA ESI,DWORD PTR DS:[EAX+1]
			//0040194A           |.  8D9B 00000000              LEA EBX,DWORD PTR DS:[EBX]
			//00401950           |>  8A08                       /MOV CL,BYTE PTR DS:[EAX]
			//00401952           |.  40                         |INC EAX
			//00401953           |.  84C9                       |TEST CL,CL
			//00401955           |.^ 75 F9                      \JNZ SHORT 00401950

			//DWORD IPFuckupPatchAddress = FindSigniture(0x00401000,0x0045FFFF,(PBYTE)"\x83\xEC\x08\x55\x56\x57\x8B\x7C\x24\x18\x8B\xC7\x33\xED","xxxxxxxxxxxxxx");
			Log.Write("IP Address found at %08X",IPAddress);
			Log.Write("Patching IP Stuffing up code");
			unsigned long ipfuckuppatch = sig->search("83EC085556578B7C24188BC733ED");
			if (ipfuckuppatch)
			{
				oldProtection = SetProtection((byte*)(ipfuckuppatch),10);

				*(byte*)(ipfuckuppatch)=0xC3; // RETN

				SetProtection((byte*)(ipfuckuppatch),10,oldProtection);

				// Get IP address of extendedgames.com using DNS lookup?
				strncpy(IPAddress,ini->GetString("ServerIP","DOMAIN").c_str(),15);

				if (strcmp(IPAddress,"DOMAIN")==0)
				{
				       Log.Write("Asking for domains ip");
					   WSADATA wsaData;
						int iResult;

						DWORD dwError;

						struct hostent *remoteHost;
						char *host_name;
						struct in_addr addr;

						// Initialize Winsock
						iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
						if (iResult != 0)
						{
							Log.Write("WSAStartup failed: %d", iResult);
						}
						else
						{

						host_name = "extendedgames.com";


						Log.Write("Calling gethostbyname with %s", host_name);
						remoteHost = gethostbyname(host_name);


						if (remoteHost == NULL)
						{
							dwError = WSAGetLastError();
							if (dwError != 0) {
								if (dwError == WSAHOST_NOT_FOUND) {
									Log.Write("Host not found\n");
								} else if (dwError == WSANO_DATA) {
									Log.Write("No data record found\n");
								} else {
									Log.Write("Function failed with error: %ld\n", dwError);
								}
							}
						}
						else
						{
							Log.Write("Function returned:");
							Log.Write("\tOfficial name: %s", remoteHost->h_name);
							Log.Write("\tAlternate names: %s", remoteHost->h_aliases);
							Log.Write("\tAddress type: ");
							switch (remoteHost->h_addrtype) {
							case AF_INET:
								Log.Write("AF_INET");
								break;
							case AF_INET6:
								Log.Write("AF_INET");
								break;
							case AF_NETBIOS:
								Log.Write("AF_NETBIOS");
								break;
							default:
								Log.Write(" %d", remoteHost->h_addrtype);
								break;
							}
							Log.Write("\tAddress length: %d", remoteHost->h_length);
							addr.s_addr = *(u_long *) remoteHost->h_addr_list[0];
							Log.Write("\tFirst IP Address: %s", inet_ntoa(addr));

							oldProtection = SetProtection(IPAddress,30);
							//sprintf(IPAddress,"%s",inet_ntoa(addr));
							strcpy(IPAddress,inet_ntoa(addr));
							SetProtection(IPAddress,30,oldProtection);
						}
						}

				}
				Log.Write("Patched IP Successfully to %s",IPAddress);


				if (ini->GetInt("PatchEncryption",1))
				{
					Log.Write("Patching Encryption");
					GameEncryptAddress = sig->search("518B4424088A088A5001");
					if (GameEncryptAddress)
					{
						Log.Write("Encryption Patched");
						byte patch[] = {0xE9,0x9B,0x00,0x00,0x00,0x90};
						oldProtection = SetProtection((byte*)GameEncryptAddress+20,10);
						memcpy((byte*)(GameEncryptAddress+20),patch,sizeof(patch));
						SetProtection((byte*)GameEncryptAddress+20,10,oldProtection);
					}
					else
					{
						Log.Write("Failed to patch Encryption");
					}
				}
			}
			else
			{
				Log.Write("Unable to patch");
			}
		}
		else
		{
			Log.Write("Failed to find IP Address");
		}
	}

	ScreenAddress = (uint*)sig->search("C705XXXXXXXX0500000068B8");
	if (ScreenAddress)
	{
		Log.Write("Found Screen Address");
	}
	else
	{
		Log.Write("Failed to find Screen Address");
	}

	// Get Zone Address
	ZoneAddress = (uint*)sig->search("8B0DXXXXXXXX83C1CF83F95A");
	if (ZoneAddress)
	{
		Log.Write("Found Zone Address at %08X",ZoneAddress);
	}
	else
	{
		Log.Write("Failed to find Zone Address");
	}


	// Get packet recv location
	// To be able to know the sizes and function addresses for all recv packets

	//004077E2 - 8B 4B 04              - mov ecx,[ebx+04]
	//004077E5 - 03 C8                 - add ecx,eax
	//004077E7 - 8B C1                 - mov eax,ecx
	//004077E9 - 85 C0                 - test eax,eax
	//004077EB - 89 4B 04              - mov [ebx+04],ecx
	//004077EE - 0F8E 03010000         - jng 004078F7
	//004077F4 - 56                    - push esi
	//004077F5 - 57                    - push edi
	//004077F6 - 8B 73 08              - mov esi,[ebx+08]
	//004077F9 - 8A 06                 - mov al,[esi]
	//004077FB - 3C 18                 - cmp al,18
	//004077FD - 0F84 80000000         - je 00407883
	//00407803 - 3C 19                 - cmp al,19
	//00407805 - 74 7C                 - je 00407883
	//00407807 - 3C 1A                 - cmp al,1A
	//00407809 - 74 78                 - je 00407883
	//0040780B - 3C 1B                 - cmp al,1B
	//0040780D - 74 74                 - je 00407883
	//0040780F - 3C 2C                 - cmp al,2C
	//00407811 - 74 70                 - je 00407883
	//00407813 - 3C 50                 - cmp al,50
	//00407815 - 74 6C                 - je 00407883
	//00407817 - 3C 57                 - cmp al,57
	//00407819 - 74 68                 - je 00407883
	//0040781B - 3C 77                 - cmp al,77
	//0040781D - 74 64                 - je 00407883
	//0040781F - 0FB6 E8               - movzx ebp,al
	//00407822 - 8B 43 04              - mov eax,[ebx+04]
	//00407825 - C1 E5 02              - shl ebp,02
	//00407828 - 8B 8D 10335800        - mov ecx,[ebp+00583310]
	//0040782E - 3B C1                 - cmp eax,ecx
	//00407830 - 0F8C BF000000         - jl 004078F5
	//00407836 - 8B 3D 08335800        - mov edi,[00583308] : [07710048]
	//0040783C - 8B D1                 - mov edx,ecx
	//0040783E - C1 E9 02              - shr ecx,02
	//00407841 - F3 A5                 - repe movsd
	//00407843 - 8B CA                 - mov ecx,edx
	//00407845 - 83 E1 03              - and ecx,03
	//00407848 - F3 A4                 - repe movsb
	//0040784A - FF 95 002F5800        - call dword ptr [ebp+00582F00]
	//00407850 - 8B 43 04              - mov eax,[ebx+04]
	//00407853 - 8B 8D 10335800        - mov ecx,[ebp+00583310]
	//00407859 - 3B C1                 - cmp eax,ecx
	//0040785B - 0F8C 89000000         - jl 004078EA
	//00407861 - 8B 53 08              - mov edx,[ebx+08]
	//00407864 - 2B C1                 - sub eax,ecx
	//00407866 - 50                    - push eax
	//00407867 - 03 CA                 - add ecx,edx
	//00407869 - 51                    - push ecx
	//0040786A - 52                    - push edx
	//0040786B - E8 30101400           - call 005488A0
	//00407870 - 8B 85 10335800        - mov eax,[ebp+00583310]
	//00407876 - 8B 4B 04              - mov ecx,[ebx+04]
	//00407879 - 83 C4 0C              - add esp,0C
	//0040787C - 2B C8                 - sub ecx,eax
	//0040787E - 89 4B 04              - mov [ebx+04],ecx
	//00407881 - EB 67                 - jmp 004078EA
	//00407883 - 8B 53 04              - mov edx,[ebx+04]
	//00407886 - 83 FA 06              - cmp edx,06
	//00407889 - 7C 6A                 - jnge 004078F5
	//0040788B - 8A 4E 01              - mov cl,[esi+01]
	//0040788E - 84 C9                 - test cl,cl
	//00407890 - 75 0C                 - jne 0040789E
	//00407892 - 0FB6 C8               - movzx ecx,al
	//00407895 - 8B 2C 8D 10335800     - mov ebp,[ecx*4+00583310]        !Packet Size
	//0040789C - EB 06                 - jmp 004078A4
	//0040789E - 8B 4E 02              - mov ecx,[esi+02]
	//004078A1 - 8D 69 06              - lea ebp,[ecx+06]
	//004078A4 - 3B D5                 - cmp edx,ebp
	//004078A6 - 7C 4D                 - jnge 004078F5
	//004078A8 - 8B 3D 08335800        - mov edi,[00583308] : [07710048]      !Recv Buffer
	//004078AE - 8B CD                 - mov ecx,ebp
	//004078B0 - 8B D1                 - mov edx,ecx
	//004078B2 - C1 E9 02              - shr ecx,02
	//004078B5 - F3 A5                 - repe movsd
	//004078B7 - 8B CA                 - mov ecx,edx
	//004078B9 - 83 E1 03              - and ecx,03
	//004078BC - 0FB6 C0               - movzx eax,al
	//004078BF - F3 A4                 - repe movsb
	//004078C1 - FF 14 85 002F5800     - call dword ptr [eax*4+00582F00]    !Function Call
	//004078C8 - 8B 43 04              - mov eax,[ebx+04]
	//004078CB - 3B C5                 - cmp eax,ebp
	//004078CD - 7C 1B                 - jnge 004078EA
	//004078CF - 8B 4B 08              - mov ecx,[ebx+08]
	//004078D2 - 2B C5                 - sub eax,ebp
	//004078D4 - 50                    - push eax
	//004078D5 - 8D 14 29              - lea edx,[ecx+ebp]
	//004078D8 - 52                    - push edx
	//004078D9 - 51                    - push ecx
	//004078DA - E8 C10F1400           - call 005488A0
	//004078DF - 8B 43 04              - mov eax,[ebx+04]
	//004078E2 - 83 C4 0C              - add esp,0C
	//004078E5 - 2B C5                 - sub eax,ebp
	//004078E7 - 89 43 04              - mov [ebx+04],eax
	//004078EA - 8B 43 04              - mov eax,[ebx+04]
	//004078ED - 85 C0                 - test eax,eax
	//004078EF - 0F8F 01FFFFFF         - jg 004077F6
	//004078F5 - 5F                    - pop edi
	//004078F6 - 5E                    - pop esi
	//004078F7 - 5D                    - pop ebp
	//004078F8 - 5B                    - pop ebx
	//004078F9 - C2 0800               - ret 0008

	//if (ini->GetInt("UseTranslations",1))
	//{
	//	// Scan for pointers we need for the data structure arrays {Item, Monster, NPC, Quest etc...}

	//	// When found
	//	LoadTranslationCSVs();
	//}

	if (ini->GetInt("Halt",0)) {
		MessageBox(0,"Halt","TSX Client DLL",0);
	}

	unsigned long RecvPacketLoop = sig->search("8B2C8D????????EB068B4E028D69063BD57C4D8B3D????????8BCD8BD1C1E902F3A58BCA83E1030FB6C0F3A4FF1485????????");

	if (RecvPacketLoop)
	{
		Log.Write("Found RecvPacketLoop at %08X",RecvPacketLoop);

		GameRecvPacketSize = *(size_t**)(RecvPacketLoop+3);
		Log.Write("Found GameRecvPacketSize at %08X",GameRecvPacketSize);

		GameNetworkInfo = RecvPacketLoop+21;
		GameRecvBufferPointer = *(byte***)GameNetworkInfo;

		Log.Write("Found GameNetworkInfo at %08X",GameNetworkInfo);
		Log.Write("Found GameRecvBufferPointer at %08X",GameRecvBufferPointer);

		GameRecvPacketFunctor = *(PacketRecvFunctor**)(RecvPacketLoop+47);
		Log.Write("Found GameRecvPacketFunctor at %08X",GameRecvPacketFunctor);

		Log.Write("Waiting for network to be Initilized");
		while (*GameRecvBufferPointer==NULL)
		{
			Sleep(10);
		}
		Sleep(10);
		Log.Write("Network Initilized");

		if (ini->GetInt("PacketInfo",1))
		{
			for (int i=0;i<=0xFF;i++)
			{
				Log.Write("Packet %02X Functor %08X PacketSize %u",i,GameRecvPacketFunctor[i],GameRecvPacketSize[i]);
			}
		}

		if (ini->GetInt("HookPackets",0))
		{

			RecvBuffer = *GameRecvBufferPointer;
			Log.Write("Recv Buffer is at %08X",RecvBuffer);
			// Backup Packet Functors
			// Should just use memcpy
			for (int i=0;i<=0xFF;i++)
			{
				OrigionalPacketRecvFunctor[i]=GameRecvPacketFunctor[i];
			}

			// I would prefer this to be hex values for packets to log
			if (ini->GetInt("LogPackets",0)) {
				for (int i=0;i<0xFF;i++) {
					GameRecvPacketFunctor[i] = hookRecvLogPacket;
				}
			}

			if (ini->GetInt("DetourPackets",1))
			{
				// Hook Packets
				if (ini->GetInt("ChangeIP",1)==0)
				{
					Log.Write("NPC Packet function is at %08X and points too %08X",&GameRecvPacketFunctor[0x19],GameRecvPacketFunctor[0x19]);
					GameRecvPacketFunctor[0x19] = MyNPCPacket;

					Log.Write("Monster Packet function is at %08X and points too %08X",&GameRecvPacketFunctor[0x1A],GameRecvPacketFunctor[0x1A]);
					GameRecvPacketFunctor[0x1A] = MyMonsterPacket;

					Log.Write("Gameguard Keypacket function is at %08X and points too %08X",&GameRecvPacketFunctor[0x9A],GameRecvPacketFunctor[0x9A]);
					GameRecvPacketFunctor[0x9A] = MyGameguardKeyPacket;
				}

				Log.Write("Chat Packet function is at %08X and points too %08X",&GameRecvPacketFunctor[0x2A],GameRecvPacketFunctor[0x2A]);
				GameRecvPacketFunctor[0x2A] = MyChatPacket;
			}
		}
	}
	else
	{
		Log.Write("Failed to find RecvPacketLoop");
	}

	// Find Speed Hack
	// Just - from gametime a certian small amount eg 0.002 each step through run
	//00401768 - 48                    - dec eax
	//00401769 - D8 05 8CC45500        - fadd dword ptr [0055C48C] : [3B449BA6]
	//0040176F - C7 05 602D5800 022B073D - mov [00582D60],3D072B02
	//00401779 - D9 1C 24              - fstp dword ptr [esp]
	//0040177C - D9 05 542E5800        - fld dword ptr [00582E54] : <<< GameTime
	//00401782 - D8 05 8CC45500        - fadd dword ptr [0055C48C]
	//00401788 - D9 1D 542E5800        - fstp dword ptr [00582E54] : [4713316F]
	//0040178E - 74 11                 - je 004017A1
	//00401790 - 83 E8 02              - sub eax,02
	//00401793 - 75 16                 - jne 004017AB
	//00401795 - B9 4064AE00           - mov ecx,00AE6440 : [00000000]
	GameTimeAdjust=0.002f;
	GameTimeAddress = (float*)sig->search("D905XXXXXXXXD805????????D91D????????");
	SpeedHackEnabled=false;

	Log.Write("GameTime found at %08X",GameTimeAddress);

	// Get Uncompress Function
	HMODULE HandleGXDCompress = GetModuleHandle("GXDCompress");
	uncompress = (uncompress_functor)GetProcAddress(HandleGXDCompress,"uncompress");
	Log.Write("GXDCompress.uncompress is at %08X",uncompress);

	ZoneID=0;
	if (MOBSpawns) delete MOBSpawns;
	MOBSpawns = new SpawnInfoManager(ZoneID,"MOB");
	if (NPCSpawns) delete NPCSpawns;
	NPCSpawns = new SpawnInfoManager(ZoneID,"NPC");

	if (ini->GetInt("LoadTranslations",1)) {
		LoadTranslationCSVs();
	}
}

void TSX_Client::Uninit()
{
	if (ini->GetInt("HookFileLoading",1)) {
		DetourRemove(oCreateFileW);
	}
}

// Helper Functions
void TSX_Client::OutputToChatBox(const char* Message, unsigned int Color)
{

}

void TSX_Client::ShowNotice(const char* Message)
{

}


// Hooked functions
DWORD TSX_Client::RecvPacket(byte* Buffer,uint PacketSize)
{
	byte PacketID = Buffer[0];
	switch (PacketID)
	{
	case 0x00:
		// Init
		break;
	default:
		Log.Write("Packet Received with ID %02X",PacketID);
		break;
	}
	return 0;
}

uint hookRecvMonsterAction( MonsterObject* mob )
{
	return DLL.onMOBPacket(mob);
}

uint hookRecvNPCAction( MonsterObject* npc )
{
	return DLL.onNPCPacket(npc);
}

// Could hook for gm commands in dll? or local cmds.
//uint hookSendChatFunction( ChatPacket* chat )
//{
//	return DLL.onChatSendPacket();
//}


unsigned long* inca__generatekey(unsigned long* inkey)
{
  unsigned long* outkey = (unsigned long*)malloc(16);
  outkey[0] = 0x10056;
  //outkey[1] = random();
  //outkey[2] = random();
  //outkey[3] = random();
  //BlowfishDecrypt(inkey);
  switch(inkey[0]) // Index 0
  {
  case 0x01: // Example case
  // Small calculation then modify outkey
  break;
  }
  //BlowfishEncrypt(outkey);
  return outkey;
}

// Packet Hooks
uint MyGameguardKeyPacket( uint length )
{
	unsigned long* Keys = (unsigned long*)RecvBuffer+1;
	dump_file_txt((char*)RecvBuffer+1,16,"GameGuardPackets.log",true);

	// To emulate grab the numbers here
	// And never call origional function
    // use blowfish to decrypt the keys
	// put it through algrothrom to generate CS2AuthResponse
	// Send the game back the response using SendMessage or call the function that deals with sending it back to server.

	return OrigionalPacketRecvFunctor[RecvBuffer[0]](length);
}


uint MyChatPacket(uint length)
{
	char* Name = (char*)RecvBuffer+1;
	char* Message = Name+13;
	Log.Write("Chat Packet Received: %s says %s",Name,Message);
	return OrigionalPacketRecvFunctor[RecvBuffer[0]](length);
}

uint MyNPCPacket(uint length)
{
	// Call origional function // The packet id
	// id iscompressed uncompressedsize compressedsize
	// If Compressed
	if (*(char*)RecvBuffer+1)
	{
		// Do ZLib uncompress
		uint sizeDataUncompressed = sizeof(uncompressBuffer);
		uint sizeCompressedData = *(uint*)RecvBuffer+2;
		//char * dataUncompressed = new char[sizeDataUncompressed];
		int z_result = uncompress(uncompressBuffer,&sizeDataUncompressed,RecvBuffer+6,sizeCompressedData);
		switch (z_result)
		{
		case Z_OK:
			printf("Success");
			break;
		case Z_MEM_ERROR:
			printf("Memory Error");
			break;
		case Z_BUF_ERROR:
			printf("Buffer Error");
			break;
		case Z_STREAM_ERROR:
			printf("Stream Error");
			break;
		}
	}
	else // Not compressed
	{
		// Get size of packet and memcpy it into uncompressBuffer
	}

	MonsterObject* mon = (MonsterObject*)uncompressBuffer;
	if (mon->HP>0)
	{
		DLL.onNPCPacket(mon);
	}
	//DLL.MOBSpawns->AddSpawnInfo(mon->UniqueID,mon->MonsterID,mon->Location.x,mon->Location.y,mon->Location.z,mon->FacingDirection);

	// Could recompress the packet and copy it back into the recv buffer to vac hack or w/e
	return OrigionalPacketRecvFunctor[RecvBuffer[0]](length);
}

uint MyMonsterPacket(uint length)
{
	// Call origional function // The packet id
	// id iscompressed uncompressedsize compressedsize
	// If Compressed
	if (*(char*)RecvBuffer+1)
	{
		// Do ZLib uncompress
		uint sizeDataUncompressed = sizeof(uncompressBuffer);
		uint sizeCompressedData = *(uint*)RecvBuffer+2;
		//char * dataUncompressed = new char[sizeDataUncompressed];

		int z_result = uncompress(uncompressBuffer,&sizeDataUncompressed,RecvBuffer+6,sizeCompressedData);
		switch (z_result)
		{
		case Z_OK:
			printf("Success");
			break;
		case Z_MEM_ERROR:
			printf("Memory Error");
			break;
		case Z_BUF_ERROR:
			printf("Buffer Error");
			break;
		case Z_STREAM_ERROR:
			printf("Stream Error");
			break;
		}
	}
	else // Not compressed
	{
		// Get size of packet and memcpy it into uncompressBuffer
	}

	MonsterObject* mon = (MonsterObject*)uncompressBuffer;
	if (mon->HP>0)
	{
		DLL.onMOBPacket(mon);
	}
	//DLL.MOBSpawns->AddSpawnInfo(mon->UniqueID,mon->MonsterID,mon->Location.x,mon->Location.y,mon->Location.z,mon->FacingDirection);

	// Could recompress the packet and copy it back into the recv buffer to vac hack or w/e
	return OrigionalPacketRecvFunctor[RecvBuffer[0]](length);
}

uint hookRecvLogPacket( uint length ) {
	uint PacketSize = DLL.GameRecvPacketSize[RecvBuffer[0]];
	dump_file_txt(RecvBuffer,PacketSize,"Packets.log",true);
	return OrigionalPacketRecvFunctor[RecvBuffer[0]](length);
}
