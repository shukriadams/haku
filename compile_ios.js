// requires that cordova files are placed in the src/3rdparty folder, and are all named cordova-[PLATFORM]-[VERSION].js
module.exports = function(grunt) {
  
  'use strict';

  var targetFolder = "compile_ios";
  var sourceFolder = "src";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

      copy: {
          main: {
              files: [
                  { expand: true, cwd : sourceFolder, src: ['**'], dest: targetFolder + '/' },
                  { src: [ sourceFolder + '/app/settings-ios.js'], dest : targetFolder + '/app/settings.js', filter: 'isFile' }
              ]
          }
      },

      uglify: {
        my_target: {
          files: [
            { cwd: targetFolder + '/3rdparty', src: '**/*.js', dest:  targetFolder + '/3rdparty', expand: true },
            { cwd: targetFolder + '/app', src: '**/*.js', dest: targetFolder + '/app', expand: true },
            { cwd: targetFolder + '/views', src: '**/*.js', dest: targetFolder + '/views', expand: true }
          ]
        }
      },

      cssmin: {
        minify: {
          expand: true,
          cwd: sourceFolder + '/css',
          src: ['*.css', '!*.min.css'],
          dest: targetFolder + '/css/',
          ext: '.css'
        }
      },

      clean: [
        targetFolder + "/shims/disposable",
        targetFolder + "/css-sass",
        targetFolder + "/tests",
        targetFolder + "/config.rb",
        targetFolder + "/start compass.bat",
        targetFolder + "/app/settings-*.js"
      ],

      replace: {

          requireRoot: {
              src: [ targetFolder + '/app/haku.js'],
              dest: targetFolder + '/app/',
              replacements: [
                  {
                      from: /haku.settings.systemPathRoot='\/'/g,
                      to: 'haku.settings.systemPathRoot=window.location.pathname.replace("index.html", "")'
                  },
                  {
                      from: /haku.settings.launchMode='direct'/g,
                      to: 'haku.settings.launchMode="onready"'
                  }
              ]
          },

          removeShims: {
              // clear all shim files of content, but leave empty files 
              src: [ targetFolder + '/shims/*.js'],
              dest: targetFolder + '/shims/',
              replacements: [{
                  from: /.*/g,                   
                  to: ''
              }]
          }
      }     

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task(s).
  grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'clean' ,'replace']);

};