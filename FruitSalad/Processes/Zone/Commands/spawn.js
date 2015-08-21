GMCommands.AddCommand(new Command('spawn',60,function spawn_monster(string, client){
  var monster_id = parseInt(string);
  db.Monster.findById(monster_id, function(err, info){
    if(err){
      return;
    }

    if(!info){
      return;
    }

    var mObj = new MonsterObj(monster_id);
    var nObj = new QuadTree.QuadTreeNode({
      object: mObj,
      update:function() {
  			this.x = this.translateX(this.object.Location.X);
  			this.y = this.translateY(this.object.Location.Z);
  		},
      type: 'monster'
    });

    var node = Zone.QuadTree.addNode(nObj);
    mObj.setInfos(info);
    mObj.setNode(node);
    mObj.spawn(client.character.state.Location);

    Zone.Monsters.push(mObj);
  });
}));

GMCommands.AddCommand(new Command('removeMonsters',60,function remove_monsters(string, client){
  for(var i=0; i<Zone.Monsters.length; i++){
    Zone.Monsters[i].despawn();
  }

  Zone.Monsters.length = 0;
}));
