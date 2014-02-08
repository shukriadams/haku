module.exports = function(grunt) {

    'use strict';

    var targetFolder = "compile_web";
    var sourceFolder = "src";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    {expand: true, cwd : sourceFolder, src: ['**'], dest: targetFolder + '/'}
                ]
            }
        },

        uglify: {
            my_target: {
                files: [
                    {cwd: targetFolder + '/3rdparty', src: '**/*.js', dest:  targetFolder + '/3rdparty', expand: true},
                    {cwd: targetFolder + '/app', src: '**/*.js', dest: targetFolder + '/app', expand: true},
                    {cwd: targetFolder + '/views', src: '**/*.js', dest: targetFolder + '/views', expand: true}
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
            targetFolder + "/css-sass",
            targetFolder + "/tests",
            targetFolder + "/config.rb",
            targetFolder + "/start compass.bat",
            targetFolder + "/app/settings-*.js"
        ]

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'clean']);

};