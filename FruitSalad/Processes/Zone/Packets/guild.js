Zone.recv.createGuild = restruct.
  int8lu('Action').
  string('Name', 13).
  string('GuildName', 13).
  pad(282);

Zone.send.createGuild = restruct.
  int8lu('PacketID').
  int8lu('Result').
  string('GuildName', 13).
  pad(3).
  int32lu('Level').
  int32lu('Reputation').
  string('LeaderName', 13).
  pad(26).
  string('Members', 13, 50).
  int32bs('Privileges', 50).
  pad(455); // Title array & some others

Zone.send.guildUpgrade = function(callback){
  var client = this;
  var guild = this.character.state.Guild;

  client.character.save(function(err){
    if(err){
      return;
    }

    guild.level++;

    guild.save(function(err){
      if(err){
        return;
      }

      var buffer = new Buffer(Zone.send.createGuild.pack({
        PacketID: 0x9D,
        GuildName: client.character.GuildName,
        LeaderName: client.character.state.Guild.leader,
        Level: guild.level,
        Reputation: guild.reputation,
        Members: guild.getMembersList(),
        Privileges: guild.getPrivilegesList(),
        Result: 0
      }));

      client.write(buffer);

      client.write(new Buffer(Zone.send.onGuildToClient.pack({
        PacketID: 0x54,
        Switch: 0xd
      })));

      global.rpc.api.invalidateGuildForClient(guild.getMembersList());
    });
  });
};

ZonePC.Set(0x74, {
  Restruct: Zone.recv.createGuild,
  function: function makeGuild(client, input){
    console.log(input);

    switch(input.Action){
      case 1:
      if(client.character.Level < 50 || client.character.Silver < 5000000) return;
      if(client.character.state.Guild || client.character.GuildName) return;

      db.Guild.findByName(input.GuildName, function(err, guild){
        if(err){
          return;
        }

        if(guild){
          console.log("This guild currently exists");
          return;
        }

        var guild = new db.Guild();
        guild.name = input.GuildName;
        guild.leader = client.character.Name;
        guild.members = {};
        guild.members[client.character.Name] = {
          privileges: 2,
          index: guild.nextMemberIndex++
        };

        guild.level = 1;

        guild.save(function(err){
          if(err){
            return;
          }
          client.character.state.Guild = guild;
          client.character.state.setGuild(guild);


          Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);

          client.character.Silver -= 5000000;
          client.character.GuildName = input.GuildName;
          client.character.GuildAccess = 0;

          client.character.save(function(err){
            if(err){
              return;
            }

            client.write(new Buffer(Zone.send.createGuild.pack({
          		PacketID: 0x9D,
          		GuildName: input.GuildName,
          		Result: 0
          	})));
          });
        });
      });
      break;

      case 2:
      case 3:
      var guild = client.character.state.Guild;

      if(!guild){
        return;
      }

      var buffer = new Buffer(Zone.send.createGuild.pack({
        PacketID: 0x9D,
        GuildName: client.character.GuildName,
        LeaderName: client.character.state.Guild.leader,
        Level: guild.level,
        Reputation: guild.reputation,
        Members: guild.getMembersList(),
        Privileges: guild.getPrivilegesList(),
        Result: 0,
        unk: 4
      }));

      client.write(buffer);
      break;

      case 4: // Character wants to leave the guild
      var guild = client.character.state.Guild;
      if(!guild){
        return;
      }

      if(guild.leader === client.character.Name){
        return;
      }

      delete guild.members[client.character.Name];

      guild.markModified('members');
      guild.save(function(err){
        if(err){
          return;
        }

        client.character.state.removeGuild();
        client.character.GuildName = null;
        client.character.GuildAccess = null;
        Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);

        client.character.save(function(err){
          if(err){
            return;
          }

          client.write(new Buffer(Zone.send.createGuild.pack({
        		PacketID: 0x9D,
        		GuildName: input.GuildName,
        		Result: 0
        	})));

          global.rpc.api.invalidateGuildForClient(guild.getMembersList());
        });
      });
      break;

      case 6: // Leader disbands the guild
      var guild = client.character.state.Guild;
      if(!guild){
        return;
      }

      if(guild.leader !== client.character.Name){
        return;
      }

      if(Object.keys(guild.members).length !== 1){
        return;
      }

      db.Guild.findOneAndRemove({
        name: guild.name
      }, function(err){
        if(err){
          return;
        }

        client.character.state.removeGuild();
        client.character.GuildName = null;
        client.character.GuildAccess = 2;
        client.character.save(function(err){
          if(err){
            return;
          }

          client.write(new Buffer(Zone.send.createGuild.pack({
            PacketID: 0x9D,
            GuildName: input.GuildName,
            Result: 0
          })));
          Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);
        });
      });
      break;


      case 7:
      var guild = client.character.state.Guild;
      if(!guild){
        return;
      }

      if(guild.leader !== client.character.Name){
        return;
      }

      if(guild.level === 5){
        client.write(new Buffer(Zone.send.createGuild.pack({
      		PacketID: 0x9D,
      		GuildName: input.GuildName,
      		Result: 1
      	})));
        return;
      }

      var upgradeCost = guild.getUpgradeCost();

      if(upgradeCost.Silver && upgradeCost.Silver > client.character.Silver){
        return;
      }

      if(upgradeCost.ContributionPoints > client.character.ContributionPoints){
        return;
      }

      client.character.Silver -= upgradeCost.Silver;
      Zone.send.guildUpgrade.call(client);
      break;

      case 8: // Kicking from guild
      var guild = client.character.state.Guild;

      if(guild.leader !== client.character.Name){
        return;
      }

      if(!guild.members[input.Name]){
        return;
      }

      db.Character.update({
        Name: input.Name
      }, {GuildName: null});

      delete guild.members[input.Name];

      guild.markModified('members');
      guild.save(function(err){
        if(err){
          return;
        }
        global.rpc.api.expelFromGuild(input.Name, new Buffer(Zone.send.onGuildToClient.pack({
    			PacketID: 0x54,
    			Switch: 0x1D,
    			InvitedBy: input.Name,
    			GuildName: client.character.GuildName
    		})));

        client.write(new Buffer(Zone.send.createGuild.pack({
      		PacketID: 0x9D,
      		GuildName: input.GuildName,
      		Result: 0
      	})));

        global.rpc.api.invalidateGuildForClient(guild.getMembersList());
      });
      break;

      // case 9:
      // client.write(new Buffer(Zone.send.createGuild.pack({
    	// 	PacketID: 0x9D,
    	// 	GuildName: input.GuildName,
    	// 	Result: 0
    	// })));
      // break;


      default:
      client.write(new Buffer(Zone.send.createGuild.pack({
    		PacketID: 0x9D,
    		GuildName: input.GuildName,
    		Result: 1
    	})));
      break;
    }
  }
});

