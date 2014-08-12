/*
 * class
 * https://github.com/pandorajs/class
 *
 * Copyright (c) 2014 pandorajs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['src/*.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          baseUrl: './',
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report/',
          linesThresholdPct: 60
        }
      },
      all: ['test/*.html']
    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'report/*.info'
      }
    },

    clean: {
      dist: {
        files: {
          src: ['dist/*.*']
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js'],
          dest: 'sea-modules/pandora/'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean', 'uglify']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['test', 'build', 'copy']);

};
