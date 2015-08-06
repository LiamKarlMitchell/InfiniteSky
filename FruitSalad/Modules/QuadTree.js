var QuadTree = function(obj){
  obj = obj || {};
  this.size = obj.size;
  this.halfSize = obj.size/2;
  this.depth = typeof obj.depth === 'undefined' ? 2 : obj.depth;
  this.topLevel = typeof obj.topLevel !== 'undefined' ? obj.topLevel : true;
  this.hasLeafs = false;
  this.leafs = [];
  this.leafSize = obj.leafSize || 10;

  this.parent = typeof obj.parent !== 'undefined' ? obj.parent : this;

  this.bounds = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };

  if(this.topLevel){
    this.x = 0
    this.y = 0;
    this.left = obj.x;
    this.top = obj.y;
    this.right = obj.x + this.size;
    this.bottom = obj.y - this.size;
    this.width = Math.abs(obj.x) + this.size;
    this.height = Math.abs(obj.y) + this.size;
    this.size = Math.max(this.width, this.height);
    this.halfSize = this.size / 2;
    this.nextNodeID = 0;
  }else{
    this.x = obj.x;
    this.y = obj.y;
  }

  this.bounds.top = this.y;
  this.bounds.left = this.x;
  this.bounds.right = this.x + this.size;
  this.bounds.bottom = this.y + this.size;

  this.nodes = [];
}

QuadTree.prototype.split = function(){
  if(!this.depth){
    console.log("not able to split QuadTree, due to reaching depth limit");
    return;
  }
  var depth = --this.depth;
  var leafSize = this.leafSize * 2;
  this.hasLeafs = true;
  var self = this;

  var obj = {
    x: this.x,
    y: this.y,
    size: this.halfSize,
    depth: depth,
    leafSize: leafSize,
    topLevel: false,
    parent: this
  };
  this.leafs[0] = new QuadTree(obj);

  obj.y = this.y + this.halfSize;
  this.leafs[1] = new QuadTree(obj);

  obj.y = this.y;
  obj.x = this.x + this.halfSize;
  this.leafs[2] = new QuadTree(obj);

  obj.y = this.y + this.halfSize;
  this.leafs[3] = new QuadTree(obj);

  for(var i=0, length=this.nodes.length; i<length; i++){
    var node = this.nodes[i];
    for(var leaf=0; leaf<4; leaf++){
      var l = this.leafs[leaf];
      process.nextTick((function(){
        // console.log(this);
        if(this.leaf.inBounds(this.node)){
          this.leaf.addNode(this.node);
        }
      }).bind({leaf: l, node: node}));
    }
  }

  this.nodes = [];
};

QuadTree.prototype.addNode = function(node){
  if(this.topLevel && node.id === null){
    node.x= this.translateX(node.x);
    node.y = this.translateY(node.y);

    if(!this.inBounds(node)){
      console.log("Out of bounds");
      console.log("Next id:", this.nextNodeID);
      console.log("node:", node)
      console.log("bounds:", this.bounds);
      return;
    }

    node.id = this.nextNodeID++;
    node.topTree = this;
    node.update();
  }

  if(this.hasLeafs){
    for(var l=0; l<4; l++){
      var leaf = this.leafs[l];
      if(leaf.inBounds(node)){
        leaf.addNode(node);
        break;
      }
    }
  }else{
    if(!this.depth){
      this.nodes.push(node);
      node.tree = this;
    }else if(this.nodes.length === this.leafSize && !this.hasLeafs){
      this.split();
      this.addNode(node);
    }else{
      this.nodes.push(node);
      node.tree = this;
    }
  }

  return node;
};

QuadTree.prototype.inBounds = function(node){
  return node.x >= this.bounds.left && node.x <= this.bounds.right && node.y >= this.bounds.top && node.y <= this.bounds.bottom;
};

QuadTree.prototype.remove = function(node){
  this.nodes.splice(this.nodes.indexOf(node), 1);
  if(this.parent && this.parent.hasLeafs){
    var totalNodes = 0;
    for(var i=0; i<4; i++){
      totalNodes += this.parent.leafs[i].nodes.length;
    }

    if(totalNodes < this.parent.leafSize){
      this.parent.nodes = []; // This might be unecessary
      for(var i=0; i<4; i++) this.parent.nodes = this.parent.nodes.concat(this.parent.leafs[i].nodes);
      this.parent.hasLeafs = false;
      this.parent.leafs = [];
    }
  }
};

