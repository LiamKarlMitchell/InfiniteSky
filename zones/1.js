// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

(function() {
module.exports = new (

function Z001_MapScript() {

this.Init = function Init(zone) {
	this.zone = zone;

	// Do other things when script is initalized
	// this.minTimer = setInterval(function() {
	// 	zone.forEachClient(function() {
	// 		this.sendInfoMessage('DING DONG!');
	// 	});
	// },60000);
}

this.Uninit = function() {
	clearInterval(this.minTimer);
}

// Event handlers for things that may happen
// example of being executed
// if (zone.zone_script.onClientJoin) zone.zone_script.onClientJoin(client);
this.onClientJoin = function onClientJoin(client) {
	console.log('A client joined map 1');

	// We can probably give zones access to mongodb or file storage.
	// if (client.account.Level >= 50) {
	// 	client.sendInfoMessage('You are allowed to see this message');
	// }
}

this.onClientLeave = function onClientLeave(client) {
	console.log('A client leaved map 1');
}

this.onCharacterLevel = function onCharacterLevel(client) {

}

this.onCharacterDeath = function onCharacterDeath(client) {

}

// Called when saving the map
this.onSave = function onSave() {

}

});
})();