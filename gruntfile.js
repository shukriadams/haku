/**
 *  Haku : a mobile and web build framework based on Phonegap and Backbone.
 *  @author  Shukri Adams (shukri.adams@gmail.com)
 *
 *  WARNING : This file is managed by Haku's own build scripts, and may be overwritten as part of the normal build process.
 *  Do not change its contents unless you know what you're doing.
 *
 *  Tasks available :
 *  init : this is the normal starting point for setting Haku up in your project. It gets the latest version of Haku's
 *         dependencies (using Bower), creates the Haku app directory structure, and copies all Haku's own files to those
 *         directories.
 *  web : Builds Haku as a pure web app.
 *  android : Builds Haku for Android.
 *  android-debug : Builds Haku for Android, but in debug-friendly mode (no minify, uglify etc).
 *  ios : Builds Haku for iOS.
 *  ios-debug : Builds Haku for iOS, but in debug-friendly mode (no minify, uglify etc).
 *  dev : Sets Haku up in dev mode. Use this if you have cloned the Haku repo and want to develop on it's core.
 */

module.exports = function(grunt) {

  'use strict';

  // overwrite settings with optional external settings file
  var settings = {};
  try{
    settings = require('./gruntSettings.js');
  } catch(err){
      console.log("gruntSettings.js not found, using default values.");
  }

  var currentTask = grunt.cli.tasks && grunt.cli.tasks.length !== 0 ? grunt.cli.tasks[0].toLowerCase() : null;

  // where bower will pull down haku and dependencies
  var bowerRoot = settings.bowerRoot ? settings.bowerRoot : "bower_components";
  // where your working copy of haku will be set up. Change this if you want to nest haku in a folder with parent build logic of its own
  var workDirectory = settings.workDirectory ? settings.workDirectory : "src";
  // where the source to "compile" is placed. Normally identital to workDirectory value. Override to add extra build step.
  var precompileDirectory = settings.precompileDirectory ? settings.precompileDirectory : "src";

  // where haku compiles and optimises final content for android apps. This content is Phonegap-ready.
  var androidTargetFolder = settings.androidTargetFolder ? settings.androidTargetFolder : "compile_android";
  // where haku compiles and optimises final content for ios apps. This content is Phonegap-ready.
  var iosTargetFolder = settings.iosTargetFolder ? settings.iosTargetFolder : "compile_ios";
  // where haku compiles and optimises final content for web apps. This content can run as public web apps.
  var webTargetFolder = settings.webTargetFolder ? settings.webTargetFolder : "compile_web";

  // targetFolder is the target folder regardless of task
  var targetFolder = "";
  if (currentTask === "web")
    targetFolder = webTargetFolder;
  else if (currentTask === "android")
    targetFolder = androidTargetFolder;
  else if (currentTask === "ios")
    targetFolder = iosTargetFolder;



  // use to assign an external grunt task prior to compiling for platform. Task must be in [workDirectory]/Gruntfile.js. Leave blank to skip.
  var precompileGrunt = null,
      fs = require('fs'),
      initCopyArgs = ['**',  '!*.bat'],
      precompileGruntTask = null;

  if(settings.precompileGrunt) {
    var args = settings.precompileGrunt.split(' ');
    if (args.length !== 2){
      console.log("precompilegrunt must be formatted 'path/to/gruntfile.js [task]'");
      return;
    }
    precompileGrunt = args[0];
    precompileGruntTask = args[1];
  }
  
  // copy sass folder if it doesn't exist
  if (fs.existsSync(workDirectory + "/css-sass")) {
    initCopyArgs.push('!css-sass/**/*')
  } 
  // copy ext folder if it doesn't exist
  if (fs.existsSync(workDirectory + "/ext")) {
    initCopyArgs.push('!ext/**/*')
  } 


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
                  { expand: true, cwd : bowerRoot + '/Haku/src', src: initCopyArgs, dest : workDirectory },
                  { src: [ bowerRoot + '/Haku/gruntfile.js'], dest : __dirname + '/gruntfile.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/Haku/package.js'], dest : __dirname + '/package.js' , filter: 'isFile' },
                  { src: [ bowerRoot + '/Haku/bower.js'], dest : __dirname + '/bower.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/backbone/backbone.js'], dest : workDirectory + '/lib/backbone.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/js/foundation.js'], dest : workDirectory + '/lib/foundation.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/normalize.css'], dest : workDirectory + '/css/normalize.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/jquery/dist/jquery.js'], dest : workDirectory + '/lib/jquery.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/klon/index.js'], dest : workDirectory + '/lib/klon.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/yarn/index.js'], dest : workDirectory + '/lib/yarn.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/modernizr/modernizr.js'], dest : workDirectory + '/lib/modernizr.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/requirejs/require.js'], dest : workDirectory + '/lib/require.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/underscore/underscore.js'], dest : workDirectory + '/lib/underscore.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/ejs/index.js'], dest : workDirectory + '/lib/ejs_production.js', filter: 'isFile' },
                  { expand: true, cwd : bowerRoot + '/qunit/qunit', src: ['**'], dest: workDirectory + '/test' }
              ]
          },
          initDev :{
              files: [
                  { src: [ bowerRoot + '/backbone/backbone.js'], dest : workDirectory + '/lib/backbone.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/klon/index.js'], dest : workDirectory + '/lib/klon.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/requirejs/require.js'], dest : workDirectory + '/lib/require.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/jquery/dist/jquery.js'], dest : workDirectory + '/lib/jquery.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/js/foundation.js'], dest : workDirectory + '/lib/foundation.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/foundation/css/normalize.css'], dest : workDirectory + '/css/normalize.css', filter: 'isFile' },
                  { src: [ bowerRoot + '/modernizr/modernizr.js'], dest : workDirectory + '/lib/modernizr.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/underscore/underscore.js'], dest : workDirectory + '/lib/underscore.js', filter: 'isFile' },
                  { src: [ bowerRoot + '/ejs/index.js'], dest : workDirectory + '/lib/ejs_production.js', filter: 'isFile' },
                  { expand: true, cwd : bowerRoot + '/qunit/qunit', src: ['**'], dest: workDirectory + '/test' }
              ]
          },
          android: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: targetFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-android.js'], dest : targetFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          ios: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: targetFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-ios.js'], dest : targetFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          web: {
              files: [
                  {expand: true, cwd : precompileDirectory, src: ['**'], dest: targetFolder + '/'}
              ]
          }                             
      },


      clean:{
        mobile : [
          targetFolder + "/shims/disposable",
          targetFolder + "/css-sass",
          targetFolder + "/test",
          targetFolder + "/config.rb",
          targetFolder + "/start compass.bat",
          targetFolder + "/app/settings-*.js"
        ],
        web : [
          targetFolder + "/css-sass",
          targetFolder + "/test",
          targetFolder + "/config.rb",
          targetFolder + "/start compass.bat",
          targetFolder + "/app/settings-*.js"        
        ]
      },


      uglify: {
        default : {
          files: [
            { cwd: targetFolder + '/lib', src: '**/*.js', dest:  targetFolder + '/lib', expand: true },
            { cwd: targetFolder + '/app', src: '**/*.js', dest: targetFolder + '/app', expand: true },
            { cwd: targetFolder + '/views', src: '**/*.js', dest: targetFolder + '/views', expand: true },
            { cwd: targetFolder + '/ext', src: '**/*.js', dest: targetFolder + '/ext', expand: true }
          ]
        }                
      },


      compass: {
        default: {
          options: {
            sassDir: precompileDirectory + '/css-sass',
            cssDir : precompileDirectory + '/css',
            force : true,
            // workaround for compass bug that was not getting "importPath" direct setter
            raw: 'add_import_path "' + precompileDirectory + '/../bower_components/foundation/scss'+ '",' +
                  '"' + precompileDirectory + '/../bower_components/foundation/scss/foundation'+ '"'            
          }
        }
      },


      cssmin: {
        default: {
          expand: true,
          cwd: precompileDirectory + '/css',
          src: ['*.css', '!*.min.css'],
          dest: targetFolder + '/css/',
          ext: '.css'
        }
      },


      replace: {

        // set base to empty string, this is for devices only, and is required for both 
        // backbone and requirejs's url mapping on both devices and on web browsers
        reset_base: {
            src: [ targetFolder + '/index.html'],
            dest: targetFolder + '/index.html',
            replacements: [{
                from: /<base href="\/" \/>/g,
                to: '<base href="" \/>'
            }]
        },

        // clear all shim files of content, but leave empty files. This is done for
        // device builds only
        removeShims: {
            src: [ targetFolder + '/app/shims/*.js'],
            dest: targetFolder + '/app/shims/',
            replacements: [{
                from: /.*/g,                   
                to: ''
            }]
        },

        // set requirejs root in settings file for android file system
        android_requireRoot: {
            src: [ targetFolder + '/app/haku.js'],
            dest: targetFolder + '/app/',
            replacements: [{
                from: /haku.settings.systemPathRoot="\/"/g,
                to: 'haku.settings.systemPathRoot="file:///android_asset/www/"'
            }]
        },

        // set requirejs root in settings file for ios file system
        ios_requireRoot: {
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
        }

      },

      hub: {
        precompileRun : {
          src: [precompileGrunt],
          tasks: [precompileGruntTask]
        }
      }

  });



  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-hub');
  grunt.loadNpmTasks('grunt-contrib-compass');



  // set up tasks
  var androidTasks = ['copy:android', 'uglify:default', 'compass', 'cssmin:default', 'clean:mobile', 'replace:android_requireRoot', 'replace:removeShims', 'replace:reset_base:'];
  if (precompileGruntTask) androidTasks.unshift('hub:precompileRun');

  var iosTasks = ['copy:ios', 'uglify:default', 'compass', 'cssmin:default', 'clean:mobile', 'replace:ios_requireRoot', 'replace:removeShims', 'replace:reset_base:'];
  if (precompileGruntTask) iosTasks.unshift('hub:precompileRun');

  var webTasks = ['copy:web', 'uglify:default', 'compass', 'cssmin:default', 'clean:web'];
  if (precompileGruntTask) webTasks.unshift('hub:precompileRun');

  // set up debug tasks
  var androidDebug = androidTasks.slice(); // copy array
  removeItem(androidDebug, "uglify:default");
  removeItem(androidDebug, "cssmin:default");

  var iosDebug = iosTasks.slice();
  removeItem(iosDebug, "uglify:default");
  removeItem(iosDebug, "cssmin:default");
  
  function removeItem(arr, item){
    var index = arr.indexOf(item);
  if (index !== -1)
    arr.splice(index, 1);
  }

  grunt.registerTask('init', ['bower', 'copy:init']);
  grunt.registerTask('dev', ['bower', 'copy:initDev']);
  grunt.registerTask('android', androidTasks);
  grunt.registerTask('android-debug', androidDebug);
  grunt.registerTask('ios', iosTasks);
  grunt.registerTask('ios-debug', iosDebug);
  grunt.registerTask('web', webTasks);

};