Zone.recv.ifPlayerExists = restruct.
  string('Name', 13).
  int32lu('Unk').
  int32lu('Unk2');

Zone.send.ifPlayerExists = restruct.
  int8lu('PacketID').
  string('Name', 13).
  int8lu('Result').
  int32lu('MapID').
  pad(12);

ZonePC.Set(0x8F, {
	Restruct: Zone.recv.ifPlayerExists,
	function: function(client, input){
    rpc.api.getCharacterZone(input.Name, client.hash, Zone.id, (function(name, mapID){
  		var buffer = new Buffer(Zone.send.ifPlayerExists.pack({
  			PacketID: 0xBE,
  			Name: name,
  			Result: 0,
  			MapID: mapID
  		}));

  		this.write(buffer);
    }));
	}
});

ZonePC.Set(0x3F, {
  Restruct: Zone.recv.ifPlayerExists,
  function: function(client, input){
    if(!client.character.state.Guild){
      return;
    }

    var guild = client.character.state.Guild;
    var maxMembers = guild.level * 10;
    if(maxMembers < Object.keys(guild.members).length){
      return;
    }
    var invited = Zone.clientNameTable[input.Name];
    if(!invited){
      return;
    }
    if(invited.character.state.Guild){
      return;
    }
    if(invited.character.Clan !== client.character.Clan){
      return;
    }

    if(invited.character.Level < 10){
      return;
    }

    if(!client.character.state.guildInvites) client.character.state.guildInvites = [];
    if(client.character.state.guildInvites.indexOf(invited.character.Name) === -1)
      client.character.state.guildInvites.push(invited.character.Name);

    invited.write(new Buffer(restruct.
  		int8lu('PacketID').
  		string('InvitedBy', 13).pack({
			PacketID: 0x58,
			InvitedBy: client.character.GuildName
		})));
  }
});

