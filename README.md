# grunt-java2html

> Converts Java source code files to html files with syntax hightlighting

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

## Java2html task

_Run this task with the `grunt java2html` command._

Task targets, files and options may be specified according to the Grunt [Configuring taks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### color

`Object` that defines the color of the highlighted elements on the html code:

The highlighted elements are defined by the following keys:
- keyWordFont
- flowerBracesFont
- doubleQuotesFont
- singleQuotesFont
- multiLineCommentFont
- singeLineCommentFont
- javadocFont
- mainBorder

Default values:

```js
color: {
  keyWordFont: '#7B0052',
  flowerBracesFont: '#D3171B',
  doubleQuotesFont: '#2A00FF',
  singleQuotesFont: '#2A00FF',
  multiLineCommentFont: '#3F7F5F',
  singeLineCommentFont: '#3F7F5F',
  javadocFont: '#3F5FBF',
  mainBorder: '#008DEF'
}

#### keepPath
Type: `Boolean` Default: `false`

Maintains the folder structure of the java files, considering the location of the Gruntfile.js as the root folder.

### Usage Examples

#### Converts .java files on ´test/fixtures/` folder to html files with the same name located at `dest/` with custom hightlight colors.

```js
 java2html: {
    'tmp': ['test/fixtures/*.java']
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
      }
    }
  }
```

#### Converts .java files on ´test/fixtures/` folder and subfolders to html files with the same name located at `dest/test/fixtures/...` maintaining its directory tree.

```js
 java2html: {
    'tmp': ['test/fixtures/**/*.java']
    options: {
      keepPath: true;
    }
  }
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 yesobo. Licensed under the MIT license.