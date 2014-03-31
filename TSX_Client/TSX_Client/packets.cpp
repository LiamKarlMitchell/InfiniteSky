// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

#include "stdafx.h"

Packet::Packet()
{
	ID=0;
}
PacketID Packet::GetID()
{
	return ID;
}
void Packet::SetID(PacketID _PacketID)
{
	ID=_PacketID;
}