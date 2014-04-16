// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

WorldPC.ActionPacket = restruct.
int32lu('Stance').
int32lu('Skill').
float32l('Frame').
struct('Location', structs.CVec3).
struct('LocationTo', structs.CVec3).
float32l('Direction').
int32lu('TargetObjectIndex').
int32lu('TargetObjectUniqueNumber').
float32l('UNK3', 4).
struct('LocationNew', structs.CVec3).
float32l('FacingDirection').
float32l('Health').
int32lu('Unknown10');

WorldPC.ActionReplyPacket = restruct.
// int32lu('CharacterID').
// int32lu('CharacterTypeIdentifier').
// string('Name', packets.CharName_Length + 1).
// string('Demostrater', packets.CharName_Length + 1).
// string('Child', packets.CharName_Length + 1).
// int8lu('UnknownI1').
// int32lu('FactionCapeThing').
// int32lu('UnknownI2').
// int32lu('TraitorFlag').
// int32lu('UnknownI3').
// int32lu('UnknownI4').
// int32lu('GlowItems').
// int32lu('UnknownI5', 2).
// int32lu('Clan').
// int32lu('Gender').
// int32lu('Hair').
// int32lu('Face').
// int32lu('Level').
// int32lu('Honor').
// struct('Necklace', structs.Equipt).
// struct('Cape', structs.Equipt).
// struct('Armor', structs.Equipt).
// struct('Glove', structs.Equipt).
// struct('Ring', structs.Equipt).
// struct('Boot', structs.Equipt).
// struct('CalbashBottle', structs.Equipt).
// struct('Weapon', structs.Equipt).
// struct('Pet', structs.Pet).
// int32lu('Unknown5').
// string('GuildName', packets.GuildName_Length + 1).
// int8lu('Unknown6', 10).
// int16lu('TagExist').
// string('ClanTag', packets.GuildTag_Length + 1).
// string('Unknown7', 14).
// int32lu('Stance').
// int32lu('Skill').
// float32l('Frame').
// struct('Location', structs.CVec3).
// struct('LocationTo', structs.CVec3).
// float32l('Direction').
// int32lu('TargetObjectIndex').
// int32lu('TargetObjectUniqueNumber').
// float32l('UNKnowni6', 4).
// struct('LocationNew', structs.CVec3).
// float32l('FacingDirection').
// int32lu('MaxHP').
// int32lu('CurrentHP').
// int32lu('MaxChi').
// int32lu('CurrentChi').
// int32lu('otherthings', 171);
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

int32lu('_Unknown1').
int32lu('_Unknown2').
int32lu('_Unknown3').
int32lu('_Unknown4').
int32lu('_Unknown5').
int32lu('_Unknown6').
int32lu('_Unknown7').
int32lu('_Unknown8').
int32lu('_Unknown9').
int32lu('_Unknown10').
int32lu('_Unknown11').
int32lu('_Unknown12').
int32lu('_Unknown13').
int32lu('_Unknown14').
int32lu('_Unknown15').
int32lu('_Unknown16').
int32lu('_Unknown17').
int32lu('_Unknown18').
int32lu('_Unknown19').
int32lu('_Unknown20').
int32lu('_Unknown21').
int32lu('_Unknown22').

int32lu('MonsterDisguise'). // The ID of a monster to disguise as

int32lu('_Unknown23').
int32lu('_Unknown24').
int8lu('dueling').
int8lu('duel_challenger'). // 0 blue 1 gold
int8lu('_Unknown25').
int8lu('Store'). // 0 none 1 open 2 open but empty


