// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

//void __usercall Recv2B_ItemsInventorySkillPacketReply(int a1<ebp>)
// {
//   int ActionType; // [sp+0h] [bp-3Ch]@1
//
//   memcpy(&ActionType, (const void *)(RecvBuffer + 1), 60u);
//   switch ( ActionType )
//   {
//     case ITEMACTION_PICKUP_ITEM:
//       ItemActionReply_PickupItem((int)&ActionType);
//       break;
//     case ITEMACTION_DROP_ITEM:
//       ItemActionReply_DropItem((int)&ActionType);
//       break;
//     case ITEMACTION_MOVE_PILL_TO_BAR:
//       ItemActionReply_MovePillToBar((int)&ActionType);
//       break;
//     case ITEMACTION_EQUIP_ITEM:
//       ItemActionReply_EquipItem((int)&ActionType);
//       break;
//     case ITEMACTION_4:
//       ItemActionReply_4((int)&ActionType);
//       break;
//     case ITEMACTION_UNEQUIP_ITEM:
//       ItemActionReply_UnequipItem((int)&ActionType);
//       break;
//     case ITEMACTION_STORE_ITEM:
//       ItemActionReply_StoreItem((int)&ActionType);
//       break;
//     case ITEMACTION_SELL_ITEM:
//       ItemActionReply_SellItem((int)&ActionType);
//       break;
//     case ITEMACTION_8:
//       sub_4613C0((int)&ActionType);
//       break;
//     case ITEMACTION_9:
//       sub_461430((int)&ActionType);
//       break;
//     case ITEMACTION_A:
//       sub_4614A0((int)&ActionType);
//       break;
//     case ITEMACTION_MOVE_FROM_PILL_BAR:
//       ItemActionReply_MoveFromPillBar((int)&ActionType);
//       break;
//     case ITEMACTION_C:
//       sub_461660(a1, (int)&ActionType);
//       break;
//     case ITEMACTION_D:
//       sub_461B20((int)&ActionType);
//       break;
//     case ITEMACTION_E:
//       sub_461C60((int)&ActionType);
//       break;
//     case ITEMACTION_MOVE_FROM_STORAGE:
//       ItemActionReply_MoveFromStorage((int)&ActionType);
//       break;
//     case ITEMACTION_10:
//       sub_462100((int)&ActionType);
//       break;
//     case ITEMACTION_BUY_ITEM:
//       ItemActionReply_BuyItem((int)&ActionType);
//       break;
//     case ITEMACTION_12_NOT_USED:
//       nullsub_4(&ActionType);
//       break;
//     case ITEMACTION_13:
//       sub_462400((int)&ActionType);
//       break;
//     case ITEMACTION_MOVE_ITEM:
//       ItemActionReply_MoveItem((int)&ActionType);
//       break;
//     case ITEMACTION_STORE_SILVER:
//       ItemActionReply_StoreSilver((int)&ActionType);
//       break;
//     case ITEMACTION_GATE_MASTER_BANK_SILVER:
//       ItemActionReply_GateMasterBankSilver((int)&ActionType);
//       break;
//     case ITEMACTION_17_NOT_USED:
//       nullsub_4(&ActionType);
//       break;
//     case ITEMACTION_18:
//       sub_4627F0((int)&ActionType);
//       break;
//     case ITEMACTION_19:
//       sub_462850((int)&ActionType);
//       break;
//     case ITEMACTION_1A_NOT_USED:
//       nullsub_4(&ActionType);
//       break;
//     case ITEMACTION_MOVE_SKILL_TO_BAR:
//       ItemActionReply_MoveSkillToBar((int)&ActionType);
//       break;
//     case ITEMACTION_1C:
//       sub_462930((int)&ActionType);
//       break;
//     case ITEMACTION_1D:
//       sub_4629B0((int)&ActionType);
//       break;
//     case ITEMACTION_1E:
//       sub_462A20((int)&ActionType);
//       break;
//     case ITEMACTION_LEARN_SKILL:
//       ItemActionReply_LearnSkill((signed int)&ActionType);
//       break;
//     case ITEMACTION_20:
//       sub_462BE0((int)&ActionType);
//       break;
//     case ITEMACTION_21:
//       sub_462C20((int)&ActionType);
//       break;
//     case ITEMACTION_22:
//       sub_462CA0((int)&ActionType);
//       break;
//     case ITEMACTION_23:
//       sub_462D10((int)&ActionType);
//       break;
//     case ITEMACTION_24:
//       sub_462F90((int)&ActionType);
//       break;
//     case ITEMACTION_25:
//       sub_4631A0((int)&ActionType);
//       break;
//     case ITEMACTION_26:
//       sub_463420((int)&ActionType);
//       break;
//     case ITEMACTION_27:
//       sub_463610((int)&ActionType);
//       break;
//     case ITEMACTION_28:
//       sub_463670((int)&ActionType);
//       break;
//     case ITEMACTION_29:
//       sub_4636D0((int)&ActionType);
//       break;
//     case ITEMACTION_2A:
//       sub_463730((int)&ActionType);
//       break;
//     default:
//       return;
//   }
// }

// Actions not added yet
// 14 - Remove Armor / Unequip Item
// 28 - Unbind Skill
// 29 - Skill Up
var ItemActions = [];
ItemActions[0] = function PickupItem(socket, input) {
    // Pick up an item from the ground and put it into inventory
    socket.write(new Buffer(
    packets.ItemActionReplyPacket.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        InventoryIndex: 6,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup
        //ColumnMove: input.ColumnMove,
        //RowMove: input.RowMove,
        //Enchant: input.Enchant it nl
    })));

    socket.character.markModified('Inventory');
    socket.character.save();
};

function ItemActionReplyStatus(socket, actionType, failed){ // Maybe change the name to : OnItemActionReplyStatus
	if(failed === undefined) failed = 1;
	socket.write(new Buffer(
		packets.ItemActionReplyPacket2.pack({
				PacketID: 0x2B,
				ActionType: actionType,
				Failed: failed
			}))
	);
}

