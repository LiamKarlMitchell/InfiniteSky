// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// TODO: Implement a semi-fixed timestep? See http://gafferongames.com/game-physics/fix-your-timestep/
var GameStep = function(callback) {
 this.interval = null;
 this.run = false;
 this.callback = callback;
 var self = this;

 this.start = function() {
 	if (this.intervall!=null) return;

   this.lastTime = process.hrtime();

   //process.nextTick(function() { this.step.call(this); });
   this.interval = setInterval(function() {

     var diff = process.hrtime(self.lastTime);

     self.lastTime = process.hrtime();

     if (callback) callback(diff[1]/1e6);

   }, 100);//maybe its not zone.js, its AI.js??? donno but think its the things zone.js loads eg monsters items. it takes ages.
 }


 this.stop = function() {
   this.run=false;
   clearInterval(this.interval);
   this.interval = null;
 }
};

module.exports = GameStep;
