// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder
vms.depends({ name: 'packets', depends: 'structs' }, function(){
if (typeof(packets)==='undefined') {
    packets = {};
}
// Keep track of Client Packets ID, Size, Name here
packets.getClientPacketInfo = function(ID)
{
    var pi = ClientPackets[ID];
    if (pi) return pi;
    return null;
};

packets.getServerPacketInfo = function(ID)
{
    var pi = ClientPackets[ID];
    if (pi) return pi;
    return null;
};

// var a = restruct.string('Name',10).string('Another Test',4);
// console.log('Restruct string test');
// console.log(a.generateDocumentation());

packets.generateDocumentation = function()
{
    // Client Packets
    var foundClientPackets = [];
    for (var i=0;i<ClientPackets.length;i++)
    {
        var ID = i;
        var pi = ClientPackets[i];
        if (pi)
        {
            var output = '';
            foundClientPackets.push({ID: ID, Name: pi.Name});
            output += 'Packet ID: '+ID+' Name: '+ pi.Name+'<br>';
            
            output += 'Size: '+pi.Restruct.size+'<br>';

            // Need to output restruct details
            output += '<pre>'+pi.Restruct.generateDocumentation()+'</pre>';
            // Should use Code Mirror?
            output += pi.func.toString();

            // Check if Packet Info html exists
            // If so read it in
            var info = '';
            output += info;

            console.log(output);
        }
    }


};

var PacketInfo = function(name, restruct, func)
{
    if (name === undefined) throw new Error("PacketInfo Name is required");
    if (restruct === undefined) throw new Error("PacketInfo restruct is required");

    this.Name = name;
    this.Restruct = restruct;

    if (func) this.func = func;
};

PacketInfo.prototype.func = function(client,pac)
{
    console.log('Packet: '+this.Name+' is not yet implemnted.');
};

// var id = 0x00;
// var pi = packets.getClientPacket(id);

// if (pi)
// {
//  if (data.size()-position>=pi.getSize())
//  {
//      pi.func(client,id,pac);
//  }
//  else
//  {
//     // Not enough data
//  }
// }
// else
// {
//  console.log('Invalid packet received');
// }

ClientPackets = [];
ClientPackets[0x00] = new PacketInfo('Init',
    restruct.
    int32lu('DX').
    string('Something',10)
    );

// console.log('Packet documentation Test');
// packets.generateDocumentation();

//ServerPackets = [];
//ServerPackets[0x00] = new PacketInfo('Init',10);

//Structs for all the packets!
packets.CharName_Length=12;
packets.UsernameLength=13;
packets.PasswordLength=64;
packets.AccountSecurityPinLength=4;
//packets.VersionRequired 60221 a much older version dakk's client is this
packets.VersionRequired=60322;
packets.AccountSecurityPinLength=4;
packets.UserIDLength=8 ;// a max length of 8 meens they are using unsigned long long or unsignedint64 a standard database entry for primary key :)
packets.AvatarNameLength=12;
packets.IPAddressLength=15;
packets.GuildName_Length=12;
packets.GuildTag_Length=12;
packets.MessageLength=50;
packets.GiftCodeLength=32;

//Enums
packets.LoginStatus = {
  Success: {value: 0, name: "LoginStatus_Success"}, 
  CannotAuthenticate: {value: 1, name: "LoginStatus_CannotAuthenticate"}, 
  AccountNotFound: {value: 2, name: "LoginStatus_AccountNotFound"},
  IncorrectPassword: {value: 3, name: "LoginStatus_IncorrectPassword"},
  Suspended: {value: 4, name: "LoginStatus_Suspended"}, 
  AlreadyLoggedIn: {value: 5, name: "LoginStatus_AlreadyLoggedIn"}, 
  NeedToPay: {value: 6, name: "LoginStatus_NeedToPay"},
  WrongVersion: {value: 7, name: "LoginStatus_WrongVersion"}, 
  Maintenance: {value: 8, name: "LoginStatus_Maintnance"}, 
  ServerFull: {value: 9, name: "LoginStatus_ServerFull"},
  UnknownError:  {value: 10, name: "LoginStatus_UnknownError"}

};

packets.PinStatus = {
    Success: {value: 0, name: "PinStatus_Success"},
    Fail: {value: 1, name: "PinStatus_Fail"},
    Kick: {value: 2, name: "PinStatus_Kick"}
};

packets.ItemActionType = {
  GroundToInventory: {value: 0, name: "ItemActionType_GroundToInventory"}, 
  InventoryToGround: {value: 1, name: "ItemActionType_InventoryToGround"}, 
  InventoryToPillBar: {value: 2, name: "ItemActionType_InventoryToPillBar"},
  ItemEquip: {value: 3, name: "ItemActionType_ItemEquip"},
  ItemUnequip: {value: 4, name: "ItemActionType_ItemUnequip"}, 
  PillBarToInventory: {value: 11, name: "ItemActionType_PillBarToInventory"}, 
  PillBarUse: {value: 12, name: "ItemActionType_PillBarUse"},
  PillBarMove: {value: 19, name: "ItemActionType_PillBarMove"}, 
  InventoryMove: {value: 20, name: "ItemActionType_InventoryMove"}, 
  MoveSkillToBar: {value: 27, name: "ItemActionType_MoveSkillToBar"}
};

//Hairer
// Maybe we do
//if (config.useCompressedPackets) method instead
var useCompressedPackets = config.useCompressedPackets = (typeof(config.useCompressedPackets) != "undefined") ? config.useCompressedPackets : false;
if (useCompressedPackets)
{
    console.log('Not coded.');
    packets.Compress_Hairer = restruct.
        int8lu('packetID').
        int8lu('isCompressed');
        int16lu('compressedSize');

    // packets.makeCompressedPacket = function(packetID,buffer) // We should make a zlib compress buffer function and compress the buffer before sending it to this function
    // {
    //  // Compress packet buffer here
    //  // Create buffer of this
    //  //packets.Compress_Hairer.pack({packetID: packetID, isCompressed: true, compressedSize: compressedbuffer.length})
    //  // Append compressed buffer to end of it
    //  //this.write(thebuffer)
    // }
}
else
{
    // Code uncompressed one nao
    packets.Compress_Hairer = restruct.
        int8lu('packetID').
        int8lu('isCompressed');
        //int32lu('size');

    // Example of calling
    // this.write(packets.makeCompressedPacket(thepacketid,thebuffer));
    packets.makeCompressedPacket = function(packetID,buffer) // if uncompressed packets then we should have any compress buffer function not bother to compress.
    {
        // Create buffer big enough to hold Compress_Hairer and buffer
        
        var CompressHairerSize = packets.Compress_Hairer.size;

        var tmpbuffer = new Buffer(CompressHairerSize+buffer.length);
        //console.log('Buffer Length is '+tmpbuffer.length);
        var cbuf = new Buffer(packets.Compress_Hairer.pack({
                            packetID: packetID,
                            isCompressed: false,
                        }));

        cbuf.copy(tmpbuffer);
        buffer.copy(tmpbuffer,CompressHairerSize);
        // 1016
        //console.log('Input Buffer Length: '+buffer.length);
        // Pack and write the compress Hairer to the tmpbuffer, with isCompressed false
        /*
        var compressbuffer = new Buffer(
        packets.Compress_Hairer.pack({
                            packetID: packetID,
                            isCompressed: false
                        })
        );

        compressbuffer.copy(tmpbuffer);

        console.log('One',tmpbuffer);

        buffer.copy(tmpbuffer, packets.Compress_Hairer.length);

        console.log('Two',tmpbuffer);

        */
        // Return the complete buffer
        return tmpbuffer;
    };  
}

// Login Server
packets.login = restruct.
        int8lu('packetID').
        string('Username', packets.UsernameLength+1).
        string('Password', packets.PasswordLength+1);

packets.CharacterInfoPacket = restruct.
    int8lu('packetID').
    int8lu('Slot').
    int8lu('Exists').
    struct('Character',structs.Character).
    int8lu('Unknown');

packets.clientCharacterCreate = restruct.
    int8lu('packetID').
    int8lu('Slot').
    int32lu('Clan').
    string('Name',packets.CharName_Length+1).
    int32lu('Gender').  
    int32lu('Hair').
    int32lu('Face').
    int8lu('Ignore',84).
    int32lu('WeaponID').
    int8lu('Ignore2',52);
    
packets.clientCharacterDelete = restruct.
    int8lu('packetID').
    int8lu('Slot').
    int32lu('Clan').
    string('Namepart',packets.CharName_Length-8);

packets.CharacterDeletePacketReply = restruct.
    int8lu('packetID').
    int8lu("Status");

//IPAddressLength=15;

packets.MapLoadReply = restruct.
    int8lu('packetID').
    int8lu("Status").
    string("IP",packets.IPAddressLength+1).
    int32lu("Port");


packets.MapLoadFailedPacket = restruct.
    int8lu('packetID').
    int32lu("MapID").
    int8lu("Slot").
    int32lu("Port");

packets.ZoneTransferPacket = restruct.
    int8lu('packetID').
    int32lu("MapID").
    int32lu("PortalID").
    string("UserID",packets.UsernameLength+1);

packets.ZoneChangePacket = restruct.
    int8lu('packetID'). // 08
    int32lu("ZoneID").   // 01 00 00 00 
    int32lu("PortalID"). // 00 00 00 00
    int32lu("Unknown1"). // 00 00 00 00
    int32lu("Unknown2"); // 03 70 53 45 


packets.MapLoad = restruct.
    int8lu('packetID').
    int32lu("MapID").
    int8lu("Slot").
    string("UserID",packets.UsernameLength+1);


packets.CharacterCreateReplyPacket = restruct.
    int8lu('packetID').
    int8lu("Status").
    struct("Character",structs.Character).
    int8lu("Unknown");

packets.GiftCodePacket = restruct.
    int8lu('packetID').
    int8lu('Slot').
    string('Username',packets.GiftCodeLength+1);

packets.GiftPacketReply = restruct.
    int8lu('packetID'). // 0C
    int32lu('code').
    struct('items',structs.GiftItem,10);
    
    // Array of
    // Amount
    // ItemID

    // Array of 10 ID, Amount ?
// 0C 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
// 00 00 00 00 00


packets.SecurityPinPacket = restruct.
    int8lu('packetID').
    string('PIN',packets.AccountSecurityPinLength+1).
    string('UserID',packets.UserIDLength);

packets.SecurityPinReply = restruct.
    int8lu('packetID').
    int8lu('PinStatus').
    string('PIN',packets.AccountSecurityPinLength+1);

//World Server

packets.WorldServerInfoPacket = restruct.
    int8lu('packetID').
    string('encdata',16);


packets.WorldUserSlotMapPacket = restruct.
    int8lu('packetID').
    string('Name',packets.CharName_Length+1).
    int8lu('Slot').
    int32lu('MapID');

packets.WorldAuthPacket = restruct.
    int8lu('packetID').
    string('Username',packets.UsernameLength+1).
    string('CharacterName',packets.CharName_Length+1).
    int32lu('Unknown1').
    int32lu('Unknown2').
    int32lu('Unknown3').
    int32lu('Unknown4').
    int32lu('Unknown5').
    int32lu('Unknown6').
    int32lu('Unknown7').
    int32lu('Unknown8').
    int32lu('Unknown9').
    int32lu('Unknown10').
    int32lu('Unknown11').
    int32lu('Unknown12').
    int32lu('Unknown13').
    int32lu('Unknown14').
    int32lu('Unknown15').
    int32lu('Unknown16').
    int32lu('Unknown17').
    int32lu('Unknown18').
    int32lu('Unknown19').
    int32lu('Unknown20').
    int32lu('Unknown21').
    string('Unknown22',3).
    int32lu('MapID').
    int8lu('UnknownByte',25);

packets.ActionPacket = restruct.
    int8lu('packetID').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    struct('LocationTo',structs.CVec3).
    float32l('Direction').
    int32lu('TargetObjectIndex').
    int32lu('TargetObjectUniqueNumber').
    float32l('UNK3',4).
    struct('LocationNew',structs.CVec3).
    float32l('FacingDirection').
    float32l('Health').
    int32lu('Unknown10');

packets.ActionReplyPacket = restruct.
    int32lu('CharacterID').
    int32lu('CharacterTypeIdentifier').
    string('Name',packets.CharName_Length+1).
    string('Demostrater',packets.CharName_Length+1).
    string('Child',packets.CharName_Length+1).
    int8lu('UnknownI1').
    int32lu('FactionCapeThing').
    int32lu('UnknownI2').
    int32lu('TraitorFlag').
    int32lu('UnknownI3').
    int32lu('UnknownI4').
    int32lu('GlowItems').
    int32lu('UnknownI5',2).
    int32lu('Clan').
    int32lu('Gender').
    int32lu('Hair').
    int32lu('Face').
    int32lu('Level').
    int32lu('Honor').
    struct('Necklace', structs.Equipt).
    struct('Cape', structs.Equipt).
    struct('Armor', structs.Equipt).
    struct('Glove', structs.Equipt).
    struct('Ring', structs.Equipt).
    struct('Boot', structs.Equipt).
    struct('CalbashBottle', structs.Equipt).
    struct('Weapon', structs.Equipt).
    struct('Pet', structs.Pet).
    int32lu('Unknown5').
    string('GuildName',packets.GuildName_Length+1).
    int8lu('Unknown6',10).
    int16lu('TagExist').
    string('ClanTag',packets.GuildTag_Length+1).
    string('Unknown7',14).
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    struct('LocationTo',structs.CVec3).
    float32l('Direction').
    int32lu('TargetObjectIndex').
    int32lu('TargetObjectUniqueNumber').
    float32l('UNKnowni6',4).
    struct('LocationNew',structs.CVec3).
    float32l('FacingDirection').
    int32lu('MaxHP').
    int32lu('CurrentHP').
    int32lu('MaxChi').
    int32lu('CurrentChi').
    int32lu('otherthings',171);


packets.WorldCharacterInfoPacket = restruct.
    int8lu('PacketID').
    int8lu('Status').
    struct('character',structs.Character).
    int8lu('Unknown');

packets.HealingReplyPacket = restruct.
    int8lu('PacketID').
    int32lu('Level').
    int32lu('Experience').
    int32lu('Honor').
    int32lu('CurrentHP').
    int32lu('CurrentChi').
    int32lu('PetActivity').
    int32lu('PetGrowth'); 

packets.MonsterSpawnInfo = restruct.
    int8lu('PacketID').
    int32lu('UniqueID').
    int32lu('MonsterID').
    struct('Location',structs.CVec3);


packets.MonsterObject = restruct.
    //int8lu('Status').
    int32lu('ID').
    int32lu('UniqueID').
    int32lu('MonsterID').
    int32lu('Life').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    int32lu('Unknown3',3).
    float32l('Direction').
    float32l('TargetDirection').
    int32ls('TargetObjectIndex').
    int32lu('Unknown3',4).
    struct('LocationTo',structs.CVec3).
    float32l('FacingDirection').
    int32lu('HP');

packets.NPCObject = restruct.
    //int8lu('Status').
    int32lu('UniqueID').
    int32lu('ID').
    int32lu('NPCID').
    int32lu('Life').
    int32lu('Stance').
    int32lu('Skill').
    float32l('Frame').
    struct('Location',structs.CVec3).
    int32lu('Unknown3',3).
    float32l('Direction').
    float32l('TargetDirection').
    int32ls('TargetObjectIndex').
    int32lu('Unknown3',4).
    struct('LocationTo',structs.CVec3).
    float32l('FacingDirection').
    int32lu('HP');

packets.ChatPacketReply = restruct.
    int8lu('PacketID').
    string('Name',packets.AvatarNameLength+1).
    string('Message',packets.MessageLength+1);

packets.ChatPacket = restruct.
    int8lu('PacketID').
    string('Name',packets.AvatarNameLength+1).
    string('Message',packets.MessageLength+1).
    int32lu('Unknown',2);

packets.FactionMessagePacket = restruct.
    int8lu('PacketID').
    int32lu('Unknown0').
    string('Message',packets.MessageLength+1).
    int32lu('Unknown123',3);



packets.ServerKeepAlive = restruct.
    int8lu('PacketID').
    int32lu('Value1').
    int32lu('Value2');


// We need to fill this out eventually :D
packets.FactionDataPacket = restruct.
    int8lu('PacketID').
    int8lu('Unknown0').
    int8lu('UnknownData',396);



packets.ItemActionReplyPacket = restruct.
    int8lu('PacketID').
    int32lu('ActionType').
    int32lu('ItemUniqueID').
    int32lu('ItemUniqueID2').
    int32lu('ItemID').
    int32lu('Unknown3').
    int32lu('Unknown4').
    int32lu('Unknown5').
    int32lu('Amount').
    int32lu('InventoryIndex'). // Seems to be InventoryIndexFrom
    int32lu('RowDrop').
    int32lu('ColumnPickup').
    int32lu('RowPickup'). // Seems to be InventoryIndexTo
    int32lu('ColumnMove').
    int32lu('RowMove').
    int32lu('Enchant'); // Set Failed to 1 to say the action failed or to 0 to say it succeed. 0 is default if not put in structure.

packets.ItemActionReplyPacket2 = restruct.
		int8lu('PacketID').
		int32lu('ActionType').
		int32lu('ItemUniqueID').
		int32lu('ItemUniqueID2').
		int32lu('ItemID').
		int32lu('Unknown3').
		int32lu('Unknown4').
		int32lu('Unknown5').
		int32lu('Amount').
		int32lu('InventoryIndex'). // Seems to be InventoryIndexFrom
		int32lu('RowDrop').
		int32lu('ColumnPickup').
		int32lu('RowPickup'). // Seems to be InventoryIndexTo
		int32lu('ColumnMove').
		int32lu('RowMove').
		int32lu('Failed'); // Set Failed to 1 to say the action failed or to 0 to say it succeed. 0 is default if not put in structure.

packets.ItemActionPacket = restruct.
    int8lu('PacketID').
    int32lu('ActionType').
    int32lu('ItemUniqueID').
    int32lu('ItemUniqueID2').
    int32lu('ItemID').
    int32lu('Unknown3').
    int32lu('Unknown4').
    int32lu('Unknown5').
    int32lu('Amount').
    int32lu('InventoryIndex').
    int32lu('RowDrop').
    int32lu('ColumnPickup').
    int32lu('RowPickup').
    int32lu('ColumnMove').
    int32lu('RowMove').
    int32lu('Enchant').
    int32lu('Unknown10').
    int32lu('Unknown11');

packets.ItemObject = restruct.
    int32lu('ItemUniqueID').
    int32lu('SomeID').
    int32lu('ItemID').
    int32lu('Life').
    int32lu('unknown1').
    int32lu('Enchant').
    int32lu('Amount').
    int32lu('unknown2').
    struct('Location',structs.CVec3).
    string('Owner_Name',packets.CharName_Length+1).
    int8lu('unknown3',3).
    int32lu('Rotation',2).
    int32lu('JustSpawned');

packets.AttackPacket = restruct.
    int8lu('PacketID').
    int8lu('Status').
    int32lu('Action').
    int32lu('CharID1').
    int32lu('CharID2').
    int32lu('TargetObjectUniqueNumber').
    int32lu('TargetObjectIndex').
    int32lu('skillID').
    int32lu('UNknownthings',10);

//2C
packets.AttackPacketReply = restruct.
    int32lu('Action'). // 0 if your attacking
    int32lu('AttackerID').
    int32lu('AttackerIndex').
    int32lu('DefenderID').
    int32lu('DefenderIndex').
    int32lu(''). // Skill ID?
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('Status'). // Depends on attacker or defender | hit or miss, block or not |
    int32lu('TotalDamage').
    int16lu('Deadly').
    int16lu('Light').
    int16lu('Shadow').
    int16lu('Dark').
    int32ls('DamageHP');

packets.ZoneTimePacket = restruct.
    int8lu('PacketID').
    int32lu('MessageID').
    int32lu('TypeID').
    int32lu('timeleft').
    int32ls('Unknown',23);

packets.AutoPillPacket = restruct.
    int8lu('PacketID').
    int32lu('Type').
    int32lu('A').
    int32lu('B').
    int32lu('C').
    int32lu('D');

// Used for a key value packet
packets.KeyValue = restruct.
    int8lu('PacketID').
    int32lu('Key').
    int32ls('Value');

packets.KeyValueUnsigned = restruct.
    int8lu('PacketID').
    int32lu('Key').
    int32lu('Value');

packets.StatPointSpend = restruct.
    int8lu('PacketID').
    int32lu('Key').
    int32lu('Value').
    int8lu('Unknown');

// 9E 01 00 00 00 for AP Shop currency
packets.Value = restruct.
    int8lu('PacketID').
    int32ls('Value');

packets.IDPacket = restruct.
    int8lu('PacketID');

// ID: 8E Give/ChangeValue
// Silver
// EXP
// CP
// TC

// Packet ID 0x62
// SilverBet
// HighLow
// Unknown1
// Unknown2
packets.GamblerDiceGame = restruct.
    int8lu('PacketID').
    int32lu('Silver').
    int32lu('HighLow').
    int32lu('Unknown1'). // Nangi Track #id
    int32lu('Unknown2'); // Nangi Track Bet

// Result of Gambling
// 0 Lose
// 1 Tie - Lose
// 2 Win

packets.GamblerDiceGameReply = restruct.
    int8lu('PacketID'). // 81
    int32lu('Status').
    int32lu('Dice1').
    int32lu('Dice2').
    int32lu('Silver').
    int32lu('Silver2'). // Some sort of bonus to amount received? // Losses
    int32lu('ItemResult'); // Some sort of item bonus?
    // 1 Ruby
    // 2 Obsidian
    // 3 Moonstone
    // 4 Amethyst
    // ...
    // Relates to these
    // 0927."[Nangi Track] lucky [ruby] have obtained."
    // 0928."[Nangi Track] lucky [Obsidian] have obtained."
    // 0929."[Nangi Track] lucky [Moonstone] have obtained."
    // 0930."[Nangi Track] lucky [Amethyst] have obtained."
    // 0931."[Nangi Track] lucky [Ch'ongju three] have obtained."
    // 0932."[Nangi Track] lucky [cat's-eye] have obtained."
    // 0933."[yukmyeonseungbu progress] lucky [ruby] have obtained."
    // 0934."[yukmyeonseungbu progress] lucky [Obsidian] have obtained."
    // 0935."[yukmyeonseungbu progress] lucky [Moonstone] have obtained."
    // 0936."[yukmyeonseungbu progress] lucky [Amethyst] have obtained."
    // 0937."[yukmyeonseungbu progress] lucky [Ch'ongju three] have obtained."
    // 0938."[yukmyeonseungbu progress] lucky [cat's-eye] have obtained."   

// When using faction buff at Lady in town center
// Unhandled Packet ID 127
// 00000000: 1500 0000 ff00 0000 7f01 0000 0001 0000  ....?...........
// 00000010: 006b e152 41                             .k?RA

// When trying to view items at Trader
// Unhandled Packet ID 89
// 00000000: 1100 0000 df01 0000 5902 0000 0001 0000  ....?...Y.......
// 00000010: 00                                       .

// When trying to withdraw item at Trader
// Unhandled Packet ID 89
// 00000000: 1100 0000 1002 0000 5902 0000 0001 0000  ........Y.......
// 00000010: 00                                       .

// Accept quest Moku Dead soilder from Guild Director Tao at level 50
// Unhandled Packet ID 69
// 00000000: 2500 0000 1e00 0000 4500 0000 0001 0000  %.......E.......
// 00000010: 0001 0000 0000 0000 0000 0000 000c c070  ..............?p
// 00000020: c409 0000 00                             ?....

// Make Guild LiamsGuild
// Unhandled Packet ID 116
// 00000000: 3e01 0000 8000 0000 7401 6132 7332 0000  >...?...t.a2s2..
// 00000010: 0000 0000 0000 004c 6961 6d73 4775 696c  .......LiamsGuil
// 00000020: 6400 0001 0000 0000 0000 40ef 1800 7950  d.........@?..yP
// 00000030: 446e 0000 0000 1cef 1800 0000 0000 9cef  Dn.....?......??
// 00000040: 1800 5501 3476 3d48 c99d feff ffff 20f0  ..U.4v=H?????.?
// 00000050: 1800 edd6 e3eb e8ef 1800 e600 7a77 70ef  ..??????..?.zwp?
// 00000060: 1800 0000 0000 20f0 1800 7000 7a77 6800  .......?..p.zwh.
// 00000070: 0000 f003 0000 0000 0000 6804 95c6 6000  ..?.......h.??`.
// 00000080: 0000 0000 0000 0067 f701 0000 0000 0d00  .......g?.......
// 00000090: 0000 e803 0000 70c6 4200 7224 7c77 00e7  ..?...p?B.r$|w.?
// 000000a0: 0800 ea03 0000 3b72 3276 011c 3376 9a17  ..?...;r2v..3v?.
// 000000b0: 1200 0d00 0000 e803 0000 44f0 1800 0000  ......?...D?....
// 000000c0: 0000 b102 0000 0100 0000 0000 0000 0067  ..?............g
// 000000d0: f701 44f0 1800 6a19 ea01 0000 0000 9a17  ?.D?..j.?.....?.
// 000000e0: 1200 a873 0000 30f0 1800 dffb 3276 0067  ..?s..0?..??2v.g
// 000000f0: f701 0000 0000 70c6 4200 e803 0000 44f0  ?.....p?B.?...D?
// 00000100: 1800 ebfb 3276 85c9 e3eb a873 5600 a001  ..??2v?????sV.?.
// 00000110: 0000 0000 0000 08f0 1800 34f0 1800 60f9  .......?..4?..`?
// 00000120: 1800 44f0 1800 a001 0000 0000 0000 cbd2  ..D?..?.......??
// 00000130: 4200 a001 0000 0000 0000 0000 0000       B.?...........

packets.GuildPacket = restruct.
    int8lu('PacketID'). // 116
    int8lu('Action').
    string('CharacterName',packets.CharName_Length+1).
    string('GuildName',packets.GuildName_Length+1).
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int32lu('').
    int16lu('');

// Request Guild Info
//Unhandled Packet ID 143
//00000000: 1e00 0000 b900 0000 8f31 3837 4b6f 6e56  ....?...?187KonV
//00000010: 6963 7465 4400 20a4 c376 54ce 433b       icteD..??vT?C;

packets.GuildInfoRequestPacket = restruct.
    int8lu('PacketID'). // 143
    string('CharacterName',packets.CharName_Length+1).
    int32lu('').
    int32lu('');

packets.SystemInfoNoticePacket = restruct.
    int8lu('PacketID'). // 84 0x54
    int32lu('Type'). // See 54 Packet in research dir
    string('CharacterName',packets.CharName_Length+1).
    string('GuildName',packets.GuildName_Length+1).
    int32lu('').
    int32lu('').
    int8lu('',74); // Unknown stuff

packets.SystemInfoNoticeTimesPacket = restruct.
    int8lu('PacketID'). // 84 0x54
    int32lu('Type'). // See 54 Packet in research dir
    int32lu('Minutes').
    string('CharacterName',packets.CharName_Length+1-4).
    string('GuildName',packets.GuildName_Length+1).
    int32lu('').
    int32lu('').
    int8lu('',74); // Unknown stuff

// Make Guild Tester
// Unhandled Packet ID 116
// 00000000: 3e01 0000 4901 0000 7401 4170 706c 6553  >...I...t.AppleS
// 00000010: 6175 6365 0000 0054 6573 7465 7200 ff00  auce...Tester.?.
// 00000020: 0000 0001 0000 3cef 1800 a010 b972 1101  ......<?..?.?r..
// 00000030: 0000 0000 0000 0000 0000 0000 0000 0425  ...............%
// 00000040: 4200 0500 0003 1101 0000 0018 0f00 20f0  B..............?
// 00000050: 1800 0998 7abb e8ef 1800 e600 5677 70ef  ...?z???..?.Vwp?
// 00000060: 1800 0000 0000 20f0 1800 7000 5677 6800  .......?..p.Vwh.
// 00000070: 0000 d807 0000 0000 0000 0060 eac7 6000  ..?........`??`.
// 00000080: 0000 0000 0000 60c8 cf01 0000 0000 0d00  ......`??.......
// 00000090: 0000 e803 0000 a010 b972 b556 5f77 00e7  ..?...?.?r?V_w.?
// 000000a0: 0800 d407 0000 3b72 cb74 011c cc74 4827  ..?...;r?t..?tH'
// 000000b0: 3f00 0d00 0000 e803 0000 44f0 1800 0000  ?.....?...D?....
// 000000c0: 0000 b102 0000 0100 0000 0000 0000 60c8  ..?...........`?
// 000000d0: cf01 44f0 1800 0425 4200 0000 0000 4827  ?.D?...%B.....H'
// 000000e0: 3f00 a883 0000 30f0 1800 dffb cb74 60c8  ?.??..0?..???t`?
// 000000f0: cf01 0000 0000 20c9 4200 e803 0000 44f0  ?......?B.?...D?
// 00000100: 1800 ebfb cb74 6187 7abb a883 5600 a101  ..???ta?z???V.?.
// 00000110: 0000 0000 0000 08f0 1800 34f0 1800 60f9  .......?..4?..`?
// 00000120: 1800 44f0 1800 a101 0000 0000 0000 7bd5  ..D?..?.......{?
// 00000130: 4200 a101 0000 0000 0000 0000 0000       B.?...........


// Lady Gayon Event
// Unhandled Packet ID 103
// 00000000: 1100 0000 1b26 0100 6702 0000 0001 0000  .....&..g.......
// 00000010: 00  

// Unhandled Packet ID 103
// 00000000: 1100 0000 8401 0000 6703 0000 0001 0000
// 00000010: 00                                     .


// Convert 100000 Loyalty points to 1 CP point
// Unhandled Packet ID 67
// 00000000: 2a00 0000 a504 0000 431a 0000 0000 54f4  *...?...C.....T?
// 00000010: 1800 a013 4105 0300 0000 0100 0000 74f4  ..?.A.........t?
// 00000020: 1800 0000 8087 0000 80b7                 ....??..??

// Convert 2000000 Loyalty points to item
// Unhandled Packet ID 67
// 00000000: 2a00 0000 1a05 0000 431b 0000 0000 54f4  *.......C.....T?
// 00000010: 1800 a013 4105 0300 0000 0100 0000 74f4  ..?.A.........t?
// 00000020: 1800 0000 80d4 0000 8004                 ....??..?.

// Open trade shop
// Unhandled Packet ID 52
// 00000000: 2102 0000 f500 0000 3453 686f 7000 0000  !...?...4Shop...
// 00000010: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000020: 0000 0000 0002 0000 0000 0000 005b 0000  .............[..
// 00000030: 0001 0000 0000 0000 0002 0000 0001 0000  ................
// 00000040: 0061 0000 0002 0000 0000 0000 0002 0000  .a..............
// 00000050: 0002 0000 0042 0000 0021 0000 0000 0000  .....B...!......
// 00000060: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000070: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000080: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000090: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000000f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000100: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000110: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000120: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000130: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000140: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000150: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000160: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000170: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000180: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000190: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001a0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 000001f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000200: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000210: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000220: 00                                       .
packets.TradeShopItem = restruct.
    int32lu('ItemID').
    int32lu('InventoryIndex').
    int32lu('Amount').
    int32lu('Price').
    int32lu("Enchant");

// Packet ID: 0x34
packets.TradeShop = restruct.
    int8lu('PacketID').
    string('Name',28).  
    // Repeats 5x5 so 25 times
    struct('Items',packets.TradeShopItem,25).
    int32lu('Unknown2'). // Money Made?
    int32lu('Unknown3'); // Time Open?

// When canceling trade request with another player
//Unhandled Packet ID 39
//00000000: 1e00 0000 5c00 0000 2752 4157 5200 0000  ....\...'RAWR...
//00000010: 0000 0000 0000 bf5a c3ac 54ce 434e       ......?Z.T?CN
// Name and two values

packets.CharacterRequest = restruct.
    int8lu('PacketID').
    string('Name',13).
    int32lu('Value1').
    int32lu('Value2');

packets.CharacterRequestToClient = restruct.
    int8lu('PacketID').
    string('Name',13).
    int32lu('Value');

packets.CharacterRequestReply = restruct.
    int8lu('PacketID').
    string('Name',13).
    int8lu('Result'). // 0 is accept
                      // 1 is reject
    int32lu('Value1').
    int32lu('Value2');

packets.CharacterRequestAnswer = restruct.
    int8lu('PacketID').
    string('Name',13).
    int8lu('Result'); // 0 is accept
                      // 1 is reject
// 41 52 41 57 52 00 00 00 00 00 00 00 00 00 00

// Packet ID: 0x85
// Autopill set HP to 20%
// 00000000: 1900 0000 9b00 0000 8514 0000 0000 0000  ....?...?.......
// 00000010: 00dd 8512 42ea 8b44 c4                   .?.B??D?

// Autopill Set HP to 40%
// 00000000: 1900 0000 e300 0000 8528 0000 0014 0000  ....?...?(......
// 00000010: 00a1 af53 421a 8c44 c4                   .??SB.?D?

// Autopill set Chi to 20%
// 00000000: 1900 0000 c000 0000 8514 0000 0014 0000  ....?...?.......
// 00000010: 0006 7c04 4202 8c44 c4                   ..|.B.?D?

packets.AutoPillSet = restruct.
int8lu('PacketID').
int32lu('HPValue').
int32lu('ChiValue').
int32lu('').
int32lu('');

// Can be used for Duel or party or guild etc
packets.RequestPlayer = restruct.
int8lu('PacketID').
string('Name',13).
int32lu('Value1').
int32lu('Value2');

// Packet ID 30 0x1E
// Request Party
// 1e41 3364 0000 0000
// 0000 0000 0000 9c88 c4cd 290e 420e
// Use RequestPlayer packet

//Unhandled Packet ID 14
//00000000: 1e00 0000 1600 0000 0e54 6573 7465 7200  .........Tester.
//00000010: 0000 0000 0000 801d c40a 0048 420a       ......?.?..HB.

// Packet ID 32
// Duel Request pill use Avaliable
// 2054 6573 7465 7231
// 3233 0000 0000 0287 c418 280e 4242 2d

packets.DuelRequestPillAvaliable = restruct.
int8lu('PacketID').
string('Name',13).
int8lu('').
int32lu('').
int32lu('');

// Packet ID 33
// Duel Request pill use Unavaliable
// 2154 6573 7465 7231
// 3233 0000 0000 5787 c42a 5f0e 4200
packets.DuelAccept = restruct.
int8lu('PacketID').
string('Name',13);


// PacketID 56 0x38
// Add to friends list
// Tester123
// 9300 0000 b200 0000 3854 6573 7465 7231
// 3233 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 00

// Remove from friends list
// 9300 0000 0701 0000 3800 6573 7465 7231
// 3233 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0000 0000 0000 0000 0000 0000 0000
// 0000 0011 0000 0008 0100 008b 0065 7374
// 6572 3132

// Use Red Buff
// Unhandled Packet ID 127
// 00000000: 1500 0000 dd02 0000 7f02 0000 0001 0000  ....?...........
// 00000010: 002e 0bb9 41                             ...?A

packets.FriendsListPacket = restruct.
int8lu('PacketID').
//struct('Friends',structs.Friend, 10).
string('Friends',13,10).
int32lu('').
int32lu('').
int32lu('Count').
int32lu('').
int8lu('',9);

// Refresh friends info PacketID 7
// 1e00 0000 b900 0000 0754 4553 5445 5200
// 0000 0000 0000 c014 c462 0044 4262 1e00
// 0000 ba00 0000 0741 5344 4600 0000 0000
// 0000 0000 c014 c462 0044 4262 1e00 0000
// bb00 0000 0761 7364 0000 0000 0000 0000
// 0000 c014 c462 0044 4262 1e00 0000 bc00
// 0000 0773 6664 7177 6561 6677 7165 0000
// c014 c462 0044 4262 1e00 0000 bd00 0000
// 0773 6561 6677 6573 6166 0000 0000 c014
// c462 0044 4262


// After unequiping a sword
// Unhandled Packet ID 23
// 00000000: 7d00 0000 0b00 0000 1700 0000 0000 0000  }...............
// 00000010: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000020: 0008 0000 0000 0000 0000 0000 0009 0000  ................
// 00000030: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000040: 0000 0000 000a 0000 0000 0000 0000 0000  ................
// 00000050: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000060: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000070: 0000 0000 0000 0000 0000 0000 001d 0000  ................
// 00000080: 000c 0000 0018 0000 0000 0000 0000 1400  ................
// 00000090: 0000 0000 0000 0000 0000                 ..........


//2E For level up animation
packets.LevelUpPacket = restruct.
    int8lu('PacketID').
    int32lu('ID1').
    int32lu('ID2').
    int8lu('Levels');

// Adding statpoint to Str
// 1200 0000 3d00 0000 1603 0000 0001 0000
// 00ae


// Drinking Calabash Bottle
// Unhandled Packet ID 123
// 00000000: 1100 0000 a900 0000 7b02 0000 0010 0000  ....?...{.......
// 00000010: 00                                       .


// Quest talk with Elder Rysual
// Unhandled Packet ID 69
// 00000000: 2500 0000 1204 0000 4500 0000 0024 0000  %.......E....$..
// 00000010: 0001 0000 0000 0000 0000 0000 003c c287  .............<.
// 00000020: 4504 0000 00                             E....


// Using /Return
// Unhandled Packet ID 24
// 00000000: 1d00 0000 0600 0000 1800 0000 0000 0000  ................
// 00000010: 0001 0000 0002 00dc c202 00ce 4361 0000  .......??..?Ca..
// 00000020: 0007 0000 0005 0400 0000 0000 0000 0000  ................
// 00000030: 0000 0000 60c3 0000 ce43 00c0 c444 8e8f  ....`?..?C.??D??
// 00000040: 9091 9293 9495 9697 9899 0300 3842 0000  ??????????..8B..
// 00000050: 0000 ffff ffff 0100 0000 0000 0000 0000  ..????..........
// 00000060: 0000 0000 0000 0000 0000 0000 0000 0000  ................
// 00000070: 0000 0300 3842 0000 0000 0000 0000       ....8B........

});