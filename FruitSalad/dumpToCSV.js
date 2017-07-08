// To use copy paste into repl.
// Made as a one off to dump the data to a csv for updating the google translation spreadsheets as their koeran is encoded wrong.
var fs = require('fs');
var ws = fs.createWriteStream('Items_Dump.csv');
ws.write('ID,Name,Description1,Description2,Description3\r\n');
var stream = db.Item.find().sort({_id: 1}).stream().on('data', function (doc) {
  console.log('Writing Item: '+doc._id+' '+doc.Name);
  ws.write(doc._id + ',"' + doc.Name + '","' + doc.Description1 + '","' + doc.Description2 + '","' + doc.Description3 + '"\r\n');
}).on('error', function (err) {
  console.error(err);
}).on('close', function () {
  console.log('All done Items');
  ws.end();
});

var ws2 = fs.createWriteStream('Monsters_Dump.csv');
ws2.write('ID,Name\r\n');
var stream = db.Monster.find().sort({_id: 1}).stream().on('data', function (doc) {
  console.log('Writing Monster: '+doc._id+' '+doc.Name);
  ws2.write(doc._id + ',"' + doc.Name + '"\r\n');
}).on('error', function (err) {
  console.error(err);
}).on('close', function () {
  console.log('All done Monster');
  ws2.end();
});

var ws3 = fs.createWriteStream('Npc_Dump.csv');
ws3.write('ID,Name,Chat1,Chat2,Chat3,Chat4,Chat5\r\n');
var stream = db.NPC.find().sort({_id: 1}).stream().on('data', function (doc) {
  console.log('Writing Npc: '+doc._id+' '+doc.Name);
  ws3.write(doc._id + ',"' + doc.Name + '","'+doc.Chat1+'", "'+doc.Chat2+'", "'+doc.Chat3+'", "'+doc.Chat4+'", "'+doc.Chat5+'"\r\n');
}).on('error', function (err) {
  console.error(err);
}).on('close', function () {
  console.log('All done Npc');
  ws3.end();
});