Zone.send.onGuildInvite = restruct.
  int8lu('PacketID').
  string('Name', 13).
  int8lu('Result');

Zone.send.onGuildToClient = restruct.
  int8lu('PacketID').
  int32lu('Switch').
  string('InvitedBy', 13).
  string('GuildName', 13).
  pad(74);

ZonePC.Set(0x41, {
  Restruct: restruct.string('GuildName', 13).int8lu('Result').pad(8),
  function: function(client, input){
    console.log(input);
    // TODO: Make an invited table? Avoiding adding yourself to guild without leader permission.
    if(input.Result) return;

    if(client.character.Level < 10){
      return;
    }

    db.Guild.findByName(input.GuildName, function(err, guild){
      if(err){
        return;
      }

      if(!guild){
        return;
      }

      var invitedBy = Zone.clientNameTable[guild.leader];
      if(!invitedBy){
        return;
      }

      if(invitedBy.character.state.guildInvites.indexOf(client.character.Name) === -1){
        return;
      }

      invitedBy.character.state.guildInvites.splice(
        invitedBy.character.state.guildInvites.indexOf(client.character.Name), 1);

      var maxMembers = guild.level * 10;

      if(maxMembers < Object.keys(guild.members).length){
        return;
      }

      guild.members[client.character.Name] = {
        privileges: 0,
        index: guild.nextMemberIndex++
      };

      guild.markModified('members');
      guild.save(function(err){
        if(err){
          return;
        }

        client.character.state.LeaderFlag = 1;
        client.character.state.LeaderSubFlag = 3;
        client.character.GuildName = invitedBy.character.GuildName;
        client.character.state.setGuild(guild);

        client.character.save(function(err){
          if(err){
            return;
          }

          Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.network.viewable_action_distance);

          client.write(new Buffer(Zone.send.onGuildToClient.pack({
      			PacketID: 0x54,
      			Switch: 10,
      			InvitedBy: invitedBy.character.Name,
      			GuildName: invitedBy.character.GuildName
      		})));

          invitedBy.write(new Buffer(Zone.send.onGuildInvite.pack({
      			PacketID: 0x5A,
      			Name: client.character.Name,
      			Result: 0
      		})));

          global.rpc.api.invalidateGuildForClient(guild.getMembersList());
        });
      });
    });
  }
});

Zone.recv.guildChat = restruct.
  pad(30).
  string('Message', 51).
  pad(8);

Zone.send.guildChat = restruct.
  int8lu('PacketID').
  string('Name', 13).
  string('GuildName', 13).
  pad(4).
  string('Message', 51);

ZonePC.Set(0x0B, {
  Restruct: Zone.recv.guildChat,
  function: function(client, input){
    if(!client.character.state.Guild){
      return;
    }

    var list = client.character.state.Guild.getMembersList();
    list.splice(list.indexOf(client.character.Name), 1);

    var buffer = new Buffer(Zone.send.guildChat.pack({
      PacketID: 0x22,
      Name: client.character.Name,
      GuildName: client.character.GuildName,
      Message: input.Message
    }));

    global.rpc.api.sendToAll(list, buffer);
    client.write(buffer);
  }
});

Zone.send.guildFlag = restruct.
  int8lu('PacketID').
  int32lu('unk').
  int32lu('unk2').
  int32lu('unk3').
  int32lu('unk4');

// var test = restruct.
//   int8lu('PacketID').
//   int32lu('unk').
//   int32lu('unk2').
//   int32lu('unk3');

ZonePC.Set(0x5E, {
  Restruct: restruct.
  int32lu('unk').
  int32lu('unk2').
  int32lu('unk3').
  int32lu('unk4'),
  function: function(client, input){
    console.log(input);
    client.write(new Buffer(Zone.send.guildFlag.pack({
      PacketID: 0x7C,
      unk: client.character._id,
      unk2: client.node.id,
      unk3: input.unk,
      unk4: input.unk2
    })));

    // 6D: A packet to control decoration state
    // client.write(new Buffer(test.pack({
    //   PacketID: 0x6D,
    //   unk: client.character._id,
    //   unk2: client.node.id,
    //   unk3: 12
    // })));
  }
});
