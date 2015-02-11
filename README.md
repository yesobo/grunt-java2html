# grunt-java2html

> Grunt plugin that converts Java source code files to html files with syntax hightlighting

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-java2html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-java2html');
```

## The "ava2html task

_Run this task with the `grunt java2html` command._

### Overview
In your project's Gruntfile, add a section named `java2html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  java2html: {
    'location/to/html/files': ['file/to/java.java', 'another/java.java'],
  },
})
```

### Usage Examples

#### Default Options
In this example all the .java files in src and other folders will be converted in .html files with the same name in the dest/src and dest/other folders respectively.

```js
grunt.initConfig({
  java2html: {
  	target: {
	    files: {
	      'dest': ['src/**/*.java', 'other/*.java'],
	    }
	}
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 yesobo. Licensed under the MIT license.