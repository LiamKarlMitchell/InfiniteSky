// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#ifndef __dump_h
#define __dump_h

#include "stdafx.h"

// Can be used to output hex/memory to file or stream
#define HEX( x ) std::setw(2) << std::setfill('0') << std::hex << (uint)( (byte)x )

std::ostream& output_datetime(std::ostream& os);
char get_ascii_view(char c);
std::ostream& dump(std::ostream& os,const void* Data,uint Length,std::streamsize line_len=16);
bool dump_file(void* Data, uint Length,const char* FileName);
bool dump_file_txt(void* Data, uint Length,const char* FileName,bool Append=false);

#endif