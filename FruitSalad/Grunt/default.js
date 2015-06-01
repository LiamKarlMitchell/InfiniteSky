module.exports = function(grunt) {

  // A very basic default task.
  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

  // Run all of the database import from game files
  grunt.registerTask('initdb', 'Import information from games files to the DB.', function() {
	grunt.task.run('itemsToMongo');
	grunt.task.run('expToMongo');
	grunt.task.run('monstersToMongo');
	grunt.task.run('updatetranslation');
  });

  // Updates translations
  grunt.registerTask('updatetranslation', 'Updates translations in DB from google spreadsheets.', function() {
	grunt.task.run('updateTranslationDBItem');
	grunt.task.run('updateTranslationDBMonster');
	grunt.task.run('updateTranslationDBNpc');
  });

};