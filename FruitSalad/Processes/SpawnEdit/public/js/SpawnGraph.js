var socket = io();

// TODO Figure out how to select selZone and add the zone options to it using d3 map maybe.
function selZone_Changed(d) {
    var value = d3.select(this).property("value");
    circles.selectAll("circle").remove();
    socket.emit('zone', value);
}

var selZone = d3.select('#selZone').on("change", selZone_Changed);

window.zones = [];
window.spawnlogs = [];
window.spawngroups = [];
window.spawnpoints = [];


d3.json("zones.json", function(json) {  
    zones.length = 0;

    var zoneIDs = Object.keys(json).map(function(item) {
        return parseInt(item, 10);
    }).sort(function(a,b){ return a-b; });

    for (var i=0;i<zoneIDs.length;i++) {
        var zoneID = zoneIDs[i];
        var zone = json[zoneID];
        zone.ID = zoneID;
        zones.push(zone);
    }

    var options = [{id: 0, Name: 'Please Select...'}];
    selZone.selectAll("option").data(options.concat(zones)).enter().append("option").attr("value", function(d) {
        return d.ID;
    }).text(function(d) {
        if (d.DisplayName) {
            return d.Name + ' ' + d.DisplayName;
        }
        return d.Name;
    });
});


var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "plan_tooltip").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("");
set_tooltip_label = function(d) {
    var dt = getDateTimeFromObjectID(d._id);
    tooltip.html('<strong>Type:</strong> ' + d.type + "<br><strong>ID:</strong>: " + d.id + " <strong>Unique ID:</strong> " + d.uniqueID1 + "<br><strong>Location:</strong> (" + d.x.toFixed(2) + ", " + d.y.toFixed(2) + ", " + d.z.toFixed(2) + ")<br><strong>Logged On:</strong> " + dt.toLocaleDateString() + ' at ' + dt.toLocaleTimeString());
    if (!(event === undefined)) {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px")
    }
};
var x = d3.scale.linear().domain([-width / 2, width / 2]).range([width, 0]);
var y = d3.scale.linear().domain([-height / 2, height / 2]).range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5).tickSize(-width);
var zoom = d3.behavior.zoom().x(x).y(y).on("zoom", zoomed);
var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(zoom);
svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
var rect = svg.append("rect").attr("width", width).attr("height", height);
svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
svg.append("g").attr("class", "y axis").call(yAxis);

var content = svg.append('g');
content.attr("clip-path", "url(#clip)");
var circles = content.append('g');
var mobColours = d3.scale.category20b();

function updateGraphData() {
    var node = circles.selectAll("circle").data(spawnlogs, function(d) {
        return d._id;
    });

    node.enter().append("circle")
    .on("mouseover", function() {
        return tooltip.style("visibility", "visible")
    }).on("mousemove", function(d) {
        set_tooltip_label(d);
    }).on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    }).attr("cx", function(d) {
        return x(d.x);
    }).attr("cy", function(d) {
        return y(d.z);
    }).attr("r", function(d) {
        return 15;
    }).style("fill", function(d) {
        switch (d.type) {
            case 'mon':
                return 'red';
                break;
            case 'npc':
                return 'blue';
                break;
            case 'player':
                return 'green';
                break;
        }
    });

    node.exit().remove();
}

function updateSpawnGroups() {

}

function updateSpawnPoints() {

}

socket.on('spawnlogs', function(data) {
    window.spawnlogs = data;
    updateGraphData();
});
socket.on('spawngroups', function(data) {
    window.spawngroups = data;
    updateSpawnGroups();
});
socket.on('spawnpoints', function(data) {
    window.spawnpoints = data;
    updateSpawnPoints();
});

function getDateTimeFromObjectID(_id) {
    var timestamp = _id.toString().substring(0, 8);
    return new Date(parseInt(timestamp, 16) * 1000);
}

function SpawnGroup() {
  this.type = 'group';
  this.shape = 'rect';
  
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.spawns = [];
}

var spawns = [];

SpawnGroup.prototype.add = function SpawnGroup__add(id, amount) {
  this.spawns.push({ id: id, amount: amount });
}

function SpawnPoint() {
  this.type = 'point';
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.spawns = [];
}

SpawnPoint.prototype.add = function SpawnPoint__add(id, direction) {
  this.spawns.push({ id: id, direction: direction });
}

// TODO: Get data from db for the selected zone, filtered for unique uniqueID1.
// TODO: Make a function for a clicked on NPC to create a spawn point at that spot.
// TODO: Make function to goto next / previous NPC
// TODO: Make function to goto next / previous Monster
// TODO: A radio button group for choosing point or group?
// TODO: Being able to select an area or point
// TODO: If there is something in the selected area add it to suggested things to put in the spawn group/point.
// TODO: A way to add monster, amount or monster, direction to a group/point manually


d3.select("button").on("click", reset);

function zoomed() {
  // TODO: Togglable zoom, should only drag/zoom when not holding shift key.
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    circles.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function reset() {
    svg.call(zoom.x(x.domain([-width / 2, width / 2])).y(y.domain([-height / 2, height / 2])).event);
}


//Variable to hold autocomplete options
var monsters;
//Load US States as options from CSV - but this can also be created dynamically
// d3.csv("states.csv",function (csv) {
//     keys=csv;
//     start();
// });
monsters = [
  { id: 1, name: 'Kobold' },
  { id: 2, name: 'Skeleton' },
  { id: 3, name: 'Cat' }
];

//Call back for when user selects an option
function onSelect(d) {
    alert(d.name);

}

//Setup and render the autocomplete
function start() {
    var mc = autocomplete('.selMonster')
            .keys(monsters)
            .dataField("name")
            .placeHolder("Spawn Name - Start typing here")
            .width(960)
            .height(500)
            .onSelected(onSelect)
            .render();
}
start();