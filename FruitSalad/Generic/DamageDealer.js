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

  var levelDifference = this.client.character.Level - tState.info.Level;
  var missChance = 5;
  if(levelDifference <= -10){
    missChance += Math.abs(levelDifference) * 5;
  }else if(levelDifference <= -6){
    missChance += Math.abs(levelDifference) * 2;
  }

  var minDamage = this.client.character.infos.Damage;
  minDamage -= this.roundDown(this.client.character.infos.Damage * 0.11);
  var maxDamage = this.client.character.infos.Damage;
  maxDamage += this.roundUp(this.client.character.infos.Damage * 0.11);

  minDamage -= tState.info.Defense;
  maxDamage -= tState.info.Defense;

  // TODO: Add stone/formation dmg bonuses.

  var rawDamage = random.integer(minDamage, maxDamage);


  missChance += tState.info.Defense * 0.04;
  missChance -= this.client.character.infos.HitRate * 0.02;

  if(missChance < 0) missChance = 0;
  else if(missChance > 100) missChance = 100;

  var experienceGained = 0;

  var missRoll = random.bool(Math.round(missChance), 100);
  var obj = {};
  obj.Action = 1;
  obj.CharacterID = this.client.character.state.CharacterID;
  obj.NodeID = this.client.character.state.NodeID;

  obj.tUniqueID = tState.UniqueID;
  obj.tNodeID = tState.NodeID;

  if(missRoll || !rawDamage){
    obj.Successful = 0;
    var buffer = new Buffer(packets.makeCompressedPacket(0x2C, new Buffer(Zone.send.attack.pack(obj))));
  	Zone.sendToAllAreaLocation(this.client.character.state.Location, config.network.viewable_action_distance, buffer);
    return;
  }

  var deadlyRoll = random.bool(this.client.character.infos.Chance_DeadlyBlow, 100);
  if(deadlyRoll){
    obj.isDeadly = 1;
    rawDamage += tState.info.Defense;
  }

  var expDamage = rawDamage;
  if(rawDamage > tState.CurrentHP) expDamage = tState.CurrentHP;

  if(rawDamage < 0) rawDamage = 0;
  if(expDamage < 0) expDamage = 0;

  if(levelDifference < 10){
    experienceGained = tState.info.Experience / tState.info.Health * expDamage;
    experienceGained = experienceGained * config.world.general.rates.global.experience;
  }

  Zone.giveEXP(this.client, experienceGained);

  obj.Successful = 1;

  obj.Damage = rawDamage;
  obj.DamageHP = 10;

  t.object.hit(expDamage);

  this.client.write(new Buffer(packets.makeCompressedPacket(0x2C, new Buffer(Zone.send.attack.pack(obj)))));
  Zone.sendToAllAreaLocation(this.client.character.state.Location, config.network.viewable_action_distance, t.object.getPacket());
};

DamageDealer.prototype.roundUp = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded + 1 : rounded;
};

DamageDealer.prototype.roundDown = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded - 1 : rounded;
};