function getItemFromInventory(character, column, row) {
    for (var i = 0; i < character.Inventory.length; i++) {
        var inv = character.Inventory[i];
        //if (inv) console.log(inv);
        if (inv && inv.Row == row && inv.Column == column && inv.ID > 0) return {index: i, item: inv};
    }
    return null;
}
function createItemOnGround(Zone, ItemID, Amount, Enchant, Combine, Location, OwnerName) {
    var spawninfo = {
        'ID': ItemID,
        'Amount': Amount,
        'Location': Location,
        'Enchant': Enchant,
        'Combine': Combine,
        'Owner': OwnerName
    };  
    var itemspawn = Zone.createItem(spawninfo);
    Zone.addItem(itemspawn);
    /*
    var ItemOnGround = Zone.createItem();
    ItemOnGround.ItemID = ItemID;
    ItemOnGround.Enchant = Enchant;
    ItemOnGround.Amount = Amount; 
    ItemOnGround.Location.set(Location); 
    ItemOnGround.Owner_Name = OwnerName;
    //ItemOnGround.Combine = Combine; Dont know if is ok
    //Direction = random direction
    //ItemOnGround.Direction = socket.character.state.Direction;
    */
    
}
ItemActions[1] = function DropItem(socket, input) {
    //socket.sendInfoMessage('Input amount:' + input.Amount);
    //console.log("Drop Item"); 
    if(input.ItemID == 1) {
        /*Dropping silvers*/
        if(socket.character.Silver >= input.Amount) {
            //console.log('Dropping silver test',input.Amount);
            createItemOnGround(socket.Zone, 1, input.Amount, 0, 0, socket.character.state.Location, socket.character.Name);
            socket.character.Silver -= input.Amount;
        } else return socket.sendInfoMessage('You dont have that amount of silver in your inventory');
    } else {
        /*Dropping items*/
        var theItem = null;
        theItem = socket.character.Inventory[input.InventoryIndex];
        //theItem = getItemFromInventory(socket.character, input.ColumnPickup, input.RowPickup);
        if (theItem) {
            if(theItem.Amount >= input.Amount) {
                //console.log('Dropping test item',theItem);
                createItemOnGround(socket.Zone, theItem.ID, input.Amount, theItem.Enchant, theItem.Combine, socket.character.state.Location, socket.character.Name);
                theItem.Amount -= input.Amount;
                if((input.Amount === 0 && theItem.Amount === 1) || theItem.Amount <= 0) delete socket.character.Inventory[input.InventoryIndex];
            } else return socket.sendInfoMessage('You dont have that amount of items in your inventory');// just for debug..
        } else {
            return socket.sendInfoMessage('Debug: Internal error item null');
        }
    }
    socket.character.markModified('Inventory');
    socket.character.save();
    //Update client
    socket.write(
    new Buffer(
        packets.ItemActionReplyPacket.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        ItemID: input.ItemID,
        Unknown3: input.Unknown3,
        Unknown4: input.Unknown4,
        Unknown5: input.Unknown5,
        Amount: input.Amount,
        InventoryIndex: input.InventoryIndex,
        RowDrop: input.RowDrop,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup,
        ColumnMove: input.ColumnMove,
        RowMove: input.RowMove,
        Enchant: input.Enchant})
        )
    );
    return;
};
ItemActions[2] = function InventoryToPillBar (socket, input) {
      //InventoryToPillBar
                        console.log("Inventory to pill bar");
                        var status;
                        if(socket.character.Inventory[input.InventoryIndex].Amount - input.Amount < 0 )
                        {
                            socket.character.Inventory[input.InventoryIndex] = null;
                            console.log("FAIL");
                        }
                        else if(socket.character.Inventory[input.InventoryIndex].Amount - input.Amount === 0)
                        {
                            socket.character.Inventory[input.InventoryIndex] = null;
                                status = socket.giveItemInPillBar(input, input);
                                    console.log("PASS:"+status);
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }
                        }
                        else 
                        {
                            socket.character.Inventory[input.InventoryIndex].Amount -= input.Amount;
                                status = socket.giveItemInPillBar(input, input);
                                    console.log("PASS");
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }

                        }
                        

};