int32lu('_oUnknown1').
int32lu('_oUnknown2').
int32lu('_oUnknown3').
int32lu('_oUnknown4').
int32lu('_oUnknown5').
int32lu('_oUnknown6').
int32lu('_oUnknown7').
int32lu('_oUnknown8').
int32lu('_oUnknown9').
int32lu('_oUnknown10').
int32lu('_oUnknown11').
int32lu('_oUnknown12').
int32lu('_oUnknown13').
int32lu('_oUnknown14').
int32lu('_oUnknown15').
int32lu('_oUnknown16').
int32lu('_oUnknown17').
int32lu('_oUnknown18').
int32lu('_oUnknown19').
int32lu('_oUnknown20').
int32lu('_oUnknown21').
int32lu('_oUnknown22').
int32lu('_oUnknown23').
int32lu('_oUnknown24').
int32lu('_oUnknown25').
int32lu('_oUnknown26').
int32lu('_oUnknown27').
int32lu('_oUnknown28').
int32lu('_oUnknown29').
int32lu('_oUnknown30').
int32lu('_oUnknown31').
int32lu('_oUnknown32').
int32lu('_oUnknown33').
int32lu('_oUnknown34').
int32lu('_oUnknown35').
int32lu('_oUnknown36').
int32lu('_oUnknown37').
int32lu('_oUnknown38').
int32lu('_oUnknown39').
int32lu('_oUnknown40').
int32lu('_oUnknown41').
int32lu('_oUnknown42').
int32lu('_oUnknown43').
int32lu('_oUnknown44').
int32lu('_oUnknown45').
int32lu('_oUnknown46').
int32lu('_oUnknown47').
int32lu('_oUnknown48').
int32lu('_oUnknown49').
int32lu('_oUnknown50').
int32lu('_oUnknown51').
int32lu('_oUnknown52').
int32lu('_oUnknown53').
int32lu('_oUnknown54').
int32lu('_oUnknown55').
int32lu('_oUnknown56').
int32lu('_oUnknown57').
int32lu('_oUnknown58').
int32lu('_oUnknown59').
int32lu('_oUnknown60').
int32lu('_oUnknown61').
int32lu('_oUnknown62').
int32lu('_oUnknown63').
int32lu('_oUnknown64').
int32lu('_oUnknown65').
int32lu('_oUnknown66').
int32lu('_oUnknown67').
int32lu('_oUnknown68').
int32lu('_oUnknown69').
int32lu('_oUnknown70').
int32lu('_oUnknown71').
int32lu('_oUnknown72').
int32lu('_oUnknown73').
int32lu('_oUnknown74').
int32lu('_oUnknown75').
int32lu('_oUnknown76').
int32lu('_oUnknown77').
int32lu('_oUnknown78').
int32lu('_oUnknown79').
int32lu('_oUnknown80').
int32lu('_oUnknown81').
int32lu('_oUnknown82').
int32lu('_oUnknown83').
int32lu('_oUnknown84').
int32lu('_oUnknown85').
int32lu('_oUnknown86').
int32lu('_oUnknown87').
int32lu('_oUnknown88').
int32lu('_oUnknown89').
int32lu('_oUnknown90').
int32lu('_oUnknown91').
int32lu('_oUnknown92').
int32lu('_oUnknown93').
int32lu('_oUnknown94').
int32lu('_oUnknown95').
int32lu('_oUnknown96').
int32lu('_oUnknown97').
int32lu('_oUnknown98').
int32lu('_oUnknown99').
int32lu('_oUnknown100').
int32lu('_oUnknown101').
int32lu('_oUnknown102').
int32lu('_oUnknown103').
int32lu('_oUnknown104').
int32lu('_oUnknown105').
int32lu('_oUnknown106').
int32lu('_oUnknown107').
int32lu('_oUnknown108').
int32lu('_oUnknown109').
int32lu('_oUnknown110').
int32lu('_oUnknown111').
int32lu('_oUnknown112').
int32lu('_oUnknown113').
int32lu('_oUnknown114').
int32lu('_oUnknown115').
int32lu('_oUnknown116').
int32lu('_oUnknown117').
int32lu('_oUnknown118').
int32lu('_oUnknown119').
int32lu('_oUnknown120').
int32lu('_oUnknown121').
int32lu('_oUnknown122').
int32lu('_oUnknown123').
int32lu('_oUnknown124').
int32lu('_oUnknown125').
int32lu('_oUnknown126').
int32lu('_oUnknown127').
int32lu('_oUnknown128').
int32lu('_oUnknown129').
int32lu('_oUnknown130').
int32lu('_oUnknown131').
int32lu('_oUnknown132').
int32lu('_oUnknown133').
int32lu('_oUnknown134').
int32lu('_oUnknown135').
int32lu('_oUnknown136').
int32lu('_oUnknown137').
int32lu('_oUnknown138').
int32lu('_oUnknown139').
int32lu('_oUnknown140').
int32lu('_oUnknown141').
int32lu('_oUnknown142').
int32lu('_oUnknown143').
int32lu('_oUnknown144').
int32lu('_oUnknown145');

