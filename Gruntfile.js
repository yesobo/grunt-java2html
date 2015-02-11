/*
 * java2html
 * 
 *
 * Copyright (c) 2015 yesobo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    java2html: {
      default_options: {
        files:      {
          'tmp/default_options': ['test/fixtures/*.java', 'test/fixtures/fixtures_2/**/*']
        }
      },
      custom_options: {
        options: {
          color: {
            keyWordFont: '#003399',
            flowerBracesFont: '#993300',
            doubleQuotesFont: '#FFFF00',
            singleQuotesFont: '#009900',
            multiLineCommentFont: '#00FF00',
            singeLineCommentFont: '#000000',
            javadocFont: '#968989',
            mainBorder: '#CC66FF'
          },
          keepPath: true
        },
        files: {
          'tmp/custom_options': ['test/fixtures/**/*.java']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'java2html', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
