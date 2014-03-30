// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

GamblerDiceGameReply = restruct.
	int8lu('PacketID'). // 81
	int32lu('Status').
	int32lu('Dice1').
	int32lu('Dice2').
	int32lu('Silver').
	int32lu('Silver2'). // Some sort of bonus to amount received? // Losses
	int32lu('ItemResult'); // Some sort of item bonus?

WorldPC.Set(0x62,{
	Restruct: restruct.
	int32lu('Silver').
	int32lu('HighLow').
	int32lu('Unknown1'). // Nangi Track #id
	int32lu('Unknown2'), // Nangi Track Bet
	function: function(socket, diceInfo) {
	// Dice Rolled
	// 10,000 Silver
	// Bet High
	// 62 10 27 00 00 01 00 00 00 D4 F7 D6 41 D8 22 7A C4
	// SilverBet
	// HighLow
	// Unknown1
	// Unknown2
	if (socket.character.Silver<diceInfo.Silver)
	{
		console.log('Gambling dice game hack attempt');
		return;
	}

	// Check if near enough to Gambler NPC is on the map and that your close enough to it
	// Check if you have the amount of silver required
	var Dice1 = Math.floor((Math.random() * 6) + 1);
	var Dice2 = Math.floor((Math.random() * 6) + 1);

	var Total = Dice1+Dice2;
	var BetHigh = diceInfo.HighLow;


	socket.sendInfoMessage('Dice1: '+Dice1+' Dice2: '+Dice2);
	socket.sendInfoMessage('Total: '+Total);
	
	var Status = 0;

	var Silver = diceInfo.Silver;

	if (BetHigh == 1)
	{
		socket.sendInfoMessage('Bet: High');
		if (Total > 7)
		{
			Status = 2;
			socket.sendInfoMessage('Winner!');
		}
		else if (Total == 7)
		{
			Status = 1;
			socket.sendInfoMessage('Draw!');
		}
	}
	else if (BetHigh == 2)
	{
		socket.sendInfoMessage('Bet: Low');
		if (Total < 7)
		{
			Status = 2;
			socket.sendInfoMessage('Winner!');
			//Silver = Math.round(Silver*1.2);
		}
		else if (Total == 7)
		{
			Status = 1;
			socket.sendInfoMessage('Draw!');
		}
	}
	else
	{
		socket.sendInfoMessage('Lol hax?');
		return;
	}

	if (Status==0) {
		socket.sendInfoMessage('Lost!');
	}

	// if (Status==1 && diceInfo.HighLow==2) {
		// http://www.youtube.com/watch?v=Gd6i_BUMliw
		// If we were playing where we guess for 7 and have 5:1 return
		// Silver*5;
	// }
	

	//var LostSilver = 0;
	//var WinSilver = 0;

	if (Status==0)
	{
		socket.character.Silver-=Silver;
		//LostSilver = Silver;
	}
	else if (Status==1) {

	}
	else
	{
		socket.character.Silver+=Silver;
		//WinSilver = Silver;
	}
	socket.sendInfoMessage('Silver is now '+socket.character.Silver);

	socket.write(new buffer(GamblerDiceGameReply.pack({
		PacketID: 0x81,
		Status: Status,
		Dice1: Dice1,
		Dice2: Dice2,
		Silver: Silver
		//LostSilver: LostSilver,
		//WinSilver: WinSilver
	})));
	}
});