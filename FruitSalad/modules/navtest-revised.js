var fs = require('fs');
var map_mesh = function(url, callback){
	console.log("Loading: " + url);
	this.wVs = [];
	this.ewVs = [];
	this.worldFaces = [];
	this.worldTri = [];
	this.dimensions = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	};
	this._callback = callback;

	var _this = this;
	fs.readFile(url, function(err, data){
		if(err){
			console.log(err);
			return;
		}

		_this.parse(data);
	});

	this.edges = [];
}

map_mesh.prototype.parse = function(data){
	//TODO: Read .obj format
	var sData = data.toString();
	var newLines = sData.split('\n');
	newLines.reverse();
	var parsedObj;
	for(var i=newLines.length-1; i >= 0; i--){
		var line = newLines[i].split(' ');
		var type = line[0];
		switch(type){
			case 'v':
			case 'V':
			parsedObj = [];
			parsedObj.push(parseFloat(line[1]));
			parsedObj.push(parseFloat(line[2]));
			parsedObj.push(parseFloat(line[3]));
			this.wVs.push(parsedObj);
			this.ewVs.push({0: parseFloat(line[1]), 1: parseFloat(line[2]), 2: parseFloat(line[3])});
			break;

			case 'f':
			case 'F':
			parsedObj = {
				1: parseInt(line[1])-1,
				2: parseInt(line[2])-1,
				3: parseInt(line[3])-1
			};

			this.worldFaces.push(parsedObj);
			break;

			case 'd':
			case 'D':
			this.dimensions.left = parseFloat(line[1]);
			this.dimensions.top = parseFloat(line[2]);
			this.dimensions.right = parseFloat(line[3]);
			this.dimensions.bottom = parseFloat(line[4]);
			break;
		}
	}

	this.worldFaces.reverse();
	this.build();
}

map_mesh.prototype.build = function(){
	var date = new Date().getTime();
	var pointA = {};
	var pointB = {};
	var pointC = {};
	for(var i=this.worldFaces.length-1; i >= 0; i--){
		var facePoint = this.worldFaces[i];
		var obj = new worldTri(facePoint[1], facePoint[2], facePoint[3], this.worldTri.length, this.wVs[facePoint[1]], this.wVs[facePoint[2]], this.wVs[facePoint[3]]);
		if(pointA[facePoint[1]] === undefined) pointA[facePoint[1]] = [];
		if(pointB[facePoint[2]] === undefined) pointB[facePoint[2]] = [];
		if(pointC[facePoint[3]] === undefined) pointC[facePoint[3]] = [];

		pointA[facePoint[1]].push(obj.index);
		pointB[facePoint[2]].push(obj.index);
		pointC[facePoint[3]].push(obj.index);

		this.worldTri.push(obj);
	}

	for(var i=this.worldTri.length-1; i >= 0; i--){
		var tri = this.worldTri[i];
		tri.center = this.findTriangleCenter(tri.points);

		var nodes = [];
		nodes = nodes.concat(
			pointA[tri.a],
			pointB[tri.a],
			pointC[tri.a],
			pointA[tri.b],
			pointB[tri.b],
			pointC[tri.b],
			pointA[tri.c],
			pointB[tri.c],
			pointC[tri.c]
		);

		for(var j=nodes.length-1; j>= 0; j--){
			var node = this.worldTri[nodes[j]];
			if (node && node.index !== tri.index && tri.nodes.indexOf(node) < 0)
				tri.nodes.push(node);
		}
	}

	delete pointA;
	delete pointB;
	delete pointC;

	this.getMapEdges();

	console.log("Builded in " + (new Date().getTime() - date) + "ms");
	if(this._callback){
		this._callback(this);
	}
}

