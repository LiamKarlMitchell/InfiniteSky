// 528 in total : 528 - 1 = 527
// 527 - title_zie = 503
// 503 body
// DWORD is 4 bytes
// 1 page is 100 bytes
// pad 3

WorldPC.Set(0x34, {
 	Restruct: packets.TradeShop,
    function: function handleItemOpenStore(client, input) {
    	if (!client.authenticated) return;
    	console.log("########################################");

//console.log(input);
console.log("Restruct size: " + packets.TradeShop.size);
console.log("Reply size: " + packets.TradeShopReply.size);

		client.write(new Buffer(packets.TradeShopReply.pack({
			"PacketID": 0x4C,
			"Items": input.Items
		})));
		client.character.state.Store = 1;
		client.character.state.setFromCharacter(client.character);
	}
});
var ShopConfirm = restruct.
string('Title', 24).
int32lu('unk',20);

console.log(ShopConfirm.size);

WorldPC.Set(0x35, {
	Size: 8,
	function: function CloseOpenedShop(client){
		console.log("Shop flag : " + client.character.state.Store);
		if(client.character.state.Store === 1 || client.character.state.Store === 2)
			client.character.state.Store = 0;

		client.character.state.setFromCharacter(client.character);
	}
});

// WorldPC.Set(0x11, {
// 	Restruct: ShopConfirm,
// 	function: function somTests(client, input){
// 		console.log(input);
// 	}
// });


