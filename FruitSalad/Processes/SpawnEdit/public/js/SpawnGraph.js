var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function getDateTimeFromObjectID(_id) {
    var timestamp = _id.toString().substring(0, 8);
    return new Date(parseInt(timestamp, 16) * 1000);
}
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
var zoom = d3.behavior.zoom().x(x).y(y).scaleExtent([-50, 50]).on("zoom", zoomed);
var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(zoom);
svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
var rect = svg.append("rect").attr("width", width).attr("height", height);
svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
svg.append("g").attr("class", "y axis").call(yAxis);

function ObjectId(s) {
    return s;
}

var zones = [{
    "ID": 1,
    "Name": "Z001",
    "Load": true,
    "DisplayName": "Gungsong Fortress"
},{
    "ID": 2,
    "Name": "Z002",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z003",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 4,
    "Name": "Z004",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 5,
    "Name": "Z005",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 6,
    "Name": "Z006",
    "Load": true,
    "DisplayName": "Padsong Fortress"
},{
    "ID": 7,
    "Name": "Z007",
    "Load": true,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z008",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z009",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z010",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z011",
    "Load": true,
    "DisplayName": "Hanma Palace"
},{
    "ID": 1,
    "Name": "Z012",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z013",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z014",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z015",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z016",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z017",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z018",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z019",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z020",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z021",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z034",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z037",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z038",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z039",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 4,
    "Name": "Z040",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 4,
    "Name": "Z043",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 4,
    "Name": "Z046",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 4,
    "Name": "Z049",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 5,
    "Name": "Z050",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 5,
    "Name": "Z055",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 5,
    "Name": "Z056",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 5,
    "Name": "Z059",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z071",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z072",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z073",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z074",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z075",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z076",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 7,
    "Name": "Z078",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z080",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z081",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z082",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z084",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z088",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 8,
    "Name": "Z089",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z090",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z091",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z094",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z095",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 9,
    "Name": "Z098",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z101",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z104",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z105",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z110",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z112",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z115",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z116",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z119",
    "Load": false,
    "DisplayName": "Nangin Track"
},{
    "ID": 1,
    "Name": "Z120",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z124",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z125",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z126",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z138",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z140",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z141",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z142",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z143",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z195",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 1,
    "Name": "Z196",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z201",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z202",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z206",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z222",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z234",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z235",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z236",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z237",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z241",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z267",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z270",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z275",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z279",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z283",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z287",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 2,
    "Name": "Z291",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z302",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z303",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z304",
    "Load": false,
    "DisplayName": ""
},{
    "ID": 3,
    "Name": "Z310",
    "Load": false,
    "DisplayName": ""
}];

function updateGraphData(data) {

}

// TODO Figure out how to select selZone and add the zone options to it using d3 map maybe.
function selZone_Changed(d) {
    var value = d3.select(this).property("value");
    getSpawnData(value, updateGraphData);
}

var selZone = d3.select('#selZone').on("change", selZone_Changed);

selZone.selectAll("option").data(zones).enter().append("option").attr("value", function(d) {
    return d.ID;
}).text(function(d) {
    return d.Name + ' ' + d.DisplayName;
});