QuadTree.prototype.query = function(query){
  // TODO: Narrow down the finding places.
  // TODO: Throw distance out in results.
  // TODO: Sorting distance as an option maybe?

  var results = [];
  if(!query){
    if(this.hasLeafs){
      for(var i=0; i<4; i++){
        var leaf = this.leafs[i];
        results = results.concat(leaf.query(query));
      }
    }else{
      return this.nodes;
    }

    return results;
  }

  if(query.CVec3 && this.topLevel){
    query.x = this.translateX(query.CVec3.X);
    query.y = this.translateY(query.CVec3.Z);
  }

  var queryType = typeof query.type;
  var isQueryType = true;

  if(queryType === 'undefined'){
    isQueryType = false;
  }

  if(queryType === 'string'){
    query.type = [query.type];
  }

  if(this.hasLeafs){
    for(var i=0; i<4; i++){
      var leaf = this.leafs[i];
      results = results.concat(leaf.query(query));
    }
  }else{
    for(var i=0; i<this.nodes.length; i++){
      var node = this.nodes[i];
      var dist = this.getDistance(node.x, node.y, query.x, query.y);
      if(!isQueryType && (!query.radius || dist <= query.radius)){
        results.push(node);
        continue;
      }
      if(query.type.indexOf(node.type) > -1 && (!query.radius || dist <= query.radius)) results.push(node);
    }
  }

  return results;
};

