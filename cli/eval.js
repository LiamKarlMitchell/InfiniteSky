// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */

// TODO: Remove depricated function we now have REPL
cli.eval = function CLI_Eval(input) {
	console.log('CLI_Eval');
  // Eval if single line given or if no input open a repl
  if (input.length) {
    eval(input); 
  } else {
  	console.log('please type js');	
  }
};

cli.eval.help = function CLI_Eval_help(input) {
  return 'A proof of concept command which can eval JS code.';
};

scripts_cli.unload.eval = function CLI_Unload_Eval() {
  delete cli.eval;
}