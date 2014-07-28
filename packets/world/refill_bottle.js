var refill_request = restruct.
int32lu('Unk1').
int32lu('Unk2');
WorldPC.Set(0x2E, {
	Restruct: refill_request,
	function: function refill(client, input){
		console.log(input);
	}
});