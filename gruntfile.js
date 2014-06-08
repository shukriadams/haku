module.exports = function(grunt) {

  'use strict';

  // overwrite settings with optional external settings file
  var settings = {};
  try{
    settings = require('./gruntSettings.js');
  } catch(err){
      console.log("gruntSettings.js not found, using default values.");
  }

  // where bower will pull down haku and dependencies
  var bowerRoot = settings.bowerRoot ? settings.bowerRoot : "bower_components";
  // where your working copy of haku will be set up. Change this if you want to nest haku in a folder with parent build logic of its own
  var workDirectory = settings.workDirectory ? settings.workDirectory : "src";
  // where the source to "compile" is placed. Normally identital to workDirectory value. Override to add extra build step.
  var precompileDirectory = settings.precompileDirectory ? settings.precompileDirectory : "src";
  // where haku compiles and optimises final content for android apps. This content is Phonegap-ready.
  var androidSrcFolder = settings.androidSrcFolder ? settings.androidSrcFolder : "compile_android";
  // where haku compiles and optimises final content for ios apps. This content is Phonegap-ready.
  var iosSrcFolder = settings.iosSrcFolder ? settings.iosSrcFolder : "compile_ios";
  // where haku compiles and optimises final content for web apps. This content can run as public web apps.
  var webSrcFolder = settings.webSrcFolder ? settings.webSrcFolder : "compile_web";


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


      bower: {
        default : { 
          options : {
            copy : false
          }
        }        
      },


      copy: {
          init: {
              files: [
                  { expand: true, cwd : bowerRoot + "/Haku/src", src: ['**', '!index.html', '!css-sass/**/*', '!*.bat' , '!ext/**/*'], dest : workDirectory },
                  { src: [ bowerRoot + '/backbone/backbone.js'], dest : workDirectory + '/3rdparty/backbone.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/js/foundation.js'], dest : workDirectory + '/3rdparty/foundation.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/foundation.css'], dest : workDirectory + '/style/foundation.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/normalize.css'], dest : workDirectory + '/style/normalize.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/jquery/jquery.js'], dest : workDirectory + '/3rdparty/jquery.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/klon/index.js'], dest : workDirectory + '/3rdparty/klon.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/modernizr/modernizr.js'], dest : workDirectory + '/3rdparty/modernizr.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/requirejs/require.js'], dest : workDirectory + '/3rdparty/require.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/underscore/underscore.js'], dest : workDirectory + '/3rdparty/underscore.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/ejs/index.js'], dest : workDirectory + '/3rdparty/ejs_production.js', filter: 'isFile' },
                  { expand: true, cwd : bowerRoot + '/qunit/qunit', src: ['**'], dest: workDirectory + '/tests' }
              ]
          },
          android: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: androidSrcFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-android.js'], dest : androidSrcFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          ios: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: iosSrcFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-ios.js'], dest : iosSrcFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          web: {
              files: [
                  {expand: true, cwd : precompileDirectory, src: ['**'], dest: webSrcFolder + '/'}
              ]
          }                             
      },


      clean:{
        android : [
          androidSrcFolder + "/shims/disposable",
          androidSrcFolder + "/css-sass",
          androidSrcFolder + "/tests",
          androidSrcFolder + "/config.rb",
          androidSrcFolder + "/start compass.bat",
          androidSrcFolder + "/app/settings-*.js"
        ],
        ios : [
          iosSrcFolder + "/shims/disposable",
          iosSrcFolder + "/css-sass",
          iosSrcFolder + "/tests",
          iosSrcFolder + "/config.rb",
          iosSrcFolder + "/start compass.bat",
          iosSrcFolder + "/app/settings-*.js"        
        ],
        web : [
          webSrcFolder + "/css-sass",
          webSrcFolder + "/tests",
          webSrcFolder + "/config.rb",
          webSrcFolder + "/start compass.bat",
          webSrcFolder + "/app/settings-*.js"        
        ]
      },


      uglify: {
        android: {
          files: [
            { cwd: androidSrcFolder + '/3rdparty', src: '**/*.js', dest:  androidSrcFolder + '/3rdparty', expand: true },
            { cwd: androidSrcFolder + '/app', src: '**/*.js', dest: androidSrcFolder + '/app', expand: true },
            { cwd: androidSrcFolder + '/views', src: '**/*.js', dest: androidSrcFolder + '/views', expand: true }
          ]
        },
        ios: {
          files: [
            { cwd: iosSrcFolder + '/3rdparty', src: '**/*.js', dest:  iosSrcFolder + '/3rdparty', expand: true },
            { cwd: iosSrcFolder + '/app', src: '**/*.js', dest: iosSrcFolder + '/app', expand: true },
            { cwd: iosSrcFolder + '/views', src: '**/*.js', dest: iosSrcFolder + '/views', expand: true }
          ]
        },
        web: {
            files: [
                {cwd: webSrcFolder + '/3rdparty', src: '**/*.js', dest:  webSrcFolder + '/3rdparty', expand: true},
                {cwd: webSrcFolder + '/app', src: '**/*.js', dest: webSrcFolder + '/app', expand: true},
                {cwd: webSrcFolder + '/views', src: '**/*.js', dest: webSrcFolder + '/views', expand: true}
            ]
        }                
      },


      cssmin: {
        android: {
          expand: true,
          cwd: precompileDirectory + '/css',
          src: ['*.css', '!*.min.css'],
          dest: androidSrcFolder + '/css/',
          ext: '.css'
        },
        ios: {
          expand: true,
          cwd: precompileDirectory + '/css',
          src: ['*.css', '!*.min.css'],
          dest: iosSrcFolder + '/css/',
          ext: '.css'
        },
        web: {
            expand: true,
            cwd: precompileDirectory + '/css',
            src: ['*.css', '!*.min.css'],
            dest: webSrcFolder + '/css/',
            ext: '.css'
        }                
      },


      replace: {
        android_requireRoot: {
            src: [ androidSrcFolder + '/app/haku.js'],
            dest: androidSrcFolder + '/app/',
            replacements: [{
                from: /haku.settings.systemPathRoot="\/"/g,
                to: 'haku.settings.systemPathRoot="file:///android_asset/www/"'
            }]
        },

        android_removeShims: {
            // clear all shim files of content, but leave empty files 
            src: [ androidSrcFolder + '/app/shims/*.js'],
            dest: androidSrcFolder + '/app/shims/',
            replacements: [{
                from: /.*/g,                   
                to: ''
            }]
        },

        ios_requireRoot: {
            src: [ iosSrcFolder + '/app/haku.js'],
            dest: iosSrcFolder + '/app/',
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

        ios_removeShims: {
            // clear all shim files of content, but leave empty files 
            src: [ iosSrcFolder + '/app/shims/*.js'],
            dest: iosSrcFolder + '/app/shims/',
            replacements: [{
                from: /.*/g,                   
                to: ''
            }]
        }        

      }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-text-replace');

   grunt.registerTask('init', ['bower', 'copy:init']);
  grunt.registerTask('android', ['copy:android', 'uglify:android', 'cssmin:android', 'clean:android', 'replace:android_requireRoot', 'replace:android_removeShims']);
  grunt.registerTask('ios', ['copy:ios', 'uglify:ios', 'cssmin:ios', 'clean:ios', 'replace:ios_requireRoot', 'replace:ios_removeShims']);
  grunt.registerTask('web', ['copy:web', 'uglify:web', 'cssmin:web', 'clean:web']);

};