ItemActions[3] = function EquipItem(socket, input) {
    
	console.log("Item Equip");
	// See if wearing the item and can equip it
	if (input.InventoryItem>64){
		console.log('Invalid Inventory Index');
		ItemActionReplyStatus(socket, input.ActionType); // Send failed status
		return;
	}

  var inventoryItem = socket.character.Inventory[input.InventoryIndex];

	var ii = infos.Item[inventoryItem.ID];

	if (ii===null || inventoryItem===null || inventoryItem.ID !== input.ItemID || inventoryItem.ID===0 || inventoryItem.Amount===0)
	{
	  console.log('Item or id does not match or not enough amount etc');
	  return true;
	}

	console.log('Equip item from '+inventoryItem.Column+', '+inventoryItem.Row);
	var item = null;

	console.log('Name: '+ii.Name+' ItemType: '+ii.ItemType);
	switch (input.RowPickup) // RowPickup is spot in equips for item to goto
	{
    case 0:
      console.log('Amulet');
      item = socket.character.Amulet;
      if (ii.ItemType!=5) { console.log('Invalid not correct item Type'); return; }
    break;
    case 1:
      console.log('Cape');
      item = socket.character.Cape;
      if (ii.ItemType!=8) { console.log('Invalid not correct item Type'); return; }
    break;
    case 2:
      console.log('Armor');
      item = socket.character.Armor;
      if (ii.ItemType!=9) { console.log('Invalid not correct item Type'); return; }
    break;
    case 3:
      console.log('Glove');
      item = socket.character.Glove;
      if (ii.ItemType!=10) { console.log('Invalid not correct item Type'); return; }
    break;
    case 4:
      console.log('Ring');
      item = socket.character.Ring;
      if (ii.ItemType!=10) { console.log('Invalid not correct item Type'); return; }
    break;
    case 5:
      console.log('Boot');
      item = socket.character.Boot;
      if (ii.ItemType!=12) { console.log('Invalid not correct item Type'); return; }
    break;
    case 6:
      console.log('CalbashBottle');
      item = socket.character.CalbashBottle;
      if (ii.ItemType!=6) { console.log('Invalid not correct item Type'); return; }
    break;
  case 7:
      console.log('Weapon');
      item = socket.character.Weapon;

      // Check type of weapon
      switch (ii.ItemType)
      {
      case 12: // ItemType = 'Sword';
      case 13: // ItemType = 'Blade';
      case 14: // ItemType = 'Marble';

      // Make sure right clan can equip
      if (socket.character.Clan!==0)
      {
        console.log('Cant equip wrong clan');
        return;
      }

      break;
      case 15: // ItemType = 'Katana';
      case 16: // ItemType = 'Double Blade';
      case 17: // ItemType = 'Lute';

      // Make sure right clan can equip
      if (socket.character.Clan!=1)
      {
          console.log('Cant equip wrong clan');
          return;
      }

      break;
      case 18: // ItemType = 'Light Blade';
      case 19: // ItemType = 'Long Spear';
      case 20: // ItemType = 'Scepter';

      // Make sure right clan can equip
      if (socket.character.Clan!=2)
      {

        console.log('Cant equip wrong clan');
        return;
      }

      break;
      default:
        console.log('Unable to equip weapon as not weapon');
      return;
    }

    break;
    case 8:
        console.log('Pet');
        item = socket.character.Pet;
        // Not sure if this is correct
        if (ii.ItemType!=2) { console.log('Invalid not correct item Type'); return; }
    break;
    default:
        console.log('Unhandled Equip Type');
        return;
	}

	if (item!==null && item.ID!==0 && item.Amount>0)
	{
	    console.log('Item already equiped there');
	    return;
	}

	// Set the equip
	item = { ID: inventoryItem.ID, Enchant: inventoryItem.Enchant, Combine: inventoryItem.Combine };

	switch (input.RowPickup) // RowPickup is spot in equips for item to goto
	{
	    case 0:
	        socket.character.Ring = item;
	    break;
	    case 1:
	        socket.character.Cape = item;
	    break;
	    case 2:
	        socket.character.Armor = item;
	    break;
	    case 3:
	        socket.character.Glove = item;
	    break;
	    case 4:
	        socket.character.Amulet = item;
	    break;
	    case 5:
	        socket.character.Boot = item;
	    break;
	    case 6:
	        socket.character.CalbashBottle = item;
	    break;
	    case 7:
	        socket.character.Weapon = item;
	    break;
	    case 8:
	        socket.character.Pet = item;
	    break;
	}

	// Clear inventory item
	socket.character.Inventory[input.InventoryIndex].ID = 0;
	socket.character.markModified('QuickUseItems');
	                            socket.character.save();

	                        // Update stats
	                        socket.character.updateInfos();
	                        socket.character.state.setFromCharacter(socket.character);

	                        socket.write(new Buffer(
	                            packets.ItemActionReplyPacket.pack({
	                                PacketID: 0x2B,
	                                ActionType: input.ActionType,
	                                ItemUniqueID: input.ItemUniqueID,
	                                ItemUniqueID2: input.ItemUniqueID2,
	                                ItemID: input.ItemID,
	                                Unknown3: input.Unknown3,
	                                Unknown4: input.Unknown4,
	                                Unknown5: input.Unknown5,
	                                Amount: input.Amount,
	                                InventoryIndex: input.InventoryIndex,
	                                RowDrop: input.RowDrop,
	                                ColumnPickup: input.ColumnPickup,
	                                RowPickup: input.RowPickup,
	                                ColumnMove: input.ColumnMove,
	                                RowMove: input.RowMove,
	                                Enchant: input.Enchant
	                            }
	                            )
	                            )
	                        );
	                        return;

};

ItemActions[14] = function ItemUnequip (socket, input){
	console.log("Item unequip");



	if (input.InventoryIndex>64)
	{
	    console.log('Invalid Inventory Index');
	    return;
	}

	console.log('Unequip item to '+input.ColumnMove+', '+input.RowMove);
	var item = null;
	var inventoryItem = null;

	switch (input.InventoryIndex)
	{
	    case 0:
	        console.log('Ring');
	        item = socket.character.Ring;
	    break;
	    case 1:
	        console.log('Cape');
	        item = socket.character.Cape;
	    break;
	    case 2:
	        console.log('Armor');
	        item = socket.character.Armor;
	    break;
	    case 3:
	        console.log('Glove');
	        item = socket.character.Glove;
	    break;
	    case 4:
	        console.log('Amulet');
	        item = socket.character.Amulet;
	    break;
	    case 5:
	        console.log('Boot');
	        item = socket.character.Boot;
	    break;
	    case 6:
	        console.log('CalbashBottle');
	        item = socket.character.CalbashBottle;
	    break;
	    case 7:
	        console.log('Weapon');
	        item = socket.character.Weapon;
	    break;
	    case 8:
	        console.log('Pet');
	        item = socket.character.Pet;
	    break;
	    default:
	        console.log('Unhandled Equip Type');
	        return;
	}

	if (item===null || item.ID===0)
	{
	    console.log('Item not equiped in that spot');
	    return;
	}

	var itemInfo = infos.Item[item.ID];
	console.log('Unequiping the Item: '+itemInfo.Name);

	var slotCount = itemInfo.getSlotCount();
	console.log('Slot Count = '+slotCount);

	// Check that its valid inventory slot to put item into.
	// input.RowPickup

	inventoryItem = socket.character.Inventory[input.RowPickup]; // RowPickup is inventory slot to put the equip into


	if (inventoryItem===null) inventoryItem = { ID: 0, Amount: 0, Row: 0, Column: 0, Enchant: 0 };
	// Check if inventory item is not already set to something
	if (inventoryItem.ID!==null && inventoryItem.Amount!==null  )
	{
	    if(inventoryItem.ID!==0 && inventoryItem.Amount!==0 )
	    {
	    console.log('Inventory item already set in this position ['+inventoryItem.ID+":"+inventoryItem.Amount+"]");
	    return;
	    }

	}

	// If slotsize if 4 check that not on edge of inventory
	// Check to see there are no items in this column/row
	// Check around top left of where item will go to see if there are any items with a slotsize of 4
	// if slotsize is 4 then check bottom and right and bottom right to make sure nothings in those slots

	if (socket.character.checkItemSlotFree(input.Column,input.Row,slotCount)===false)
	{
	    console.log('Item overlap detected');
	    return;
	}

	inventoryItem.ID = item.ID;
	inventoryItem.Amount = 1;
	inventoryItem.Enchant = item.Enchant;
	inventoryItem.Column = input.ColumnMove;
	inventoryItem.Row = input.RowMove;

	socket.character.Inventory[input.RowPickup] = inventoryItem;

	item.ID = 0;
	item.Amount = 0;
	item.Enchant = 0;
	item.Combine = 0;

	console.log(socket.character.Inventory[input.RowPickup]);

	// See if wearing the item and can unequip it
	// Update stats
	socket.character.updateInfos();
	socket.character.state.setFromCharacter(socket.character);

	// Send reply
	socket.write(new Buffer(
	    packets.ItemActionReplyPacket.pack({
	        PacketID: 0x2B,
	        ActionType: input.ActionType,
	        ItemUniqueID: input.ItemUniqueID,
	        ItemUniqueID2: input.ItemUniqueID2,
	        ItemID: input.ItemID,
	        Unknown3: input.Unknown3,
	        Unknown4: input.Unknown4,
	        Unknown5: input.Unknown5,
	        Amount: input.Amount,
	        InventoryIndex: input.InventoryIndex,
	        RowDrop: input.RowDrop,
	        ColumnPickup: input.ColumnPickup,
	        RowPickup: input.RowPickup,
	        ColumnMove: input.ColumnMove,
	        RowMove: input.RowMove,
	        Enchant: input.Enchant
	    })));
};

