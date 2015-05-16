module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-gss');

  // Default task(s).
  grunt.task.loadTasks('Grunt');
};