map_mesh.prototype.getMapEdges = function(){
	var map = {};
	var tris = {};

	this.processPoints = {};

	for(var i=this.worldTri.length-1; i>=0; i--){
		var tri = this.worldTri[i];
		this.processEdge(tri.a, tri.b, map, tris, tri, 0);
		this.processEdge(tri.b, tri.c, map, tris, tri, 1);
		this.processEdge(tri.c, tri.a, map, tris, tri, 2);
	}

	for(var i in this.processPoints){
		var points = this.processPoints[i];
		var uniquePoints = [];
		for(var j=0; j<points.length; j++){
			var p = points[j];
			if(uniquePoints.indexOf(p) < 0) uniquePoints.push(p);
		}

		this.processPoints[i] = uniquePoints;
	}

	for(var i in map){
		if(map[i].total !== 1) continue;

		var a = map[i].a;
		var b = map[i].b;
		var tri = map[i].tri;
		var index = map[i].tri.index;

		var ind = index === 0 ? map[i].tri.c : index === 1 ? map[i].tri.a : map[i].tri.b;
		map[i].tri.edge = [a, b];

		var tA = this.wVs[a];
		var tB = this.wVs[b];		

		var deltaX = tA[0] - tB[0];
		var deltaY = tA[2] - tB[2];

		var angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;

		var offset = 1;

		var cos = (Math.cos(angle) * offset);
		var sin = (Math.sin(angle) * offset);

		this.ewVs[a][0] += cos;
		this.ewVs[a][2] += sin;

		this.ewVs[b][0] += cos;
		this.ewVs[b][2] += sin;

		this.edges.push([ this.ewVs[a], this.ewVs[b] ]);
	}
}

map_mesh.prototype.processEdge = function(aS, bS, map, tris, tri, index){
	// console.log(tri.a, tri.b, tri.c);
	var a = aS;
	var b = bS;
	// console.log(a, b);
	tris[a] = this.wVs[a];
	tris[b] = this.wVs[b];

	var key = (tris[a][0] * tris[a][1] * tris[a][2]) + (tris[b][0] * tris[b][1] * tris[b][2]);

	if(this.processPoints[a] === undefined) this.processPoints[a] = [b];
	else this.processPoints[a].push(b);

	if(this.processPoints[b] === undefined) this.processPoints[b] = [a];
	else this.processPoints[b].push(a);

	if(map[key] === undefined){
		map[key] = {};
		map[key].total = 1;
		map[key].a = a;
		map[key].b = b;
		map[key].tri = tri;
		map[key].index = index;
	}else map[key].total++;
}

map_mesh.prototype.getParentNodeByLocation = function(x, y, z){
	// Consider a bucket layout for faster selection
	// like maybe a range selection of a bucket. 
	// so maybe bucket.minX >= x && x <= bucket.maxX && y
	// then querying on that bucket. Should be faster by maybe 50% or 25%
	var start = new Date().getTime();

	for(var i=this.worldTri.length-1; i>= 0; i--){
		var node = this.worldTri[i];
		if(node.pointIntersects(x, y, z)){
			console.log("Found node triangle in " + (new Date().getTime() - start) + "ms");
			return node;
		}
	}

	return null;
}

map_mesh.prototype.moveCost = function(from_x, from_y, from_z, to_x, to_y, to_z){
	var x = from_x - to_x;
	var y = from_y - to_y;
	var z = from_z - to_z;

	return Math.sqrt(x * x + y * y + z * z);
}

map_mesh.prototype.heuristic = function(from_x, from_y, from_z, to_x, to_y, to_z){

	// This method is more acurate
	var x = Math.abs(from_x - to_x);
	var y = Math.abs(from_z - to_z);
	if(x > y){
		return 14 * y + 10 * (x - y);
	}else{
		return 14 * x + 10 * (y - x);
	}


	// This one is a little bit faster, about 1ms. But less accurate more points to clean up.
	// return 10*(Math.abs(from_x-to_x) + Math.abs(from_z-to_z));
}