ItemActions[6] = function StoreItem (socket, input){
	console.log('Wants to store item');
	// RowPickup contains index to put it in the storage at
	if (input.RowPickup>27)
	{
	    console.log('Invalid Storage Index');
	    return;
	}


	if (input.InventoryIndex>=64)
	{
	    console.log('Invalid inventory index');
	    return;
	}

	var invItem = socket.character.Inventory[input.InventoryIndex];

	if (invItem===null)
	{
	    console.log('Invalid Inventory Item');
	    return;
	}

	if (invItem.ID !== input.ItemID)
	{
	    console.log('Inventory ItemID and ItemID do not match');
	    return;
	}

	if (input.Amount===0) input.Amount=1;
	if (input.Amount>99) input.Amount=99;
	if (input.Amount>invItem.Amount) input.Amount = invItem.Amount;

	console.log('Storage Index: '+input.RowPickup);
	eyes.inspect(socket.character.Storage);
	var storageItem = socket.character.Storage[input.RowPickup];
	var Amount=input.Amount;

	if ((storageItem.ID || 0) !==0 && (storageItem.Amount || 0) !==0)
	{
	    if (storageItem.ID === invItem.ID)
	        {
	            // If item is stackable
	            Amount+=storageItem.Amount;
	        }
	        else
	        {
	            console.log('Already item in that slot');
	            return;
	        }
	}

	storageItem = { ID: invItem.ID, Amount: Amount, Enchant: invItem.Enchant };

	socket.character.markModified('Storage');

	socket.character.Storage[input.RowPickup] = storageItem;
	invItem.Amount -= input.Amount;

	if (invItem.Amount === 0)
	{
	    invItem=null;
	}

	socket.character.Inventory[input.InventoryIndex] = invItem;



	socket.write(new Buffer(
	    packets.ItemActionReplyPacket.pack({
	        PacketID: 0x2B,
	        ActionType: input.ActionType,
	        ItemUniqueID: input.ItemUniqueID,
	        ItemUniqueID2: input.ItemUniqueID2,
	        ItemID: input.ItemID,
	        Unknown3: input.Unknown3,
	        Unknown4: input.Unknown4,
	        Unknown5: input.Unknown5,
	        Amount: input.Amount,
	        InventoryIndex: input.InventoryIndex,
	        RowDrop: input.RowDrop,
	        ColumnPickup: input.ColumnPickup,
	        RowPickup: input.RowPickup,
	        ColumnMove: input.ColumnMove,
	        RowMove: input.RowMove,
	        Enchant: input.Enchant
	    })
	));
};

ItemActions[7] = function ItemSell (socket, input) {



                        if (input.Amount===0) input.Amount=1;
                        if (input.Amount>99) input.Amount=99;

                        console.log("character [",socket.character.Name,"] is selling [",input.Amount,"] - ",infos.Item[input.ItemID].Name+' At Index '+input.InventoryIndex );
                        //find item in character data
                        // socket.character.Inventory[i] might be null or undefined
                        // it can be if empty
                        //need to do if (typeof(socket.character.Inventory[i])!='undefined')
                        // or a if(socket.character.Inventory[i])
                        // When iterating for reading the values might be null if an item is not in the spot.
                        // When i create a character.
                        // Ivnetnory[1] will be null
                        // Check input.InventoryPage?
                        //if (socket.character.StorageUse) // if can use hermits chest
                        // Check near NPC that can sell at
                        if (input.InventoryIndex<=64)
                        {
                            var invItem = socket.character.Inventory[input.InventoryIndex];
                            if (invItem && invItem.ID == input.ItemID && invItem.Amount>0) // Check that inventory item exists
                            {
                                if (input.Amount>invItem.Amount) {
                                    input.Amount = invItem.Amount;
                                }

                                var info = infos.Item[input.ItemID];
                                if (info===null)
                                {
                                    console.log('Invalid Item');
                                    return;
                                }

                                if(invItem.Amount-input.Amount === 0) {
                                    invItem = null;
                                }
                                else
                                {
                                    invItem.Amount-=input.Amount;
                                }
                                    // give the character the correct amount of cash
                                    socket.character.Silver+=info.SalePrice*input.Amount;
                                    socket.character.Inventory[input.InventoryIndex] = invItem;
                            }
                            else{
                                console.log("character[",socket.character.Name,"] Cannot sell item[",infos.Item[input.ItemID].Name,"]");
                                return;
                            }
                        }

                        socket.character.markModified('Silver');
                        socket.character.markModified('Inventory');
                        socket.character.save();


                        socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: 1,
                                Unknown4: 2,
                                Unknown5: 1,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            })));
};

