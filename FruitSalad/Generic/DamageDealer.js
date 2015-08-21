function DamageDealer(client){
  this.client = client;
}

DamageDealer.prototype.attack = function(t){
  var tState = null;
  switch(t.type){
    case 'client':
    tState = t.object.character.state;
    break;

    case 'monster':
    tState = t.object;
    break;

    default:
    return console.log("Attacking unknown target type ("+t.type+")");
    break;
  }

  if(!tState.isAlive) return;
  console.log(tState.info);

  var levelDifference = this.client.character.Level - tState.info.Level;
  if(levelDifference <= -10){
    console.log("Miss more rate to the client. -10");
  }else if(levelDifference <= -6){
    console.log("Miss more rate to the client. -6");
  }

  var minDamage = this.roundDown(this.client.character.infos.Damage - (this.client.character.infos.Damage / 100 * 10));
  var maxDamage = this.roundUp(this.client.character.infos.Damage + (this.client.character.infos.Damage / 100 * 20));

  minDamage -= Math.floor(tState.info.Defense/2);
  maxDamage -= Math.floor(tState.info.Defense/2);

  var rawDamage = random.integer(minDamage, maxDamage);

  console.log("Damage (min, max):", minDamage, maxDamage);
  console.log("Raw damage:", rawDamage);

  // if(!state.isAlive) return;
  //
  // console.log(this.client.character.infos.HitRate, state.infos.DodgeRate);
  //
  // var target = {
  //   damage: {
  //     min: this.client.character.infos.Damage - state.infos.Defense,
  //     max: this.client.character.infos.Damage - state.infos.Defense
  //   },
  //   elemental_damage: {},
  //   chance_dodge: this.client.character.infos.HitRate / state.infos.DodgeRate
  // };
  //
  // target.elemental_damage[this.client.character.Clan] = this.client.character.infos.ElementalDamage - state.infos.ElementalDefense[this.client.character.Clan];
  //
  // var damageRange = target.damage.min / 100 * 5;
  // target.damage.min -= damageRange;
  // target.damage.max += damageRange;
  // target.damage.min = this.roundDown(target.damage.min);
  // target.damage.max = this.roundUp(target.damage.max);
  //
  // var damage = random.integer(target.damage.min, target.damage.max);
  //
  // console.log("Damage done:", damage, target.damage);
  // console.log("Dodge %:", target.chance_dodge)
  // console.log("Elemental damage:", target.elemental_damage);
  // // int32lu('Action'). // 0 your attacking
  // // int32lu('AttackerID').
  // // int32lu('AttackerIndex').
  // // int32lu('DefenderID').
  // // int32lu('DefenderIndex').
  // // int32lu('A'). // Skill ID?
  // // int32lu('B').
  // // int32lu('C').
  // // int32lu('D').
  // // int32lu('Status'). // Depends on attacker or defender | hit or miss, block or not |
  // // int32lu('TotalDamage').
  // // int16lu('Deadly').
  // // int16lu('Light').
  // // int16lu('Shadow').
  // // int16lu('Dark').
  // // int32ls('DamageHP');
  //
  // var totalDamage = target.elemental_damage + target.damage;
  // this.client.write(packets.makeCompressedPacket(0x2C, new Buffer(Zone.send.attack.pack({
  //   Action: 1,
  //   DefenderID: this.client.character.state.CharacterID,
  //   DefenderIndex: this.client.character.state.NodeID,
  //   AttackerID: this.client.character.state.CharacterID,
  //   AttackerIndex: this.client.character.state.NodeID,
  //
  //   TotalDamage: totalDamage,
  //   ElementalDamage: target.elemental_damage,
  //   Status: 1
  // }))));
};

DamageDealer.prototype.roundUp = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded + 1 : rounded;
};

DamageDealer.prototype.roundDown = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded - 1 : rounded;
};