map_mesh.prototype.findPath = function(from, to, radius, callback){
	var node = this.getParentNodeByLocation(from.x, from.y, from.z);
	if(!node){
		console.log("Unknown location for Parent location");
		return;
	}

	var target = this.getParentNodeByLocation(to.x, to.y, to.z);
	if(!target){
		console.log("Unknown location for Parent location");
		return;
	}

	var closedList = [];
	var currentNodeIndex = null;
	var nodeGCost = {};
	var nodeHCost = {};
	var history = [];
	var nodeBucket = {};

	var nodeA = this.wVs[node.a];
	nodeGCost[node.a] = 0;
	nodeHCost[node.a] = this.moveCost(nodeA[0], nodeA[1], nodeA[2], to.x, to.y, to.z);
	var nodeAf = nodeGCost[node.a] + nodeHCost[node.a];

	var nodeB = this.wVs[node.b];
	nodeGCost[node.b] = 0;
	nodeHCost[node.b] = this.moveCost(nodeB[0], nodeB[1], nodeB[2], to.x, to.y, to.z);
	var nodeBf = nodeGCost[node.b] + nodeHCost[node.b];

	var nodeC = this.wVs[node.c];
	nodeGCost[node.c] = 0;
	nodeHCost[node.c] = this.moveCost(nodeC[0], nodeC[1], nodeC[2], to.x, to.y, to.z);
	var nodeCf = nodeGCost[node.c] + nodeHCost[node.c];

	var smallestF = nodeAf; var smallestI = node.a;
	if(smallestF > nodeBf) { smallestF = nodeBf; smallestI = node.b;}
	if(smallestF > nodeCf) { smallestF = nodeCf; smallestI = node.c;}

	currentNodeIndex = smallestI;
	closedList.push(currentNodeIndex);

	var points = [[from.x, from.y, from.z], [this.wVs[smallestI][0], this.wVs[smallestI][1], this.wVs[smallestI][2]]];
	var t = 0;
	var start = new Date().getTime();

	while(true){
		var bestI = null;
		var lowestF = null;

		var totalSkipped = 0;
		history.push(currentNodeIndex);
		var total = this.processPoints[currentNodeIndex].length;
		for(var pIndex in this.processPoints[currentNodeIndex]){
			var point = this.processPoints[currentNodeIndex][pIndex];
			if(closedList.indexOf(point) >= 0){
				totalSkipped++;
				continue;
			}

			var pointLocation = this.wVs[point];
			var h;
			if(nodeHCost[point] === undefined){
				h = this.moveCost(pointLocation[0], pointLocation[1], pointLocation[2], to.x, to.y, to.z);
				nodeHCost[point] = h;
			}else{
				h = nodeHCost[point];
			}

			var g;
			if(nodeGCost[point] === undefined)
				nodeGCost[point] = this.moveCost(pointLocation[0], pointLocation[1], pointLocation[2], from.x, from.y, from.z) + 16;

			if(currentNodeIndex !== null)
				g = nodeGCost[point] + nodeGCost[currentNodeIndex];
			else
				g = nodeGCost[point];

			var f = h - g;
	
			if(lowestF === null || f < lowestF){
				lowestF = f;
				bestI = point;
			}
		}

		nodeBucket[currentNodeIndex] = total - totalSkipped;

		if(totalSkipped === total){
			var followingHistory = false;
			for(var i=history.length-1; i>= 0; i--){
				if(nodeBucket[history[i]] >= 1){
					currentNodeIndex = history[i];
					followingHistory = true;
					break;
				}
			}

			if(!followingHistory){
				console.log("No path");
				break;
			}
			continue;
		}

		if(bestI === null){
			console.log("Path not founded");
			break;
		}

		currentNodeIndex = bestI;
		var currentNodeLocation = this.wVs[bestI];

		if(target.pointIntersects(currentNodeLocation[0], currentNodeLocation[1], currentNodeLocation[2])){
			console.log("Path founded");
			break;
		}

		closedList.push(bestI);
		points.push([currentNodeLocation[0], currentNodeLocation[1], currentNodeLocation[2]]);

	}

	points.push([to.x, to.y, to.z]);
	console.log("Path located in " + (new Date().getTime() - start) + "ms @ " + points.length + " points.");


	callback(points);
}