//void __stdcall Recv_GoldToCoins(sItemAction *a1)
//{
//	int v1; // eax@4
//	signed int v2; // [sp-8h] [bp-8h]@2
//	char v3; // [sp-4h] [bp-4h]@2
//
//	dword_F00034 = 0;
//	if ( a1->ErrorOrEnchant == 1 )
//	{
//		v3 = byte_AC80CC;
//		v2 = 108;
//	}
//	else
//	{
//		Silver += 1000000000;
//		--Gold;
//		v3 = byte_AC80CC;
//		v2 = 2250;
//	}
//	v1 = GetMessageFromID((int)&gameMessages_dat, v2);
//	PushMessage(v1, v3);
//}

ItemActions[8] = function CoinsToGold(socket, input) {
	if(socket.character.Silver >= 1000000000){
		socket.character.Silver -= 1000000000;
		socket.character.SilverBig++;
		socket.character.save();
	}

	// Send reply to client
	socket.write(new Buffer(
			packets.ItemActionReplyPacket.pack({
				PacketID: 0x2B,
				ActionType: input.ActionType
			})));

	socket.sendInfoMessage('Hello from CoinsToGold function!');

};

ItemActions[9] = function GoldToCoins(socket, input) {
	var MAX_SILVER = 2147483647; //TODO: Move this into a main definition file somewhere..

	if(socket.character.SilverBig >= 1){
		if( (socket.character.Silver+1000000000) <= MAX_SILVER  ) {
			socket.character.Silver += 1000000000;
			socket.character.SilverBig--;
			socket.character.save();
		}
	}

    // Send reply to client
    socket.write(new Buffer(
    packets.ItemActionReplyPacket.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType
    })));

    socket.sendInfoMessage('Hello from GoldToCoins function!');
};


ItemActions[11] = function PillBarToInventory (socket, input) {
    // case 11:  //PillBarToInventory
                    var status;
                            console.log("Moving item from Pill Bar to Inventory");

                            if(socket.character.QuickUseItems[input.InventoryIndex].Amount - input.Amount < 0 )
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].ID = 0;
                            socket.character.markModified('QuickUseItems');
                            socket.character.save();
                            console.log("FAIL");
                        }
                        else if(socket.character.QuickUseItems[input.InventoryIndex].Amount - input.Amount === 0)
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].ID = 0;
                            socket.character.markModified('QuickUseItems');
                            socket.character.save();
                                status = socket.giveItemInInventory(input, input);
                                    console.log("PASS");
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }
                        }
                        else 
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].Amount -= input.Amount;
                                status = socket.giveItemInInventory(input, input);
                                    console.log("PASS");
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }

                        }
};

ItemActions[12] = function PillBarUse (socket, input) {
    // case 11:  //PillBarToInventory
                            console.log("Using item from Pill Bar");


                            if(socket.character.QuickUseItems[input.InventoryIndex].Amount - input.Amount < 0 || input.Amount > 1 )
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].ID = 0;
                            socket.character.markModified('QuickUseItems');
                            socket.character.save();
                            console.log("FAIL");
                        }
                        else if(socket.character.QuickUseItems[input.InventoryIndex].Amount - input.Amount === 0)
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].ID = 0;
                            socket.character.markModified('QuickUseItems');
                            socket.character.save();
                                    console.log("PASS");
                                    if(status === true)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }
                        }
                        else 
                        {
                            socket.character.QuickUseItems[input.InventoryIndex].Amount -= 1;
                            socket.character.markModified('QuickUseItems');
                            socket.character.save();
                                var status = socket.giveItemInInventory(input, input);
                                    console.log("PASS");
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }

                        }
};


ItemActions[15] = function RetrieveFromStorage (socket, input){
console.log("Retrive from storage");    
if (input.InventoryIndex>27)
{
    console.log('Invalid storage index');
    return;
}

if (input.RowPickup>63)
{
    console.log('Invalid inventory index');
    return;
}


var storageItem = socket.character.Storage[input.InventoryIndex];

if (storageItem && storageItem.ID==input.ItemID && storageItem.Amount>0)
{
    if (input.Amount===0)  input.Amount=1;
    if (input.Amount>storageItem.Amount) input.Amount = storageItem.Amount;

    var invItem = socket.character.Storage[input.RowPickup];

    var Amount = input.Amount;
    if (invItem)
    {
        // Check if stackable etc
        if (invItem.ID == storageItem.ID && invItem.Amount>0)
        {
            Amount+=invItem.Amount;
        }
    }

    var ii = infos.Item[storageItem.ID];
    if (ii===null) {
        console.log('Invalid Item');
        return;
    }

    if (socket.character.checkItemSlotFree(input.ColumnDrop,input.RowDrop,ii.getSlotCount(),storageItem.ID)===false)
    {
        console.log('Would overlap/slotnotfree');
        return;
    }
    
    invItem = {ID: storageItem.ID, Amount: Amount, Enchant: storageItem.Enchant, Column: input.ColumnDrop, Row: input.RowDrop };
    
    storageItem.Amount-=input.Amount;
    if (storageItem.Amount===0) storageItem = null;

    socket.character.Storage[input.InventoryIndex] = storageItem;
    socket.character.Inventory[input.RowPickup] = invItem;

    socket.character.markModified('Storage');
}
else
{
    console.log('Item not found in storage');
    return;
}


                        socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: 1,
                                Unknown4: 2,
                                Unknown5: 1,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            })));

};

