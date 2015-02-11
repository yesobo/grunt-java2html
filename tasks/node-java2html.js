var exports = module.exports = {};

var java2html = java2html || {};

var htmlencode = require('htmlencode');

java2html.convert = (function() {
    'use strict';

    var debugVariable = false;

    var currentIndex = (function() {
        var index = 0;
        var getIndex = function() {
            return index;
        };
        var setIndex = function(newIndex) {
            index = newIndex;
        };
        var nextIndex = function() {
            index++;
        };

        return {
            getIndex: getIndex,
            setIndex: setIndex,
            nextIndex: nextIndex
        };
    })();

    var keyWords = new Array( "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native", "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile", "while", "true", "false", "null" );
    var spanEndtag = "</span>";
    var finalText = "";
    var preEndTag = "</pre>";

    var append = true;

    var default_colors = {
        keyWord: '#7B0052',
        flowerBrace: '#D3171B',
        string: '#2A00FF',
        javadoc: '#3F5FBF',
        comment: '#3F7F5F',
        main: '#008DEF'
    };

    function getTag(type, color) {
        var colorParam = color || false;
        var result = "";
        var resultColor = "";
        switch (type) {
            case 'keyWord':
                resultColor = colorParam || default_colors.keyWord;
                result = "<span style='font-weight:bold;color:" + resultColor + ";'>";
                break;
            case 'flowerBrace':
                resultColor = colorParam || default_colors.flowerBrace;
                result = "<span style='font-weight:bold;color:" + resultColor + "'>";
                break;
            case 'string':
                resultColor = colorParam || default_colors.string;
                result = "<span style='color:" + resultColor + "'>";
                break;
            case 'javadoc':
                resultColor = colorParam || default_colors.javadoc;
                result = "<span style='color:" + resultColor + "'>";
                break;
            case 'comment':
                resultColor = colorParam || default_colors.comment;
                result = "<span style='color:" + resultColor + "'>";
                break;
            case 'preStart':
                resultColor = colorParam || default_colors.main;
                result = "<pre style='text-align: left; border: 1px dashed " + resultColor + "; line-height: 18px; padding: 15px; font-size: 13px; font-family:'Courier New', Courier, monospace; overflow: auto;'>";
                break;
            default:
                result = "<span>";
                break;
        } //end of switch
        return result;
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    
    function startsWith(subString, sourceString){
        if(sourceString.substr(0, subString.length) === subString){
          return true;
        }
        return false;
    }

    function processFlowerBraces(flowerBrace, finalText, color, cb) {
        var formattedBrace = getTag('flowerBrace', color) + flowerBrace + spanEndtag;
        var newFinalText = finalText + formattedBrace;
        append = false;
        return cb(newFinalText);
    }

    function htmlEscapeTo(char, string) {
        return htmlEscape(char, function(result) {
            return string + result;
        });
    }

    function processDoubleQuotes(sourceText, color, cb) {

        var testCounter = 0;
        var nextChar = "";
        var stringLiteral = '"';
        while (nextChar !== '"') {
            currentIndex.nextIndex();
            nextChar = sourceText.charAt(currentIndex.getIndex());
            if (nextChar === '\\') {
                switch (sourceText.charAt(currentIndex.getIndex() + 1)) {
                    case '"':
                        stringLiteral = stringLiteral + "\\\"";
                        currentIndex.nextIndex();
                        break;
                    case '\\':
                        stringLiteral = stringLiteral + "\\\\";
                        currentIndex.nextIndex();
                        break;
                    default:
                        stringLiteral = stringLiteral + nextChar;
                        break;

                } //end of switch
            } else if (nextChar === '<' || nextChar === '>') {
                stringLiteral = htmlEscapeTo(nextChar, stringLiteral);
            } else {
                stringLiteral = stringLiteral + nextChar;
            }


            testCounter += 1;

        } //end of while
        var paintedString = getTag('string', color) + htmlencode.htmlEncode(stringLiteral) + spanEndtag;
        return cb(paintedString);
    }

    function processSingleQuotes(sourceText, color, cb) {
        var nextChar = "";
        var stringLiteral = "'";
        while (nextChar !== "'") {
            currentIndex.nextIndex();
            nextChar = sourceText.charAt(currentIndex.getIndex());
            if (nextChar === '\\') {
                switch (sourceText.charAt(currentIndex.getIndex() + 1)) {
                    case "'":
                        stringLiteral = stringLiteral + "\\\'";
                        currentIndex.nextIndex();
                        break;
                    case "\\":
                        stringLiteral = stringLiteral + "\\\\";
                        currentIndex.nextIndex();
                        break;
                    default:
                        stringLiteral = stringLiteral + nextChar;
                        break;

                } //end of switch
            } else if (nextChar === '<' || nextChar === '>') {
                stringLiteral = htmlEscapeTo(nextChar, stringLiteral);
            } else {
                stringLiteral = stringLiteral + nextChar;
            }
        } //end of while
        var paintedString = getTag('string', color) + htmlencode.htmlEncode(stringLiteral) + spanEndtag;
        return cb(paintedString);
    }

    function processMultilineComment(sourceText, color, javadocColor, cb) {
        var nextChar = "";
        var multiLineComment = "/*";
        currentIndex.nextIndex();
        while (true) {
            currentIndex.nextIndex();
            nextChar = sourceText.charAt(currentIndex.getIndex());
            if (nextChar === '*' && sourceText.charAt(currentIndex.getIndex() + 1) === '/') {
                break;
            }
            if (nextChar === '<' || nextChar === '>') {
                multiLineComment = htmlEscapeTo(nextChar, multiLineComment);
            } else {
                multiLineComment = multiLineComment + nextChar;
            }
        }

        multiLineComment += "*/";
        var paintedMLComment = "";
        if (startsWith("/** ", multiLineComment) || startsWith("/**\t", multiLineComment) || startsWith("/**\n", multiLineComment)) {
            paintedMLComment = getTag('javadoc', javadocColor) + htmlencode.htmlEncode(multiLineComment) + spanEndtag;
        } else {
            paintedMLComment = getTag('comment', color) + htmlencode.htmlEncode(multiLineComment) + spanEndtag;
        }
        currentIndex.nextIndex();
        return cb(paintedMLComment);
    }

    function processSingleLineComment(sourceText, color, cb) {
        var nextChar = "";
        var singleLineComment = "//";
        currentIndex.nextIndex();
        while (true) {
            currentIndex.nextIndex();
            nextChar = sourceText.charAt(currentIndex.getIndex());
            if (nextChar === '\n') {
                break;
            }
            if (nextChar === '<' || nextChar === '>') {
                singleLineComment = htmlEscapeTo(nextChar, singleLineComment);
            } else {
                singleLineComment = singleLineComment + nextChar;
            }
        }

        singleLineComment += "\n";
        var paintedComment = getTag('comment', color) + htmlencode.htmlEncode(singleLineComment) + spanEndtag;
        return cb(paintedComment);
    }

    function htmlEscape(currentChar, cb) {
        if (currentChar === '<') {
            return cb("&lt;");
        }
        else if (currentChar === '>') {
            return cb("&gt;");
        }
    }

    function processKeyWord(token, finalText, color, cb) {
        var newFinalText = finalText;
        if (token === undefined) {
            cb();
        }
        //check if it is present in the keyWord list
        if (keyWords.indexOf(token) !== -1) {
            var enclosedText = getTag('keyWord', color) + token + spanEndtag;
            newFinalText = finalText.substring(0, finalText.length - token.length);
            newFinalText = newFinalText + enclosedText;
        }
        return cb(newFinalText);
    }

    function processKeyWordTo(readToken, finalText, color) {
        return processKeyWord(readToken, finalText, color, function(newFinalText) {
            finalText = newFinalText;
            return finalText;
        });
    }

    function processFlowerBracesTo(currentChar, finalText, color) {
        return processFlowerBraces(currentChar, finalText, color, function(newFinalText) {
            return newFinalText;
        });
    }

    function processDoubleQuotesTo(sourceText, finalText, color) {
        return processDoubleQuotes(sourceText, color, function(quotedString) {
            return finalText + quotedString;
        });
    }

    function processSingleQuoteTo(sourceText, finalText, color) {
        return processSingleQuotes(sourceText, color, function(quotedString) {
            return finalText + quotedString;
        });
    }

    function processMultilineCommentTo(sourceText, finalText, color, javadocColor) {
        return processMultilineComment(sourceText, color, javadocColor, function(comment) {
            return comment;
        });
    }

    function processSingleLineCommentTo(sourceText, finalText, color) {
         return processSingleLineComment(sourceText, color, function(paintedComment) {
            return finalText + paintedComment;
        });
    }

    function main(java_source, options) {

        var finalText = "";
        var result = "";
        var sourceText = java_source;
        sourceText = trim(sourceText);
        var readToken = "";

        var resultOptions = options || {};

        currentIndex.setIndex(0);
        while (currentIndex.getIndex() < sourceText.length && !debugVariable) {
            var currentChar = sourceText.charAt(currentIndex.getIndex());
            append = true;
            if (currentChar === ';' || currentChar === '\t' || currentChar === ' ' || currentChar === '\n' || currentChar === '(' || currentChar === ')') {
                finalText = processKeyWordTo(readToken, finalText, options.keyWordColor);
                readToken = "";
                append = false;
                currentIndex.nextIndex();
                finalText = finalText + currentChar;
            } else if (currentChar === "+" || currentChar === '-' || currentChar === '*' || currentChar === '=') {
                finalText = finalText + currentChar;
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === '}' || currentChar === '{') {
                finalText = processFlowerBracesTo(currentChar, processKeyWordTo(readToken, finalText, options.keyWordColor), options.flowerBracesColor);
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === '"') {
                finalText = processDoubleQuotesTo(sourceText, finalText, options.doubleQuotesColor);
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === "'") {
                finalText = processSingleQuoteTo(sourceText, finalText, options.singleQuotesColor);
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === '/' && sourceText.charAt(currentIndex.getIndex() + 1) === '*') {
                finalText = processMultilineCommentTo(sourceText, finalText, options.multiLineCommentColor, options.javadocColor);
                currentIndex.nextIndex();
                readToken = "";
                append = false;
            } else if (currentChar === '/' && sourceText.charAt(currentIndex.getIndex() + 1) === '/') {
                finalText = processSingleLineCommentTo(sourceText, finalText, options.singeLineCommentColor);
                currentIndex.nextIndex();
                readToken = "";
                append = false;
            } else if (currentChar === '<' || currentChar === '>') {
                readToken = "";
                append = false;
                currentChar = htmlEscapeTo(currentChar, "");
                finalText = finalText + currentChar;
                currentIndex.nextIndex();
            } else {
                readToken = readToken + currentChar;
            }
            if (append) {
                finalText = finalText + currentChar;
                currentIndex.nextIndex();
            }
        }
        result = getTag('preStart', options.mainBorderColor) + finalText + preEndTag;
        return result;
    }
    return main;
})();

exports.convert = java2html.convert;