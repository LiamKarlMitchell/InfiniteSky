Login.recv.GameStart = restruct.
	int32lu('MapID').
	int8lu('Slot').
	pad(8); // Probably a user id, but we dont care about it from input.

Login.recv.GameStartReply = function(status){

};

LoginPC.Set(0x09, {
	Restruct: Login.recv.GameStart,
	function: function(socket, input){
		if(!socket.authenticated || socket.handleGameStart) return;
		socket.handleGameStart = true;


		//TODO: IP cleaning & translations

		if(socket.characters && !socket.characters[input.Slot]){
			console.log('Hack attempt, character slot not full with data.');
			socket.destroy();
			return;
		}

		socket.character = socket.characters[input.Slot];

		// TODO: Make sure that we send the player to right map if disconnected w/e.

		



		console.log(input);
	}
});