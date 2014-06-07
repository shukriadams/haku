module.exports = function(grunt) {

  'use strict';

  // overwrite settings with optional external settings file
  var settings = {};
  try{
    settings = require('./gruntSettings.js');
  } catch(err){
      console.log("gruntSettings.js not found, using default values.");
  }

  var bowerRoot = settings.bowerRoot ? settings.bowerRoot : "bower_components";
  var srcRoot = settings.srcRoot ? settings.srcRoot : "src";
  var androidSrcFolder = settings.androidSrcFolder ? settings.androidSrcFolder : "compile_android";
  var iosSrcFolder = settings.iosSrcFolder ? settings.iosSrcFolder : "compile_ios";
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
                  { expand: true, cwd : bowerRoot + "/Haku/src", src: ['**', '!**/src/index.html', '!**/src/css-sass/*', '!**/*.bat' , '!**/src/ext/*'] }
              ]
          },
          depend: {
              files: [
                  { src: [ bowerRoot + '/backbone/backbone.js'], dest : srcRoot + '/3rdparty/backbone.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/js/foundation.js'], dest : srcRoot + '/3rdparty/foundation.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/foundation.css'], dest : srcRoot + '/style/foundation.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/normalize.css'], dest : srcRoot + '/style/normalize.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/jquery/jquery.js'], dest : srcRoot + '/3rdparty/jquery.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/klon/index.js'], dest : srcRoot + '/3rdparty/klon.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/modernizr/modernizr.js'], dest : srcRoot + '/3rdparty/modernizr.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/requirejs/require.js'], dest : srcRoot + '/3rdparty/require.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/underscore/underscore.js'], dest : srcRoot + '/3rdparty/underscore.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/ejs/index.js'], dest : srcRoot + '/3rdparty/ejs_production.js', filter: 'isFile' },
                  { expand: true, cwd : bowerRoot + '/qunit/qunit', src: ['**'], dest: srcRoot + '/tests' }
              ]
          },
          android: {
              files: [
                  { expand: true, cwd : srcRoot, src: ['**'], dest: androidSrcFolder + '/' },
                  { src: [ srcRoot + '/app/settings-android.js'], dest : androidSrcFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          ios: {
              files: [
                  { expand: true, cwd : srcRoot, src: ['**'], dest: iosSrcFolder + '/' },
                  { src: [ srcRoot + '/app/settings-ios.js'], dest : iosSrcFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          web: {
              files: [
                  {expand: true, cwd : srcRoot, src: ['**'], dest: webSrcFolder + '/'}
              ]
          }                             
      },


      clean:{
        depend : [bowerRoot + '/klon'],    
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
          cwd: srcRoot + '/css',
          src: ['*.css', '!*.min.css'],
          dest: androidSrcFolder + '/css/',
          ext: '.css'
        },
        ios: {
          expand: true,
          cwd: srcRoot + '/css',
          src: ['*.css', '!*.min.css'],
          dest: iosSrcFolder + '/css/',
          ext: '.css'
        },
        web: {
            expand: true,
            cwd: srcRoot + '/css',
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
            src: [ androidSrcFolder + '/shims/*.js'],
            dest: androidSrcFolder + '/shims/',
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
            src: [ iosSrcFolder + '/shims/*.js'],
            dest: iosSrcFolder + '/shims/',
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

  // Default task(s).
  grunt.registerTask('init', ['bower', 'copy:init']);
  grunt.registerTask('depend', ['clean:depend', 'bower', 'copy:depend']);
  grunt.registerTask('android', ['copy:android', 'uglify:android', 'cssmin:android', 'clean:android', 'replace:android_requireRoot', 'replace:android_removeShims']);
  grunt.registerTask('ios', ['copy:ios', 'uglify:ios', 'cssmin:ios', 'clean:ios', 'replace:ios_requireRoot', 'replace:ios_removeShims']);
  grunt.registerTask('web', ['copy:web', 'uglify:web', 'cssmin:web', 'clean:web']);
};