ItemActions[17] = function BuyItem (socket, input){
    // case 17: //Buy Item
                            console.log("Buy Item");

                            // Check if near correct buying npc
                            // Check that NPC has item


                            var ii = infos.Item[input.ItemID];

                            if (input.Amount===0) input.Amount=1;
                            if (input.Amount>99) input.Amount=99;

                            console.log('Wants to buy '+ii.Name+' it costs '+ii.PurchasePrice+' Wants amount: '+input.Amount+' Which would cost '+ii.PurchasePrice*input.Amount+' silver on hand: '+socket.character.Silver);

                            if (socket.character.Silver<ii.PurchasePrice*input.Amount)
                            {
                                console.log('Too poor to buy');
                                return;
                            }

                            console.log('Putting it into the inventory index '+input.RowPickup);

                            var item = socket.character.Inventory[input.RowPickup];

                            var ExistingAmount=0;
                            if (item!==null && item.ID!==0)
                            {
                                if (item.ID===input.ItemID)
                                {
                                    ExistingAmount=item.Amount;
                                }
                                else
                                {
                                    console.log('Already item in this spot');
                                    return;
                                }
                            }

                            // Check that the index is within inventory bounds
                            console.log('ItemType: '+ii.ItemType);
                            if (socket.character.checkItemSlotFree(input.ColumnMove,input.RowMove,ii.getSlotCount(), item!==null ? item.ID : 0)===false)
                            {
                                console.log('Item overlap detected');
                                return;
                            }

                            var Amount = input.Amount+ExistingAmount;
                            // Check if Amount is correct eg stackable amount for that item type
                            if (ii.getSlotCount()===1)
                            {
                                if (Amount>99)
                                {
                                    console.log('Too much stacked');
                                    return;
                                }
                            }
                            else
                            {
                                if (Amount>1)
                                {
                                    console.log('Too much stacked');
                                    return;
                                }
                            }

                            // Set the item
                            item = { ID: input.ItemID, Column: input.ColumnMove, Row: input.RowMove, Enchant: 0, Combine: 0, Amount: Amount };
                            socket.character.Inventory[input.RowPickup] = item;

                            socket.character.Silver-=ii.PurchasePrice*input.Amount;

                            socket.write(new Buffer(
                                packets.ItemActionReplyPacket.pack({
                                    PacketID: 0x2B,
                                    ActionType: input.ActionType,
                                    ItemUniqueID: input.ItemUniqueID,
                                    ItemUniqueID2: input.ItemUniqueID2,
                                    ItemID: input.ItemID,
                                    Unknown3: input.Unknown3,
                                    Unknown4: input.Unknown4,
                                    Unknown5: input.Unknown5,
                                    Amount: Amount,
                                    InventoryIndex: input.InventoryIndex,
                                    RowDrop: input.RowDrop,
                                    ColumnPickup: input.ColumnPickup,
                                    RowPickup: input.RowPickup,
                                    ColumnMove: input.ColumnMove,
                                    RowMove: input.RowMove,
                                    Enchant: input.Enchant
                                }
                                )
                                )
                            );


};