map_mesh.prototype.cleanPath = function(path){
	var edgesQuery = {top: null, bottom: null, left: null, right: null};
	for(var i=0; i<path.length; i++){
		var point = path[i];

		if(edgesQuery.top === null || edgesQuery.top > point[2]) edgesQuery.top = point[2];
		if(edgesQuery.bottom === null || edgesQuery.bottom < point[2]) edgesQuery.bottom = point[2];

		if(edgesQuery.left === null || edgesQuery.left > point[0]) edgesQuery.left = point[0];
		if(edgesQuery.right === null || edgesQuery.right < point[0]) edgesQuery.right = point[0];
	}

	var edges = [];
	for(var i=0; i<this.edges.length; i++){
		var edge = this.edges[i];
		var a = edge[0];
		var b = edge[1];

		if(edgesQuery.left <= a[0] && edgesQuery.right >= b[0] && edgesQuery.top <= a[2] && edgesQuery.bottom >= b[2]){
			edges.push(edge);
		}
	}

	var cleanedPath = [path[0]];
	for(var i=0; i<path.length; i++){
		i = this.throw(edges, path, i);
		cleanedPath.push(path[i]);
		if(i === path.length-1){
			console.log("Path cleared");
			break;
		}
		i--;
	}
	return cleanedPath;
}

// Function that checks every possible point from argument[0] as a point. Which one has the highest index, or which one is the closest to the target.
// For each point, it checks if the point intersects one of the edges.
// Improvement: Convert queried edges, convert them to polygons. Cache them, and intersect over a polygon.
map_mesh.prototype.throw = function(edges, points, currentPoint){
	var cPoint = points[currentPoint];
	var farestIndex = currentPoint;
	for(var i=0; i<points.length; i++){
		var point = points[i];
		var intersection = false;
		if(i <= farestIndex) continue;
		for(var e=0; e<edges.length; e++){
			var edge = edges[e];
			var a = edge[0];
			var b = edge[1];

			var result = this.lineIntersect(a[0], a[2], b[0], b[2], cPoint[0], cPoint[2], point[0], point[2]);
			if(result){
				intersection = true;
				break;
			}
		}

		if(!intersection && i > farestIndex){
			farestIndex = i;
		}
	}
	if(farestIndex === currentPoint) {
		// console.log("We are stuck.", farestIndex, points.length);
		return points.length-1;
	}
	return farestIndex;
}

map_mesh.prototype.lineIntersect = function checkLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
 
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
 
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
 
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        return 1;
    }
 
    return 0;
}

map_mesh.prototype.findTriangleCenter = function(points){
	var centerX = (points[0][0] + points[1][0] + points[2][0]) / 3;
	var centerY = (points[0][1] + points[1][1] + points[2][1]) / 3;
	var centerZ = (points[0][2] + points[1][2] + points[2][2]) / 3;
	return [centerX, centerY, centerZ];
}


map_mesh.prototype.randomPoint = function(callback){
	var randomTriIndex = Math.floor(Math.random() * this.worldTri.length-1);
	randomTriIndex = randomTriIndex < 0 ? 0 : randomTriIndex;
	var center = this.worldTri[randomTriIndex].points[0];
	callback(center[0], center[1], center[2]);
}

var worldTri = function(a, b, c, index, p1, p2, p3){
	this.a = a;
	this.b = b;
	this.c = c;
	this.index = index;

	this.points = [p1, p2, p3];
	this.nodes = [];
	this.center = [0,0,0];
	this.edge = false;
}


worldTri.prototype.pointIntersects = function(x, y, z){
	var point = {x: x, y: y, z: z}, b1, b2, b3;

	b1 = this.sign(point, this.points[0], this.points[1]) < 0;
	b2 = this.sign(point, this.points[1], this.points[2]) < 0;
	b3 = this.sign(point, this.points[2], this.points[0]) < 0;

	return ((b1 === b2) && (b2 === b3));
}

worldTri.prototype.sign = function(p1, p2, p3)
{
    return (p1.x - p3[0]) * (p2[2] - p3[2]) - (p2[0] - p3[0]) * (p1.z - p3[2]);
}

module.exports = map_mesh;