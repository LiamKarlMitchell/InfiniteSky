// TODO Think of a way to say when config.json is reloaded if NangiTrack_Crontab has been modified then change it.


/**
 * Nangi Track
 * @namespace
 */
 var NangiTrack = function NangiTrack() {

/* @const The recommended crontab value */
var crontab = "54 * * * *";

schedule({ 
	name: "NangiTrack",
	description: "The Nangi Racetrack should run every hour. It has a countdown before it starts for 6 minutes. Active on zone 119 only.",
	targets: 'Z119',
	crontab: config.NangiTrack_Crontab || crontab,
	onLoad: NangiTrack_onLoad,
	init: NangiTrack_Init
});

/** Announcement Message Values

````
Type: 0x22

| Value | Message |
| - | - |
| 1 | [Start the Nangi Track] The [Nangi Track] will begin in [5] minutes. |
| 2 | [Start the Nangi Track] The [Nangi Track] will begin in [4] minutes. |
| 3 | [Start the Nangi Track] The [Nangi Track] will begin in [3] minutes. |
| 4 | [Start the Nangi Track] The [Nangi Track] will begin in [2] minutes. |
| 5 | [Start the Nangi Track] The [Nangi Track] will begin in [1] minute. |
| 6 | [Start the Nangi Track] The [Nangi Track] has begun. |
| 8 | Boots character out of Nangi Track back to town map. |
````

**/


var NangiCatRacePacket = restruct.
int8lu('PacketID');

/**
* This is called when the schedule is loaded for the first time.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NangiTrack_onLoad(schedule, zone, data) {
	data.status = 1;
	
	/* If the config NangiTrack_Crontab is updated we want to specify a new crontab for the scheduler */
	zone.on('config', function() {
		var old_crontab = schedule.crontab;

		if (config.NangiTrack_Crontab !== undefined) {
			schedule.crontab = config.NangiTrack_Crontab;
		} else {
			schedule.crontab = crontab;
		}

		if (schedule.crontab !== old_crontab) {

		}
	})
}

/**
* Initalizes the NangiTrack countdown.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NangiTrack_Init(zone, data) {
	data.status = 0;
	data.countdown = 6;
	world.announce({ type: 0x22, value: 0 });

	// Contdown every minute.
	data.countdownInterval = setInterval(NangiTrack_Countdown.bind(undefined, zone, data), 60000);
}

/**
* Sends out a message for each minute of the countdown.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NangiTrack_Countdown(zone, data) {
	data.countdown --;
	world.announce({ type: 0x22, value: 6 - data.countdown })

	if (data.countdown === 0) {
		clearInterval(data.countdownInterval);
		NangiTrack_Start(zone, data);
		return;
	}
}

/**
* Starts off the NangiTrack race.
* Makes the cats run.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NangiTrack_Start(zone, data) {
	data.status = 2;

	// Calculate speeds of Nangi Cats
	var details = {
		PacketID: 0x6A
	};

	details.winningSilver = 10000;
	details.winningCat = 1;

	// Send Nangi Cat packet to all in zone.
	zoen.sendToAll(new Buffer( NangiCatRacePacket.pack( details ) ));

	setTimeout(NangiTrack_Finished.bind(undefined, zone, data), 60000);
}

/**
* Finishes the race.
* Pays out bets to players.
* @param {Zone} The zone.
* @param {Object} Data provided to schedule functions.
*/
function NangiTrack_Finished(zone, data) {
	data.status = 1;

	// Get winning bets out to players.
	// If player is not on the map then their bet is forfit.

	// Calculate win based on the bets.
	// character.silver += win;
}

}