ItemActions[20] = function InventoryMoveItem(socket, input) {
    /*
    var RP;
    var Item = infos.Item[input.ItemID];
    if(!Item) { 
        return socket.sendInfoMessage('Invalid Item ID');
    }
    if(Item.ItemType == 2) {    
        socket.sendInfoMessage('Item type = 2');
    } else {
        RP = input.RowPickup;
        if(ItemInfo.ItemType != 23) {
            socket.character.Inventory[RP].ID = input.ItemID;
            socket.character.Inventory[input.RowPickup].Column = input.ColumnMove;
            socket.character.Inventory[input.RowPickup].Row = input.RowMove;
            socket.character.Inventory[input.RowPickup].Amount = input.Amount;
            socket.character.Inventory[input.RowPickup].Enchant = socket.character.Inventory[input.InventoryIndex].Enchant;
            socket.character.Inventory[input.InventoryIndex].ID = 0;
            socket.character.Inventory[input.InventoryIndex].Column = 0;
            socket.character.Inventory[input.InventoryIndex].Row = 0;
            socket.character.Inventory[input.InventoryIndex].Amount = 0;
            socket.character.Inventory[input.InventoryIndex].Enchant = 0;
            socket.sendInfoMessage('Moved ItemID '+input.ItemID+' to '+input.RowMove+','+input.ColumnMove+'');
        }
        socket.character.markModified('Inventory');
        socket.character.save();
        //
        socket.write(new Buffer(
        packets.ItemActionReplyPacket.pack({
        PacketID: 0x2B,
        ActionType: input.ActionType,
        ItemUniqueID: input.ItemUniqueID,
        ItemUniqueID2: input.ItemUniqueID2,
        ItemID: input.ItemID,
        Unknown3: input.Unknown3,
        Unknown4: input.Unknown4,
        Unknown5: input.Unknown5,
        Amount: input.Amount,
        InventoryIndex: input.InventoryIndex,
        RowDrop: input.RowDrop,
        ColumnPickup: input.ColumnPickup,
        RowPickup: input.RowPickup,
        ColumnMove: input.ColumnMove,
        RowMove: input.RowMove,
        Enchant: input.Enchant                      
        })));
    }
    */
	if (input.InventoryIndex > 64) {
			console.log('Debug: Invalid Inventory Index');
		ItemActionReplyStatus(socket, input.ActionType);
			return;
	}

	console.log('CLIENTSIDE:' + socket.character.Name + ' Want put item('+input.ItemID+') in slot ('+input.ColumnMove+','+input.RowMove+') Index ('+input.InventoryIndex+')');

	var WhereMove = null, id = 0;

	for (var i = 0; i < socket.character.Inventory.length; i++) {
		var inv = socket.character.Inventory[i];

		if(inv && inv.Row == input.RowMove && inv.Column == input.ColumnMove) {
			WhereMove = socket.character.Inventory[i];
			id = i;
			break;
		}
	}

	var itemInfo = infos.Item[input.ItemID];
	var slotCount = itemInfo.getSlotCount();

	var WhatMove = socket.character.Inventory[input.InventoryIndex];
	if(WhatMove) {
		if (WhereMove === null) WhereMove = { ID: 0, Amount: 0, Row: 0, Column: 0, Enchant: 0 };
		if (WhereMove.ID !== null && WhereMove.Amount !== null) {
			if(WhereMove.ID!==0 && WhereMove.Amount!==0 ) {
				console.log('Inventory item already set in this position ('+WhereMove.ID+":"+WhereMove.Amount+")");
				return;
			}
		}
		if (socket.character.checkItemSlotFree(input.ColumnMove, input.RowMove, slotCount) === false) {
			console.log('Item overlap detected');
			ItemActionReplyStatus(socket, input.ActionType);
			return;
		}

		if(WhatMove.Amount > 1) WhatMove.Amount -= input.Amount;

		WhereMove.ID = input.ItemID;
		WhereMove.Amount = input.Amount;
		WhereMove.Enchant = input.Enchant;
		WhereMove.Column = input.ColumnMove;
		WhereMove.Row = input.RowMove;
		socket.character.Inventory[id] = WhereMove;


		if((input.Amount === 0 && WhatMove.Amount === 1) || WhatMove.Amount <= 0) delete socket.character.Inventory[input.InventoryIndex];


		socket.character.markModified('Inventory');
		socket.character.save();

		socket.write(new Buffer(
			packets.ItemActionReplyPacket.pack({
			PacketID: 0x2B,
			ActionType: input.ActionType,
			ItemUniqueID: input.ItemUniqueID,
			ItemUniqueID2: input.ItemUniqueID2,
			ItemID: input.ItemID,
			Unknown3: input.Unknown3,
			Unknown4: input.Unknown4,
			Unknown5: input.Unknown5,
			Amount: input.Amount,
			InventoryIndex: input.InventoryIndex,
			RowDrop: input.RowDrop,
			ColumnPickup: input.ColumnPickup,
			RowPickup: input.RowPickup,
			ColumnMove: input.ColumnMove,
			RowMove: input.RowMove,
			Enchant: input.Enchant
		})));
	}
};
/*
function getItemFromInventory(character, column, row) {
    for (var i = 0; i < character.Inventory.length; i++) {
        var inv = character.Inventory[i];
        //if (inv) console.log(inv);
        if (inv && inv.Row == row && inv.Column == column && inv.ID > 0) return {index: i, item: inv};
    }
    return null;
}
*/
// 
ItemActions[21] = function StoreSilver (socket, input){
    // case 21: // Store Silver
                                // at Guild Director
                                console.log('Storage Guild Director');
                                if (input.ItemID===0)
                                {
                                    console.log("Wants to store silver");
                                    if (socket.character.Silver>=input.Amount)
                                    {
                                        socket.StorageSilver+=input.Amount;
                                        socket.character.Silver-=input.Amount;

                                    }
                                }
                                else
                                {
                                    console.log('Wants to store item');
                                    // RowPickup contains index to put it in the storage at
                                    if (input.RowPickup>27)
                                    {
                                        console.log('Invalid Storage Index');
                                        return;
                                    }

                                    if (input.InventoryIndex>=64)
                                    {
                                        console.log('Invalid inventory index');
                                        return;
                                    }

                                    var invItem = socket.character.Inventory[input.InventoryIndex];

                                    if (invItem===null)
                                    {
                                        console.log('Invalid Inventory Item');
                                        return;
                                    }

                                    if (invItem.ID!==input.ItemID)
                                    {
                                        console.log('Inventory ItemID and ItemID do not match');
                                        return;
                                    } 

                                    if (input.Amount===0) input.Amount=1;
                                    if (input.Amount>99) input.Amount=99;
                                    if (input.Amount>invItem.Amount) input.Amount = invItem.Amount;

                                    var storageItem = socket.character.Storage[input.RowPickup];
                                    var Amount=input.Amount;
                                    if (storageItem)
                                    {
                                        if (storageItem.ID!==0 && storageItem.Amount!==0)
                                        {
                                            if (storageItem.ID==invItem.ID)
                                    {
                                        // Compare other attributes and merge if possible
                                        if (storageItem.Enchant===invItem.Enchant)
                                        {
                                            Amount+=storageItem.Amount;
                                        }
                                        else
                                        {
                                            console.log('Cantt stack');
                                            return;
                                        }
                                    }
                                    if (storageItem.ID==invItem.ID)
                                        {
                                            // Compare other attributes and merge if possible
                                            if (storageItem.Enchant==invItem.Enchant)
                                            {
                                                Amount+=storageItem.Amount;
                                            }
                                            else
                                            {
                                                console.log('Cantt stack');
                                                return;
                                            }
                                        }
                                        else
                                        {
                                            console.log('Already item in that slot');
                                            return;
                                        }
                                        }
                                    }

                                    storageItem = { ID: input.ID, Amount: Amount, Enchant: invItem.Enchant };                                   

                                    socket.character.markModified('Storage');

                                    socket.character.Storage[input.RowPickup] = storageItem;
                                    invItem.Amount -= input.Amount;

                                    if (invItem.Amount===0)
                                    {
                                        invItem=null;
                                    }

                                    socket.character.Inventory[input.InventoryIndex] = invItem;
                                }


                                socket.write(new Buffer(
                                    packets.ItemActionReplyPacket.pack({
                                        PacketID: 0x2B,
                                        ActionType: input.ActionType,
                                        ItemUniqueID: input.ItemUniqueID,
                                        ItemUniqueID2: input.ItemUniqueID2,
                                        ItemID: input.ItemID,
                                        Unknown3: input.Unknown3,
                                        Unknown4: input.Unknown4,
                                        Unknown5: input.Unknown5,
                                        Amount: input.Amount,
                                        InventoryIndex: input.InventoryIndex,
                                        RowDrop: input.RowDrop,
                                        ColumnPickup: input.ColumnPickup,
                                        RowPickup: input.RowPickup,
                                        ColumnMove: input.ColumnMove,
                                        RowMove: input.RowMove,
                                        Enchant: input.Enchant
                                    })));
};

ItemActions[22] = function GateMasterBankSIlver (socket, input){
    console.log("Wants to bank silver");
                                var CommissionCost = 5;
                                if (socket.character.Silver>=input.Amount+CommissionCost)
                                {
                                    socket.character.BankSilver+=input.Amount;
                                    socket.character.Silver-=input.Amount+CommissionCost;

                                    socket.write(new Buffer(
                                        packets.ItemActionReplyPacket.pack({
                                            PacketID: 0x2B,
                                            ActionType: input.ActionType,
                                            ItemUniqueID: input.ItemUniqueID,
                                            ItemUniqueID2: input.ItemUniqueID2,
                                            ItemID: input.ItemID,
                                            Unknown3: input.Unknown3,
                                            Unknown4: input.Unknown4,
                                            Unknown5: input.Unknown5,
                                            //Amount: input.Amount,
                                            InventoryIndex: input.InventoryIndex,
                                            RowDrop: input.RowDrop,
                                            ColumnPickup: input.ColumnPickup,
                                            RowPickup: input.RowPickup,
                                            ColumnMove: input.ColumnMove,
                                            RowMove: input.RowMove,
                                            Enchant: input.Enchant
                                        })));
                                }
};

