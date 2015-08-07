vms('Guild', [], function(){
  var Mixed = db.mongoose.Schema.Types.Mixed;
	var guildSchema = mongoose.Schema({
		name: {type: String, unique: true, index: true},
    leader: String,
    members: Object,
    level: Number,
    reputation: Number,
    nextMemberIndex: { type: Number, default: 0 }
	});

	guildSchema.index({name: 1});

  guildSchema.methods.getMembersList = function(){
    var unsortedList = [];
    for(var name in this.members) unsortedList.push([this.members[name].index, name]);
    unsortedList.sort(function(a, b){ return a[0] - b[0]; });
    var list = [];
    for(var i=0; i<unsortedList.length; i++) list.push(unsortedList[i][1]);
    return list;
  };

  guildSchema.methods.getPrivilegesList = function(){
    var unsortedList = [];
    for(var name in this.members) unsortedList.push([this.members[name].index,
      this.members[name].privileges === 2 ? 0 : this.members[name].privileges === 0 ? 2 : 1]);
    unsortedList.sort(function(a, b){ return a[0] - b[0]; });
    var list = [];
    for(var i=0; i<unsortedList.length; i++) list.push(unsortedList[i][1]);
    return list;
  };

  guildSchema.methods.getUpgradeCost = function(){
    switch(this.level){
      case 1:
      return {
        Silver: 10000000,
        ContributionPoints: 100
      };
      break;

      case 2:
      return {
        Silver: 20000000,
        ContributionPoints: 500
      };
      break;

      case 3:
      return {
        Silver: 30000000,
        ContributionPoints: 1000
      };
      break;

      case 4:
      return {
        Silver: 50000000,
        ContributionPoints: 2000
      };
      break;
    }
  };

  guildSchema.methods.invalidate = function(state, callback){
    var self = this;
    db.Guild.findByName(this.name, function(err, guild){
      if(err){
        return;
      }

      if(!guild){
        return;
      }

      state.Guild = guild;
      if(typeof callback === 'function'){
        callback(guild);
      }
    });
  };

	delete mongoose.models['guild'];
	var Guild = db.mongoose.model('guild', guildSchema);
	db.Guild = Guild;

  db.Guild.findByName = function(name, callback){
    db.Guild.findOne({
			name: name
		}, callback);
  };

  db.Guild.findByLeader = function(name, callback){
    db.Guild.findOne({
			leader: name
		}, callback);
  };
});
