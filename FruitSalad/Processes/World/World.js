// vmscript.watch('Config/network.json');
// vmscript.watch('Config/login.json');

// vms('Login Server', [
// 	'Config/network.json',
// 	'Config/login.json'
// 	], function(){
// 	net = require('net');
// 	CachedBuffer = require('./modules/CachedBuffer.js');
// 	PacketCollection = require('./modules/PacketCollection.js');
// 	restruct = require('./modules/restruct');

// 	function LoginInstance(){
// 		/*
// 			Array of current connected clients.
// 		*/
// 		this.clients = [];
// 		this.nextID = 0;

// 		/*
// 			Boolean indicating that the server is running
// 			and listening for incoming connections.
// 		*/
// 		this.listening = false;

// 		/*
// 			Used Later to see if config has to offer a new port to listen to.
// 			If is different than currently listening, re-listen the tcp server,
// 			to listen for the new port.
// 		*/
// 		this.listeningPort = null;

// 		/*
// 			A boolean variable to decide if we want to accept incoming connections.
// 		*/
// 		this.acceptConnections = false;

// 		/*
// 			A object of packet collection for this current instance.
// 		*/
// 		this.packetCollection = null;

// 		var self = this;
// 		/*
// 			A TCP server instance.
// 		*/
// 		this.instance = net.createServer(function (socket) { self.onConnection(socket); });
// 	}

// 	LoginInstance.prototype.onConnection = function(socket){
// 		if(!this.acceptConnections) return;

// 		var self = this;
// 		socket.clientID = this.nextID;
// 		this.nextID++;
// 		socket.authenticated = false;

// 		this.clients.push(socket);
// 		CachedBuffer.call(socket, this.packetCollection);

// 		console.log("[Login] new Connection #" + socket.clientID);

// 		try {
// 			this.onConnected(socket);
// 		} catch (e) {
// 			console.log(e);
// 		}

// 		socket.on('end', function() {
// 			return self.onDisconnect(socket);
// 		});

// 		// Need to find out which functions to use and make this tidyer....
// 		// Need to check for memory leaks and make sure we actually delete the un needed socket.
// 		// Need to make sure using splice won't be slower than deleting the index.
// 		// Should maybe look at using room or list rather than array of socket object.
// 		socket.on('close', function() {
// 			return self.onDisconnect(socket);
// 		});

// 		socket.on('disconnect', function() {
// 			return self.onDisconnect(socket);
// 		});

// 		socket.on('error', function(err) {
// 			return self.onError(err, socket);
// 		});
// 	};

// 	LoginInstance.prototype.onDisconnect = function(socket){
// 		console.log("[Login] connection closed #" + socket.clientID);
// 		this.clients.splice(this.clients.indexOf(socket), 1);
// 		socket.destroy();
// 	};

// 	LoginInstance.prototype.onError = function(err, socket){
// 		console.log(err);
// 		this.clients.splice(this.clients.indexOf(socket), 1);
// 		socket.destroy();
// 	};

// 	LoginInstance.prototype.init = function(){
// 		if(this.listening) return;

// 		var self = this;
// 		this.instance.listen(config.network.ports.login, function(){
// 			self.listening = true;
// 			self.listeningPort = config.network.ports.login;
// 			console.log("Login Server Instance listening on:", self.listeningPort);
// 		});

// 		this.packetCollection = PacketCollection('LoginPC');

// 		vmscript.watch('./Processes/Login/Packets').on('Packets', function(){
// 			self.acceptConnections = true;
// 		});
// 	}

// 	if(typeof Login === 'undefined')
// 		global.Login = new LoginInstance();
// 	else
// 		global.Login.__proto__ = LoginInstance.prototype;

// 	global.Login.init();
// });


process.api.run();
// console.log(process.api);