ItemActions[27] = function SkillToBar (socket, input){
    // case 27:
                        socket.sendInfoMessage('Skill Bind is not finished being coded.');
                        console.log('Skill Bind');
                        if(socket.character.SkillList[input.InventoryIndex].Level < input.Amount  )
                        {
                            socket.character.SkillList[input.InventoryIndex] = null;
                            console.log("FAIL");
                        }

                        else 
                        {
                            
                                var status = socket.giveSkillInSkillBar(input, input);
                                    console.log("PASS");
                                    if(status == 15)
                                        {
                                            socket.write(new Buffer(
                            packets.ItemActionReplyPacket.pack({
                                PacketID: 0x2B,
                                ActionType: input.ActionType,
                                ItemUniqueID: input.ItemUniqueID,
                                ItemUniqueID2: input.ItemUniqueID2,
                                ItemID: input.ItemID,
                                Unknown3: input.Unknown3,
                                Unknown4: input.Unknown4,
                                Unknown5: input.Unknown5,
                                Amount: input.Amount,
                                InventoryIndex: input.InventoryIndex,
                                RowDrop: input.RowDrop,
                                ColumnPickup: input.ColumnPickup,
                                RowPickup: input.RowPickup,
                                ColumnMove: input.ColumnMove,
                                RowMove: input.RowMove,
                                Enchant: input.Enchant
                            }
                            )
                            )
                                            );
                                        }
                                        else
                                        {
                                            return;
                                        }

                        }
};

ItemActions[31] = function LearnSkills (socket, input){
    // case 31:
                        socket.sendInfoMessage('Learning skills is not finished being coded.');
                        console.log('Learn Skill '+input.ItemID);

                        // Check if skill exists
                        // var si = SkillInfos.getByID(input.ItemID];
                        // if (si==null)
                        // {
                        //  console.log('Skill does not exist');
                        //  return;
                        // }
                        // Check correct clan/levelrequirements
                        // Check if near npc
                        // Check if has skill point
                        if (socket.character.SkillPoints>0)
                        {   
                            // Check not already know skill
                            //if (socket.character.Skills[input.ItemID])
                            socket.character.Skills[input.ItemID] = { SkillID: input.ItemID, Level: 1 };
                        }
                        else
                        {
                            console.log('No skill points');
                            return;
                        }

                        socket.write(new Buffer(
                                packets.ItemActionReplyPacket.pack({
                                    PacketID: 0x2B,
                                    ActionType: input.ActionType,
                                    ItemUniqueID: input.ItemUniqueID,
                                    ItemUniqueID2: input.ItemUniqueID2,
                                    ItemID: input.ItemID,
                                    Unknown3: input.Unknown3,
                                    Unknown4: input.Unknown4,
                                    Unknown5: input.Unknown5,
                                    Amount: input.Amount,
                                    InventoryIndex: input.InventoryIndex,
                                    RowDrop: input.RowDrop,
                                    ColumnPickup: input.ColumnPickup,
                                    RowPickup: input.RowPickup,
                                    ColumnMove: input.ColumnMove,
                                    RowMove: input.RowMove,
                                    Enchant: input.Enchant
                                }
                                )
                                )
                            );
};

WorldPC.ItemActionPacket = restruct.
    int32lu('ActionType').
    int32lu('ItemUniqueID').
    int32lu('ItemUniqueID2').
    int32lu('ItemID').
    int32lu('Unknown3').
    int32lu('Unknown4').
    int32lu('Unknown5').
    int32lu('Amount').
    int32lu('InventoryIndex').
    int32lu('RowDrop').
    int32lu('ColumnPickup').
    int32lu('RowPickup').
    int32lu('ColumnMove').
    int32lu('RowMove').
    int32lu('Enchant').
    int32lu('Unknown10').
    int32lu('Unknown11');

WorldPC.Set(0x14, {
    Restruct: WorldPC.ItemActionPacket,

    function: function handleItemActionPacket(socket, input) {
        if (!socket.authenticated) return;
        socket.sendInfoMessage('Handling Item Action: ' + input.ActionType);
        
        if (ItemActions[input.ActionType]) {
            ItemActions[input.ActionType](socket, input);
        } else {
            console.log('Unhandled Item Action: ' + input.ActionType);
            socket.sendInfoMessage('The inventory action '+input.ActionType+' has not been coded into the server. Please report this to a developer and tell them what you were doing at the time.');

                            socket.write(new Buffer(
                                packets.ItemActionReplyPacket.pack({
                                    PacketID: 0x2B,
                                    ActionType: input.ActionType,
                                    ItemUniqueID: input.ItemUniqueID,
                                    ItemUniqueID2: input.ItemUniqueID2,
                                    ItemID: input.ItemID,
                                    Unknown3: input.Unknown3,
                                    Unknown4: input.Unknown4,
                                    Unknown5: input.Unknown5,
                                    Amount: input.Amount,
                                    InventoryIndex: input.InventoryIndex,
                                    RowDrop: input.RowDrop,
                                    ColumnPickup: input.ColumnPickup,
                                    RowPickup: input.RowPickup,
                                    ColumnMove: input.ColumnMove,
                                    RowMove: input.RowMove,
                                    Enchant: input.Enchant
                                }
                                )
                                )
                            );
        }
    }
});

WorldPC.Set(0x23, {
	Restruct: WorldPC.ItemActionPacket,

	function: function handleItemActionPacket(socket, input) {
		console.log(input);
	}
});

// TODO: Make a way for clients to do a gm command to attach to reload event for a file.
//       They should get a message in game when the file is reloaded.
//       and for any errors.
//       Hard part I think is removing the listener when the client is disconnected
// var adminNames = ['MegaByte','iJumbo','Beam'];
// for (var i=0;i<adminNames.length;i++) {
//     var p = world.findCharacterSocket(adminNames[i]);
//     if (p) {
//         p.sendInfoMessage('Reloaded file '+new Date());
//     }
// }
