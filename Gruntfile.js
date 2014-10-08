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

    exec: {
      spm: {
        cwd: './',
        command: 'spm install'
      }
    },

    jshint: {
      files: ['src/pandora.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          baseUrl: './',
          src: ['src/pandora.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report/',
          linesThresholdPct: 60
        }
      },
      all: ['test/pandora.html']
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
      sea: {
        files: {
          src: ['sea-modules/**/*', '!sea-modules/.svn']
        }
      },
      dist: {
        files: {
          src: ['dist/pandora.js']
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['pandora.js'],
          dest: 'sea-modules/'
        }, {
          // expand: true,
          // cwd: 'dist/',
          src: 'dist/pandora.js',
          dest: 'sea-modules/pandora/bootstrap.js'
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
          src: ['pandora.js'],
          dest: 'dist/'
        }]
      }
    },

    replace: {
      example: {
        src: ['dist/*.js'],
        dest: 'dist/',
        replacements: [{
          from: '@TIMESTAMP',
          to: '<%= grunt.template.today("yyyymmddHHMMss") %>'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean:dist', 'uglify', 'replace', 'copy']);

  grunt.registerTask('sync', ['clean:sea', 'exec:spm']);

  // qunit, ok in browser, failed in grunt
  grunt.registerTask('test', ['jshint'/*, 'qunit'*/]);

  grunt.registerTask('default', ['test', 'sync', 'build']);

};
