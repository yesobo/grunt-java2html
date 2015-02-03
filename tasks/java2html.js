/*
 * java2html
 * 
 *
 * Copyright (c) 2015 yesobo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var node_java2html = require('./node-java2html.js');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('java2html', 'Converts Java source code files to html files with syntax hightlighting', function () {

    /*
    var options = this.options({
    });
    */

    var fileCounter = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      file.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          if (grunt.file.isDir(filepath)) {
            return false;
          } else {
            return true;
          }
        }
      }).map(function (filepath) {
        // Read file source.
        grunt.log.writeln('reading file: ' + filepath);
        
        var fileContent = grunt.file.read(filepath);
        var newFilepath = filepath.replace('.java', '.html');

        var htmlResult = node_java2html.convert(fileContent);

        var writingPath = file.dest + '/' + newFilepath;

        grunt.log.writeln('writing to: ' + writingPath);

        grunt.file.write(writingPath, htmlResult);

        fileCounter ++;
      });

      // Print a success message.
      grunt.log.writeln(fileCounter + ' files processed.');
    });
  });
};