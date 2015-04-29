/**
 * Child Process Host module.
 * @module Helper/ChildProcessHost
 */

var process = require('process');

/**
* @constructor
* @this {ChildProcessHost}
* @param {name} The name given to the ChildProcessHost
* @param {context} opt_argument An optional context to pass
*/
function ChildProcessHost(name, context) {
  /** The name of this ChildProcessHost. */
  this.name = name;

  /** Array to hold Child Processes. */
  this.children = [];

  this.context = {};
  if (context !== undefined) {
  	this.setContext(context);
  }
}


/**
* Sets the context of a ChildProcessHost.
*
* @this {ChildProcessHost}
*/
ChildProcessHost.prototype.setContext = function ChildProcessHost_setContext(context) {
	/** The context given to the children. */
	this.context = context;
}

/**
* Starts a ChildProcessHost
*
* @this {ChildProcessHost}
*/
ChildProcessHost.prototype.start = function ChildProcessHost_start() {

}


/**
* Adds a child to a ChildProcessHost.
* @param {string} script file name
* @param {array} arguments to pass
* @this {ChildProcessHost}
*/
ChildProcessHost.prototype.addChild = function ChildProcessHost_addChild(script, args) {

}

 /** Constructor for ChildProcessHost */
 exports.ChildProcessHost = ChildProcessHost;