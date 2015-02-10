var exports = module.exports = {};

var java2html = java2html || {};

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

    var resultBuffer = (function() {
        var buffer = "";
        var add = function(string) {
            buffer = buffer + string;
        };
        var get = function() {
            return buffer;
        };
    })();

    var keyWords = new Array( "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native", "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile", "while", "true", "false", "null" );
    var keyWordStartTag = "<span style='font-weight:bold;color:#7B0052;'>";
    var spanEndtag = "</span>";
    var finalText = "";
    var flowerBraceStartTag = "<span style='font-weight:bold;color:#D3171B'>";
    var stringStartTag = "<span style='color:#2A00FF'>";
    var javaDocStartTag = "<span style='color:#3F5FBF'>";
    var commentStartTag = "<span style='color:#3F7F5F'>";
    var preStartTag = "<pre style='text-align: left; border: 1px dashed #008DEF; line-height: 18px; padding: 15px; font-size: 13px; font-family:'Courier New', Courier, monospace; overflow: auto;'>";
    var preEndTag = "</pre>";

    var append = true;

    function trim(str) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    
    function startsWith(subString, sourceString){
        if(sourceString.substr(0, subString.length) === subString){
          return true;
        }
        return false;
    }

    function processFlowerBraces(flowerBrace, finalText, cb) {
        var formattedBrace = flowerBraceStartTag + flowerBrace + spanEndtag;
        var newFinalText = finalText + formattedBrace;
        append = false;
        return cb(newFinalText);
    }

    function htmlEscapeTo(char, string) {
        return htmlEscape(char, function(result) {
            return string + result;
        });
    }

    function processDoubleQuotes(sourceText, cb) {

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
        var paintedString = stringStartTag + stringLiteral + spanEndtag;
        return cb(paintedString);
    }

    function processSingleQuotes(sourceText, cb) {
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
        var paintedString = stringStartTag + stringLiteral + spanEndtag;
        return cb(paintedString);
    }

    function processMultilineComment(sourceText, cb) {
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
            paintedMLComment = javaDocStartTag + multiLineComment + spanEndtag;
        } else {
            paintedMLComment = commentStartTag + multiLineComment + spanEndtag;
        }
        currentIndex.nextIndex();
        return cb(paintedMLComment);
    }

    function processSingleLineComment(sourceText, cb) {
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
        var paintedComment = commentStartTag + singleLineComment + spanEndtag;
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

    function processKeyWord(token, finalText, cb) {
        var newFinalText = finalText;
        if (token === undefined) {
            cb();
        }
        //check if it is present in the keyWord list
        if (keyWords.indexOf(token) !== -1) {
            var enclosedText = keyWordStartTag + token + spanEndtag;
            newFinalText = finalText.substring(0, finalText.length - token.length);
            newFinalText = newFinalText + enclosedText;
        }
        return cb(newFinalText);
    }

    function processKeyWordTo(readToken, finalText) {
        return processKeyWord(readToken, finalText, function(newFinalText) {
            finalText = newFinalText;
            return finalText;
        });
    }

    function processFlowerBracesTo(currentChar, finalText) {
        return processFlowerBraces(currentChar, finalText, function(newFinalText) {
            return newFinalText;
        });
    }

    function processDoubleQuotesTo(sourceText, finalText) {
        return processDoubleQuotes(sourceText, function(quotedString) {
            return finalText + quotedString;
        });
    }

    function processSingleQuoteTo(sourceText, finalText) {
        return processSingleQuotes(sourceText, function(quotedString) {
            return quotedString;
        });
    }

    function processMultilineCommentTo(sourceText, finalText) {
        return processMultilineComment(sourceText, function(comment) {
            return comment;
        });
    }

    function processSingleLineCommentTo(sourceText, finalText) {
         return processSingleLineComment(sourceText, function(paintedComment) {
            return finalText + paintedComment;
        });
    }

    function main(java_source) {
        var finalText = "";
        var result = "";
        var sourceText = java_source;
        sourceText = trim(sourceText);
        var readToken = "";
        currentIndex.setIndex(0);
        while (currentIndex.getIndex() < sourceText.length && !debugVariable) {
            var currentChar = sourceText.charAt(currentIndex.getIndex());
            append = true;
            if (currentChar === ';' || currentChar === '\t' || currentChar === ' ' || currentChar === '\n' || currentChar === '(' || currentChar === ')') {
                finalText = processKeyWordTo(readToken, finalText);
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
                finalText = processFlowerBracesTo(currentChar, processKeyWordTo(readToken, finalText));
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === '"') {
                finalText = processDoubleQuotesTo(sourceText, finalText);
                readToken = "";
                append = false;
                currentIndex.nextIndex();
            } else if (currentChar === "'") {
                finalText = processSingleQuoteTo(sourceText, finalText);
                readToken = "";
                append = false;
            } else if (currentChar === '/' && sourceText.charAt(currentIndex.getIndex() + 1) === '*') {
                finalText = processMultilineCommentTo(sourceText, finalText);
                currentIndex.nextIndex();
                readToken = "";
                append = false;
            } else if (currentChar === '/' && sourceText.charAt(currentIndex.getIndex() + 1) === '/') {
                finalText = processSingleLineCommentTo(sourceText, finalText);
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
        result = preStartTag + finalText + preEndTag;
        return result;
    }
    return main;
})();

exports.convert = java2html.convert;