function getSpawnData(zoneID) {
  
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

var data = [{ // Player
        "_id": ObjectId("55b3345bca012c8110f5cb4b"),
        "uniqueID1": 0,
        "id": 1,
        "x": -614.08,
        "y": 49.80,
        "z": -993.46,
        "type": 'player'
    },
    /* 1 */
    {
        "_id": ObjectId("55b3345bca012c8110f5cb4b"),
        "uniqueID1": 0,
        "id": 1,
        "x": -991,
        "y": 259,
        "z": 236,
        "direction": 270,
        "type": "npc"
    },
    /* 2 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc2"),
        "uniqueID1": 0,
        "id": 1,
        "x": -754.8853149414062500,
        "y": 0.1001586914062500,
        "z": -2214.8281250000000000,
        "direction": 50,
        "type": "mon"
    },
    /* 3 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc3"),
        "uniqueID1": 1,
        "id": 1,
        "x": -712.1564941406250000,
        "y": 0.1001586914062500,
        "z": -2177.5705566406250000,
        "direction": 12,
        "type": "mon"
    },
    /* 4 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc4"),
        "uniqueID1": 2,
        "id": 1,
        "x": -812.9321899414062500,
        "y": 0.1001586914062500,
        "z": -2087.5102539062500000,
        "direction": 35,
        "type": "mon"
    },
    /* 5 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc5"),
        "uniqueID1": 3,
        "id": 1,
        "x": -583.6227416992187500,
        "y": 9.4950428009033203,
        "z": -2177.2407226562500000,
        "direction": 181,
        "type": "mon"
    },
    /* 6 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc6"),
        "uniqueID1": 4,
        "id": 1,
        "x": -757.5907592773437500,
        "y": 0.1001586914062500,
        "z": -2411.2304687500000000,
        "direction": 29,
        "type": "mon"
    },
    /* 7 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd02"),
        "uniqueID1": 5,
        "id": 1,
        "x": -14.7001876831054690,
        "y": -9.8362808227539062,
        "z": -2393.9033203125000000,
        "direction": 253,
        "type": "mon"
    },
    /* 8 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc7"),
        "uniqueID1": 6,
        "id": 1,
        "x": -128.7774658203125000,
        "y": -9.2010812759399414,
        "z": -2271.9143066406250000,
        "direction": 273,
        "type": "mon"
    },
    /* 9 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd03"),
        "uniqueID1": 7,
        "id": 1,
        "x": -7.0230073928833008,
        "y": -9.8362808227539062,
        "z": -2408.2268066406250000,
        "direction": 230,
        "type": "mon"
    },
    /* 10 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd04"),
        "uniqueID1": 8,
        "id": 1,
        "x": 139.0182647705078100,
        "y": -9.8364105224609375,
        "z": -2434.1831054687500000,
        "direction": 164,
        "type": "mon"
    },
    /* 11 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd05"),
        "uniqueID1": 9,
        "id": 1,
        "x": 166.1027679443359400,
        "y": -9.1801757812500000,
        "z": -2275.5581054687500000,
        "direction": 271,
        "type": "mon"
    },
    /* 12 */
    {
        "_id": ObjectId("55b338cfca012c8110f5cd00"),
        "uniqueID1": 10,
        "id": 1,
        "x": -1048.7673339843750000,
        "y": 0.1001586914062500,
        "z": -2196.5798339843750000,
        "direction": 65,
        "type": "mon"
    },
    /* 13 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc54"),
        "uniqueID1": 11,
        "id": 1,
        "x": -1199.9119873046875000,
        "y": 12.0299348831176760,
        "z": -2335.6691894531250000,
        "direction": 330,
        "type": "mon"
    },
    /* 14 */
    {
        "_id": ObjectId("55b338cfca012c8110f5cd01"),
        "uniqueID1": 12,
        "id": 1,
        "x": -1038.5322265625000000,
        "y": 0.1001586914062500,
        "z": -2224.8125000000000000,
        "direction": 280,
        "type": "mon"
    },
    /* 15 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc55"),
        "uniqueID1": 13,
        "id": 1,
        "x": -1185.8443603515625000,
        "y": 11.3245344161987300,
        "z": -2263.6484375000000000,
        "direction": 158,
        "type": "mon"
    },
    /* 16 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc56"),
        "uniqueID1": 17,
        "id": 1,
        "x": -1881.3021240234375000,
        "y": 15.1208543777465820,
        "z": -2361.9721679687500000,
        "direction": 116,
        "type": "mon"
    },
    /* 17 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc57"),
        "uniqueID1": 19,
        "id": 1,
        "x": -1530.3839111328125000,
        "y": 0.1001586914062500,
        "z": -2311.4458007812500000,
        "direction": 228,
        "type": "mon"
    },
    /* 18 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccb9"),
        "uniqueID1": 20,
        "id": 1,
        "x": 459.4909973144531200,
        "y": 0.1266470104455948,
        "z": -2194.3835449218750000,
        "direction": 183,
        "type": "mon"
    },
    /* 19 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccba"),
        "uniqueID1": 21,
        "id": 1,
        "x": 761.5588378906250000,
        "y": 0.1000289916992188,
        "z": -2083.2580566406250000,
        "direction": 344,
        "type": "mon"
    },
    /* 20 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccbb"),
        "uniqueID1": 22,
        "id": 1,
        "x": 500.6590576171875000,
        "y": 0.0692429542541504,
        "z": -1959.2598876953125000,
        "direction": 335,
        "type": "mon"
    },
    /* 21 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccbc"),
        "uniqueID1": 23,
        "id": 1,
        "x": 591.3323974609375000,
        "y": 1.1059026718139648,
        "z": -2224.2553710937500000,
        "direction": 152,
        "type": "mon"
    },
    /* 22 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccbd"),
        "uniqueID1": 24,
        "id": 1,
        "x": 647.0574340820312500,
        "y": 0.3253600597381592,
        "z": -2180.1704101562500000,
        "direction": 104,
        "type": "mon"
    },
    /* 23 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb6e"),
        "uniqueID1": 30,
        "id": 1,
        "x": -2034.4410400390625000,
        "y": 2.8946266174316406,
        "z": -923.5357666015625000,
        "direction": 220,
        "type": "mon"
    },
    /* 24 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb6b"),
        "uniqueID1": 31,
        "id": 1,
        "x": -2001.8071289062500000,
        "y": 5.6684703826904297,
        "z": -1066.4304199218750000,
        "direction": 272,
        "type": "mon"
    },
    /* 25 */
    {
        "_id": ObjectId("55b337d3ca012c8110f5cb65"),
        "uniqueID1": 32,
        "id": 1,
        "x": -1743.4340820312500000,
        "y": 0.1000061035156250,
        "z": -1075.0777587890625000,
        "direction": 275,
        "type": "mon"
    },
    /* 26 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb6c"),
        "uniqueID1": 34,
        "id": 1,
        "x": -1928.3503417968750000,
        "y": 0.1000132262706757,
        "z": -884.4612426757812500,
        "direction": 255,
        "type": "mon"
    },
    /* 27 */
    {
        "_id": ObjectId("55b338acca012c8110f5ccc8"),
        "uniqueID1": 35,
        "id": 1,
        "x": 1073.4514160156250000,
        "y": 0.1000289916992188,
        "z": -1654.5089111328125000,
        "direction": 283,
        "type": "mon"
    },
    /* 28 */
    {
        "_id": ObjectId("55b338acca012c8110f5ccc9"),
        "uniqueID1": 36,
        "id": 1,
        "x": 1105.1130371093750000,
        "y": 0.1000289916992188,
        "z": -1733.1295166015625000,
        "direction": 79,
        "type": "mon"
    },
    /* 29 */
    {
        "_id": ObjectId("55b338acca012c8110f5cccb"),
        "uniqueID1": 37,
        "id": 1,
        "x": 989.9067382812500000,
        "y": 0.1000289916992188,
        "z": -1842.7626953125000000,
        "direction": 280,
        "type": "mon"
    },
    /* 30 */
    {
        "_id": ObjectId("55b338acca012c8110f5ccca"),
        "uniqueID1": 38,
        "id": 1,
        "x": 1170.8934326171875000,
        "y": 0.1000289916992188,
        "z": -1644.4525146484375000,
        "direction": 89,
        "type": "mon"
    },
    /* 31 */
    {
        "_id": ObjectId("55b338acca012c8110f5cccc"),
        "uniqueID1": 39,
        "id": 1,
        "x": 1043.2391357421875000,
        "y": 0.1000289916992188,
        "z": -1799.6267089843750000,
        "direction": 302,
        "type": "mon"
    },
    /* 32 */
    {
        "_id": ObjectId("55b338acca012c8110f5ccce"),
        "uniqueID1": 40,
        "id": 1,
        "x": 752.3294067382812500,
        "y": 0.1000289916992188,
        "z": -1065.1245117187500000,
        "direction": 307,
        "type": "mon"
    },
    /* 33 */
    {
        "_id": ObjectId("55b338a9ca012c8110f5ccc6"),
        "uniqueID1": 42,
        "id": 1,
        "x": 758.9636230468750000,
        "y": 0.1000289916992188,
        "z": -1367.9405517578125000,
        "direction": 339,
        "type": "mon"
    },
    /* 34 */
    {
        "_id": ObjectId("55b338acca012c8110f5ccd0"),
        "uniqueID1": 43,
        "id": 1,
        "x": 738.5444335937500000,
        "y": 0.1000289916992188,
        "z": -1283.2944335937500000,
        "direction": 157,
        "type": "mon"
    },
    /* 35 */
    {
        "_id": ObjectId("55b338acca012c8110f5cccf"),
        "uniqueID1": 44,
        "id": 1,
        "x": 852.6855468750000000,
        "y": 0.1000289916992188,
        "z": -1154.0799560546875000,
        "direction": 115,
        "type": "mon"
    },
    /* 36 */
    {
        "_id": ObjectId("55b337d3ca012c8110f5cb66"),
        "uniqueID1": 45,
        "id": 1,
        "x": -1821.5786132812500000,
        "y": 0.1000061035156250,
        "z": -608.3853149414062500,
        "direction": 177,
        "type": "mon"
    },
    /* 37 */
    {
        "_id": ObjectId("55b337d3ca012c8110f5cb67"),
        "uniqueID1": 46,
        "id": 1,
        "x": -1855.3828125000000000,
        "y": 0.1000216379761696,
        "z": -511.5097351074218700,
        "direction": 8,
        "type": "mon"
    },
    /* 38 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb6f"),
        "uniqueID1": 48,
        "id": 1,
        "x": -2130.3383789062500000,
        "y": 0.1000289916992188,
        "z": -563.2080078125000000,
        "direction": 79,
        "type": "mon"
    },
    /* 39 */
    {
        "_id": ObjectId("55b338b1ca012c8110f5ccd1"),
        "uniqueID1": 50,
        "id": 1,
        "x": 870.9314575195312500,
        "y": 0.1000289916992188,
        "z": -638.2055664062500000,
        "direction": 85,
        "type": "mon"
    },
    /* 40 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd2"),
        "uniqueID1": 52,
        "id": 1,
        "x": 785.5910034179687500,
        "y": 0.1000289916992188,
        "z": -538.8146972656250000,
        "direction": 174,
        "type": "mon"
    },
    /* 41 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd3"),
        "uniqueID1": 53,
        "id": 1,
        "x": 784.4303588867187500,
        "y": 0.1000289916992188,
        "z": -545.2020263671875000,
        "direction": 20,
        "type": "mon"
    },
    /* 42 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd4"),
        "uniqueID1": 54,
        "id": 1,
        "x": 889.6736450195312500,
        "y": 0.1000289916992188,
        "z": -642.2666625976562500,
        "direction": 183,
        "type": "mon"
    },
    /* 43 */
    {
        "_id": ObjectId("55b338acca012c8110f5cccd"),
        "uniqueID1": 63,
        "id": 1,
        "x": 1219.1087646484375000,
        "y": 0.1000289916992188,
        "z": -1657.5096435546875000,
        "direction": 315,
        "type": "mon"
    },
    /* 44 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccbe"),
        "uniqueID1": 66,
        "id": 1,
        "x": 1085.7534179687500000,
        "y": -9.8085889816284180,
        "z": -2247.3183593750000000,
        "direction": 295,
        "type": "mon"
    },
    /* 45 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccbf"),
        "uniqueID1": 67,
        "id": 1,
        "x": 1080.9875488281250000,
        "y": -9.2402276992797852,
        "z": -2175.2180175781250000,
        "direction": 41,
        "type": "mon"
    },
    /* 46 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccc0"),
        "uniqueID1": 68,
        "id": 1,
        "x": 1016.8909301757812000,
        "y": -9.4665584564208984,
        "z": -2246.1745605468750000,
        "direction": 67,
        "type": "mon"
    },
    /* 47 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccc2"),
        "uniqueID1": 69,
        "id": 1,
        "x": 1171.2642822265625000,
        "y": -9.8364105224609375,
        "z": -2204.5578613281250000,
        "direction": 122,
        "type": "mon"
    },
    /* 48 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb70"),
        "uniqueID1": 75,
        "id": 1,
        "x": -2486.9121093750000000,
        "y": 0.1000289916992188,
        "z": -736.5435791015625000,
        "direction": 286,
        "type": "mon"
    },
    /* 49 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb71"),
        "uniqueID1": 76,
        "id": 1,
        "x": -2338.0715332031250000,
        "y": 0.1000289916992188,
        "z": -510.6991882324218700,
        "direction": 201,
        "type": "mon"
    },
    /* 50 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb6d"),
        "uniqueID1": 77,
        "id": 1,
        "x": -2228.2519531250000000,
        "y": 0.1000289916992188,
        "z": -642.0359497070312500,
        "direction": 183,
        "type": "mon"
    },
    /* 51 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb72"),
        "uniqueID1": 78,
        "id": 1,
        "x": -2324.1418457031250000,
        "y": 0.1000289916992188,
        "z": -824.8068237304687500,
        "direction": 131,
        "type": "mon"
    },
    /* 52 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb73"),
        "uniqueID1": 79,
        "id": 1,
        "x": -2395.2043457031250000,
        "y": 0.1000289916992188,
        "z": -452.9792175292968700,
        "direction": 316,
        "type": "mon"
    },
    /* 53 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc60"),
        "uniqueID1": 85,
        "id": 1,
        "x": -2005.4587402343750000,
        "y": 34.9594841003417970,
        "z": -2420.0939941406250000,
        "direction": 269,
        "type": "mon"
    },
    /* 54 */
    {
        "_id": ObjectId("55b33866ca012c8110f5cc5c"),
        "uniqueID1": 90,
        "id": 1,
        "x": -1736.8559570312500000,
        "y": 27.2162017822265620,
        "z": -2474.8713378906250000,
        "direction": 139,
        "type": "mon"
    },
    /* 55 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc48"),
        "uniqueID1": 91,
        "id": 1,
        "x": -1486.2934570312500000,
        "y": 32.9658889770507810,
        "z": -2564.3271484375000000,
        "direction": 110,
        "type": "mon"
    },
    /* 56 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc58"),
        "uniqueID1": 92,
        "id": 1,
        "x": -1388.1569824218750000,
        "y": 16.2275161743164060,
        "z": -2814.9819335937500000,
        "direction": 289,
        "type": "mon"
    },
    /* 57 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc49"),
        "uniqueID1": 93,
        "id": 1,
        "x": -1501.4942626953125000,
        "y": 28.1112327575683590,
        "z": -2508.1389160156250000,
        "direction": 21,
        "type": "mon"
    },
    /* 58 */
    {
        "_id": ObjectId("55b33866ca012c8110f5cc5d"),
        "uniqueID1": 94,
        "id": 1,
        "x": -1628.2840576171875000,
        "y": 11.8873958587646480,
        "z": -2490.6643066406250000,
        "direction": 321,
        "type": "mon"
    },
    /* 59 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbca"),
        "uniqueID1": 95,
        "id": 1,
        "x": -531.0339965820312500,
        "y": 14.3282966613769530,
        "z": -2807.9548339843750000,
        "direction": 130,
        "type": "mon"
    },
    /* 60 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbcb"),
        "uniqueID1": 96,
        "id": 1,
        "x": -851.7642822265625000,
        "y": 39.7845382690429690,
        "z": -2730.3754882812500000,
        "direction": 91,
        "type": "mon"
    },
    /* 61 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc8"),
        "uniqueID1": 97,
        "id": 1,
        "x": -876.8725585937500000,
        "y": 0.8176751136779785,
        "z": -2450.8703613281250000,
        "direction": 103,
        "type": "mon"
    },
    /* 62 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbcc"),
        "uniqueID1": 98,
        "id": 1,
        "x": -948.4622192382812500,
        "y": 26.8963451385498050,
        "z": -2837.2329101562500000,
        "direction": 331,
        "type": "mon"
    },
    /* 63 */
    {
        "_id": ObjectId("55b3380aca012c8110f5cbc9"),
        "uniqueID1": 99,
        "id": 1,
        "x": -972.5783691406250000,
        "y": 3.8430953025817871,
        "z": -2484.4357910156250000,
        "direction": 39,
        "type": "mon"
    },
    /* 64 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd06"),
        "uniqueID1": 100,
        "id": 1,
        "x": 6.4977874755859375,
        "y": -9.2426929473876953,
        "z": -2603.1557617187500000,
        "direction": 342,
        "type": "mon"
    },
    /* 65 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd07"),
        "uniqueID1": 101,
        "id": 1,
        "x": -240.9899749755859400,
        "y": -9.4165239334106445,
        "z": -2654.6533203125000000,
        "direction": 115,
        "type": "mon"
    },
    /* 66 */
    {
        "_id": ObjectId("55b338d2ca012c8110f5cd08"),
        "uniqueID1": 102,
        "id": 1,
        "x": -37.0003890991210940,
        "y": -9.4274597167968750,
        "z": -2654.6123046875000000,
        "direction": 94,
        "type": "mon"
    },
    /* 67 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbcd"),
        "uniqueID1": 103,
        "id": 1,
        "x": -348.6504516601562500,
        "y": -10.1340017318725590,
        "z": -2865.2487792968750000,
        "direction": 250,
        "type": "mon"
    },
    /* 68 */
    {
        "_id": ObjectId("55b33891ca012c8110f5ccaa"),
        "uniqueID1": 104,
        "id": 1,
        "x": -305.3605041503906200,
        "y": -7.7620506286621094,
        "z": -2670.2773437500000000,
        "direction": 180,
        "type": "mon"
    },
    /* 69 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccab"),
        "uniqueID1": 105,
        "id": 1,
        "x": 387.3064575195312500,
        "y": -9.8364105224609375,
        "z": -2717.4335937500000000,
        "direction": 261,
        "type": "mon"
    },
    /* 70 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccac"),
        "uniqueID1": 106,
        "id": 1,
        "x": 278.6846618652343700,
        "y": -9.6301088333129883,
        "z": -2801.6403808593750000,
        "direction": 3,
        "type": "mon"
    },
    /* 71 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccad"),
        "uniqueID1": 107,
        "id": 1,
        "x": 446.6799926757812500,
        "y": -7.5491433143615723,
        "z": -2793.0524902343750000,
        "direction": 80,
        "type": "mon"
    },
    /* 72 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccc1"),
        "uniqueID1": 108,
        "id": 1,
        "x": 351.2823181152343700,
        "y": -9.8364105224609375,
        "z": -2553.0407714843750000,
        "direction": 296,
        "type": "mon"
    },
    /* 73 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccae"),
        "uniqueID1": 109,
        "id": 1,
        "x": 473.4264221191406200,
        "y": -9.8364105224609375,
        "z": -2691.8342285156250000,
        "direction": 84,
        "type": "mon"
    },
    /* 74 */
    {
        "_id": ObjectId("55b337e1ca012c8110f5cb7d"),
        "uniqueID1": 115,
        "id": 1,
        "x": -2931.1215820312500000,
        "y": 0.1990308165550232,
        "z": -1038.0159912109375000,
        "direction": 337,
        "type": "mon"
    },
    /* 75 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb76"),
        "uniqueID1": 116,
        "id": 1,
        "x": -2932.7478027343750000,
        "y": 0.1000289916992188,
        "z": -1080.1821289062500000,
        "direction": 343,
        "type": "mon"
    },
    /* 76 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb74"),
        "uniqueID1": 117,
        "id": 1,
        "x": -2605.6499023437500000,
        "y": 8.4413881301879883,
        "z": -975.0756835937500000,
        "direction": 75,
        "type": "mon"
    },
    /* 77 */
    {
        "_id": ObjectId("55b337d9ca012c8110f5cb75"),
        "uniqueID1": 118,
        "id": 1,
        "x": -2705.3859863281250000,
        "y": 0.1000289916992188,
        "z": -1108.5313720703125000,
        "direction": 205,
        "type": "mon"
    },
    /* 78 */
    {
        "_id": ObjectId("55b337e1ca012c8110f5cb7e"),
        "uniqueID1": 119,
        "id": 1,
        "x": -2934.0861816406250000,
        "y": 5.7815065383911133,
        "z": -805.4979248046875000,
        "direction": 312,
        "type": "mon"
    },
    /* 79 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc59"),
        "uniqueID1": 125,
        "id": 1,
        "x": -1934.8150634765625000,
        "y": 40.5950469970703130,
        "z": -2668.2534179687500000,
        "direction": 128,
        "type": "mon"
    },
    /* 80 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc61"),
        "uniqueID1": 126,
        "id": 1,
        "x": -1998.9847412109375000,
        "y": 22.4626827239990230,
        "z": -2796.4042968750000000,
        "direction": 17,
        "type": "mon"
    },
    /* 81 */
    {
        "_id": ObjectId("55b33863ca012c8110f5cc5a"),
        "uniqueID1": 127,
        "id": 1,
        "x": -1882.7265625000000000,
        "y": 22.7250480651855470,
        "z": -2872.7939453125000000,
        "direction": 90,
        "type": "mon"
    },
    /* 82 */
    {
        "_id": ObjectId("55b33866ca012c8110f5cc5e"),
        "uniqueID1": 128,
        "id": 1,
        "x": -1916.4379882812500000,
        "y": 40.5950469970703130,
        "z": -2659.0847167968750000,
        "direction": 272,
        "type": "mon"
    },
    /* 83 */
    {
        "_id": ObjectId("55b33866ca012c8110f5cc5f"),
        "uniqueID1": 129,
        "id": 1,
        "x": -1880.7716064453125000,
        "y": 40.5950469970703130,
        "z": -2575.5234375000000000,
        "direction": 128,
        "type": "mon"
    },
    /* 84 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4a"),
        "uniqueID1": 130,
        "id": 1,
        "x": -1265.8476562500000000,
        "y": 0.2119313180446625,
        "z": -3136.2731933593750000,
        "direction": 353,
        "type": "mon"
    },
    /* 85 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4b"),
        "uniqueID1": 131,
        "id": 1,
        "x": -1440.9454345703125000,
        "y": 15.8288946151733400,
        "z": -3043.8310546875000000,
        "direction": 303,
        "type": "mon"
    },
    /* 86 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4c"),
        "uniqueID1": 132,
        "id": 1,
        "x": -1203.0216064453125000,
        "y": 3.1469583511352539,
        "z": -2967.9663085937500000,
        "direction": 327,
        "type": "mon"
    },
    /* 87 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4d"),
        "uniqueID1": 133,
        "id": 1,
        "x": -1333.2899169921875000,
        "y": 18.0031223297119140,
        "z": -3066.4472656250000000,
        "direction": 205,
        "type": "mon"
    },
    /* 88 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4e"),
        "uniqueID1": 134,
        "id": 1,
        "x": -1474.4053955078125000,
        "y": 37.4952888488769530,
        "z": -2847.0761718750000000,
        "direction": 113,
        "type": "mon"
    },
    /* 89 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbce"),
        "uniqueID1": 135,
        "id": 1,
        "x": -635.9465332031250000,
        "y": 0.1001586914062500,
        "z": -3112.6552734375000000,
        "direction": 162,
        "type": "mon"
    },
    /* 90 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbcf"),
        "uniqueID1": 136,
        "id": 1,
        "x": -839.7740478515625000,
        "y": 0.1001586914062500,
        "z": -3292.2932128906250000,
        "direction": 155,
        "type": "mon"
    },
    /* 91 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd0"),
        "uniqueID1": 137,
        "id": 1,
        "x": -590.6385498046875000,
        "y": 0.1001586914062500,
        "z": -3232.4047851562500000,
        "direction": 41,
        "type": "mon"
    },
    /* 92 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd1"),
        "uniqueID1": 138,
        "id": 1,
        "x": -752,
        "y": 4.6406359672546387,
        "z": -3134,
        "direction": 133,
        "type": "mon"
    },
    /* 93 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd2"),
        "uniqueID1": 139,
        "id": 1,
        "x": -667.3522949218750000,
        "y": 1.1098345518112183,
        "z": -3051.7883300781250000,
        "direction": 71,
        "type": "mon"
    },
    /* 94 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd3"),
        "uniqueID1": 140,
        "id": 1,
        "x": -350.1352539062500000,
        "y": 12.7453136444091800,
        "z": -3016.4531250000000000,
        "direction": 161,
        "type": "mon"
    },
    /* 95 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd4"),
        "uniqueID1": 141,
        "id": 1,
        "x": -192.8139038085937500,
        "y": -9.8362808227539062,
        "z": -3167.0681152343750000,
        "direction": 144,
        "type": "mon"
    },
    /* 96 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd5"),
        "uniqueID1": 142,
        "id": 1,
        "x": -391.7973632812500000,
        "y": 6.4424815177917480,
        "z": -2994.1137695312500000,
        "direction": 233,
        "type": "mon"
    },
    /* 97 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd6"),
        "uniqueID1": 143,
        "id": 1,
        "x": -379.6283264160156200,
        "y": -0.9188399910926819,
        "z": -3157.9846191406250000,
        "direction": 130,
        "type": "mon"
    },
    /* 98 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd7"),
        "uniqueID1": 144,
        "id": 1,
        "x": -248.1193847656250000,
        "y": -9.8362808227539062,
        "z": -3231.9135742187500000,
        "direction": 232,
        "type": "mon"
    },
    /* 99 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccaf"),
        "uniqueID1": 145,
        "id": 1,
        "x": 538.9314575195312500,
        "y": -6.1644015312194824,
        "z": -3158.4738769531250000,
        "direction": 148,
        "type": "mon"
    },
    /* 100 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb0"),
        "uniqueID1": 146,
        "id": 1,
        "x": 616.3342285156250000,
        "y": -9.8364105224609375,
        "z": -2998.9118652343750000,
        "direction": 200,
        "type": "mon"
    },
    /* 101 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb1"),
        "uniqueID1": 147,
        "id": 1,
        "x": 603.5870361328125000,
        "y": -5.9937796592712402,
        "z": -2893.9736328125000000,
        "direction": 166,
        "type": "mon"
    },
    /* 102 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb2"),
        "uniqueID1": 148,
        "id": 1,
        "x": 373.2999877929687500,
        "y": -2.9441485404968262,
        "z": -3246.3784179687500000,
        "direction": 222,
        "type": "mon"
    },
    /* 103 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb3"),
        "uniqueID1": 149,
        "id": 1,
        "x": 473.5871887207031200,
        "y": -3.1572172641754150,
        "z": -2885.3576660156250000,
        "direction": 138,
        "type": "mon"
    },
    /* 104 */
    {
        "_id": ObjectId("55b3345bca012c8110f5cb4c"),
        "uniqueID1": 1,
        "id": 2,
        "x": -879,
        "y": 221,
        "z": 185,
        "direction": 90,
        "type": "npc"
    },
    /* 105 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccc3"),
        "uniqueID1": 150,
        "id": 2,
        "x": 1120.1668701171875000,
        "y": -6.8295350074768066,
        "z": -2464.1762695312500000,
        "direction": 83,
        "type": "mon"
    },
    /* 106 */
    {
        "_id": ObjectId("55b338a7ca012c8110f5ccc4"),
        "uniqueID1": 151,
        "id": 2,
        "x": 853.9744262695312500,
        "y": -4.6278686523437500,
        "z": -2489.8334960937500000,
        "direction": 145,
        "type": "mon"
    },
    /* 107 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd5"),
        "uniqueID1": 183,
        "id": 2,
        "x": 1522.0125732421875000,
        "y": 30.5503768920898440,
        "z": -752.9790039062500000,
        "direction": 305,
        "type": "mon"
    },
    /* 108 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd6"),
        "uniqueID1": 185,
        "id": 2,
        "x": 1323.8427734375000000,
        "y": 0.1000289916992188,
        "z": -298.1293029785156200,
        "direction": 74,
        "type": "mon"
    },
    /* 109 */
    {
        "_id": ObjectId("55b338b4ca012c8110f5ccda"),
        "uniqueID1": 186,
        "id": 2,
        "x": 1471.9389648437500000,
        "y": 0.1000289916992188,
        "z": -274.2213439941406200,
        "direction": 323,
        "type": "mon"
    },
    /* 110 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd7"),
        "uniqueID1": 187,
        "id": 2,
        "x": 1193.0253906250000000,
        "y": 0.1000289916992188,
        "z": -392.3268127441406200,
        "direction": 200,
        "type": "mon"
    },
    /* 111 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd8"),
        "uniqueID1": 188,
        "id": 2,
        "x": 1302.4846191406250000,
        "y": 0.1000289916992188,
        "z": -88.4323120117187500,
        "direction": 100,
        "type": "mon"
    },
    /* 112 */
    {
        "_id": ObjectId("55b338b2ca012c8110f5ccd9"),
        "uniqueID1": 189,
        "id": 2,
        "x": 1446.1533203125000000,
        "y": 0.1000289916992188,
        "z": -148.7458953857421900,
        "direction": 197,
        "type": "mon"
    },
    /* 113 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb4"),
        "uniqueID1": 190,
        "id": 2,
        "x": 107.3564147949218700,
        "y": -4.5685706138610840,
        "z": -3072.9162597656250000,
        "direction": 37,
        "type": "mon"
    },
    /* 114 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb5"),
        "uniqueID1": 191,
        "id": 2,
        "x": 142.6416625976562500,
        "y": -9.8364105224609375,
        "z": -3355.3872070312500000,
        "direction": 241,
        "type": "mon"
    },
    /* 115 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb7"),
        "uniqueID1": 192,
        "id": 2,
        "x": 232.2819061279296900,
        "y": -9.4445981979370117,
        "z": -3069.8054199218750000,
        "direction": 293,
        "type": "mon"
    },
    /* 116 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb6"),
        "uniqueID1": 193,
        "id": 2,
        "x": 323.5855102539062500,
        "y": 0.1000289916992188,
        "z": -3320.1276855468750000,
        "direction": 8,
        "type": "mon"
    },
    /* 117 */
    {
        "_id": ObjectId("55b338a1ca012c8110f5ccb8"),
        "uniqueID1": 194,
        "id": 2,
        "x": 128.5399475097656200,
        "y": -5.8504705429077148,
        "z": -3094.2565917968750000,
        "direction": 283,
        "type": "mon"
    },
    /* 118 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd8"),
        "uniqueID1": 195,
        "id": 2,
        "x": -368.8231201171875000,
        "y": -2.8779542446136475,
        "z": -3468.9938964843750000,
        "direction": 242,
        "type": "mon"
    },
    /* 119 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbd9"),
        "uniqueID1": 196,
        "id": 2,
        "x": -165.3746948242187500,
        "y": -6.2427735328674316,
        "z": -3345.1596679687500000,
        "direction": 163,
        "type": "mon"
    },
    /* 120 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbde"),
        "uniqueID1": 197,
        "id": 2,
        "x": -549.4384155273437500,
        "y": 0.1001586914062500,
        "z": -3608.5151367187500000,
        "direction": 94,
        "type": "mon"
    },
    /* 121 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbda"),
        "uniqueID1": 199,
        "id": 2,
        "x": -258.5806274414062500,
        "y": -9.8362808227539062,
        "z": -3317.3386230468750000,
        "direction": 210,
        "type": "mon"
    },
    /* 122 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe2"),
        "uniqueID1": 200,
        "id": 2,
        "x": -961.3032226562500000,
        "y": 0.5949364900588989,
        "z": -3699.7673339843750000,
        "direction": 48,
        "type": "mon"
    },
    /* 123 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbdb"),
        "uniqueID1": 201,
        "id": 2,
        "x": -850.6266479492187500,
        "y": 0.1001586914062500,
        "z": -3271.0649414062500000,
        "direction": 201,
        "type": "mon"
    },
    /* 124 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbdf"),
        "uniqueID1": 202,
        "id": 2,
        "x": -811.2232055664062500,
        "y": 0.1001586914062500,
        "z": -3584.8725585937500000,
        "direction": 258,
        "type": "mon"
    },
    /* 125 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbdc"),
        "uniqueID1": 203,
        "id": 2,
        "x": -845.7454223632812500,
        "y": 0.1001586914062500,
        "z": -3521.1020507812500000,
        "direction": 69,
        "type": "mon"
    },
    /* 126 */
    {
        "_id": ObjectId("55b3380fca012c8110f5cbdd"),
        "uniqueID1": 204,
        "id": 2,
        "x": -930.7042236328125000,
        "y": 0.1001586914062500,
        "z": -3395.2177734375000000,
        "direction": 231,
        "type": "mon"
    },
    /* 127 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc4f"),
        "uniqueID1": 205,
        "id": 2,
        "x": -1285.5290527343750000,
        "y": 0.1001586914062500,
        "z": -3236.8681640625000000,
        "direction": 309,
        "type": "mon"
    },
    /* 128 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc50"),
        "uniqueID1": 207,
        "id": 2,
        "x": -1379.5390625000000000,
        "y": 28.1654815673828130,
        "z": -3045.6157226562500000,
        "direction": 32,
        "type": "mon"
    },
    /* 129 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc51"),
        "uniqueID1": 208,
        "id": 2,
        "x": -1264.7545166015625000,
        "y": 13.2323379516601560,
        "z": -3033.8857421875000000,
        "direction": 328,
        "type": "mon"
    },
    /* 130 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc52"),
        "uniqueID1": 209,
        "id": 2,
        "x": -1395.9593505859375000,
        "y": 0.1612183004617691,
        "z": -3400.3840332031250000,
        "direction": 256,
        "type": "mon"
    },
    /* 131 */
    {
        "_id": ObjectId("55b33860ca012c8110f5cc53"),
        "uniqueID1": 210,
        "id": 2,
        "x": -1730.7365722656250000,
        "y": 0.1001586914062500,
        "z": -3117.0710449218750000,
        "direction": 228,
        "type": "mon"
    },
    /* 132 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc62"),
        "uniqueID1": 215,
        "id": 2,
        "x": -2711.4069824218750000,
        "y": 7.0384030342102051,
        "z": -2874.3237304687500000,
        "direction": 319,
        "type": "mon"
    },
    /* 133 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc63"),
        "uniqueID1": 216,
        "id": 2,
        "x": -2596.1347656250000000,
        "y": 84.2120437622070310,
        "z": -2647.6105957031250000,
        "direction": 122,
        "type": "mon"
    },
    /* 134 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc64"),
        "uniqueID1": 218,
        "id": 2,
        "x": -2519.3977050781250000,
        "y": 60.3454895019531250,
        "z": -2593.6735839843750000,
        "direction": 314,
        "type": "mon"
    },
    /* 135 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc65"),
        "uniqueID1": 219,
        "id": 2,
        "x": -2360.4270019531250000,
        "y": 24.8433189392089840,
        "z": -2552.7995605468750000,
        "direction": 26,
        "type": "mon"
    },
    /* 136 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc68"),
        "uniqueID1": 220,
        "id": 2,
        "x": -2391.4533691406250000,
        "y": 0.1001586914062500,
        "z": -3177.9848632812500000,
        "direction": 250,
        "type": "mon"
    },
    /* 137 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc69"),
        "uniqueID1": 221,
        "id": 2,
        "x": -2222.5673828125000000,
        "y": 0.1001586914062500,
        "z": -3100.8183593750000000,
        "direction": 345,
        "type": "mon"
    },
    /* 138 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6a"),
        "uniqueID1": 222,
        "id": 2,
        "x": -2169.2770996093750000,
        "y": 2.6276612281799316,
        "z": -3259.9233398437500000,
        "direction": 59,
        "type": "mon"
    },
    /* 139 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6b"),
        "uniqueID1": 223,
        "id": 2,
        "x": -2262.3227539062500000,
        "y": 0.1001586914062500,
        "z": -2977.0642089843750000,
        "direction": 325,
        "type": "mon"
    },
    /* 140 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6c"),
        "uniqueID1": 224,
        "id": 2,
        "x": -2126.2800292968750000,
        "y": 0.1001586914062500,
        "z": -3187.0312500000000000,
        "direction": 52,
        "type": "mon"
    },
    /* 141 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb0"),
        "uniqueID1": 229,
        "id": 2,
        "x": -3185.1528320312500000,
        "y": 44.3096809387207030,
        "z": -2604.9470214843750000,
        "direction": 331,
        "type": "mon"
    },
    /* 142 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb77"),
        "uniqueID1": 238,
        "id": 2,
        "x": -2810.2189941406250000,
        "y": 0.1000289916992188,
        "z": -1235.0120849609375000,
        "direction": 3,
        "type": "mon"
    },
    /* 143 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb80"),
        "uniqueID1": 240,
        "id": 2,
        "x": -3341.6115722656250000,
        "y": 0.1000289916992188,
        "z": -895.8733520507812500,
        "direction": 36,
        "type": "mon"
    },
    /* 144 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb81"),
        "uniqueID1": 241,
        "id": 2,
        "x": -3367.1252441406250000,
        "y": 23.3586463928222660,
        "z": -1055.5644531250000000,
        "direction": 21,
        "type": "mon"
    },
    /* 145 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb78"),
        "uniqueID1": 242,
        "id": 2,
        "x": -3084.8212890625000000,
        "y": 0.1588992923498154,
        "z": -809.2420654296875000,
        "direction": 128,
        "type": "mon"
    },
    /* 146 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb79"),
        "uniqueID1": 243,
        "id": 2,
        "x": -3017.4785156250000000,
        "y": 0.1000289916992188,
        "z": -669.6420898437500000,
        "direction": 176,
        "type": "mon"
    },
    /* 147 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb7a"),
        "uniqueID1": 244,
        "id": 2,
        "x": -3159.7485351562500000,
        "y": 0.2207889109849930,
        "z": -897.8936157226562500,
        "direction": 177,
        "type": "mon"
    },
    /* 148 */
    {
        "_id": ObjectId("55b337e1ca012c8110f5cb7f"),
        "uniqueID1": 245,
        "id": 2,
        "x": -3073.8903808593750000,
        "y": 0.1000289916992188,
        "z": -539.5913696289062500,
        "direction": 4,
        "type": "mon"
    },
    /* 149 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb7b"),
        "uniqueID1": 246,
        "id": 2,
        "x": -2903.8461914062500000,
        "y": 0.1000289916992188,
        "z": -531.7073974609375000,
        "direction": 28,
        "type": "mon"
    },
    /* 150 */
    {
        "_id": ObjectId("55b337deca012c8110f5cb7c"),
        "uniqueID1": 249,
        "id": 2,
        "x": -2981.0891113281250000,
        "y": 0.1000289916992188,
        "z": -455.8930358886718700,
        "direction": 16,
        "type": "mon"
    },
    /* 151 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc66"),
        "uniqueID1": 286,
        "id": 2,
        "x": -2637.4548339843750000,
        "y": 0.1001586914062500,
        "z": -2954.5163574218750000,
        "direction": 0,
        "type": "mon"
    },
    /* 152 */
    {
        "_id": ObjectId("55b33868ca012c8110f5cc67"),
        "uniqueID1": 288,
        "id": 2,
        "x": -2693.7634277343750000,
        "y": 0.8733250498771668,
        "z": -2930.8195800781250000,
        "direction": 351,
        "type": "mon"
    },
    /* 153 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb82"),
        "uniqueID1": 293,
        "id": 2,
        "x": -3588.8420410156250000,
        "y": 0.1000289916992188,
        "z": -463.1595458984375000,
        "direction": 278,
        "type": "mon"
    },
    /* 154 */
    {
        "_id": ObjectId("55b338c4ca012c8110f5ccfc"),
        "uniqueID1": 425,
        "id": 2,
        "x": 2973.9331054687500000,
        "y": 0.1000289916992188,
        "z": -469.5572509765625000,
        "direction": 268,
        "type": "mon"
    },
    /* 155 */
    {
        "_id": ObjectId("55b338c4ca012c8110f5ccfd"),
        "uniqueID1": 427,
        "id": 2,
        "x": 2985.5725097656250000,
        "y": 0.1000289916992188,
        "z": -545.2604980468750000,
        "direction": 242,
        "type": "mon"
    },
    /* 156 */
    {
        "_id": ObjectId("55b3345bca012c8110f5cb4d"),
        "uniqueID1": 2,
        "id": 3,
        "x": -880,
        "y": 221,
        "z": 284,
        "direction": 90,
        "type": "npc"
    },
    /* 157 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5ccdd"),
        "uniqueID1": 265,
        "id": 3,
        "x": 1263.2119140625000000,
        "y": 0.1000289916992188,
        "z": 306.2423095703125000,
        "direction": 270,
        "type": "mon"
    },
    /* 158 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5ccde"),
        "uniqueID1": 266,
        "id": 3,
        "x": 1376.0816650390625000,
        "y": 0.1000289916992188,
        "z": 215.2691650390625000,
        "direction": 20,
        "type": "mon"
    },
    /* 159 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5ccdf"),
        "uniqueID1": 267,
        "id": 3,
        "x": 1342.1401367187500000,
        "y": 0.1000289916992188,
        "z": 225.3539123535156200,
        "direction": 229,
        "type": "mon"
    },
    /* 160 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce0"),
        "uniqueID1": 268,
        "id": 3,
        "x": 1182.0714111328125000,
        "y": 0.1000289916992188,
        "z": 379.2182312011718700,
        "direction": 294,
        "type": "mon"
    },
    /* 161 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce1"),
        "uniqueID1": 269,
        "id": 3,
        "x": 1495.2493896484375000,
        "y": 0.1000289916992188,
        "z": 296.1274108886718700,
        "direction": 163,
        "type": "mon"
    },
    /* 162 */
    {
        "_id": ObjectId("55b338b4ca012c8110f5ccdb"),
        "uniqueID1": 271,
        "id": 3,
        "x": 1719.3729248046875000,
        "y": 10.5935611724853520,
        "z": 33.8185691833496090,
        "direction": 6,
        "type": "mon"
    },
    /* 163 */
    {
        "_id": ObjectId("55b337e9ca012c8110f5cb95"),
        "uniqueID1": 300,
        "id": 3,
        "x": -4104.1616210937500000,
        "y": 1.8450390100479126,
        "z": -311.9877624511718700,
        "direction": 297,
        "type": "mon"
    },
    /* 164 */
    {
        "_id": ObjectId("55b337e9ca012c8110f5cb96"),
        "uniqueID1": 301,
        "id": 3,
        "x": -4080.6904296875000000,
        "y": 0.1000289916992188,
        "z": -471.7627868652343700,
        "direction": 166,
        "type": "mon"
    },
    /* 165 */
    {
        "_id": ObjectId("55b337e9ca012c8110f5cb97"),
        "uniqueID1": 302,
        "id": 3,
        "x": -4174.8339843750000000,
        "y": 3.4993298053741455,
        "z": -292.1735839843750000,
        "direction": 125,
        "type": "mon"
    },
    /* 166 */
    {
        "_id": ObjectId("55b337ecca012c8110f5cb98"),
        "uniqueID1": 303,
        "id": 3,
        "x": -4044.9370117187500000,
        "y": 0.1000289916992188,
        "z": -507.0449829101562500,
        "direction": 46,
        "type": "mon"
    },
    /* 167 */
    {
        "_id": ObjectId("55b337ecca012c8110f5cb99"),
        "uniqueID1": 304,
        "id": 3,
        "x": -4143.8769531250000000,
        "y": 0.1000289916992188,
        "z": -416.4211425781250000,
        "direction": 198,
        "type": "mon"
    },
    /* 168 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb87"),
        "uniqueID1": 305,
        "id": 3,
        "x": -3718.4885253906250000,
        "y": 0.1000289916992188,
        "z": -751.3103027343750000,
        "direction": 163,
        "type": "mon"
    },
    /* 169 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb88"),
        "uniqueID1": 306,
        "id": 3,
        "x": -3956.7780761718750000,
        "y": 0.1058180406689644,
        "z": -966.9178466796875000,
        "direction": 132,
        "type": "mon"
    },
    /* 170 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb83"),
        "uniqueID1": 307,
        "id": 3,
        "x": -3697.8039550781250000,
        "y": 3.0816168785095215,
        "z": -1075.6075439453125000,
        "direction": 0,
        "type": "mon"
    },
    /* 171 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb84"),
        "uniqueID1": 308,
        "id": 3,
        "x": -3598.3134765625000000,
        "y": 2.7205712795257568,
        "z": -702.1907348632812500,
        "direction": 343,
        "type": "mon"
    },
    /* 172 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb85"),
        "uniqueID1": 309,
        "id": 3,
        "x": -3771.3583984375000000,
        "y": 1.3046588897705078,
        "z": -974.0244750976562500,
        "direction": 288,
        "type": "mon"
    },
    /* 173 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb89"),
        "uniqueID1": 310,
        "id": 3,
        "x": -3637.6518554687500000,
        "y": 18.7872753143310550,
        "z": -1198.0549316406250000,
        "direction": 211,
        "type": "mon"
    },
    /* 174 */
    {
        "_id": ObjectId("55b337f1ca012c8110f5cb9a"),
        "uniqueID1": 311,
        "id": 3,
        "x": -3521.3273925781250000,
        "y": 37.2880325317382810,
        "z": -1215.0158691406250000,
        "direction": 329,
        "type": "mon"
    },
    /* 175 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cb9c"),
        "uniqueID1": 312,
        "id": 3,
        "x": -3910.6049804687500000,
        "y": 0.2437204420566559,
        "z": -1361.4527587890625000,
        "direction": 293,
        "type": "mon"
    },
    /* 176 */
    {
        "_id": ObjectId("55b337e4ca012c8110f5cb86"),
        "uniqueID1": 313,
        "id": 3,
        "x": -3931.4409179687500000,
        "y": 0.1000289916992188,
        "z": -1280.2154541015625000,
        "direction": 307,
        "type": "mon"
    },
    /* 177 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8a"),
        "uniqueID1": 314,
        "id": 3,
        "x": -3787.2531738281250000,
        "y": 4.8883576393127441,
        "z": -1409.5228271484375000,
        "direction": 188,
        "type": "mon"
    },
    /* 178 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cb9d"),
        "uniqueID1": 317,
        "id": 3,
        "x": -3639.6738281250000000,
        "y": 45.1133232116699220,
        "z": -1966.7939453125000000,
        "direction": 31,
        "type": "mon"
    },
    /* 179 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cb9e"),
        "uniqueID1": 318,
        "id": 3,
        "x": -3698.8291015625000000,
        "y": 46.3056564331054690,
        "z": -1934.0264892578125000,
        "direction": 77,
        "type": "mon"
    },
    /* 180 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cb9f"),
        "uniqueID1": 319,
        "id": 3,
        "x": -3441.5275878906250000,
        "y": 7.8063650131225586,
        "z": -1863.9500732421875000,
        "direction": 122,
        "type": "mon"
    },
    /* 181 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8b"),
        "uniqueID1": 320,
        "id": 3,
        "x": -3914.1511230468750000,
        "y": 0.1000289916992188,
        "z": -1230.6112060546875000,
        "direction": 309,
        "type": "mon"
    },
    /* 182 */
    {
        "_id": ObjectId("55b337f1ca012c8110f5cb9b"),
        "uniqueID1": 323,
        "id": 3,
        "x": -3950.8586425781250000,
        "y": 0.1000289916992188,
        "z": -1560.5535888671875000,
        "direction": 141,
        "type": "mon"
    },
    /* 183 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8c"),
        "uniqueID1": 324,
        "id": 3,
        "x": -4108.8842773437500000,
        "y": 12.3289775848388670,
        "z": -1425.3977050781250000,
        "direction": 250,
        "type": "mon"
    },
    /* 184 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8d"),
        "uniqueID1": 325,
        "id": 3,
        "x": -4331.4340820312500000,
        "y": 30.1788768768310550,
        "z": -962.1575927734375000,
        "direction": 318,
        "type": "mon"
    },
    /* 185 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8e"),
        "uniqueID1": 326,
        "id": 3,
        "x": -4265.2260742187500000,
        "y": 6.2818546295166016,
        "z": -817.1084594726562500,
        "direction": 222,
        "type": "mon"
    },
    /* 186 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb8f"),
        "uniqueID1": 327,
        "id": 3,
        "x": -3905.5129394531250000,
        "y": 0.1000289916992188,
        "z": -975.2074584960937500,
        "direction": 166,
        "type": "mon"
    },
    /* 187 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb90"),
        "uniqueID1": 328,
        "id": 3,
        "x": -3955.9877929687500000,
        "y": 0.1032424643635750,
        "z": -980.8121948242187500,
        "direction": 155,
        "type": "mon"
    },
    /* 188 */
    {
        "_id": ObjectId("55b337e6ca012c8110f5cb91"),
        "uniqueID1": 329,
        "id": 3,
        "x": -4193.2724609375000000,
        "y": 2.9662406444549561,
        "z": -876.6632690429687500,
        "direction": 56,
        "type": "mon"
    },
    /* 189 */
    {
        "_id": ObjectId("55b337f7ca012c8110f5cba3"),
        "uniqueID1": 330,
        "id": 3,
        "x": -3818.3666992187500000,
        "y": 53.2011413574218750,
        "z": -2241.9167480468750000,
        "direction": 225,
        "type": "mon"
    },
    /* 190 */
    {
        "_id": ObjectId("55b337f7ca012c8110f5cba4"),
        "uniqueID1": 331,
        "id": 3,
        "x": -3997.3020019531250000,
        "y": 0.1048376709222794,
        "z": -1999.4975585937500000,
        "direction": 231,
        "type": "mon"
    },
    /* 191 */
    {
        "_id": ObjectId("55b337f7ca012c8110f5cba5"),
        "uniqueID1": 334,
        "id": 3,
        "x": -3699.4499511718750000,
        "y": 56.4368247985839840,
        "z": -2204.9311523437500000,
        "direction": 160,
        "type": "mon"
    },
    /* 192 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb1"),
        "uniqueID1": 335,
        "id": 3,
        "x": -3432.0522460937500000,
        "y": 26.9311428070068360,
        "z": -2485.5380859375000000,
        "direction": 143,
        "type": "mon"
    },
    /* 193 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb2"),
        "uniqueID1": 336,
        "id": 3,
        "x": -3543.5566406250000000,
        "y": 8.1708240509033203,
        "z": -2453.7197265625000000,
        "direction": 255,
        "type": "mon"
    },
    /* 194 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb3"),
        "uniqueID1": 337,
        "id": 3,
        "x": -3523.8549804687500000,
        "y": 6.4592108726501465,
        "z": -2437.6074218750000000,
        "direction": 232,
        "type": "mon"
    },
    /* 195 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb4"),
        "uniqueID1": 339,
        "id": 3,
        "x": -3565.9543457031250000,
        "y": 16.1253833770751950,
        "z": -2500.9519042968750000,
        "direction": 239,
        "type": "mon"
    },
    /* 196 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb5"),
        "uniqueID1": 340,
        "id": 3,
        "x": -3506.1140136718750000,
        "y": 37.4880523681640620,
        "z": -2878.0017089843750000,
        "direction": 215,
        "type": "mon"
    },
    /* 197 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb6"),
        "uniqueID1": 341,
        "id": 3,
        "x": -3659.6535644531250000,
        "y": 35.4484863281250000,
        "z": -2852.6689453125000000,
        "direction": 18,
        "type": "mon"
    },
    /* 198 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb7"),
        "uniqueID1": 342,
        "id": 3,
        "x": -3424.8586425781250000,
        "y": 30.2089138031005860,
        "z": -2848.8088378906250000,
        "direction": 293,
        "type": "mon"
    },
    /* 199 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb8"),
        "uniqueID1": 343,
        "id": 3,
        "x": -3771.9990234375000000,
        "y": 15.5072298049926760,
        "z": -2801.5434570312500000,
        "direction": 199,
        "type": "mon"
    },
    /* 200 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbb9"),
        "uniqueID1": 344,
        "id": 3,
        "x": -3764.4438476562500000,
        "y": 27.7043533325195310,
        "z": -2905.9824218750000000,
        "direction": 191,
        "type": "mon"
    },
    /* 201 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbbb"),
        "uniqueID1": 345,
        "id": 3,
        "x": -3356.3649902343750000,
        "y": 19.4147014617919920,
        "z": -2873.6696777343750000,
        "direction": 226,
        "type": "mon"
    },
    /* 202 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbba"),
        "uniqueID1": 346,
        "id": 3,
        "x": -3159.0700683593750000,
        "y": 58.7218093872070310,
        "z": -3038.9306640625000000,
        "direction": 336,
        "type": "mon"
    },
    /* 203 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbbc"),
        "uniqueID1": 347,
        "id": 3,
        "x": -3327.1423339843750000,
        "y": 20.6035175323486330,
        "z": -2984.8671875000000000,
        "direction": 32,
        "type": "mon"
    },
    /* 204 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbbd"),
        "uniqueID1": 348,
        "id": 3,
        "x": -3320.2766113281250000,
        "y": 23.4067039489746090,
        "z": -2965.8652343750000000,
        "direction": 260,
        "type": "mon"
    },
    /* 205 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbbe"),
        "uniqueID1": 349,
        "id": 3,
        "x": -3230.3444824218750000,
        "y": 48.5749931335449220,
        "z": -2861.2907714843750000,
        "direction": 116,
        "type": "mon"
    },
    /* 206 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc7b"),
        "uniqueID1": 350,
        "id": 3,
        "x": -2995.9145507812500000,
        "y": 7.8985185623168945,
        "z": -3384.5754394531250000,
        "direction": 196,
        "type": "mon"
    },
    /* 207 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc75"),
        "uniqueID1": 351,
        "id": 3,
        "x": -3039.5610351562500000,
        "y": 5.4051523208618164,
        "z": -3177.6010742187500000,
        "direction": 266,
        "type": "mon"
    },
    /* 208 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc7c"),
        "uniqueID1": 352,
        "id": 3,
        "x": -3030.2761230468750000,
        "y": 15.8697223663330080,
        "z": -3457.7043457031250000,
        "direction": 224,
        "type": "mon"
    },
    /* 209 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc76"),
        "uniqueID1": 353,
        "id": 3,
        "x": -3119.1633300781250000,
        "y": 0.1001586914062500,
        "z": -3263.2053222656250000,
        "direction": 250,
        "type": "mon"
    },
    /* 210 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc7d"),
        "uniqueID1": 354,
        "id": 3,
        "x": -3059.9963378906250000,
        "y": 0.8719169497489929,
        "z": -3360.1025390625000000,
        "direction": 349,
        "type": "mon"
    },
    /* 211 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6d"),
        "uniqueID1": 355,
        "id": 3,
        "x": -2547.7099609375000000,
        "y": 1.8888864517211914,
        "z": -3306.4929199218750000,
        "direction": 35,
        "type": "mon"
    },
    /* 212 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc77"),
        "uniqueID1": 356,
        "id": 3,
        "x": -2919.8330078125000000,
        "y": 0.1001586914062500,
        "z": -3269.4335937500000000,
        "direction": 244,
        "type": "mon"
    },
    /* 213 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6e"),
        "uniqueID1": 357,
        "id": 3,
        "x": -2784.4655761718750000,
        "y": 2.2728204727172852,
        "z": -3326.8852539062500000,
        "direction": 309,
        "type": "mon"
    },
    /* 214 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc6f"),
        "uniqueID1": 358,
        "id": 3,
        "x": -2547.0561523437500000,
        "y": 0.1001586914062500,
        "z": -3147.7792968750000000,
        "direction": 282,
        "type": "mon"
    },
    /* 215 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc70"),
        "uniqueID1": 359,
        "id": 3,
        "x": -2925.8850097656250000,
        "y": 3.0521602630615234,
        "z": -3328.9011230468750000,
        "direction": 65,
        "type": "mon"
    },
    /* 216 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc71"),
        "uniqueID1": 360,
        "id": 3,
        "x": -2288.4755859375000000,
        "y": 87.1715927124023440,
        "z": -3630.3110351562500000,
        "direction": 120,
        "type": "mon"
    },
    /* 217 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc72"),
        "uniqueID1": 362,
        "id": 3,
        "x": -2513.3854980468750000,
        "y": 46.1671066284179690,
        "z": -3515.9296875000000000,
        "direction": 71,
        "type": "mon"
    },
    /* 218 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc73"),
        "uniqueID1": 363,
        "id": 3,
        "x": -2336.6667480468750000,
        "y": 85.5933151245117190,
        "z": -3568.7536621093750000,
        "direction": 91,
        "type": "mon"
    },
    /* 219 */
    {
        "_id": ObjectId("55b3386bca012c8110f5cc74"),
        "uniqueID1": 364,
        "id": 3,
        "x": -2289.3461914062500000,
        "y": 86.3111724853515630,
        "z": -3636.4418945312500000,
        "direction": 215,
        "type": "mon"
    },
    /* 220 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe0"),
        "uniqueID1": 375,
        "id": 3,
        "x": -907.5148925781250000,
        "y": 0.1001586914062500,
        "z": -4024.7604980468750000,
        "direction": 133,
        "type": "mon"
    },
    /* 221 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe1"),
        "uniqueID1": 376,
        "id": 3,
        "x": -871.5349121093750000,
        "y": 0.1001586914062500,
        "z": -3816.1076660156250000,
        "direction": 320,
        "type": "mon"
    },
    /* 222 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe3"),
        "uniqueID1": 378,
        "id": 3,
        "x": -878.0269165039062500,
        "y": 0.1001586914062500,
        "z": -3966,
        "direction": 286,
        "type": "mon"
    },
    /* 223 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe4"),
        "uniqueID1": 379,
        "id": 3,
        "x": -859.2250366210937500,
        "y": 0.1001586914062500,
        "z": -3981.6538085937500000,
        "direction": 150,
        "type": "mon"
    },
    /* 224 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe5"),
        "uniqueID1": 380,
        "id": 3,
        "x": -611.6442260742187500,
        "y": 0.1001586914062500,
        "z": -4201.5122070312500000,
        "direction": 24,
        "type": "mon"
    },
    /* 225 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe6"),
        "uniqueID1": 381,
        "id": 3,
        "x": -481.5151367187500000,
        "y": -9.8245420455932617,
        "z": -4025.3679199218750000,
        "direction": 276,
        "type": "mon"
    },
    /* 226 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe7"),
        "uniqueID1": 382,
        "id": 3,
        "x": -499.7199401855468800,
        "y": -9.8292818069458008,
        "z": -4049.1694335937500000,
        "direction": 198,
        "type": "mon"
    },
    /* 227 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe8"),
        "uniqueID1": 383,
        "id": 3,
        "x": -386.0126342773437500,
        "y": -9.7939958572387695,
        "z": -4288.8383789062500000,
        "direction": 23,
        "type": "mon"
    },
    /* 228 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbe9"),
        "uniqueID1": 384,
        "id": 3,
        "x": -397.5380859375000000,
        "y": -8.1042127609252930,
        "z": -3918.3728027343750000,
        "direction": 118,
        "type": "mon"
    },
    /* 229 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbf8"),
        "uniqueID1": 385,
        "id": 3,
        "x": -81.3312988281250000,
        "y": -3.8545186519622803,
        "z": -3945.1220703125000000,
        "direction": 132,
        "type": "mon"
    },
    /* 230 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbea"),
        "uniqueID1": 386,
        "id": 3,
        "x": -119.8748168945312500,
        "y": -6.4418101310729980,
        "z": -3850.6967773437500000,
        "direction": 147.0104370117187500,
        "type": "mon"
    },
    /* 231 */
    {
        "_id": ObjectId("55b33855ca012c8110f5cc47"),
        "uniqueID1": 387,
        "id": 3,
        "x": 4.9853577613830566,
        "y": -8.8868045806884766,
        "z": -3891.9086914062500000,
        "direction": 152.6535644531250000,
        "type": "mon"
    },
    /* 232 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbf9"),
        "uniqueID1": 388,
        "id": 3,
        "x": -9.1364374160766602,
        "y": -7.9946436882019043,
        "z": -3954.7758789062500000,
        "direction": 140,
        "type": "mon"
    },
    /* 233 */
    {
        "_id": ObjectId("55b33814ca012c8110f5cbeb"),
        "uniqueID1": 389,
        "id": 3,
        "x": -288.1167297363281200,
        "y": -9.8362808227539062,
        "z": -3902.0878906250000000,
        "direction": 86,
        "type": "mon"
    },
    /* 234 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc01"),
        "uniqueID1": 390,
        "id": 3,
        "x": 200.4610443115234400,
        "y": -7.4344115257263184,
        "z": -3850.6940917968750000,
        "direction": 192,
        "type": "mon"
    },
    /* 235 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc02"),
        "uniqueID1": 391,
        "id": 3,
        "x": 231.0442352294921900,
        "y": 14.0953969955444340,
        "z": -3850.4006347656250000,
        "direction": 246,
        "type": "mon"
    },
    /* 236 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc03"),
        "uniqueID1": 392,
        "id": 3,
        "x": 278.1631164550781200,
        "y": 20.1274185180664060,
        "z": -3891.0932617187500000,
        "direction": 323,
        "type": "mon"
    },
    /* 237 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc04"),
        "uniqueID1": 393,
        "id": 3,
        "x": 482.2314147949218700,
        "y": -10.0521125793457030,
        "z": -4046.5671386718750000,
        "direction": 207,
        "type": "mon"
    },
    /* 238 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc05"),
        "uniqueID1": 394,
        "id": 3,
        "x": 344.3323364257812500,
        "y": 45.2012290954589840,
        "z": -3823.0568847656250000,
        "direction": 152,
        "type": "mon"
    },
    /* 239 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbfa"),
        "uniqueID1": 395,
        "id": 3,
        "x": 353.9831237792968700,
        "y": -9.3904647827148437,
        "z": -4078.4560546875000000,
        "direction": 80,
        "type": "mon"
    },
    /* 240 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc06"),
        "uniqueID1": 396,
        "id": 3,
        "x": 419.6716308593750000,
        "y": -9.7837400436401367,
        "z": -4100.6357421875000000,
        "direction": 122,
        "type": "mon"
    },
    /* 241 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc07"),
        "uniqueID1": 397,
        "id": 3,
        "x": 691.6673583984375000,
        "y": 0.7273653745651245,
        "z": -4226.9692382812500000,
        "direction": 20,
        "type": "mon"
    },
    /* 242 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc08"),
        "uniqueID1": 398,
        "id": 3,
        "x": 548.3926391601562500,
        "y": 2.3927114009857178,
        "z": -4252.5908203125000000,
        "direction": 116,
        "type": "mon"
    },
    /* 243 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc09"),
        "uniqueID1": 399,
        "id": 3,
        "x": 479.3186950683593700,
        "y": -9.0492639541625977,
        "z": -4236.1450195312500000,
        "direction": 347,
        "type": "mon"
    },
    /* 244 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbfb"),
        "uniqueID1": 400,
        "id": 3,
        "x": 111.9703521728515600,
        "y": -9.8364105224609375,
        "z": -4371.7387695312500000,
        "direction": 281,
        "type": "mon"
    },
    /* 245 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbfc"),
        "uniqueID1": 401,
        "id": 3,
        "x": -12.4011917114257810,
        "y": -9.8362808227539062,
        "z": -4468.9082031250000000,
        "direction": 50,
        "type": "mon"
    },
    /* 246 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbfd"),
        "uniqueID1": 402,
        "id": 3,
        "x": -10.2957630157470700,
        "y": -9.8362007141113281,
        "z": -4587.9482421875000000,
        "direction": 267,
        "type": "mon"
    },
    /* 247 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbfe"),
        "uniqueID1": 403,
        "id": 3,
        "x": -12.3323421478271480,
        "y": -9.8362808227539062,
        "z": -4463.8442382812500000,
        "direction": 115,
        "type": "mon"
    },
    /* 248 */
    {
        "_id": ObjectId("55b3381aca012c8110f5cbff"),
        "uniqueID1": 404,
        "id": 3,
        "x": -180,
        "y": -9.8362808227539062,
        "z": -4455.0356445312500000,
        "direction": 246,
        "type": "mon"
    },
    /* 249 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbed"),
        "uniqueID1": 405,
        "id": 3,
        "x": -672.3143310546875000,
        "y": 0.1001586914062500,
        "z": -4540.6210937500000000,
        "direction": 309,
        "type": "mon"
    },
    /* 250 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbee"),
        "uniqueID1": 406,
        "id": 3,
        "x": -392.5343322753906200,
        "y": 0.1001586914062500,
        "z": -4684.4125976562500000,
        "direction": 184,
        "type": "mon"
    },
    /* 251 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbef"),
        "uniqueID1": 407,
        "id": 3,
        "x": -482.9860229492187500,
        "y": -9.8362808227539062,
        "z": -4589.6298828125000000,
        "direction": 88,
        "type": "mon"
    },
    /* 252 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf0"),
        "uniqueID1": 408,
        "id": 3,
        "x": -489.1248779296875000,
        "y": -9.6566715240478516,
        "z": -4590.9033203125000000,
        "direction": 71,
        "type": "mon"
    },
    /* 253 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf1"),
        "uniqueID1": 409,
        "id": 3,
        "x": -401.1573181152343700,
        "y": -9.8362808227539062,
        "z": -4443.1572265625000000,
        "direction": 133,
        "type": "mon"
    },
    /* 254 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf2"),
        "uniqueID1": 410,
        "id": 3,
        "x": -580.1064453125000000,
        "y": 0.1001586914062500,
        "z": -4735.0473632812500000,
        "direction": 330,
        "type": "mon"
    },
    /* 255 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf3"),
        "uniqueID1": 411,
        "id": 3,
        "x": -574.7263183593750000,
        "y": -5.9160342216491699,
        "z": -4502.9106445312500000,
        "direction": 120,
        "type": "mon"
    },
    /* 256 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf4"),
        "uniqueID1": 412,
        "id": 3,
        "x": -973.0150146484375000,
        "y": 0.1001586914062500,
        "z": -4628.5014648437500000,
        "direction": 277,
        "type": "mon"
    },
    /* 257 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf5"),
        "uniqueID1": 413,
        "id": 3,
        "x": -982.8928222656250000,
        "y": 0.1001586914062500,
        "z": -4519.5512695312500000,
        "direction": 126,
        "type": "mon"
    },
    /* 258 */
    {
        "_id": ObjectId("55b33817ca012c8110f5cbf6"),
        "uniqueID1": 414,
        "id": 3,
        "x": -923.6079101562500000,
        "y": 0.1001586914062500,
        "z": -4392.0581054687500000,
        "direction": 237,
        "type": "mon"
    },
    /* 259 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc78"),
        "uniqueID1": 415,
        "id": 3,
        "x": -3148.9130859375000000,
        "y": 52.9455680847167970,
        "z": -3700.6970214843750000,
        "direction": 159,
        "type": "mon"
    },
    /* 260 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc7e"),
        "uniqueID1": 416,
        "id": 3,
        "x": -3149.5952148437500000,
        "y": 56.4171333312988280,
        "z": -3855.6789550781250000,
        "direction": 17,
        "type": "mon"
    },
    /* 261 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc79"),
        "uniqueID1": 417,
        "id": 3,
        "x": -2957.3737792968750000,
        "y": 41.1685638427734380,
        "z": -3766.0939941406250000,
        "direction": 52,
        "type": "mon"
    },
    /* 262 */
    {
        "_id": ObjectId("55b3386eca012c8110f5cc7a"),
        "uniqueID1": 418,
        "id": 3,
        "x": -2909.1437988281250000,
        "y": 3.0420989990234375,
        "z": -3925.6074218750000000,
        "direction": 11,
        "type": "mon"
    },
    /* 263 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc7f"),
        "uniqueID1": 419,
        "id": 3,
        "x": -2968.1298828125000000,
        "y": 54.8021507263183590,
        "z": -3656.4731445312500000,
        "direction": 134,
        "type": "mon"
    },
    /* 264 */
    {
        "_id": ObjectId("55b338c4ca012c8110f5ccfe"),
        "uniqueID1": 430,
        "id": 3,
        "x": 2981.4323730468750000,
        "y": 0.1000289916992188,
        "z": -411.5447387695312500,
        "direction": 25,
        "type": "mon"
    },
    /* 265 */
    {
        "_id": ObjectId("55b338c2ca012c8110f5ccf9"),
        "uniqueID1": 431,
        "id": 3,
        "x": 2965.2937011718750000,
        "y": 0.1000289916992188,
        "z": -266.2903747558593700,
        "direction": 41,
        "type": "mon"
    },
    /* 266 */
    {
        "_id": ObjectId("55b338c2ca012c8110f5ccfa"),
        "uniqueID1": 432,
        "id": 3,
        "x": 2777.9367675781250000,
        "y": 15.1367797851562500,
        "z": -38.6144180297851560,
        "direction": 222,
        "type": "mon"
    },
    /* 267 */
    {
        "_id": ObjectId("55b338c4ca012c8110f5ccff"),
        "uniqueID1": 433,
        "id": 3,
        "x": 3158.5490722656250000,
        "y": 0.1000289916992188,
        "z": -59.5396728515625000,
        "direction": 62,
        "type": "mon"
    },
    /* 268 */
    {
        "_id": ObjectId("55b338c2ca012c8110f5ccfb"),
        "uniqueID1": 434,
        "id": 3,
        "x": 2866.4777832031250000,
        "y": 0.1000289916992188,
        "z": -252.4213714599609400,
        "direction": 42,
        "type": "mon"
    },
    /* 269 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccef"),
        "uniqueID1": 437,
        "id": 3,
        "x": 2544.2675781250000000,
        "y": 0.8983266353607178,
        "z": 56.9310035705566410,
        "direction": 346,
        "type": "mon"
    },
    /* 270 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf0"),
        "uniqueID1": 438,
        "id": 3,
        "x": 2469.6474609375000000,
        "y": 0.1000289916992188,
        "z": -5.9803218841552734,
        "direction": 111,
        "type": "mon"
    },
    /* 271 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf1"),
        "uniqueID1": 439,
        "id": 3,
        "x": 2588.2092285156250000,
        "y": 29.3288002014160160,
        "z": 180.5080261230468700,
        "direction": 72,
        "type": "mon"
    },
    /* 272 */
    {
        "_id": ObjectId("55b33425ca012c8110f5cb47"),
        "uniqueID1": 3,
        "id": 4,
        "x": -364,
        "y": 148,
        "z": 556,
        "direction": 360,
        "type": "npc"
    },
    /* 273 */
    {
        "_id": ObjectId("55b337e7ca012c8110f5cb92"),
        "uniqueID1": 452,
        "id": 4,
        "x": -4396.7290039062500000,
        "y": 66.3221664428710940,
        "z": -1248.5034179687500000,
        "direction": 241,
        "type": "mon"
    },
    /* 274 */
    {
        "_id": ObjectId("55b337f7ca012c8110f5cba6"),
        "uniqueID1": 459,
        "id": 4,
        "x": -4160.6669921875000000,
        "y": 3.5345745086669922,
        "z": -1894.4094238281250000,
        "direction": 294,
        "type": "mon"
    },
    /* 275 */
    {
        "_id": ObjectId("55b337f9ca012c8110f5cba7"),
        "uniqueID1": 460,
        "id": 4,
        "x": -4383.4760742187500000,
        "y": 10.6796102523803710,
        "z": -2527.9489746093750000,
        "direction": 9,
        "type": "mon"
    },
    /* 276 */
    {
        "_id": ObjectId("55b337f9ca012c8110f5cba8"),
        "uniqueID1": 465,
        "id": 4,
        "x": -3876.1245117187500000,
        "y": 58.0868911743164060,
        "z": -2541.2658691406250000,
        "direction": 18,
        "type": "mon"
    },
    /* 277 */
    {
        "_id": ObjectId("55b337f9ca012c8110f5cba9"),
        "uniqueID1": 466,
        "id": 4,
        "x": -4094.3940429687500000,
        "y": 1.2603231668472290,
        "z": -2394.5102539062500000,
        "direction": 17,
        "type": "mon"
    },
    /* 278 */
    {
        "_id": ObjectId("55b337f9ca012c8110f5cbaa"),
        "uniqueID1": 467,
        "id": 4,
        "x": -3969.9179687500000000,
        "y": 30.7916660308837890,
        "z": -2395.9641113281250000,
        "direction": 2,
        "type": "mon"
    },
    /* 279 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cba0"),
        "uniqueID1": 468,
        "id": 4,
        "x": -3910.7731933593750000,
        "y": 33.3444824218750000,
        "z": -2303.2822265625000000,
        "direction": 292,
        "type": "mon"
    },
    /* 280 */
    {
        "_id": ObjectId("55b337faca012c8110f5cbab"),
        "uniqueID1": 470,
        "id": 4,
        "x": -3811.8513183593750000,
        "y": 211.1109313964843700,
        "z": -3055.7065429687500000,
        "direction": 103,
        "type": "mon"
    },
    /* 281 */
    {
        "_id": ObjectId("55b337faca012c8110f5cbac"),
        "uniqueID1": 471,
        "id": 4,
        "x": -3734.8850097656250000,
        "y": 18.8808155059814450,
        "z": -2812.9226074218750000,
        "direction": 108,
        "type": "mon"
    },
    /* 282 */
    {
        "_id": ObjectId("55b337faca012c8110f5cbad"),
        "uniqueID1": 474,
        "id": 4,
        "x": -3815.8642578125000000,
        "y": 20.2033805847167970,
        "z": -2722.5354003906250000,
        "direction": 275,
        "type": "mon"
    },
    /* 283 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc80"),
        "uniqueID1": 480,
        "id": 4,
        "x": -3707.2038574218750000,
        "y": 0.1001586914062500,
        "z": -3505.1215820312500000,
        "direction": 115,
        "type": "mon"
    },
    /* 284 */
    {
        "_id": ObjectId("55b337ffca012c8110f5cbc0"),
        "uniqueID1": 482,
        "id": 4,
        "x": -3714.9709472656250000,
        "y": 222.4276733398437500,
        "z": -3101.7153320312500000,
        "direction": 253,
        "type": "mon"
    },
    /* 285 */
    {
        "_id": ObjectId("55b337fcca012c8110f5cbbf"),
        "uniqueID1": 484,
        "id": 4,
        "x": -3589.7478027343750000,
        "y": 4.0106501579284668,
        "z": -3188.3420410156250000,
        "direction": 6,
        "type": "mon"
    },
    /* 286 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc81"),
        "uniqueID1": 485,
        "id": 4,
        "x": -3573.6008300781250000,
        "y": 7.0313339233398437,
        "z": -3703.9980468750000000,
        "direction": 69,
        "type": "mon"
    },
    /* 287 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc82"),
        "uniqueID1": 486,
        "id": 4,
        "x": -3755.0148925781250000,
        "y": 0.6939938664436340,
        "z": -3658.0593261718750000,
        "direction": 320,
        "type": "mon"
    },
    /* 288 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc83"),
        "uniqueID1": 487,
        "id": 4,
        "x": -3668.6240234375000000,
        "y": 16.8496742248535160,
        "z": -3743.0039062500000000,
        "direction": 134,
        "type": "mon"
    },
    /* 289 */
    {
        "_id": ObjectId("55b33870ca012c8110f5cc84"),
        "uniqueID1": 488,
        "id": 4,
        "x": -3627.2827148437500000,
        "y": 0.1001586914062500,
        "z": -3634.1169433593750000,
        "direction": 90,
        "type": "mon"
    },
    /* 290 */
    {
        "_id": ObjectId("55b33871ca012c8110f5cc85"),
        "uniqueID1": 489,
        "id": 4,
        "x": -3595.6628417968750000,
        "y": 0.1001586914062500,
        "z": -3603.1010742187500000,
        "direction": 35,
        "type": "mon"
    },
    /* 291 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8a"),
        "uniqueID1": 490,
        "id": 4,
        "x": -3499.6730957031250000,
        "y": 34.1749076843261720,
        "z": -4032.6291503906250000,
        "direction": 227,
        "type": "mon"
    },
    /* 292 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8b"),
        "uniqueID1": 491,
        "id": 4,
        "x": -3540.0197753906250000,
        "y": 22.6631660461425780,
        "z": -4107.4448242187500000,
        "direction": 350,
        "type": "mon"
    },
    /* 293 */
    {
        "_id": ObjectId("55b33871ca012c8110f5cc86"),
        "uniqueID1": 494,
        "id": 4,
        "x": -3323.8588867187500000,
        "y": 31.4171333312988280,
        "z": -3712.7629394531250000,
        "direction": 334,
        "type": "mon"
    },
    /* 294 */
    {
        "_id": ObjectId("55b33876ca012c8110f5cc96"),
        "uniqueID1": 495,
        "id": 4,
        "x": -4521.4926757812500000,
        "y": 1.6157754659652710,
        "z": -3547.1796875000000000,
        "direction": 319,
        "type": "mon"
    },
    /* 295 */
    {
        "_id": ObjectId("55b33876ca012c8110f5cc97"),
        "uniqueID1": 496,
        "id": 4,
        "x": -4178.5004882812500000,
        "y": 0.1001586914062500,
        "z": -3626.8713378906250000,
        "direction": 55,
        "type": "mon"
    },
    /* 296 */
    {
        "_id": ObjectId("55b33876ca012c8110f5cc98"),
        "uniqueID1": 497,
        "id": 4,
        "x": -4449.0527343750000000,
        "y": 0.1001586914062500,
        "z": -3586.4338378906250000,
        "direction": 119,
        "type": "mon"
    },
    /* 297 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce2"),
        "uniqueID1": 545,
        "id": 4,
        "x": 1500.3630371093750000,
        "y": 0.4860182106494904,
        "z": 455.2239685058593700,
        "direction": 192,
        "type": "mon"
    },
    /* 298 */
    {
        "_id": ObjectId("55b338baca012c8110f5cceb"),
        "uniqueID1": 546,
        "id": 4,
        "x": 1819.4924316406250000,
        "y": 65.5223541259765630,
        "z": 477.3329162597656200,
        "direction": 347,
        "type": "mon"
    },
    /* 299 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce3"),
        "uniqueID1": 547,
        "id": 4,
        "x": 1609.9672851562500000,
        "y": 11.6281127929687500,
        "z": 525.8042602539062500,
        "direction": 248,
        "type": "mon"
    },
    /* 300 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce4"),
        "uniqueID1": 548,
        "id": 4,
        "x": 1683.7006835937500000,
        "y": 6.5884795188903809,
        "z": 625.0410156250000000,
        "direction": 51,
        "type": "mon"
    },
    /* 301 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce5"),
        "uniqueID1": 549,
        "id": 4,
        "x": 1483.5982666015625000,
        "y": 0.5828275680541992,
        "z": 766.7158813476562500,
        "direction": 24,
        "type": "mon"
    },
    /* 302 */
    {
        "_id": ObjectId("55b338baca012c8110f5ccec"),
        "uniqueID1": 550,
        "id": 4,
        "x": 2163.2778320312500000,
        "y": 15.2646627426147460,
        "z": 478.8981018066406200,
        "direction": 114,
        "type": "mon"
    },
    /* 303 */
    {
        "_id": ObjectId("55b338bcca012c8110f5cced"),
        "uniqueID1": 551,
        "id": 4,
        "x": 2276.4284667968750000,
        "y": 10.0010976791381840,
        "z": 782.4073486328125000,
        "direction": 121,
        "type": "mon"
    },
    /* 304 */
    {
        "_id": ObjectId("55b338bdca012c8110f5ccee"),
        "uniqueID1": 552,
        "id": 4,
        "x": 2493.5463867187500000,
        "y": 8.9580888748168945,
        "z": 543.4604492187500000,
        "direction": 163,
        "type": "mon"
    },
    /* 305 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf2"),
        "uniqueID1": 555,
        "id": 4,
        "x": 3069.2045898437500000,
        "y": 1.0242624282836914,
        "z": 540.0228271484375000,
        "direction": 311,
        "type": "mon"
    },
    /* 306 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf3"),
        "uniqueID1": 557,
        "id": 4,
        "x": 3017.3144531250000000,
        "y": 0.1000289916992188,
        "z": 354.9488525390625000,
        "direction": 329,
        "type": "mon"
    },
    /* 307 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf5"),
        "uniqueID1": 558,
        "id": 4,
        "x": 2904.2827148437500000,
        "y": 0.3241163492202759,
        "z": 435.6112670898437500,
        "direction": 342,
        "type": "mon"
    },
    /* 308 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf4"),
        "uniqueID1": 559,
        "id": 4,
        "x": 2817.3459472656250000,
        "y": 3.8983423709869385,
        "z": 402.2614746093750000,
        "direction": 284,
        "type": "mon"
    },
    /* 309 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc1d"),
        "uniqueID1": 577,
        "id": 4,
        "x": 2860.5825195312500000,
        "y": 1.4096101522445679,
        "z": -2971.7084960937500000,
        "direction": 118,
        "type": "mon"
    },
    /* 310 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc1e"),
        "uniqueID1": 578,
        "id": 4,
        "x": 2876.4682617187500000,
        "y": 0.7914541959762573,
        "z": -2942.7888183593750000,
        "direction": 345,
        "type": "mon"
    },
    /* 311 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc1f"),
        "uniqueID1": 579,
        "id": 4,
        "x": 2850.8833007812500000,
        "y": 2.5058004856109619,
        "z": -3003.6579589843750000,
        "direction": 312,
        "type": "mon"
    },
    /* 312 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc20"),
        "uniqueID1": 580,
        "id": 4,
        "x": 2713.9726562500000000,
        "y": 0.1032208427786827,
        "z": -2910.1154785156250000,
        "direction": 217,
        "type": "mon"
    },
    /* 313 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc21"),
        "uniqueID1": 581,
        "id": 4,
        "x": 2723.5737304687500000,
        "y": 0.1038515344262123,
        "z": -2908.5773925781250000,
        "direction": 38,
        "type": "mon"
    },
    /* 314 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc22"),
        "uniqueID1": 582,
        "id": 4,
        "x": 2516.8437500000000000,
        "y": 38.7145805358886720,
        "z": -3277.4970703125000000,
        "direction": 280,
        "type": "mon"
    },
    /* 315 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc23"),
        "uniqueID1": 583,
        "id": 4,
        "x": 2705.7343750000000000,
        "y": 12.4312686920166020,
        "z": -3169.6201171875000000,
        "direction": 219,
        "type": "mon"
    },
    /* 316 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc24"),
        "uniqueID1": 584,
        "id": 4,
        "x": 2448.6613769531250000,
        "y": 4.8776359558105469,
        "z": -2935.8723144531250000,
        "direction": 77,
        "type": "mon"
    },
    /* 317 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc25"),
        "uniqueID1": 585,
        "id": 4,
        "x": 2451.4582519531250000,
        "y": 56.8657989501953120,
        "z": -3406.4011230468750000,
        "direction": 170,
        "type": "mon"
    },
    /* 318 */
    {
        "_id": ObjectId("55b33827ca012c8110f5cc14"),
        "uniqueID1": 586,
        "id": 4,
        "x": 2156.9079589843750000,
        "y": 33.2714233398437500,
        "z": -3623.2851562500000000,
        "direction": 75,
        "type": "mon"
    },
    /* 319 */
    {
        "_id": ObjectId("55b33827ca012c8110f5cc15"),
        "uniqueID1": 587,
        "id": 4,
        "x": 2186.1303710937500000,
        "y": 54.8344917297363280,
        "z": -3428.5256347656250000,
        "direction": 290,
        "type": "mon"
    },
    /* 320 */
    {
        "_id": ObjectId("55b33827ca012c8110f5cc16"),
        "uniqueID1": 588,
        "id": 4,
        "x": 2197.7958984375000000,
        "y": 54.0738410949707030,
        "z": -3419.1542968750000000,
        "direction": 127,
        "type": "mon"
    },
    /* 321 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc26"),
        "uniqueID1": 589,
        "id": 4,
        "x": 2337.4396972656250000,
        "y": 50.7837829589843750,
        "z": -3315.5212402343750000,
        "direction": 146,
        "type": "mon"
    },
    /* 322 */
    {
        "_id": ObjectId("55b33426ca012c8110f5cb49"),
        "uniqueID1": 5,
        "id": 5,
        "x": -256,
        "y": 148,
        "z": 395,
        "direction": 90,
        "type": "npc"
    },
    /* 323 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce6"),
        "uniqueID1": 638,
        "id": 5,
        "x": 1332.4531250000000000,
        "y": 0.4599075019359589,
        "z": 858.2729492187500000,
        "direction": 223.5135192871093700,
        "type": "mon"
    },
    /* 324 */
    {
        "_id": ObjectId("55b338b7ca012c8110f5cce7"),
        "uniqueID1": 639,
        "id": 5,
        "x": 1196.0656738281250000,
        "y": 0.1000289916992188,
        "z": 731.1553955078125000,
        "direction": 237,
        "type": "mon"
    },
    /* 325 */
    {
        "_id": ObjectId("55b33848ca012c8110f5cc43"),
        "uniqueID1": 640,
        "id": 5,
        "x": 2489.5466308593750000,
        "y": 84.5352020263671880,
        "z": -3955.7954101562500000,
        "direction": 179,
        "type": "mon"
    },
    /* 326 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc27"),
        "uniqueID1": 641,
        "id": 5,
        "x": 2604.5996093750000000,
        "y": 82.8841857910156250,
        "z": -3752.4379882812500000,
        "direction": 72,
        "type": "mon"
    },
    /* 327 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc31"),
        "uniqueID1": 642,
        "id": 5,
        "x": 2846.6047363281250000,
        "y": 164.6015167236328100,
        "z": -3992.5407714843750000,
        "direction": 275,
        "type": "mon"
    },
    /* 328 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc28"),
        "uniqueID1": 643,
        "id": 5,
        "x": 2561.9609375000000000,
        "y": 74.1795196533203130,
        "z": -3664.7795410156250000,
        "direction": 10,
        "type": "mon"
    },
    /* 329 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc32"),
        "uniqueID1": 644,
        "id": 5,
        "x": 2780.4272460937500000,
        "y": 162.0964202880859400,
        "z": -4025.9536132812500000,
        "direction": 242,
        "type": "mon"
    },
    /* 330 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc29"),
        "uniqueID1": 645,
        "id": 5,
        "x": 3136.8903808593750000,
        "y": 80.9717864990234380,
        "z": -3550.4401855468750000,
        "direction": 9,
        "type": "mon"
    },
    /* 331 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2a"),
        "uniqueID1": 646,
        "id": 5,
        "x": 3077.9147949218750000,
        "y": 73.4354095458984370,
        "z": -3522.3864746093750000,
        "direction": 35,
        "type": "mon"
    },
    /* 332 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2b"),
        "uniqueID1": 647,
        "id": 5,
        "x": 3076.9995117187500000,
        "y": 72.2429885864257810,
        "z": -3516.9389648437500000,
        "direction": 329,
        "type": "mon"
    },
    /* 333 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc33"),
        "uniqueID1": 648,
        "id": 5,
        "x": 3247.1232910156250000,
        "y": 140.1968841552734400,
        "z": -3745.6389160156250000,
        "direction": 191,
        "type": "mon"
    },
    /* 334 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2c"),
        "uniqueID1": 649,
        "id": 5,
        "x": 3092.5212402343750000,
        "y": 88.0721511840820310,
        "z": -3579.7285156250000000,
        "direction": 271,
        "type": "mon"
    },
    /* 335 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc17"),
        "uniqueID1": 650,
        "id": 5,
        "x": 2093.4235839843750000,
        "y": 32.5216522216796880,
        "z": -3859.7658691406250000,
        "direction": 4,
        "type": "mon"
    },
    /* 336 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc18"),
        "uniqueID1": 651,
        "id": 5,
        "x": 2102.8513183593750000,
        "y": 39.7233276367187500,
        "z": -4015.9992675781250000,
        "direction": 129,
        "type": "mon"
    },
    /* 337 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc19"),
        "uniqueID1": 652,
        "id": 5,
        "x": 1856.5533447265625000,
        "y": 22.4008235931396480,
        "z": -3925.6108398437500000,
        "direction": 312,
        "type": "mon"
    },
    /* 338 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc1a"),
        "uniqueID1": 653,
        "id": 5,
        "x": 2111.5944824218750000,
        "y": 38.4033851623535160,
        "z": -3607.0908203125000000,
        "direction": 153,
        "type": "mon"
    },
    /* 339 */
    {
        "_id": ObjectId("55b3384bca012c8110f5cc44"),
        "uniqueID1": 654,
        "id": 5,
        "x": 2019.3050537109375000,
        "y": 36.1392784118652340,
        "z": -4023.8383789062500000,
        "direction": 25,
        "type": "mon"
    },
    /* 340 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc0d"),
        "uniqueID1": 655,
        "id": 5,
        "x": 1523.3349609375000000,
        "y": 23.4361400604248050,
        "z": -3800.6040039062500000,
        "direction": 124,
        "type": "mon"
    },
    /* 341 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc0e"),
        "uniqueID1": 656,
        "id": 5,
        "x": 1443.3283691406250000,
        "y": 9.1095075607299805,
        "z": -3799.6928710937500000,
        "direction": 358,
        "type": "mon"
    },
    /* 342 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc0f"),
        "uniqueID1": 657,
        "id": 5,
        "x": 1679.7059326171875000,
        "y": 18.2390937805175780,
        "z": -3953.2387695312500000,
        "direction": 38,
        "type": "mon"
    },
    /* 343 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc10"),
        "uniqueID1": 658,
        "id": 5,
        "x": 1516.5815429687500000,
        "y": 9.2864866256713867,
        "z": -3980.5673828125000000,
        "direction": 228,
        "type": "mon"
    },
    /* 344 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc11"),
        "uniqueID1": 659,
        "id": 5,
        "x": 1754.0574951171875000,
        "y": 39.8679809570312500,
        "z": -3837.3564453125000000,
        "direction": 348,
        "type": "mon"
    },
    /* 345 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc0a"),
        "uniqueID1": 660,
        "id": 5,
        "x": 982.7057495117187500,
        "y": 0.1000289916992188,
        "z": -3633.9833984375000000,
        "direction": 243,
        "type": "mon"
    },
    /* 346 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc12"),
        "uniqueID1": 661,
        "id": 5,
        "x": 1274.5019531250000000,
        "y": 2.3983914852142334,
        "z": -3552.8334960937500000,
        "direction": 239,
        "type": "mon"
    },
    /* 347 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc0b"),
        "uniqueID1": 662,
        "id": 5,
        "x": 999.3988037109375000,
        "y": 0.1000524759292603,
        "z": -3598.9523925781250000,
        "direction": 309,
        "type": "mon"
    },
    /* 348 */
    {
        "_id": ObjectId("55b3381fca012c8110f5cc0c"),
        "uniqueID1": 663,
        "id": 5,
        "x": 929.8478393554687500,
        "y": 0.1000289916992188,
        "z": -3613.9179687500000000,
        "direction": 166,
        "type": "mon"
    },
    /* 349 */
    {
        "_id": ObjectId("55b33825ca012c8110f5cc13"),
        "uniqueID1": 664,
        "id": 5,
        "x": 1093.1984863281250000,
        "y": 0.1000289916992188,
        "z": -3740.5302734375000000,
        "direction": 4,
        "type": "mon"
    },
    /* 350 */
    {
        "_id": ObjectId("55b33850ca012c8110f5cc45"),
        "uniqueID1": 667,
        "id": 5,
        "x": 1092.8758544921875000,
        "y": 0.1000289916992188,
        "z": -4105.3837890625000000,
        "direction": 138,
        "type": "mon"
    },
    /* 351 */
    {
        "_id": ObjectId("55b33850ca012c8110f5cc46"),
        "uniqueID1": 668,
        "id": 5,
        "x": 1076.3952636718750000,
        "y": 0.1000289916992188,
        "z": -4110.1044921875000000,
        "direction": 315,
        "type": "mon"
    },
    /* 352 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc34"),
        "uniqueID1": 670,
        "id": 5,
        "x": 2772.1931152343750000,
        "y": 208.6516113281250000,
        "z": -4187.3212890625000000,
        "direction": 351,
        "type": "mon"
    },
    /* 353 */
    {
        "_id": ObjectId("55b33842ca012c8110f5cc41"),
        "uniqueID1": 671,
        "id": 5,
        "x": 2676.9716796875000000,
        "y": 175.5855255126953100,
        "z": -4247.8432617187500000,
        "direction": 110,
        "type": "mon"
    },
    /* 354 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3a"),
        "uniqueID1": 672,
        "id": 5,
        "x": 2961.3339843750000000,
        "y": 331.9482421875000000,
        "z": -4605.2475585937500000,
        "direction": 184,
        "type": "mon"
    },
    /* 355 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc35"),
        "uniqueID1": 673,
        "id": 5,
        "x": 2887.9619140625000000,
        "y": 245.7299041748046900,
        "z": -4288.9565429687500000,
        "direction": 213,
        "type": "mon"
    },
    /* 356 */
    {
        "_id": ObjectId("55b33842ca012c8110f5cc42"),
        "uniqueID1": 674,
        "id": 5,
        "x": 2649.4792480468750000,
        "y": 151.6347351074218700,
        "z": -4182.9536132812500000,
        "direction": 30,
        "type": "mon"
    },
    /* 357 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc36"),
        "uniqueID1": 675,
        "id": 5,
        "x": 3154.3845214843750000,
        "y": 236.7728424072265600,
        "z": -4021.8911132812500000,
        "direction": 205,
        "type": "mon"
    },
    /* 358 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc37"),
        "uniqueID1": 676,
        "id": 5,
        "x": 2963.2697753906250000,
        "y": 232.4541168212890600,
        "z": -4211.1616210937500000,
        "direction": 269,
        "type": "mon"
    },
    /* 359 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc38"),
        "uniqueID1": 677,
        "id": 5,
        "x": 2901.3796386718750000,
        "y": 150.7793121337890600,
        "z": -3869.4514160156250000,
        "direction": 238,
        "type": "mon"
    },
    /* 360 */
    {
        "_id": ObjectId("55b33832ca012c8110f5cc39"),
        "uniqueID1": 678,
        "id": 5,
        "x": 3267.2282714843750000,
        "y": 312.0357055664062500,
        "z": -4191.6093750000000000,
        "direction": 8,
        "type": "mon"
    },
    /* 361 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3b"),
        "uniqueID1": 679,
        "id": 5,
        "x": 3304.1730957031250000,
        "y": 328.9651794433593700,
        "z": -4257.0444335937500000,
        "direction": 262,
        "type": "mon"
    },
    /* 362 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8c"),
        "uniqueID1": 680,
        "id": 5,
        "x": -4332.0146484375000000,
        "y": 1.5298389196395874,
        "z": -3870.2946777343750000,
        "direction": 281,
        "type": "mon"
    },
    /* 363 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8d"),
        "uniqueID1": 681,
        "id": 5,
        "x": -4256.8754882812500000,
        "y": 14.4020881652832030,
        "z": -3769.9946289062500000,
        "direction": 336,
        "type": "mon"
    },
    /* 364 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc99"),
        "uniqueID1": 682,
        "id": 5,
        "x": -4348.5874023437500000,
        "y": 0.5604349374771118,
        "z": -3849.3374023437500000,
        "direction": 16,
        "type": "mon"
    },
    /* 365 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9b"),
        "uniqueID1": 683,
        "id": 5,
        "x": -4492.4877929687500000,
        "y": 0.1001586914062500,
        "z": -3745.4116210937500000,
        "direction": 330,
        "type": "mon"
    },
    /* 366 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8e"),
        "uniqueID1": 684,
        "id": 5,
        "x": -4246.7626953125000000,
        "y": 5.2932233810424805,
        "z": -4006.6213378906250000,
        "direction": 238,
        "type": "mon"
    },
    /* 367 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9a"),
        "uniqueID1": 685,
        "id": 5,
        "x": -4758.1108398437500000,
        "y": 0.2850115001201630,
        "z": -4053.0642089843750000,
        "direction": 204,
        "type": "mon"
    },
    /* 368 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9d"),
        "uniqueID1": 686,
        "id": 5,
        "x": -4868.5986328125000000,
        "y": 0.9166944622993469,
        "z": -3794.8764648437500000,
        "direction": 218,
        "type": "mon"
    },
    /* 369 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9c"),
        "uniqueID1": 687,
        "id": 5,
        "x": -4724.2856445312500000,
        "y": 0.1001586914062500,
        "z": -3964.5327148437500000,
        "direction": 183,
        "type": "mon"
    },
    /* 370 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9e"),
        "uniqueID1": 688,
        "id": 5,
        "x": -4780.8530273437500000,
        "y": 0.5947117805480957,
        "z": -3891.6765136718750000,
        "direction": 194,
        "type": "mon"
    },
    /* 371 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cc9f"),
        "uniqueID1": 689,
        "id": 5,
        "x": -4737.0200195312500000,
        "y": 3.1792316436767578,
        "z": -4157.6909179687500000,
        "direction": 260,
        "type": "mon"
    },
    /* 372 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc8f"),
        "uniqueID1": 690,
        "id": 5,
        "x": -3778.0112304687500000,
        "y": 22.9785022735595700,
        "z": -4221.3461914062500000,
        "direction": 325,
        "type": "mon"
    },
    /* 373 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc90"),
        "uniqueID1": 691,
        "id": 5,
        "x": -3820.5078125000000000,
        "y": 54.7825012207031250,
        "z": -3924.8120117187500000,
        "direction": 206,
        "type": "mon"
    },
    /* 374 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc91"),
        "uniqueID1": 692,
        "id": 5,
        "x": -3931.3339843750000000,
        "y": 52.2397918701171880,
        "z": -4078.7719726562500000,
        "direction": 71,
        "type": "mon"
    },
    /* 375 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc92"),
        "uniqueID1": 693,
        "id": 5,
        "x": -4066.8989257812500000,
        "y": 38.6223030090332030,
        "z": -3947.2768554687500000,
        "direction": 130,
        "type": "mon"
    },
    /* 376 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc93"),
        "uniqueID1": 694,
        "id": 5,
        "x": -4021.8991699218750000,
        "y": 55.9099845886230470,
        "z": -4071.7321777343750000,
        "direction": 264,
        "type": "mon"
    },
    /* 377 */
    {
        "_id": ObjectId("55b337a8ca012c8110f5cb58"),
        "uniqueID1": 729,
        "id": 5,
        "x": 883.5814208984375000,
        "y": 20.7223358154296880,
        "z": 1665.9272460937500000,
        "direction": 201,
        "type": "mon"
    },
    /* 378 */
    {
        "_id": ObjectId("55b337a6ca012c8110f5cb53"),
        "uniqueID1": 730,
        "id": 5,
        "x": 950.5995483398437500,
        "y": -3.4703297615051270,
        "z": 1285.4846191406250000,
        "direction": 284,
        "type": "mon"
    },
    /* 379 */
    {
        "_id": ObjectId("55b337a6ca012c8110f5cb54"),
        "uniqueID1": 731,
        "id": 5,
        "x": 678.0942993164062500,
        "y": 0.1000289916992188,
        "z": 1256.7427978515625000,
        "direction": 243,
        "type": "mon"
    },
    /* 380 */
    {
        "_id": ObjectId("55b337a6ca012c8110f5cb55"),
        "uniqueID1": 732,
        "id": 5,
        "x": 676.3649902343750000,
        "y": 8.7686824798583984,
        "z": 1523.1572265625000000,
        "direction": 188,
        "type": "mon"
    },
    /* 381 */
    {
        "_id": ObjectId("55b337a6ca012c8110f5cb56"),
        "uniqueID1": 733,
        "id": 5,
        "x": 987.0333862304687500,
        "y": -2.0217773914337158,
        "z": 1367.2674560546875000,
        "direction": 19,
        "type": "mon"
    },
    /* 382 */
    {
        "_id": ObjectId("55b337a6ca012c8110f5cb57"),
        "uniqueID1": 734,
        "id": 5,
        "x": 875.5446166992187500,
        "y": 2.8194193840026855,
        "z": 1477.4381103515625000,
        "direction": 73,
        "type": "mon"
    },
    /* 383 */
    {
        "_id": ObjectId("55b33426ca012c8110f5cb48"),
        "uniqueID1": 4,
        "id": 6,
        "x": -459,
        "y": 148,
        "z": 391,
        "direction": 270,
        "type": "npc"
    },
    /* 384 */
    {
        "_id": ObjectId("55b3387eca012c8110f5cca6"),
        "uniqueID1": 750,
        "id": 6,
        "x": -5480.5058593750000000,
        "y": 0.1002086475491524,
        "z": -4727.3979492187500000,
        "direction": 162,
        "type": "mon"
    },
    /* 385 */
    {
        "_id": ObjectId("55b3387eca012c8110f5cca7"),
        "uniqueID1": 751,
        "id": 6,
        "x": -5509.6079101562500000,
        "y": 0.3473058640956879,
        "z": -4719.3666992187500000,
        "direction": 103,
        "type": "mon"
    },
    /* 386 */
    {
        "_id": ObjectId("55b3387eca012c8110f5cca8"),
        "uniqueID1": 752,
        "id": 6,
        "x": -5318.7500000000000000,
        "y": 33.7752342224121090,
        "z": -5043.6586914062500000,
        "direction": 81,
        "type": "mon"
    },
    /* 387 */
    {
        "_id": ObjectId("55b3387eca012c8110f5cca9"),
        "uniqueID1": 753,
        "id": 6,
        "x": -5393.0737304687500000,
        "y": 0.9009342193603516,
        "z": -4753.4106445312500000,
        "direction": 342,
        "type": "mon"
    },
    /* 388 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3d"),
        "uniqueID1": 755,
        "id": 6,
        "x": 3819.1059570312500000,
        "y": 376.7394409179687500,
        "z": -4613.4291992187500000,
        "direction": 28,
        "type": "mon"
    },
    /* 389 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3c"),
        "uniqueID1": 756,
        "id": 6,
        "x": 3620.3286132812500000,
        "y": 374.1633300781250000,
        "z": -4800.3149414062500000,
        "direction": 232,
        "type": "mon"
    },
    /* 390 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3e"),
        "uniqueID1": 757,
        "id": 6,
        "x": 3364.7272949218750000,
        "y": 388.2229309082031200,
        "z": -4960.4458007812500000,
        "direction": 45,
        "type": "mon"
    },
    /* 391 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc3f"),
        "uniqueID1": 758,
        "id": 6,
        "x": 3586.1791992187500000,
        "y": 385.5804443359375000,
        "z": -4719.4584960937500000,
        "direction": 266,
        "type": "mon"
    },
    /* 392 */
    {
        "_id": ObjectId("55b33838ca012c8110f5cc40"),
        "uniqueID1": 759,
        "id": 6,
        "x": 3244.9575195312500000,
        "y": 358.3586730957031200,
        "z": -4520.5756835937500000,
        "direction": 282,
        "type": "mon"
    },
    /* 393 */
    {
        "_id": ObjectId("55b337bbca012c8110f5cb61"),
        "uniqueID1": 790,
        "id": 6,
        "x": -22.4814720153808590,
        "y": 1.9738395214080811,
        "z": 2073.6733398437500000,
        "direction": 319,
        "type": "mon"
    },
    /* 394 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb59"),
        "uniqueID1": 791,
        "id": 6,
        "x": 397.5407714843750000,
        "y": 61.0627365112304690,
        "z": 1851.9061279296875000,
        "direction": 75,
        "type": "mon"
    },
    /* 395 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5a"),
        "uniqueID1": 792,
        "id": 6,
        "x": 323.1151123046875000,
        "y": 100.8975524902343700,
        "z": 2006.7261962890625000,
        "direction": 37,
        "type": "mon"
    },
    /* 396 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5b"),
        "uniqueID1": 794,
        "id": 6,
        "x": 681.4794921875000000,
        "y": 47.3997955322265630,
        "z": 1832.8374023437500000,
        "direction": 356,
        "type": "mon"
    },
    /* 397 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5c"),
        "uniqueID1": 796,
        "id": 6,
        "x": 288.3621520996093700,
        "y": 82.0912704467773440,
        "z": 1969.7684326171875000,
        "direction": 64,
        "type": "mon"
    },
    /* 398 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5d"),
        "uniqueID1": 797,
        "id": 6,
        "x": 195.0654449462890600,
        "y": 35.6621208190917970,
        "z": 1916.2926025390625000,
        "direction": 63,
        "type": "mon"
    },
    /* 399 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5e"),
        "uniqueID1": 798,
        "id": 6,
        "x": 153.4646301269531200,
        "y": 0.3198240697383881,
        "z": 1704.5657958984375000,
        "direction": 139,
        "type": "mon"
    },
    /* 400 */
    {
        "_id": ObjectId("55b337bfca012c8110f5cb64"),
        "uniqueID1": 798,
        "id": 6,
        "x": 153.4646301269531200,
        "y": 0.3198240697383881,
        "z": 1704.5657958984375000,
        "direction": 200.2830200195312500,
        "type": "mon"
    },
    /* 401 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb5f"),
        "uniqueID1": 799,
        "id": 6,
        "x": 788.3217163085937500,
        "y": 24.2152175903320310,
        "z": 1814.2296142578125000,
        "direction": 336,
        "type": "mon"
    },
    /* 402 */
    {
        "_id": ObjectId("55b337bcca012c8110f5cb62"),
        "uniqueID1": 822,
        "id": 6,
        "x": -306.4907226562500000,
        "y": 0.1000289916992188,
        "z": 1648.5356445312500000,
        "direction": 29,
        "type": "mon"
    },
    /* 403 */
    {
        "_id": ObjectId("55b337bcca012c8110f5cb63"),
        "uniqueID1": 823,
        "id": 6,
        "x": -209.2884063720703100,
        "y": 0.1000289916992188,
        "z": 1612.9267578125000000,
        "direction": 270,
        "type": "mon"
    },
    /* 404 */
    {
        "_id": ObjectId("55b337b1ca012c8110f5cb60"),
        "uniqueID1": 824,
        "id": 6,
        "x": -124.7458038330078100,
        "y": 0.1000289916992188,
        "z": 1682.4272460937500000,
        "direction": 244,
        "type": "mon"
    },
    /* 405 */
    {
        "_id": ObjectId("55b332b2ca012c8110f5cb45"),
        "uniqueID1": 20,
        "id": 7,
        "x": -10,
        "y": 0,
        "z": -1546,
        "direction": 180,
        "type": "npc"
    },
    /* 406 */
    {
        "_id": ObjectId("55b338b9ca012c8110f5cce9"),
        "uniqueID1": 904,
        "id": 7,
        "x": 1799.8033447265625000,
        "y": 5.8590068817138672,
        "z": 840.1886596679687500,
        "direction": 120.8560180664062500,
        "type": "mon"
    },
    /* 407 */
    {
        "_id": ObjectId("55b338b9ca012c8110f5ccea"),
        "uniqueID1": 905,
        "id": 7,
        "x": 1533.0042724609375000,
        "y": 5.4751124382019043,
        "z": 972.2236328125000000,
        "direction": 118.7474670410156200,
        "type": "mon"
    },
    /* 408 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2d"),
        "uniqueID1": 907,
        "id": 7,
        "x": 3093.3693847656250000,
        "y": 3.4148967266082764,
        "z": -2957.2746582031250000,
        "direction": 31,
        "type": "mon"
    },
    /* 409 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2e"),
        "uniqueID1": 909,
        "id": 7,
        "x": 2456.2783203125000000,
        "y": 5.3648796081542969,
        "z": -2946.8151855468750000,
        "direction": 181,
        "type": "mon"
    },
    /* 410 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc94"),
        "uniqueID1": 910,
        "id": 7,
        "x": -3657.5004882812500000,
        "y": 54.7815780639648440,
        "z": -3881.4470214843750000,
        "direction": 131,
        "type": "mon"
    },
    /* 411 */
    {
        "_id": ObjectId("55b33873ca012c8110f5cc95"),
        "uniqueID1": 911,
        "id": 7,
        "x": -3772.4333496093750000,
        "y": 48.2920417785644530,
        "z": -4055.8327636718750000,
        "direction": 232,
        "type": "mon"
    },
    /* 412 */
    {
        "_id": ObjectId("55b337faca012c8110f5cbaf"),
        "uniqueID1": 912,
        "id": 7,
        "x": -3996.2934570312500000,
        "y": 39.5298881530761720,
        "z": -2814.6303710937500000,
        "direction": 134.0738525390625000,
        "type": "mon"
    },
    /* 413 */
    {
        "_id": ObjectId("55b337f6ca012c8110f5cba2"),
        "uniqueID1": 913,
        "id": 7,
        "x": -3954.5583496093750000,
        "y": 37.4622116088867190,
        "z": -2612.2304687500000000,
        "direction": 25.4153747558593750,
        "type": "mon"
    },
    /* 414 */
    {
        "_id": ObjectId("55b337faca012c8110f5cbae"),
        "uniqueID1": 913,
        "id": 7,
        "x": -3954.5583496093750000,
        "y": 37.4622116088867190,
        "z": -2612.2304687500000000,
        "direction": 310.5563964843750000,
        "type": "mon"
    },
    /* 415 */
    {
        "_id": ObjectId("55b337e7ca012c8110f5cb93"),
        "uniqueID1": 919,
        "id": 7,
        "x": -4193.0898437500000000,
        "y": 47.2379722595214840,
        "z": -1416.2136230468750000,
        "direction": 26,
        "type": "mon"
    },
    /* 416 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc2f"),
        "uniqueID1": 934,
        "id": 7,
        "x": 2627.6806640625000000,
        "y": 67.7647476196289060,
        "z": -3503.3884277343750000,
        "direction": 105,
        "type": "mon"
    },
    /* 417 */
    {
        "_id": ObjectId("55b3382dca012c8110f5cc30"),
        "uniqueID1": 935,
        "id": 7,
        "x": 2792.0510253906250000,
        "y": 91.4328155517578130,
        "z": -3671.9143066406250000,
        "direction": 257,
        "type": "mon"
    },
    /* 418 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cca0"),
        "uniqueID1": 936,
        "id": 7,
        "x": -4676.9848632812500000,
        "y": 43.1646003723144530,
        "z": -4306.5708007812500000,
        "direction": 177,
        "type": "mon"
    },
    /* 419 */
    {
        "_id": ObjectId("55b33878ca012c8110f5cca1"),
        "uniqueID1": 937,
        "id": 7,
        "x": -4959.7094726562500000,
        "y": 1.6127916574478149,
        "z": -4381.7792968750000000,
        "direction": 286,
        "type": "mon"
    },
    /* 420 */
    {
        "_id": ObjectId("55b3387aca012c8110f5cca4"),
        "uniqueID1": 937,
        "id": 7,
        "x": -4959.7094726562500000,
        "y": 1.6127916574478149,
        "z": -4381.7792968750000000,
        "direction": 194.9933929443359400,
        "type": "mon"
    },
    /* 421 */
    {
        "_id": ObjectId("55b3387bca012c8110f5cca5"),
        "uniqueID1": 937,
        "id": 7,
        "x": -4953.2416992187500000,
        "y": 1.8333078622817993,
        "z": -4357.6303710937500000,
        "direction": 171.5822143554687500,
        "type": "mon"
    },
    /* 422 */
    {
        "_id": ObjectId("55b33879ca012c8110f5cca2"),
        "uniqueID1": 938,
        "id": 7,
        "x": -5083.2197265625000000,
        "y": 27.9642009735107420,
        "z": -4130.1801757812500000,
        "direction": 346,
        "type": "mon"
    },
    /* 423 */
    {
        "_id": ObjectId("55b33879ca012c8110f5cca3"),
        "uniqueID1": 939,
        "id": 7,
        "x": -5091.6557617187500000,
        "y": 27.9471626281738280,
        "z": -4167.1259765625000000,
        "direction": 59,
        "type": "mon"
    },
    /* 424 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc1b"),
        "uniqueID1": 940,
        "id": 7,
        "x": 2066.9091796875000000,
        "y": 57.8729438781738280,
        "z": -3337.6560058593750000,
        "direction": 141,
        "type": "mon"
    },
    /* 425 */
    {
        "_id": ObjectId("55b33828ca012c8110f5cc1c"),
        "uniqueID1": 941,
        "id": 7,
        "x": 1962.1246337890625000,
        "y": 60.7567939758300780,
        "z": -3267.4768066406250000,
        "direction": 241,
        "type": "mon"
    },
    /* 426 */
    {
        "_id": ObjectId("55b337f4ca012c8110f5cba1"),
        "uniqueID1": 944,
        "id": 7,
        "x": -4145.9794921875000000,
        "y": 3.5674493312835693,
        "z": -1864.1040039062500000,
        "direction": 101.4293212890625000,
        "type": "mon"
    },
    /* 427 */
    {
        "_id": ObjectId("55b337e7ca012c8110f5cb94"),
        "uniqueID1": 945,
        "id": 7,
        "x": -4154.5219726562500000,
        "y": 8.3389902114868164,
        "z": -1177.6650390625000000,
        "direction": 134,
        "type": "mon"
    },
    /* 428 */
    {
        "_id": ObjectId("55b33871ca012c8110f5cc87"),
        "uniqueID1": 946,
        "id": 7,
        "x": -3314.3127441406250000,
        "y": 0.1001586914062500,
        "z": -3462.9936523437500000,
        "direction": 93,
        "type": "mon"
    },
    /* 429 */
    {
        "_id": ObjectId("55b33871ca012c8110f5cc88"),
        "uniqueID1": 946,
        "id": 7,
        "x": -3314.3127441406250000,
        "y": 0.1001586914062500,
        "z": -3462.9936523437500000,
        "direction": 4.5708312988281250,
        "type": "mon"
    },
    /* 430 */
    {
        "_id": ObjectId("55b33872ca012c8110f5cc89"),
        "uniqueID1": 946,
        "id": 7,
        "x": -3320.2897949218750000,
        "y": 1.2663903236389160,
        "z": -3537.7548828125000000,
        "direction": 4.5708312988281250,
        "type": "mon"
    },
    /* 431 */
    {
        "_id": ObjectId("55b33815ca012c8110f5cbec"),
        "uniqueID1": 947,
        "id": 7,
        "x": -309.9075622558593700,
        "y": -9.7944622039794922,
        "z": -4288.8496093750000000,
        "direction": 98,
        "type": "mon"
    },
    /* 432 */
    {
        "_id": ObjectId("55b33819ca012c8110f5cbf7"),
        "uniqueID1": 947,
        "id": 7,
        "x": -309.9075622558593700,
        "y": -9.7944622039794922,
        "z": -4288.8496093750000000,
        "direction": 331.9052734375000000,
        "type": "mon"
    },
    /* 433 */
    {
        "_id": ObjectId("55b3381bca012c8110f5cc00"),
        "uniqueID1": 947,
        "id": 7,
        "x": -262.8145446777343800,
        "y": -9.8362808227539062,
        "z": -4377.0664062500000000,
        "direction": 331.9052734375000000,
        "type": "mon"
    },
    /* 434 */
    {
        "_id": ObjectId("55b338bfca012c8110f5ccf6"),
        "uniqueID1": 948,
        "id": 7,
        "x": 2919.7033691406250000,
        "y": 0.1000289916992188,
        "z": 164.7534637451171900,
        "direction": 64.7549438476562500,
        "type": "mon"
    },
    /* 435 */
    {
        "_id": ObjectId("55b338c0ca012c8110f5ccf7"),
        "uniqueID1": 948,
        "id": 7,
        "x": 2919.7033691406250000,
        "y": 0.1000289916992188,
        "z": 164.7534637451171900,
        "direction": 141.7859802246093800,
        "type": "mon"
    },
    /* 436 */
    {
        "_id": ObjectId("55b338c0ca012c8110f5ccf8"),
        "uniqueID1": 948,
        "id": 7,
        "x": 2904.2382812500000000,
        "y": 0.1000289916992188,
        "z": 184.3961029052734400,
        "direction": 123.1816406250000000,
        "type": "mon"
    },
    /* 437 */
    {
        "_id": ObjectId("55b338b6ca012c8110f5ccdc"),
        "uniqueID1": 949,
        "id": 7,
        "x": 1671.9536132812500000,
        "y": 5.2584753036499023,
        "z": 625.4797973632812500,
        "direction": 345.2789001464843700,
        "type": "mon"
    },
    /* 438 */
    {
        "_id": ObjectId("55b338b8ca012c8110f5cce8"),
        "uniqueID1": 949,
        "id": 7,
        "x": 1671.9536132812500000,
        "y": 5.2584753036499023,
        "z": 625.4797973632812500,
        "direction": 33.1193542480468750,
        "type": "mon"
    },
    /* 439 */
    {
        "_id": ObjectId("55b333caca012c8110f5cb46"),
        "uniqueID1": 6,
        "id": 8,
        "x": -244,
        "y": 35,
        "z": -496,
        "direction": 88.3620605468750000,
        "type": "npc"
    },
    /* 440 */
    {
        "_id": ObjectId("55b33281ca012c8110f5cb34"),
        "uniqueID1": 7,
        "id": 9,
        "x": -1092,
        "y": 35,
        "z": -959,
        "direction": 360,
        "type": "npc"
    },
    /* 441 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb3a"),
        "uniqueID1": 21,
        "id": 11,
        "x": -1264,
        "y": 0,
        "z": -1539,
        "direction": 270,
        "type": "npc"
    },
    /* 442 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb39"),
        "uniqueID1": 9,
        "id": 12,
        "x": -1066,
        "y": 0,
        "z": -1637,
        "direction": 180,
        "type": "npc"
    },
    /* 443 */
    {
        "_id": ObjectId("55b332a7ca012c8110f5cb3f"),
        "uniqueID1": 10,
        "id": 13,
        "x": -582,
        "y": 0,
        "z": -1719,
        "direction": 180,
        "type": "npc"
    },
    /* 444 */
    {
        "_id": ObjectId("55b332abca012c8110f5cb43"),
        "uniqueID1": 11,
        "id": 14,
        "x": -578,
        "y": 0,
        "z": -1947,
        "direction": 329.8757934570312500,
        "type": "npc"
    },
    /* 445 */
    {
        "_id": ObjectId("55b4318bf7342f15566bb239"),
        "uniqueID1": 11,
        "id": 14,
        "x": -578,
        "y": 0,
        "z": -1947,
        "direction": 48.0357971191406250,
        "type": "npc"
    },
    /* 446 */
    {
        "_id": ObjectId("55b332abca012c8110f5cb44"),
        "uniqueID1": 12,
        "id": 15,
        "x": -682,
        "y": 0,
        "z": -1949,
        "direction": 14.3191223144531250,
        "type": "npc"
    },
    /* 447 */
    {
        "_id": ObjectId("55b332a7ca012c8110f5cb40"),
        "uniqueID1": 13,
        "id": 15,
        "x": -1201,
        "y": 0,
        "z": -1867,
        "direction": 360,
        "type": "npc"
    },
    /* 448 */
    {
        "_id": ObjectId("55b33864ca012c8110f5cc5b"),
        "uniqueID1": 14,
        "id": 15,
        "x": -1380,
        "y": 0,
        "z": -1964,
        "direction": 348.1445007324218700,
        "type": "npc"
    },
    /* 449 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb68"),
        "uniqueID1": 15,
        "id": 15,
        "x": -1660,
        "y": 0,
        "z": -864,
        "direction": 360,
        "type": "npc"
    },
    /* 450 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb69"),
        "uniqueID1": 16,
        "id": 15,
        "x": -1656,
        "y": 0,
        "z": -760,
        "direction": 360,
        "type": "npc"
    },
    /* 451 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb3b"),
        "uniqueID1": 26,
        "id": 15,
        "x": -1555,
        "y": 0,
        "z": -1222,
        "direction": 360,
        "type": "npc"
    },
    /* 452 */
    {
        "_id": ObjectId("55b337d6ca012c8110f5cb6a"),
        "uniqueID1": 27,
        "id": 15,
        "x": -1521,
        "y": 53,
        "z": -576,
        "direction": 360,
        "type": "npc"
    },
    /* 453 */
    {
        "_id": ObjectId("55b338aaca012c8110f5ccc7"),
        "uniqueID1": 28,
        "id": 15,
        "x": 584,
        "y": 0,
        "z": -1659,
        "direction": 145.6773986816406200,
        "type": "npc"
    },
    /* 454 */
    {
        "_id": ObjectId("55b4318cf7342f15566bb23a"),
        "uniqueID1": 29,
        "id": 15,
        "x": -70,
        "y": 0,
        "z": -1824,
        "direction": 360,
        "type": "npc"
    },
    /* 455 */
    {
        "_id": ObjectId("55b33430ca012c8110f5cb4a"),
        "uniqueID1": 31,
        "id": 15,
        "x": 182,
        "y": 151,
        "z": 717,
        "direction": 360,
        "type": "npc"
    },
    /* 456 */
    {
        "_id": ObjectId("55b33785ca012c8110f5cb50"),
        "uniqueID1": 32,
        "id": 15,
        "x": -1386,
        "y": 219,
        "z": 365,
        "direction": 360,
        "type": "npc"
    },
    /* 457 */
    {
        "_id": ObjectId("55b33785ca012c8110f5cb51"),
        "uniqueID1": 33,
        "id": 15,
        "x": -1381,
        "y": 219,
        "z": 202,
        "direction": 360,
        "type": "npc"
    },
    /* 458 */
    {
        "_id": ObjectId("55b33795ca012c8110f5cb52"),
        "uniqueID1": 34,
        "id": 15,
        "x": 306,
        "y": 130,
        "z": 563,
        "direction": 360,
        "type": "npc"
    },
    /* 459 */
    {
        "_id": ObjectId("55b338a9ca012c8110f5ccc5"),
        "uniqueID1": 37,
        "id": 15,
        "x": 385,
        "y": 53,
        "z": -1826,
        "direction": 360,
        "type": "npc"
    },
    /* 460 */
    {
        "_id": ObjectId("55b338dfca012c8110f5cd09"),
        "uniqueID1": 38,
        "id": 15,
        "x": 222,
        "y": 53,
        "z": -1829,
        "direction": 360,
        "type": "npc"
    },
    /* 461 */
    {
        "_id": ObjectId("55b332a7ca012c8110f5cb41"),
        "uniqueID1": 39,
        "id": 15,
        "x": -764,
        "y": 53,
        "z": -1825,
        "direction": 360,
        "type": "npc"
    },
    /* 462 */
    {
        "_id": ObjectId("55b332a7ca012c8110f5cb42"),
        "uniqueID1": 40,
        "id": 15,
        "x": -980,
        "y": 53,
        "z": -1827,
        "direction": 360,
        "type": "npc"
    },
    /* 463 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb3c"),
        "uniqueID1": 43,
        "id": 15,
        "x": -1507,
        "y": 53,
        "z": -1492,
        "direction": 360,
        "type": "npc"
    },
    /* 464 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb3d"),
        "uniqueID1": 44,
        "id": 15,
        "x": -1506,
        "y": 53,
        "z": -1366,
        "direction": 360,
        "type": "npc"
    },
    /* 465 */
    {
        "_id": ObjectId("55b332a1ca012c8110f5cb3e"),
        "uniqueID1": 45,
        "id": 15,
        "x": -1523,
        "y": 53,
        "z": -1051,
        "direction": 360,
        "type": "npc"
    },
    /* 466 */
    {
        "_id": ObjectId("55b33807ca012c8110f5cbc1"),
        "uniqueID1": 46,
        "id": 15,
        "x": -226,
        "y": 0,
        "z": -1848,
        "direction": 360,
        "type": "npc"
    },
    /* 467 */
    {
        "_id": ObjectId("55b33552ca012c8110f5cb4f"),
        "uniqueID1": 47,
        "id": 15,
        "x": -1134,
        "y": 239,
        "z": 700,
        "direction": 360,
        "type": "npc"
    },
    /* 468 */
    {
        "_id": ObjectId("55b33461ca012c8110f5cb4e"),
        "uniqueID1": 48,
        "id": 15,
        "x": -908,
        "y": 239,
        "z": 698,
        "direction": 360,
        "type": "npc"
    },
    /* 469 */
    {
        "_id": ObjectId("55b33281ca012c8110f5cb35"),
        "uniqueID1": 22,
        "id": 137,
        "x": -567,
        "y": 35,
        "z": -1136,
        "direction": 90,
        "type": "npc"
    }, ,
    /* 470 */
    {
        "_id": ObjectId("55b33281ca012c8110f5cb36"),
        "uniqueID1": 23,
        "id": 140,
        "x": -689,
        "y": 35,
        "z": -1115,
        "direction": 270,
        "type": "npc"
    },
    /* 471 */
    {
        "_id": ObjectId("55b3329cca012c8110f5cb38"),
        "uniqueID1": 24,
        "id": 144,
        "x": -1022,
        "y": 35,
        "z": -632,
        "direction": 360,
        "type": "npc"
    },
    /* 472 */
    {
        "_id": ObjectId("55b33281ca012c8110f5cb37"),
        "uniqueID1": 25,
        "id": 147,
        "x": -695,
        "y": 49,
        "z": -748,
        "direction": 360,
        "type": "npc"
    }
];
data.length = 470

//updateGraphData(data);
var circles = svg.append('g').attr("clip-path", "url(#clip)").selectAll("circle").data(data).enter().append("circle").on("mouseover", function() {
    return tooltip.style("visibility", "visible")
}).on("mousemove", function(d) {
    set_tooltip_label(d);
}).on("mouseout", function() {
    tooltip.style("visibility", "hidden");
});
var mobColours = d3.scale.category20b();
var circleAttributes = circles.attr("cx", function(d) {
    return x(d.x);
}).attr("cy", function(d) {
    return y(d.z);
}).attr("r", function(d) {
    return 20
}).style("fill", function(d) {
    switch (d.type) {
        case 'mon':
            {
                return 'red';
                break;
            }
        case 'npc':
            return 'blue';
            break;
        case 'player':
            return 'green';
            break;
    }
});

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