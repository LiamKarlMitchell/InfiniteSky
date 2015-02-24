WorldPC.Set(0x03, {
    Restruct: WorldPC.ActionPacket,

    function: function ActionHearthBeatHandler(client, input) {
        client.character.RealX = input.Location.X;
        client.character.RealY = input.Location.Y;
        client.character.RealZ = input.Location.Z;

        // console.log(input.Frame);
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
