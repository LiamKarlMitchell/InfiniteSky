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
  var missChance = 5;
  if(levelDifference <= -10){
    missChance += Math.abs(levelDifference) * 5;
    console.log("Miss more rate to the client. -10");
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

  var expDamage = rawDamage;
  if(rawDamage > tState.CurrentHP) expDamage = tState.CurrentHP;

  if(rawDamage < 0) rawDamage = 0;
  if(expDamage < 0) expDamage = 0;

  missChance += tState.info.Defense * 0.04;
  missChance -= this.client.character.infos.HitRate * 0.02;

  if(missChance < 0) missChance = 0;
  else if(missChance > 100) missChance = 100;

  var experienceGained = 0;
  if(levelDifference < 10){
    experienceGained = tState.info.Experience / tState.info.Health * expDamage;
    experienceGained = experienceGained * config.world.general.rates.global.experience;
  }

  var missRoll = random.bool(Math.round(missChance), 100);
  if(missRoll){
    return;
  }



  console.log("Damage (min, max):", minDamage, maxDamage);
  console.log("Raw damage:", rawDamage);
  console.log("Chance to miss: ", missChance);
  console.log("Missed?", missRoll);
  console.log("Experience gained: ", experienceGained + " / " + this.client.character.infos.ExpInfo.EXPEnd, "("+(100 / this.client.character.infos.ExpInfo.EXPEnd * experienceGained)+"%)");
};

DamageDealer.prototype.roundUp = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded + 1 : rounded;
};

DamageDealer.prototype.roundDown = function(value){
  var rounded = Math.round(value);
  return rounded < value ? rounded - 1 : rounded;
};