QuadTree.prototype.getDistance = function(x, y, x0, y0){
  return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

QuadTree.prototype.translateX = function(val){
  return val < 0 ? Math.abs(this.left) + val : Math.abs(this.left) + val;
};

QuadTree.prototype.translateY = function(val){
  return val < 0 ? Math.abs(this.top) - val : Math.abs(this.top) - val;
};

function QuadTreeNode(obj){
  this.object = obj.object;
  this.updateFunction = obj.update;
  this.type = obj.type;
  this.x = obj.x || null;
  this.y = obj.y || null;
  this.id = null;
  this.topTree = obj.tree;
  this.tree = null;
}

QuadTreeNode.prototype.update = function(){
  if(typeof this.updateFunction === 'function'){
    this.updateFunction.call(this);
    if(this.tree && !this.tree.inBounds(this)){
      this.tree.remove(this);
      this.topTree.addNode(this);
    }
  }
};

QuadTreeNode.prototype.translateX = function(val){
  return val < 0 ? Math.abs(this.topTree.left) + val : Math.abs(this.topTree.left) + val;
};

QuadTreeNode.prototype.translateY = function(val){
  return val < 0 ? Math.abs(this.topTree.top) - val : Math.abs(this.topTree.top) - val;
};

QuadTree.QuadTreeNode = QuadTreeNode;

module.exports = QuadTree;



// // TODO: onEnter onLeave sensors?
// // Size is considered Radius and origin point xy should be at center.
// // An implementation of a range based square QuadTree.
// // Which keeps leafs around if they have any nodes in them.
// // Child leafs are only removed when empty.
// // Querys check position and size nodes to see if they are inside the query radius.
// // See my code pen here for more detail: http://codepen.io/LiamKarlMitchell/pen/raxRKq
// // The old one.
// //http://codepen.io/LiamKarlMitchell/pen/zImip
// var QuadTreeConstants = {
//     useLocal: 0,
//     useObject: 1,
//     useObjectLocation: 2,
//     useObjectPosition: 3,
//     useParam: 4,
//     useFunction: 5
// };
//
// function AABBCircleIntersect(circle, rectangle) {
//     // Circle is x,y, radius
//     // Rectangle is top left bottom right
//     // We need a copy of the point
//     // var circle_copy = {
//     //     x: circle.x,
//     //     y: circle.y
//     // };
//     // // Snap our circle to the rectangle corner/side its nearest
//     // console.log(circle_copy);
//     // console.log(rectangle);
//
//     // if(circle_copy.x > rectangle.right) {
//     //     circle_copy.x = rectangle.right;
//     // } else if(circle_copy.x < rectangle.left) {
//     //     circle_copy.x = rectangle.left;
//     // }
//     // if(circle_copy.y > rectangle.bottom) {
//     //     circle_copy.y = rectangle.bottom;
//     // } else if(circle_copy.y < rectangle.top) {
//     //     circle_copy.y = rectangle.top;
//     // }
//     // var dx = circle_copy.x - circle.x;
//     // var dy = circle_copy.y - circle.y;
//     // var distance = Math.sqrt(Math.abs((dx * dx) + (dy * dy)));
//     // console.log(distance, circle.radius);
//
//     // if(distance < circle.radius) return true;
//     // return false;
//     return true;
// }
//
// function QuadTreeNode(opts) {
//     if(opts === undefined) {
//         throw new Error('QuadTreeNode requires opts to be defined.');
//     }
//     this.id = undefined;
//     this.lifetime = 0;
//     this.x = opts.x || 0;
//     this.y = opts.y || 0;
//     this.size = opts.size || 1;
//
//     this._valueAccess = QuadTreeConstants.useLocal;
//     this.object = opts.object || null;
//     this.type = undefined;
//   // TODO: Switch to using bitflag? or multi option thing. For example if i want function update but then use object x and y or object.location.x etc
//     if(this.object !== null) {
//         if(this.object.x != undefined && this.object.y != undefined) {
//             this._valueAccess = QuadTreeConstants.useObject;
//         } else if(this.object.Location !== undefined) {
//             this._valueAccess = QuadTreeConstants.useObjectLocation;
//         } else if(this.object.position !== undefined) {
//             this._valueAccess = QuadTreeConstants.useObjectPosition;
//         }
//         this.type = this.object.type || this.object.constructor.name || this.object.__proto__.constructor.name;
//     }
//     this.type = opts.type || this.type;
//     if(opts.getParam) {
//         this._getParam = opts.getParam;
//         this._valueAccess = QuadTreeConstants.useParam;
//     }
//
//     if (typeof(opts.update) === 'function') {
//         this.UpdateFunction = opts.update;
//         this._valueAccess = QuadTreeConstants.useFunction;
//     } else if (opts.useObjectUpdate) {
//         this.UpdateFunction = this.object.update;
//         this._valueAccess = QuadTreeConstants.useFunction;
//     }
//     this.update();
// }
// // Call update to refresh the tree
// QuadTreeNode.prototype.update = function(delta) {
//     if(delta !== undefined) this.lifetime += delta;
//     switch(this._valueAccess) {
//     case QuadTreeConstants.useFunction:
//         var result = this.UpdateFunction.call(this.object,this,delta);
//         if (result===null) return;
//
//         this.x = result.x;
//         this.y = result.y;
//         this.size = result.size || this.size;
//         break;
//     case QuadTreeConstants.useLocal:
//         // Do Nothing
//         break;
//     case QuadTreeConstants.useObject:
//         this.x = this.object.x;
//         this.y = this.object.y;
//         this.size = this.object.size || 1;
//         break;
//     case QuadTreeConstants.useObjectLocation:
//         this.x = this.object.Location.X;
//         this.y = this.object.Location.Y;
//         this.size = this.object.size || 1;
//         break;
//     case QuadTreeConstants.useObjectPosition:
//         // Check if pixi loaded and if position is of pixi origin.
//         this.x = this.object.position.x;
//         this.y = this.object.position.y;
//         // this.size = this.object.size; TODO: Get size propperly for XYZ
//         // Maybe getBounds
//         break;
//     case QuadTreeConstants.useParam:
//         this.x = this.object[this._getParam.x];
//         this.y = this.object[this._getParam.y];
//         this.size = this.object[this._getParam.size] || 1;
//         break;
//     default:
//         throw new Error('Unspecified QuadTreeConstant. (' + this._valueAccess + ')');
//         break;
//     }
// }
// // Create a tree with options
// // {x : 0, y: 0, size: 1000}
//
// function QuadTree(opts) {
//     this.leafs = [];
//     this.nodes = [];
//     this.nodesHash = {};
//     this.topLevel = true;
//     this.level = opts.level || 0;
//     if(this.level > 0) {
//         this.topLevel = false;
//     }
//     this.nextNodeID = 1;
//     QuadTreeNode.call(this, opts);
//
//     // For the root of a QuadTree we can check ignoring size constraint.
//     if (opts.rootSpansInfinite) {
//       this.inBounds = function(obj) {
//         return true;
//       }
//     }
//
//     // Set when tree splits remove when unsplit
//     this.hasChildrenAreas = false;
//     this.halfSize = this.size / 2;
//     this.depth = opts.depth || 5;
//     this.limit = opts.limit || 10;
// }
// QuadTree.prototype = Object.create(QuadTreeNode.prototype);
// QuadTree.prototype.clear = function() {
//     for(var i = 0; i < this.nodes.length; i++) {
//         delete this.nodes[i].leaf;
//     }
//     this.nodes = [];
//     this.nodesHash = {};
//     this.leafs = [];
//     this.hasChildrenAreas = false;
//     this.nextNodeID = 1;
// }
// QuadTree.prototype.getNodeByID = function(input) {
//   if (Array.isArray(input)) {
//     var result = [];
//     for (var i=0; i < input.length; i++) {
//       result[i] = this.getNodeByID(input[i]);
//     }
//     return result;
//   }
//
//   var node;
//   if (this.nodesHash[input]) {
//     return this.nodesHash[input];
//   }
//
//   if (this.hasChildrenAreas) {
//     node = this.leafs[0].getNodeByID(input);
//     if (node) return node;
//     node = this.leafs[1].getNodeByID(input);
//     if (node) return node;
//     node = this.leafs[2].getNodeByID(input);
//     if (node) return node;
//     node = this.leafs[3].getNodeByID(input);
//     if (node) return node;
//   }
//
//   return null;
// }
// QuadTree.prototype.query = function(query) {
//     // console.log(query);
//     var results = [];
//     if(query === undefined) {
//         for(var n = 0; n < this.nodes.length; n++) {
//             results.push({
//                 distance: null,
//                 node: this.nodes[n],
//                 object: this.nodes[n].object
//             });
//         }
//         query = {};
//     } else {
//         if (typeof(query.x) === 'undefined') query.x = 0;
//         if (typeof(query.y) === 'undefined') query.y = 0;
//         if(query.position) {
//             query.x = query.position.x;
//             query.y = query.position.y;
//         }
//         if(query.location) {
//             query.x = query.location.x;
//             query.y = query.location.y;
//         }
//         if (query.CVec3) {
//             query.x = query.CVec3.X;
//             query.y = query.CVec3.Z;
//         }
//         if(query.radius === undefined) {
//             for(var n = 0; n < this.nodes.length; n++) {
//                 var distance = null;
//
//                 if (query.x !== undefined && query.y !== undefined) {
//                     var dx = this.nodes[n].x - query.x;
//                     var dy = this.nodes[n].y - query.y;
//                     distance = Math.sqrt(Math.abs((dx * dx) + (dy * dy))) - this.nodes[n].size;
//                 }
//
//                 results.push({
//                     distance: distance,
//                     node: this.nodes[n],
//                     object: this.nodes[n].object
//                 });
//             }
//         } else {
//             if(this.hasChildrenAreas) {
//                 // Check if circle intersects square for each of these
//                 // If so then query inside
//                 // var circle = {
//                 //     x: query.x,
//                 //     y: query.y,
//                 //     radius: query.radius
//                 // };
//                 // if(AABBCircleIntersect(circle, this.leafs[0].bounds)) {
//                     // console.log("test");
//                     results = results.concat(this.leafs[0].query(query));
//                 // }
//                 // if(AABBCircleIntersect(circle, this.leafs[1].bounds)) {
//                     // console.log("test");
//                     results = results.concat(this.leafs[1].query(query));
//                 // }
//                 // if(AABBCircleIntersect(circle, this.leafs[2].bounds)) {
//                     // console.log("test");
//                     results = results.concat(this.leafs[2].query(query));
//                 // }
//                 // if(AABBCircleIntersect(circle, this.leafs[3].bounds)) {
//                     // console.log("test");
//                     results = results.concat(this.leafs[3].query(query));
//                 // }
//
//                 // for(var i=0; i<4; i++){
//                     // this.leafs[i].__proto__ = QuadTree.prototype;
//                 // }
//
//                 // console.log("Has");
//             }
//
//             // Check each of the nodes
//             for(var n = 0; n < this.nodes.length; n++) {
//                 if(this.nodes[n]) {
//                     // console.log('node');
//                     // Get distance
//                     var dx = this.nodes[n].x - query.x;
//                     var dy = this.nodes[n].y - query.y;
//                     var distance = Math.sqrt((dx * dx) + (dy * dy));
//                     // console.log(query.type, this.nodes[n].type, distance);
//                     if(distance <= query.radius) {
//                         // console.log(this.nodes[n].type, query.type);
//                         if(query.type.indexOf(this.nodes[n].type) === -1) continue;
//                         results.push({
//                             distance: distance,
//                             node: this.nodes[n],
//                             object: this.nodes[n].object
//                         });
//                     }
//                 }
//             }
//
//         }
//     }
//
//     // console.log(results.toString());
//
//     // if(this.topLevel) {
//         // Do filter functions
//         // if(query.filter) {
//         //     results = results.filter(query.filter);
//         // }
//         // if(query.type) {
//         //     if(typeof(query.type) === 'string') {
//         //         query.type = query.type.split(/[\s,]+/);
//  							// 	results = results.filter(function(r) {
//         //             if(query.type.indexOf(r.node.type) >= 0) {
//         //                 return true;
//         //             }
//         //             return false;
//         //         });
//         //     } else if(Array.isArray(query.type)) {
//         //         results = results.filter(function(r) {
//         //           var type;
//         //           var typeIsFunction = type instanceof Function;
//         //           for (var i=0;i < query.type.length;i++) {
//         //             type = query.type[i];
//         //             if (typeIsFunction && r.node.object instanceof type){
//         //             	return true;
//         //             } else if (type instanceof String && type == r.node.type) {
//         //               return true;
//         //             }
//         //           }
//         //           return false;
//         //         });
//         //     }
//         // }
//         // // Do sorting
//         // if(query.sort !== undefined) {
//         //     if(typeof(query.sort) === 'function') {
//         //         results = results.sort(query.sort);
//         //     } else {
//         //         results = results.sort(function(a, b) {
//         //             return a.distance - b.distance;
//         //         });
//         //     }
//         // }
//
//
//         for(var i=0; i<results.length; i++){
//             var r = results[i];
//             if(query.type.indexOf(r.node.type) === -1)
//                 results.splice(i, 1);
//         }
//
//         // results = results.sort(function(a, b) {
//         //     return a.distance - b.distance;
//         // });
//     // }
//     return results;
// }
// QuadTree.prototype.update = function update(delta) {
//     // I am not sure how to handle if quad tree moves? I suppose locaitons of nodes should be relative?
//     //QuadTreeNode.prototype.update.call(this, delta);
//     // Should cache old x,y and size compare if different if so recalculate? That would probably be more work than just calculating it.
//
//     this.bounds = {
//         top: this.y,
//         left: this.x,
//         bottom: this.y - this.size,
//         right: this.x + this.size
//     };
//
//     // process.log(this.bounds);
//     //if(this.topLevel) {
//         var i, node, leaf;
//         for(i = 0; i < this.nodes.length; i++) {
//             node = this.nodes[i];
//             var xold = node.x, yold = node.y, sizeold = node.size;
//             node.update(delta);
//             if (node.x == xold && node.y == yold && node.size == sizeold) {
//               // Node has not moved
//               continue;
//             }
//             leaf = node.leaf;
//             if(!leaf.inBounds(node)) {
//                 // If node is no longer in parent leaf bounds
//                 leaf.removeNode(node);
//                 var placed = false;
//                 while(leaf.Parent || leaf.topLevel) {
//                     if(leaf.inBounds(node)) {
//                         leaf.addNode(node);
//                         placed = true;
//                         break;
//                     }
//                     if(leaf.topLevel) {
//                         break;
//                     }
//                     leaf = leaf.Parent;
//                 }
//                 if(placed == false) {
//                     process.log('node not in quad tree...');
//                 }
//             } else {
//               // Check if node would fit inside a child leaf
//               if(this.hasChildrenAreas) {
//                   var placed = false;
//                   if(this.leafs[0].inBounds(node)) {
//                       this.leafs[0].addNode(node);
//                       placed = true;
//                   } else if(this.leafs[1].inBounds(node)) {
//                       this.leafs[1].addNode(node);
//                       placed = true;
//                   } else if(this.leafs[2].inBounds(node)) {
//                       this.leafs[2].addNode(node);
//                       placed = true;
//                   } else if(this.leafs[3].inBounds(node)) {
//                       this.leafs[3].addNode(node);
//                       placed = true;
//                   }
//
//                   if (placed) {
//                     var index = this.nodes.indexOf(node);
//                     if(index > -1) {
//                       delete this.nodesHash[node.id];
//                       this.nodes.splice(index, 1);
//                     }
//                   }
//               }
//
//             }
//         }
//     //}
//     // If has children
//     // Update Leafs
//     if(this.hasChildrenAreas) {
//         // Unrolled for speed
//         this.leafs[0].update(delta);
//         this.leafs[1].update(delta);
//         this.leafs[2].update(delta);
//         this.leafs[3].update(delta);
//
//         if (this.topLevel) {
//             function checkLeafsChildrenEmpty(quadTreeLeaf, maxDepth) {
//                 if (quadTreeLeaf.nodes.length === 0 && (quadTreeLeaf.hasChildrenAreas == false || quadTreeLeaf.level == maxDepth) )  return true;
//
//                 if (quadTreeLeaf.hasChildrenAreas) {
//                     var result1 = checkLeafsChildrenEmpty(quadTreeLeaf.leafs[0], maxDepth);
//                     var result2 = checkLeafsChildrenEmpty(quadTreeLeaf.leafs[1], maxDepth);
//                     var result3 = checkLeafsChildrenEmpty(quadTreeLeaf.leafs[2], maxDepth);
//                     var result4 = checkLeafsChildrenEmpty(quadTreeLeaf.leafs[3], maxDepth);
//
//                     if (result1 && result2 && result3 && result4) {
//                       quadTreeLeaf.leafs = [];
//                       quadTreeLeaf.hasChildrenAreas = false;
//                       if (quadTreeLeaf.nodes.length === 0) return true;
//                     }
//                 } else {
//                   if (quadTreeLeaf.nodes.length === 0) return true;
//                 }
//                 return false;
//             }
//
//             checkLeafsChildrenEmpty(this, this.depth);
//         }
//     }
// }
// QuadTree.prototype.inBounds = function(node) {
//     var negX = node.x < 0;
//     var negY = node.y < 0;
//
//     var fnX = Math.floor(node.x);
//     var fnY = Math.floor(node.y);
//
//     var nodeX = Math.floor(negX ? Math.abs(this.bounds.left) - Math.abs(fnX) : this.bounds.right - fnX);
//     var nodeY = Math.floor(negY ? Math.abs(this.bounds.bottom) - Math.abs(fnY) : this.bounds.top - fnY);
//
//     return nodeX >= 0 && nodeY >= 0;
// };
//
// // Returns array of unplaced nodes although this should be empty
// QuadTree.prototype.putNodesInChildrenLeafs = function() {
//     if(!this.hasChildrenAreas) {
//         throw new Error('Cannot use putNodesInChildrenLeafs when there are no children leafs...');
//         return;
//     }
//     var unplaced = [];
//     // Place the nodes in the appropriate child leaf
//     var removed = [], node, i;
//     for(i = 0; i < this.nodes.length; i++) {
//         var node = this.nodes[i];
//         if(this.leafs[0].inBounds(node)) {
//             this.leafs[0].addNode(node);
//             removed.push(node);
//         } else if(this.leafs[1].inBounds(node)) {
//             this.leafs[1].addNode(node);
//             removed.push(node);
//         } else if(this.leafs[2].inBounds(node)) {
//             this.leafs[2].addNode(node);
//             removed.push(node);
//         } else if(this.leafs[3].inBounds(node)) {
//             this.leafs[3].addNode(node);
//             removed.push(node);
//         } else {
//             unplaced.push(node);
//         }
//
//     }
//     // If the node was placed in a child leaf then remove it from the parents nodes list.
//     for (i=0;i<removed.length;i++) {
//       node = removed[i];
//       var index = this.nodes.indexOf(node);
//       if(index > -1) {
//           delete this.nodesHash[node.id];
//           this.nodes.splice(index, 1);
//       }
//     }
//     return unplaced;
// }
// QuadTree.prototype.removeNode = function(value) {
//     var node;
//     if(value instanceof QuadTreeNode) {
//         node = value;
//         value = node.id;
//     } else if(typeof(value) === 'number') {
//         node = this.getNodeByID(value);
//     } else {
//         throw new Error('Invalid value passed to QuadTree::removeNode');
//         return;
//     }
//     if(node === undefined) {
//         node = this.getNodeByID(value);
//     }
//     if(node.leaf !== undefined && node.leaf !== this && this.topLevel) {
//         node.leaf.removeNode(node);
//     }
//     var index = this.nodes.indexOf(node);
//     if(index > -1) {
//         delete this.nodesHash[node.id];
//         this.nodes.splice(index, 1);
//         delete node.leaf;
//     }
// }
// QuadTree.prototype.addNode = function(node) {
//     if(this.topLevel) {
//         if(node instanceof QuadTreeNode === false) {
//             node = new QuadTreeNode(node);
//         }
//         if(node.id === undefined) {
//             node.id = this.nextNodeID;
//             this.nextNodeID++;
//         }
//     }
//     node.leaf = this;
//     // Check any children that exist if we can add it there
//     if(this.hasChildrenAreas) {
//         if(this.leafs[0].inBounds(node)) {
//             this.leafs[0].addNode(node);
//         } else if(this.leafs[1].inBounds(node)) {
//             this.leafs[1].addNode(node);
//         } else if(this.leafs[2].inBounds(node)) {
//             this.leafs[2].addNode(node);
//         } else if(this.leafs[3].inBounds(node)) {
//             this.leafs[3].addNode(node);
//         } else {
//             this.nodes.push(node);
//             this.nodesHash[node.id] = node;
//         }
//         // Check if we need to create child areas
//     } else if(this.depth > 0 && this.nodes.length + 1 > this.limit) {
//         this.hasChildrenAreas = true;
//         this.leafs[0] = new QuadTree({
//             x: this.x,
//             y: this.y,
//             size: this.halfSize,
//             limit: this.limit,
//             depth: this.depth - 1,
//             level: this.level + 1
//         });
//         this.leafs[1] = new QuadTree({
//             x: this.x + this.halfSize,
//             y: this.y,
//             size: this.halfSize,
//             limit: this.limit,
//             depth: this.depth - 1,
//             level: this.level + 1
//         });
//         this.leafs[2] = new QuadTree({
//             x: this.x,
//             y: this.y + this.halfSize,
//             size: this.halfSize,
//             limit: this.limit,
//             depth: this.depth - 1,
//             level: this.level + 1
//         });
//         this.leafs[3] = new QuadTree({
//             x: this.x + this.halfSize,
//             y: this.y + this.halfSize,
//             size: this.halfSize,
//             limit: this.limit,
//             depth: this.depth - 1,
//             level: this.level + 1
//         });
//         this.leafs[0].Parent = this;
//         this.leafs[1].Parent = this;
//         this.leafs[2].Parent = this;
//         this.leafs[3].Parent = this;
//         this.nodes.push(node);
//         this.nodesHash[node.id] = node;
//         // Reorganize Nodes
//         this.putNodesInChildrenLeafs();
//     }// else if(this.topLevel === false) {
//     else {
//         if(this.inBounds(node)) {
//             this.nodes.push(node);
//             this.nodesHash[node.id] = node;
//             node.leaf = this;
//         } else {
//           console.log("Adding node that is out of bounds");
//           console.log(this.bounds);
//           console.log(node.x,node.y);
//           //console.log(this.bounds);
//           //process.log('Node outside Quad Tree bounds ' + this.x + ',' + this.y + ' size ' + this.size);
//           return null;
//         }
//     }
//
//     return node;
// }
//
// QuadTree.QuadTreeConstants = QuadTreeConstants;
// QuadTree.AABBCircleIntersect = AABBCircleIntersect;
// QuadTree.QuadTreeNode = QuadTreeNode;
//
// if(typeof module !== "undefined" && module.exports) {
//     module.exports = QuadTree;
// }
// if(typeof window !== "undefined") {
//     window.QuadTree = QuadTree;
// }
//
// // if(typeof Zone !== 'undefined'){
// //     // console.log("True");
// //     Zone.QuadTree.__proto__ = QuadTree.prototype;
// // }
