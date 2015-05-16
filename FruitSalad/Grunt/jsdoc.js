module.exports = function(grunt) {

  // A very basic default task.
  grunt.registerTask('jsdoc', 'Generate project documentation.', function() {

	grunt.config('jsdoc',{
		    dist : {
		        src: ['*.js', 'Database', 'Helper', 'Processes', 'README.md'],
		        options: {
		            destination: 'Documentation',
		            template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
		            configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json",
		            recurse: true,
		            tutorials: "Tutorials"

		        }
		    }
	});

	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.task.run('jsdoc');
  });



};

