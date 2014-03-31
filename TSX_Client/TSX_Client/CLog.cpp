// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Something I made ages ago feel free to use in your own projects.

#include "stdafx.h"

CLog Log;
HANDLE LogMutex;

CLog::CLog(char* FileName)
{		
	LogFile=FileName;
}

void CLog::Write(const char *fmt, ...)
{	
	Mutex m(&LogMutex);
	// Could we dynamically set buffer here there has to be a way to find what the total length can be?
	char buf[1024] = {'\0'};
	va_list va_alist;

	va_start(va_alist, fmt);
	vsprintf_s(buf, fmt, va_alist);
	va_end(va_alist);

	//history.push_back(buf);

	ofstream myfile;
	myfile.open (LogFile,ios::app);	// Open LogFile append to end
	myfile << buf << endl;			// Write out the message
	myfile.close();					// Close LogFile
}

void CLog::Write_String(const char *msg)
{
	Mutex m(&LogMutex);
	// Could we dynamically set buffer here there has to be a way to find what the total length can be?

	//history.push_back(buf);

	ofstream myfile;
	myfile.open (LogFile,ios::app);	// Open LogFile append to end
	myfile << msg << endl;			// Write out the message
	myfile.close();					// Close LogFile
}

void CLog::Remove()
{
	Mutex m(&LogMutex);
	remove(LogFile);
}

void CLog::SetFile(char* FileName)
{
	Mutex m(&LogMutex);
	LogFile=FileName;
}