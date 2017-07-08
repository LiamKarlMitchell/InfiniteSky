// Using some to call the callback function for the queued things.
// If you want you could view the array, process just the first or last thing and return true to break
// then no further execution would be done.
// Callback should expect value, index, array as arguments
function GroupOverTimeThenCall(callback, options) {
	if (!(callback instanceof Function)) {
		throw new Error('GroupOverTimeThenCall expects callback to be a function.');
	}

	this.callback = callback;

	// Set default options here
	this.options = {
		waitTime: 5000, // Time to wait before calling the function and emptying queue.
		limit: 30 // Amount to queue before just sending immediatly.
	};

	if (options) {
		for (var a in options) {
			this.options[a] = options[a];
		}
	}

	this.timeout = null;
	this.queue = [];
}

GroupOverTimeThenCall.prototype.flush = function GroupOverTimeThenCall__flush() {
	if (this.queue.length) {
		this.queue.some(this.callback);
	}
	this.queue.length = 0;
};

GroupOverTimeThenCall.prototype.add = function GroupOverTimeThenCall__add(data) {
	if (this.queue.length >= this.options.limit) {
		this.flush();
	}

	this.queue.push(data);
	clearTimeout(this.timeout);
	this.timeout = setTimeout(this.flush.bind(this), this.options.waitTime);
};

var test = new GroupOverTimeThenCall(function(value) {
	console.log(value);
});
test.add('POOP');
test.add('POOP');
test.add('POOP');
test.add('POOP');
test.add('POOP');
test.add('POOP');