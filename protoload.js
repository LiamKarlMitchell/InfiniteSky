// I can't remember why I was writing this... im sure I will need it sometime in the future though.
var system = {};

function Register(name,prototype) {
	if (typeof (prototype.shutdown) !== 'function') {
		console.log('Prototype must have a shutdown function');
	}

	// If not registered before then register
	if (system[name] === undefined) {
		system[name] = {};
		system[name].__proto__ = prototype;
	} else {
		console.log('already exists');
		// See if we can back up anything to transfer to new instance
		var transfer;
		if (typeof(system[name].transfer) === 'function') {
			transfer = system[name].transfer();
		}

		system[name].__proto__ = prototype;

		// If possible transfer our data we backed up
		if (transfer !== undefined && typeof(system[name].transfer) === 'function' ) {
			system[name].transfer(transfer);
		}

	}

	return system[name];
}

function Unregister(name) {
	if (system[name]) {
		if (typeof(system[name].Unregister) === 'function') {
			return system[name].Unregister();
		}
	}
}

function Get(name) {
	return system[name];
}


module.exports = {
  Register: Register,
  Unregister: Unregister,
  Get: Get
};
