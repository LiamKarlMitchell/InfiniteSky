// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#ifndef __CLOG_H
#define __CLOG_H

#include "stdafx.h"

using namespace std;

class CLog
{
public:		
	char * LogFile;
	//std::list <std::string> history;
	CLog(char* FileName = "log.txt");
	void Write(const char *fmt, ...);
	void Write_String(const char *msg);
	void Remove();
	void SetFile(char* FileName);
};
extern CLog Log;
#endif // __CLOG_H