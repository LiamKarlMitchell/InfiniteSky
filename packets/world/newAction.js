WorldPC.Set(0x03, {
    Restruct: WorldPC.ActionPacket,

    function: function ActionHearthBeatHandler(client, input) {
        client.character.RealX = input.Location.X;
        client.character.RealY = input.Location.Y;
        client.character.RealZ = input.Location.Z;

        // TODO: Simulate serverside movement and compare.
    }
});

WorldPC.Set(0x04, {
    Restruct: WorldPC.ActionPacket,

    function: function HandleDuringAction(client, input) {
        client.character.state.Frame = input.Frame;
        client.character.state.Stance = input.Stance;
        client.character.state.Skill = input.Skill;
        client.character.state.FacingDirection = input.FacingDirection;
        client.character.state.Direction = input.Direction;

        client.character.RealX = input.Location.X;
        client.character.RealY = input.Location.Y;
        client.character.RealZ = input.Location.Z;

        client.character.state.Location.X = input.Location.X;
        client.character.state.Location.Y = input.Location.Y;
        client.character.state.Location.Z = input.Location.Z;

        client.Zone.sendToAllArea(client, false, client.character.state.getPacket(), config.viewable_action_distance);
    }
});

WorldPC.Set(0x05, {
    Restruct: WorldPC.ActionPacket,

    function: function ActionHandler(client, input) {
        console.log("Action packet, uses skill: " + input.Skill);
        // console.log(input);

        client.character.state.Frame = input.Frame;
        // client.character.state.OldStance = client.character.state.Stance;
        client.character.state.Stance = input.Stance;
        // client.character.state.OldSkill = client.character.state.Skill;
        client.character.state.Skill = input.Skill;
        client.character.state.FacingDirection = input.FacingDirection;
        client.character.state.Direction = input.Direction;

        client.character.RealX = input.Location.X;
        client.character.RealY = input.Location.Y;
        client.character.RealZ = input.Location.Z;

        client.character.state.Location.X = input.Location.X;
        client.character.state.Location.Y = input.Location.Y;
        client.character.state.Location.Z = input.Location.Z;

        client.character.state.LocationTo.X = input.Location.X;
        client.character.state.LocationTo.Y = input.Location.Y;
        client.character.state.LocationTo.Z = input.Location.Z;

        client.character.state.LocationNew.X = input.LocationNew.X;
        client.character.state.LocationNew.Y = input.LocationNew.Y;
        client.character.state.LocationNew.Z = input.LocationNew.Z;

        // TODO: Refactor TargetObjectIndex and TargetObjectUniqueNumber to be TargetID and TargetNodeID
        client.character.state.TargetObjectIndex = input.TargetID;
        client.character.state.TargetObjectUniqueNumber = input.nodeID;

        if (input.Skill == 5 || input.Skill == 6 || input.Skill == 7) {
          console.log(input);
        }

        var otherNode = null;
        // If the node id of target is not -1 or 0
        if (client.character.state.TargetObjectUniqueNumber != 4294967295 && client.character.state.TargetObjectUniqueNumber != 0) {
            otherNode = client.Zone.QuadTree.getNodeByID(client.character.state.TargetObjectUniqueNumber);
        }

        if (otherNode) {
            // TODO: Use information to implement attacking.
            client.sendInfoMessage('Selected Node ['+client.character.state.TargetObjectUniqueNumber+'] '+otherNode.type);
        }

        switch(input.Skill){
            case 41:
            case 32:
            case 60:
            case 66:
            case 44:
            case 40:
            case 61:
            case 68:
            case 75:
            case 67:
            client.character.state.onSkillStateUpdate = true;
            break;

            default:
            client.Zone.sendToAllArea(client, true, client.character.state.getPacket(), config.viewable_action_distance);
            break;
        }
    }
});
