// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// This file dumps contents to files or text with hex and ascii.
// Rather good as a packet logger.

#include "stdafx.h"

using namespace std;

std::ostream& output_datetime(std::ostream& os)
{
	time_t rawtime;
	struct tm * timeinfo;

	time ( &rawtime );
	timeinfo = localtime ( &rawtime );

	os << asctime(timeinfo);
	return os;
}

char get_ascii_view(char c)
{
	char o = '.';

	//if (c>=' ' && c<= 0x'~')
	if (c>=0x20 && c<= 0x7E)
	{
		o=c;
	}
	return o;
}

std::ostream& dump(std::ostream& os,const void* Data,uint Length,std::streamsize line_len)
{
	uint i=0;
	uint pos=0;
	uint spos=0;
	char* data = (char*)Data;

	const std::streamsize lines(Length / line_len);
	const std::streamsize chars(Length % line_len);

	std::ios::fmtflags f(os.flags());

	// printout guides
	os << "Length: " << std::dec << Length << "\nDateTime: ";
	output_datetime(os);
	os << "\n";
	// Output column numbers
	//for(i = 0; i < line_len; ++i)
	//{
	//	os << std::setw(2) << std::hex << i << " ";
	//}
	//os << '\n';

	os << std::hex;
	os << std::uppercase;

	// Printout lines
	for(std::streamsize line = 0; line < lines; ++line)
	{
		spos=pos;
		// Output hex
		for(i = 0; i < line_len; ++i)
		{
			os << HEX(data[pos++]) << " ";
		}

		// Output ascii symbol for this line
		os << "\t";
		pos=spos;
		for(i = 0; i < line_len; ++i)
		{
			os << get_ascii_view(data[pos++]);
		}

		// Output new line
		os << '\n';
	}

	// printout remaining data
	spos=pos;
	for(i = 0; i < chars; ++i)
	{
		os << HEX(data[pos++]) << " ";
	}

	// output remaining padding
	while (i<line_len)
	{
		os << "   ";
		i++;
	}

	os << "\t";
	// output remaining ascii/symbols	
	pos=spos;
	for(i = 0; i < chars; ++i)
	{
		os << get_ascii_view(data[pos++]);
	}

	while (i<line_len)
	{
		os << " ";
		i++;
	}
	// If the position has not been set to 0 put out a new line
	if (i) os << '\n';

	// Reset the flags on the output stream
	os.flags(f);
	return os;
}

bool dump_file(void* Data, uint Length,const char* FileName)
{
	std::ofstream myfile(FileName, std::ios::out | std::ios::binary);
	if (myfile.is_open())
	{
		myfile.write((const char*)Data,Length);
		if (myfile.bad())
		{
			myfile.close();		
			return false;
		}
		myfile.close();		
		return true;
	}
	return false;
}

bool dump_file_txt(void* Data, uint Length,const char* FileName,bool Append)
{
	std::ofstream myfile;
	if (Append)
	{
		myfile.open(FileName, std::ios::out | std::ios::binary | std::ios::app);
	}
	else
	{
		myfile.open(FileName, std::ios::out | std::ios::binary);
	}
	
	if (myfile.is_open())
	{		
		dump(myfile,Data,Length);
		if (myfile.bad())
		{
			myfile.close();		
			return false;
		}
		myfile.close();		
		return true;
	}
	return false;
}