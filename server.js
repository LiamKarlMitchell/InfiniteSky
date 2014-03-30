// The idea was to use this as a base for each server we run up.
// However due to shortage of time I just hard coded the server parts in the login and world files.

vmscript = require('./vmscript');
util = require('./util');
zlib = require('zlib');
restruct = require('./restruct');
async = require('async');
protoload = require('./protoload');
repl = require("repl");
jshint = require('jshint').JSHINT;
events = require('events');
hexy = require('hexy').hexy;

Netmask = require('netmask').Netmask;
net = net = require('net');
io = io = require('socket.io');
http = http = require('http');

var scope = require('./sandbox');

function Server() {

};

module.exports = Server;