WorldPC.AttackPacket = restruct.
int8lu('PacketID').
int8lu('Status').
int32lu('Action').
int32lu('CharID1').
int32lu('CharID2').
int32lu('TargetObjectUniqueNumber').
int32lu('TargetObjectIndex').
int32lu('skillID').
int32lu('UNknownthings', 10);

//2C
WorldPC.AttackPacketReply = restruct.
int32lu('Action'). // 0 your attacking



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

// WorldPC.SpecialMovement = restruct.
// int32lu('Action'). // 0 your attacking
// int32lu(''). // Skill ID?
// int32lu('').
// int32lu('').
// int32lu('X').
// int32lu('Z');

// function handleAdvanceMovementPacket(socket, Info){
//      socket.character.state.LocationTo.X = location.X;
//      socket.character.state.LocationTo.Z = location.Z;
        
// }

function handleActionPacket(socket, action, update) {

    //if (socket.debug) {
        //console.log('Action: '+ action.Skill);
        //console.log('Location: ' + JSON.stringify(action.Location));
        //console.log('LocationTo: ' + JSON.stringify(action.LocationTo));
        //console.log('LocationNew: ' + JSON.stringify(action.LocationNew));
    //}

    if (socket.character.state.CurrentHP > 0) {

        socket.character.state.Stance = action.Stance;
        socket.character.state.Skill = action.Skill;
        //console.log(update,socket.character.state.Stance,socket.character.state.Skill);
        switch (action.Skill) {
        case 0:
            //console.log("Spawn");
            break;
        case 1:
            //console.log("Standing");
            break;
        case 2:
            //console.log("Walking");
            break;
        case 5:
            //console.log('Attack 5');
            break;
        case 6:
            //console.log('Attack 6');
            break;
        case 7:
            //console.log('Attack 7');
            break;
        case 33: 
            //console.log('Fly');
            break;
        case 32:
            //console.log('Run');
            break;  
        case 37: 
            //console.log('Come Down');
            break;

        default: 
            socket.sendInfoMessage("Skill:("+action.Skill+") is not registered");
            break;
        }

        var AttackPacket;

        // Is Attacking something?
        if (action.Skill >= 5 && action.Skill <= 7) {
            //socket.character.state.CanAttack = 1;
            //socket.sendInfoMessage('Tried to attack! '+new Date());
            // if (socket.character.state.CanAttack != 1) {
                
            //  return;
            // }
            // What is selected
            if (action.TargetObjectUniqueNumber != 4294967295) // If it is not -1
            {

                // Set when can attack again
                // setTimeout(function() { 
                //  socket.character.state.CanAttack = 1;
                // },500); // Work out time on the kind of action.
                // Some actions attack 3 time or 2 times more.

                //socket.sendInfoMessage("Selected: "+ action.TargetObjectIndex+' '+ action.TargetObjectUniqueNumber);
                eyes.inspect(action);
                //socket.character.state.CanAttack = 0;
                //console.log(socket.character.state.CanAttack);

                //console.log('We currently have no way to tell what is attacking what.');
                //console.log('We need to see if we can use one of the ID\'s as an identifyer of object type or maybe assign certian ranges to different object types');
                //console.log('Should make an object with function to handle attacking other objects.');
                //console.log('Prototyping and inherientence come into play :)');
                switch (action.TargetObjectIndex) {
                case 0:
                    // Attacking character
                    {
                        socket.sendInfoMessage('Attacking character '+action.TargetObjectUniqueNumber);

                        var other = socket.Zone.findSocketByCharacterID(action.TargetObjectUniqueNumber);
                        if (other===null) break; // If not found then skip this case.

                        other.sendInfoMessage('You are being attacked by '+socket.character.Name);
                        console.log(other.character.statInfo);
                        
                        AttackPacket = Generic.Battle.calculate(socket.character,other.character);
                        socket.sendInfoMessage('Dmg: '+AttackPacket.DamageHP);
                            eyes.inspect(AttackPacket);
                            
                            other.character.state.CurrentHP -= AttackPacket.DamageHP;
                            socket.giveEXP(AttackPacket.DamageHP);
                            console.log("Client attacking monster " + other.character.state.HP + "::" + AttackPacket.TotalDamage);
                            //socket.giveEXP(AttackPacket.TotalDamage); // Give HP relative to the damage we have done
                            
                            socket.Zone.sendToAllAreaLocation( socket.character.state.Location,packets.makeCompressedPacket(0x2C,new Buffer(WorldPC.AttackPacketReply.pack(AttackPacket))),config.viewable_action_distance );
                            // socket.write(packets.makeCompressedPacket(0x2C, new Buffer(WorldPC.AttackPacketReply.pack(AttackPacket))));
                            // other.write(packets.makeCompressedPacket(0x2C, new Buffer(WorldPC.AttackPacketReply.pack(AttackPacket))));
                            
                    }
                    break;
                case 2:
                    // Attacking monster
                    {
                        console.log('Attacking monster');
                        var monster_node = socket.Zone.Objects.GetNodeByID(action.TargetObjectIndex);
                        var monster = monster_node.object;


                        //var monster = socket.Zone.getMonster(action.TargetObjectIndex);
                        //console.log(monster);
                        //console.log(monster_node);
                        if (monster) {

                            var monsterinfo = MonsterInfo.getByID(monster.MonsterID);
                            //console.log(monsterinfo.Name);
                            //console.log('Logging out locations:',monster.LocationTo.toString(),socket.character.state.Location.toString());
                            //monster.Skill=12;
                            //console.log(monster.getAttackers());
                            //monster.Skill=Math.ceil(Math.random()*15);
                            // monster.FacingDirection = socket.character.state.Location.get2DDirection(monster.Location);
                            // monster.LocationTo.set(socket.character.state.Location);
                            // monster.HP = 0; //Math.floor(Math.random() * 1000);
                            //console.log('Angle between monster and character is '+monster.Location.get2DDirection(socket.character.state.Location));
                            // Check if able to attack
                            // Do battle caculation 
                            //Monster.damage(socket,Damage);
                            // socket.giveEXP(Damage)
                            //socket.Zone.sendToAllAreaLocation(monster.Location,monster.getPacket(),config.viewable_action_distance);
                            ///
                            AttackPacket = {
                                Action: 0,
                                // 0 if your attacking otherwise 5,6,7 or 1 if skill
                                AttackerID: socket.character.state.CharacterID,
                                AttackerIndex: socket.character.state.Index,
                                DefenderID: monster.MonsterID,
                                DefenderIndex: monster.UniqueID,
                                Status: 1,
                                // Depends on attacker or defender | hit or miss, block or not |
                                TotalDamage: 10,
                                Deadly: 1,
                                Light: 0,
                                Shadow: 0,
                                Dark: 0,
                                DamageHP: 1 // Deadly bypasses defense
                            };

                            monster.Attackers.regulate(socket.character._id, AttackPacket.TotalDamage);
                            monster.HP -= AttackPacket.TotalDamage;
                            console.log("Client attacking monster " + monster.HP + "::" + AttackPacket.TotalDamage);
                            socket.giveEXP(AttackPacket.TotalDamage); // Give HP relative to the damage we have done
                            socket.write(packets.makeCompressedPacket(0x2C, new Buffer(WorldPC.AttackPacketReply.pack(AttackPacket))));
                            
                            // var DefenderPacket = AttackPacket;
                            //  DefenderPacket.Action = action.Skill;
                            //  DefenderPacket.AttackerID = monster.MonsterID;
                            //  DefenderPacket.AttackerIndex = monster.UniqueID;
                            //  DefenderPacket.DefenderID = socket.character.state.CharacterID;
                            //  DefenderPacket.DefenderIndex = socket.character.state.Index;
                            // socket.Zone.sendToAllAreaLocation( socket.character.state.Location,packets.makeCompressedPacket(0x2C,new Buffer(WorldPC.AttackPacketReply.pack(DefenderPacket))),config.viewable_action_distance );
                        }
                    }
                    break;
                case 3:
                    // Attacking npc
                    {
                        console.log('Attacking npc');
                        return;
                    }
                    break;
                default:
                    // Unknown
                    console.log('Attacking unknown type: ' + action.TargetObjectUniqueNumber);
                
                    break;
                }
            }
        }
//      if(action.Skill == 32){
//      socket.character.state.Frame = action.Frame+.5;
//      if ( socket.character.state.Frame == 100 )
//          socket.character.state.Frame = 0;
// }    
// else
// {
//  socket.character.state.Frame = action.Frame;

// }
        socket.character.state.Frame = action.Frame;
        socket.character.state.Stance = action.Stance;
        //console.log('frame: '+action.Frame);

        socket.character.state.Location.X = action.Location.X;
        socket.character.state.Location.Y = action.Location.Y;
        socket.character.state.Location.Z = action.Location.Z;
        //console.log(socket.character.state.Location.toString());
        //var y = socket.Zone.GetY(socket.character.state.Location.X, socket.character.state.Location.Z);
        //console.log(socket.character.state.Location.Y+' '+y);
        
        socket.character.state.LocationTo.X = action.LocationTo.X;
        socket.character.state.LocationTo.Y = action.LocationTo.Y;
        socket.character.state.LocationTo.Z = action.LocationTo.Z;

        socket.character.state.Direction = action.Direction; //action.Direction;
        socket.character.state.FacingDirection = action.FacingDirection;

        socket.character.state.TargetObjectIndex = action.TargetObjectIndex;
        socket.character.state.TargetObjectUniqueNumber = action.TargetObjectUniqueNumber;

        socket.character.state.LocationNew.X = action.LocationNew.X;
        socket.character.state.LocationNew.Y = action.LocationNew.Y;
        socket.character.state.LocationNew.Z = action.LocationNew.Z;

    } else {
        socket.character.state.Frame = action.Frame;
        socket.character.state.Stance = action.Stance;
        if (action.Skill === 12) {
            socket.character.state.Skill = action.Skill;
        }
    }

    //if (socket.character.state.Skill == 0) socket.character.state.Skill = 1;


    if (socket.character.state.hidden) {
        socket.write(packets.makeCompressedPacket(
        0x18, new Buffer(
        WorldPC.ActionReplyPacket.pack(
        socket.character.state))));
        return;
    }

    //if (socket.character.state.Skill!=1) {
        socket.Zone.sendToAllArea(socket, true, packets.makeCompressedPacket(
        0x18, new Buffer(
        WorldPC.ActionReplyPacket.pack(
        socket.character.state))), config.viewable_action_distance);
    //}
}

WorldPC.Set(0x03, {
    Restruct: WorldPC.ActionPacket,

    function: function HandleStartAction(socket, action) {
        handleActionPacket(socket, action, 0);
    }
});

WorldPC.Set(0x04, {
    Restruct: WorldPC.ActionPacket,

    function: function HandleDuringAction(socket, action) {
        handleActionPacket(socket, action, 1);
    }
});

WorldPC.Set(0x05, {
    Restruct: WorldPC.ActionPacket,

    function: function HandleEndAction(socket, action) {
        handleActionPacket(socket, action, 2);
    }
});