module.exports = function(grunt) {
  
  'use strict';
  var sourceRoot = "bower_components";
  var targetRoot = "src";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

      clean: [
          sourceRoot + '/klon'
      ],

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
                  { src: [ sourceRoot + '/backbone/backbone.js'], dest : targetRoot + '/3rdparty/backbone.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/foundation/js/foundation.js'], dest : targetRoot + '/3rdparty/foundation.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/foundation/css/foundation.css'], dest : targetRoot + '/style/foundation.css', filter: 'isFile' },
                  { src: [ sourceRoot + '/foundation/css/normalize.css'], dest : targetRoot + '/style/normalize.css', filter: 'isFile' },
                  { src: [ sourceRoot + '/jquery/jquery.js'], dest : targetRoot + '/3rdparty/jquery.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/klon/index.js'], dest : targetRoot + '/3rdparty/klon.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/modernizr/modernizr.js'], dest : targetRoot + '/3rdparty/modernizr.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/requirejs/require.js'], dest : targetRoot + '/3rdparty/require.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/underscore/underscore.js'], dest : targetRoot + '/3rdparty/underscore.js', filter: 'isFile' },
                  { src: [ sourceRoot + '/ejs/index.js'], dest : targetRoot + '/3rdparty/ejs_production.js', filter: 'isFile' },
                  { expand: true, cwd : sourceRoot + '/qunit/qunit', src: ['**'], dest: targetRoot + '/tests' }
              ]
          }
      }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');


  grunt.registerTask('default', ['clean', 'bower', 'copy']);

};