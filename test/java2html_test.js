'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.java2html = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  default_options: function (test) {
    test.expect(4);

    var actual = grunt.file.read('tmp/default_options/test/fixtures/java_source_level11.html');
    var expected = grunt.file.read('test/expected/default_options/java_source_level11.html');
    test.equal(actual, expected, 'java_source_level11 is properly parsed.');

    actual = grunt.file.read('tmp/default_options/test/fixtures/java_source_level12.html');
    expected = grunt.file.read('test/expected/default_options/java_source_level12.html');
    test.equal(actual, expected, 'java_source_level12 is properly parsed');

    actual = grunt.file.read('tmp/default_options/test/fixtures/fixtures_2/java_source_level21.html');
    expected = grunt.file.read('test/expected/default_options/java_source_level21.html');
    test.equal(actual, expected, 'java_source_level21 is properly parsed');

    actual = grunt.file.read('tmp/default_options/test/fixtures/fixtures_2/java_source_level22.html');
    expected = grunt.file.read('test/expected/default_options/java_source_level22.html');
    test.equal(actual, expected, 'java_source_level22 is properly parsed');

    test.done();
  },
  custom_options: function (test) {
    test.expect(4);

    var actual = grunt.file.read('tmp/custom_options/test/fixtures/java_source_level11.html');
    var expected = grunt.file.read('test/expected/custom_options/java_source_level11.html');
    test.equal(actual, expected, 'java_source_level11 is properly parsed.');

    actual = grunt.file.read('tmp/custom_options/test/fixtures/java_source_level12.html');
    expected = grunt.file.read('test/expected/custom_options/java_source_level12.html');
    test.equal(actual, expected, 'java_source_level12 is properly parsed');

    actual = grunt.file.read('tmp/custom_options/test/fixtures/fixtures_2/java_source_level21.html');
    expected = grunt.file.read('test/expected/custom_options/java_source_level21.html');
    test.equal(actual, expected, 'java_source_level21 is properly parsed');

    actual = grunt.file.read('tmp/custom_options/test/fixtures/fixtures_2/java_source_level22.html');
    expected = grunt.file.read('test/expected/custom_options/java_source_level22.html');
    test.equal(actual, expected, 'java_source_level22 is properly parsed');

    test.done();
  }
};
