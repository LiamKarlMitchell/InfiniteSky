var recieveData = restruct.
int32lu('Price').
int32lu('ItemID').
int32lu('Unknown3').
int32lu('Unknown4').
int32lu('Unknown5').
int32lu('Unknown6').
int32lu('Unknown7').
int32lu('Unknown8').
int32lu('Unknown9').
int32lu('Unknown10');


WorldPC.Set(0x39, {
	Restruct: recieveData,
	function: function generate_new_atique(client, input){
		console.log(input);
		console.log("Item name: " + infos.Item[input.ItemID].Name);
	}
})