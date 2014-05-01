module.exports = function(grunt) {

    'use strict';

  var sourceFolder = "bower_components/Haku";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

      bower: {
        install: { 
          options : {
            copy : false
          }
        }
      },

      copy: {
          main: {
              files: [
                  { expand: true, cwd : sourceFolder, src: ['**', '!**/src/index.html', '!**/src/css-sass/*', '!**/*.bat' , '!**/src/ext/*'] }
              ]
          }
      }
     
    
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['bower', 'copy']);

};