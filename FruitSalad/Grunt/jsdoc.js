module.exports = function(grunt) {

  // A very basic default task.
  grunt.registerTask('jsdoc', 'Generate project documentation.', function() {

	grunt.initConfig({
	    jsdoc : {
	        dist : {
	            src: ['*.js', 'Modules', 'Grunt', 'Generic', 'Commands', 'Database', 'Helper', 'Processes', '../README.md' ],
	            options: {
		            destination: 'Documentation',
		            recurse: true,
		            tutorials: "Tutorials",
		            template : "node_modules/jsdoc-oblivion/template",
          			configure : "Config/jsdoc.json",
	            }
	        }
	    }
	});

	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.task.run('jsdoc');
  });
};

