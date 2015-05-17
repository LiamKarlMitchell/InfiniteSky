vmscript.watch('Config/network.json');
vmscript.watch('Config/login.json');

vms('Login Server', [
	'Config/network.json',
	'Config/login.json'
	], function(){
	net = require('net');
	CachedBuffer = require('./modules/CachedBuffer.js');
	PacketCollection = require('./modules/PacketCollection.js');

	function LoginInstance(){
		/*
			Array of current connected clients.
		*/
		this.clients = [];

		this.nextID = 0;

		/* Boolean indicating that the server is running
		and listening for incoming connections. */
		this.listening = false;
		this.listeningPort = null;
		this.acceptConnections = false;
		this.packetCollection = null;

		var self = this;
		this.instance = net.createServer(function (socket) { self.onConnection(socket); });
	}

	LoginInstance.prototype.onConnection = function(socket){
		if(!this.acceptConnections) return;

		var self = this;
		socket.clientID = this.nextID;
		this.nextID++;
		socket.authenticated = false;

		this.clients.push(socket);
		CachedBuffer.call(socket, this.packetCollection);

		console.log("[Login] new Connection #" + socket.clientID);

		socket.on('end', function() {
			return self.onDisconnect(socket);
		});

		// Need to find out which functions to use and make this tidyer....
		// Need to check for memory leaks and make sure we actually delete the un needed socket.
		// Need to make sure using splice won't be slower than deleting the index.
		// Should maybe look at using room or list rather than array of socket object.
		socket.on('close', function() {
			return self.onDisconnect(socket);
		});

		socket.on('disconnect', function() {
			return self.onDisconnect(socket);
		});

		socket.on('error', function(err) {
			return self.onError(socket);
		});
	};

	LoginInstance.prototype.onDisconnect = function(socket){
		this.clients.splice(this.clients.indexOf(socket), 1);
		socket.destroy();
	};

	LoginInstance.prototype.onError = function(socket){
		this.clients.splice(this.clients.indexOf(socket), 1);
		socket.destroy();
	};

	LoginInstance.prototype.init = function(){
		if(this.listening) return;
		
		var self = this;
		this.instance.listen(config.network.ports.login, function(){
			self.listening = true;
			self.listeningPort = config.network.ports.login;
			console.log("Login Server Instance listening on:", self.listeningPort);
		});

		this.packetCollection = PacketCollection('LoginPC');

		vmscript.watch('./Processes/Login/Packets').on('Packets', function(){
			self.acceptConnections = true;
		});
	}

	if(typeof Login === 'undefined')
		global.Login = new LoginInstance();
	else
		global.Login.__proto__ = LoginInstance.prototype;

	global.Login.init();
});