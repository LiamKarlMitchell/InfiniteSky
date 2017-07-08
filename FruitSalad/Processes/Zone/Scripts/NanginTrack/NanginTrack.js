// TODO Think of a way to say when config.json is reloaded if NanginTrack_Crontab has been modified then change it.


// *
//  * Nangin Track
//  * @namespace
 
// var NanginTrack = {

/* @const The recommended crontab value */
var crontab = "54 * * * *";

// schedule({ 
// 	name: "NanginTrack",
// 	description: "The Nangin Racetrack should run every hour. It has a countdown before it starts for 6 minutes. Active on zone 119 only.",
// 	crontab: config.NanginTrack_Crontab || crontab,
// 	onLoad: NanginTrack_onLoad,
// 	init: NanginTrack_Init
// });

/** Announcement Message Values

````
Type: 0x22

| Value | Message |
| - | - |
| 1 | [Start the Nangin Track] The [Nangin Track] will begin in [5] minutes. |
| 2 | [Start the Nangin Track] The [Nangin Track] will begin in [4] minutes. |
| 3 | [Start the Nangin Track] The [Nangin Track] will begin in [3] minutes. |
| 4 | [Start the Nangin Track] The [Nangin Track] will begin in [2] minutes. |
| 5 | [Start the Nangin Track] The [Nangin Track] will begin in [1] minute. |
| 6 | [Start the Nangin Track] The [Nangin Track] has begun. |
| 8 | Boots character out of Nangin Track back to town map. |
````

**/
log.warn('Nangin Track script not yet implemented.');
var NanginCatRacePacket = restruct.
int8lu('PacketID');

if (typeof(NanginTrackData) === 'undefined') {
	NanginTrackData = {};
}



/**
* This is called when the schedule is loaded for the first time.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NanginTrack_onLoad(schedule, zone, data) {
	data.status = 1;
	
	/* If the config NanginTrack_Crontab is updated we want to specify a new crontab for the scheduler */
	//zone.on('config', function() {
		//var old_crontab = schedule.crontab;
        //
		// if (config.NanginTrack_Crontab !== undefined) {
		// 	schedule.crontab = config.NanginTrack_Crontab;
		// } else {
		// 	schedule.crontab = crontab;
		// }

		// if (schedule.crontab !== old_crontab) {

		// }
	//})
}

/**
* Initalizes the NanginTrack countdown.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NanginTrack_Init(zone, data) {
	data.status = 0;
	data.countdown = 6;
	world.announce({ type: 0x22, value: 0 });

	// Contdown every minute.
	data.countdownInterval = setInterval(NanginTrack_Countdown.bind(undefined, zone, data), 60000);
}

/**
* Sends out a message for each minute of the countdown.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NanginTrack_Countdown(zone, data) {
	data.countdown --;
	world.announce({ type: 0x22, value: 6 - data.countdown })

	if (data.countdown === 0) {
		clearInterval(data.countdownInterval);
		NanginTrack_Start(zone, data);
		return;
	}
}

/**
* Starts off the NanginTrack race.
* Makes the cats run.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NanginTrack_Start(zone, data) {
	data.status = 2;

	// Calculate speeds of Nangin Cats
	var details = {
		PacketID: 0x6A
	};

	details.winningSilver = 10000;
	details.winningCat = 1;

	// Send Nangin Cat packet to all in zone.
	Zone.sendToAll(new Buffer( NanginCatRacePacket.pack( details ) ));

	setTimeout(NanginTrack_Finished.bind(undefined, zone, data), 60000);
}

/**
* Finishes the race.
* Pays out bets to players.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NanginTrack_Finished(zone, data) {
	data.status = 1;

	// Get winning bets out to players.
	// If player is not on the map then their bet is forfit.

	// Calculate win based on the bets.
	// character.silver += win;
}
