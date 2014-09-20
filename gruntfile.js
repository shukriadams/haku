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
          android: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: androidTargetFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-android.js'], dest : androidTargetFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          ios: {
              files: [
                  { expand: true, cwd : precompileDirectory, src: ['**'], dest: iosTargetFolder + '/' },
                  { src: [ precompileDirectory + '/app/settings-ios.js'], dest : iosTargetFolder + '/app/settings.js', filter: 'isFile' }
              ]
          },
          web: {
              files: [
                  {expand: true, cwd : precompileDirectory, src: ['**'], dest: webTargetFolder + '/'}
              ]
          }                             
      },


      clean:{
        android : [
          androidTargetFolder + "/shims/disposable",
          androidTargetFolder + "/css-sass",
          androidTargetFolder + "/test",
          androidTargetFolder + "/config.rb",
          androidTargetFolder + "/start compass.bat",
          androidTargetFolder + "/app/settings-*.js"
        ],
        ios : [
          iosTargetFolder + "/shims/disposable",
          iosTargetFolder + "/css-sass",
          iosTargetFolder + "/test",
          iosTargetFolder + "/config.rb",
          iosTargetFolder + "/start compass.bat",
          iosTargetFolder + "/app/settings-*.js"        
        ],
        web : [
          webTargetFolder + "/css-sass",
          webTargetFolder + "/test",
          webTargetFolder + "/config.rb",
          webTargetFolder + "/start compass.bat",
          webTargetFolder + "/app/settings-*.js"        
        ]
      },


      uglify: {
        android: {
          files: [
            { cwd: androidTargetFolder + '/lib', src: '**/*.js', dest:  androidTargetFolder + '/lib', expand: true },
            { cwd: androidTargetFolder + '/app', src: '**/*.js', dest: androidTargetFolder + '/app', expand: true },
            { cwd: androidTargetFolder + '/views', src: '**/*.js', dest: androidTargetFolder + '/views', expand: true },
            { cwd: androidTargetFolder + '/ext', src: '**/*.js', dest: androidTargetFolder + '/ext', expand: true }
          ]
        },
        ios: {
          files: [
            { cwd: iosTargetFolder + '/lib', src: '**/*.js', dest:  iosTargetFolder + '/lib', expand: true },
            { cwd: iosTargetFolder + '/app', src: '**/*.js', dest: iosTargetFolder + '/app', expand: true },
            { cwd: iosTargetFolder + '/views', src: '**/*.js', dest: iosTargetFolder + '/views', expand: true },
            { cwd: iosTargetFolder + '/ext', src: '**/*.js', dest: iosTargetFolder + '/ext', expand: true }
          ]
        },
        web: {
            files: [
                { cwd: webTargetFolder + '/lib', src: '**/*.js', dest:  webTargetFolder + '/lib', expand: true },
                { cwd: webTargetFolder + '/app', src: '**/*.js', dest: webTargetFolder + '/app', expand: true },
                { cwd: webTargetFolder + '/views', src: '**/*.js', dest: webTargetFolder + '/views', expand: true },
                { cwd: webTargetFolder + '/ext', src: '**/*.js', dest: webTargetFolder + '/ext', expand: true }
            ]
        }                
      },


      compass: {
        default: {
          options: {
            sassDir: precompileDirectory + '/css-sass',
            cssDir : precompileDirectory + '/css',
            // workaround for compass bug that was not getting "importPath" direct setter
            raw: 'add_import_path "' + precompileDirectory + '/../bower_components/foundation/scss'+ '"'
          }
        }
      },


      cssmin: {
        android: {
          expand: true,
          cwd: precompileDirectory + '/css',
          src: ['*.css', '!*.min.css'],
          dest: androidTargetFolder + '/css/',
          ext: '.css'
        },
        ios: {
          expand: true,
          cwd: precompileDirectory + '/css',
          src: ['*.css', '!*.min.css'],
          dest: iosTargetFolder + '/css/',
          ext: '.css'
        },
        web: {
            expand: true,
            cwd: precompileDirectory + '/css',
            src: ['*.css', '!*.min.css'],
            dest: webTargetFolder + '/css/',
            ext: '.css'
        }                
      },


      replace: {
        android_requireRoot: {
            src: [ androidTargetFolder + '/app/haku.js'],
            dest: androidTargetFolder + '/app/',
            replacements: [{
                from: /haku.settings.systemPathRoot="\/"/g,
                to: 'haku.settings.systemPathRoot="file:///android_asset/www/"'
            }]
        },

        android_removeShims: {
            // clear all shim files of content, but leave empty files 
            src: [ androidTargetFolder + '/app/shims/*.js'],
            dest: androidTargetFolder + '/app/shims/',
            replacements: [{
                from: /.*/g,                   
                to: ''
            }]
        },

        ios_requireRoot: {
            src: [ iosTargetFolder + '/app/haku.js'],
            dest: iosTargetFolder + '/app/',
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
            src: [ iosTargetFolder + '/app/shims/*.js'],
            dest: iosTargetFolder + '/app/shims/',
            replacements: [{
                from: /.*/g,                   
                to: ''
            }]
        }        

      },

      hub: {
        precompileRun : {
          src: [precompileGrunt],
          tasks: [precompileGruntTask]
        }
      },      

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
  var androidTasks = ['copy:android', 'uglify:android', 'compass', 'cssmin:android', 'clean:android', 'replace:android_requireRoot', 'replace:android_removeShims'];
  if (precompileGruntTask) androidTasks.unshift('hub:precompileRun');

  var iosTasks = ['copy:ios', 'uglify:ios', 'compass', 'cssmin:ios', 'clean:ios', 'replace:ios_requireRoot', 'replace:ios_removeShims'];
  if (precompileGruntTask) iosTasks.unshift('hub:precompileRun');

  var webTasks = ['copy:web', 'uglify:web', 'compass', 'cssmin:web', 'clean:web'];
  if (precompileGruntTask) webTasks.unshift('hub:precompileRun');

  // set up debug tasks
  var androidDebug = androidTasks.slice(); // copy array
  removeItem(androidDebug, "uglify:android");
  removeItem(androidDebug, "cssmin:android");

  var iosDebug = iosTasks.slice();
  removeItem(iosDebug, "uglify:ios");
  removeItem(iosDebug, "clean:ios");
  
  function removeItem(arr, item){
    var index = arr.indexOf(item);
  if (index !== -1)
    arr.splice(index, 1);
  }

  grunt.registerTask('init', ['bower', 'copy:init']);
  grunt.registerTask('android-debug', androidDebug);
  grunt.registerTask('android', androidTasks);
  grunt.registerTask('ios', iosTasks);
  grunt.registerTask('ios-debug', removeItem);
  grunt.registerTask('web', webTasks);

};