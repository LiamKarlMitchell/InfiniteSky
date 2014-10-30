// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

generic.Battle = {
  // Can be used for battle calculations for attacking a character
  // Input is required to be like this 1 for a 1 for b
 // {
 // 	id: number,
 // 	Index: number,
 //    infos: {}
 // }
 // it will return attack packet information

  damage: function damage(a_damage,b_defense) {
  	return (((Math.random() * 0.15)-0.05) * a_damage) + (a_damage - b_defense);
  },

  calculate: function calculate(a,b) {
	var Hurt = this.damage(a.infos.Damage,b.infos.Defense);

	var AttackPacket = {
			Action: 0,
			// 0 if your attacking otherwise 5,6,7 or 1 if skill
			AttackerID: a.state.CharacterID,
			AttackerIndex: a.state.Index,
			DefenderID: b.state.CharacterID,
			DefenderIndex: b.state.Index,
			Status: 1,
			// Depends on attacker or defender | hit or miss, block or not |
			TotalDamage: Math.floor(Hurt),
			Deadly: Math.floor(1),
			Light: Math.floor(a.infos.LightDamage),
			Shadow: Math.floor(a.infos.ShadowDamage),
			Dark: Math.floor(a.infos.DarkDamage),
			DamageHP: Math.floor(Hurt) // Deadly bypasses defense
		}

	return AttackPacket;
  }
};