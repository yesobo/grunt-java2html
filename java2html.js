var exports = module.exports = {};

var java2html = java2html || {};

java2html.convert = (function() {
    'use strict';

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
        if(sourceString.substr(0, subString.length) == subString){
          return true;
        }
        return false;
    }

    function processKeyWord(token, finalText, cb) {
        var newFinalText = finalText;
        if (token === undefined) {
            cb();
        };
        //check if it is present in the keyWord list
        if (keyWords.indexOf(token) != -1) {
            var enclosedText = keyWordStartTag + token + spanEndtag;
            newFinalText = finalText.substring(0, finalText.length - token.length);
            newFinalText = newFinalText + enclosedText;
        }
        cb(newFinalText);
    }

    function processFlowerBraces(flowerBrace, finalText, cb) {
        var formattedBrace = flowerBraceStartTag + flowerBrace + spanEndtag;
        var newFinalText = finalText + formattedBrace;
        append = false;
        cb(newFinalText);
    }

    function processDoubleQuotes(index, sourceText, cb) {
        var nextChar = "";
        var stringLiteral = '"';
        //alert("Found \" at index "+index);
        //read everything till the next "
        //be CAREFUL about the escape sequence
        while (nextChar != '"') {
            index++;
            nextChar = sourceText.charAt(index);
            //alert("Next Char = "+nextChar+" at "+index);
            if (nextChar == '\\') {
                switch (sourceText.charAt(index + 1)) {
                    case '"':
                        stringLiteral = stringLiteral + "\\\"";
                        index++;
                        break;
                    case '\\':
                        stringLiteral = stringLiteral + "\\\\";
                        index++;
                        break;
                    default:
                        stringLiteral = stringLiteral + nextChar;
                        break;

                } //end of switch
                //escape sequenced \\ or \" found , dont end parse here
            } else if (nextChar == '<' || nextChar == '>') {
                htmlEscape(nextChar, function(result) {
                    stringLiteral = stringLiteral + result;
                })
            } else {
                stringLiteral = stringLiteral + nextChar;
            }
        } //end of while
        //paint it blue
        var paintedString = stringStartTag + stringLiteral + spanEndtag;
        cb(index, paintedString);
    }

    function processSingleQuotes(index, sourceText, cb) {
        var nextChar = "";
        var stringLiteral = "'";
        //alert("Found \" at index "+index);
        //read everything till the next
        //be CAREFUL about the escape sequence
        while (nextChar != "'") {
            index++;
            nextChar = sourceText.charAt(index);
            //alert("Next Char = "+nextChar+" at "+index);
            if (nextChar == '\\') {
                switch (sourceText.charAt(index + 1)) {
                    case "'":
                        stringLiteral = stringLiteral + "\\\'";
                        index++;
                        break;
                    case "\\":
                        stringLiteral = stringLiteral + "\\\\";
                        index++;
                        break;
                    default:
                        stringLiteral = stringLiteral + nextChar;
                        break;

                } //end of switch
                //escape sequenced \\ or \' found , dont end parse here
            } else if (nextChar == '<' || nextChar == '>') {
                htmlEscape(nextChar, function(result) {
                    stringLiteral = stringLiteral + result;    
                });
            } else {
                stringLiteral = stringLiteral + nextChar;
            }
        } //end of while

        //paint it blue
        var paintedString = stringStartTag + stringLiteral + spanEndtag;
        cb(index, paintedString);
    }

    function processMultilineComment(index, sourceText, cb) {
        var nextChar = "";
        var multiLineComment = "/*";
        /*The current index points at /, we will increment it by 1
        because stringLiteral has already been filled with 2 chars
        Why increment by 1?
        Because we start the loop below by incrementing the index
        */
        index++;

        //read everything until */ is found
        while (true) {
            index++;
            nextChar = sourceText.charAt(index);
            if (nextChar == '*' && sourceText.charAt(index + 1) == '/')
                break;
            if (nextChar == '<' || nextChar == '>') {
                htmlEscape(nextChar, function(result) {
                    multiLineComment = multiLineComment + result;
                });
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
        index++; //point it to the / char which ends the comment
        cb(index, paintedMLComment);
    }

    function processSingleLineComment(index, sourceText, cb) {
        var nextChar = "";
        var singleLineComment = "//";
        /*The current index points at /, we will increment it by 1
        because stringLiteral has already been filled with 2 chars
        Why increment by 1?
        Because we start the loop below by incrementing the index
        */
        index++;

        //read everything until newline --&gt; \n is found
        while (true) {
            index++;
            nextChar = sourceText.charAt(index);
            if (nextChar == '\n')
                break;
            if (nextChar == '<' || nextChar == '>') {
                htmlEscape(nextChar, function() {
                    singleLineComment = singleLineComment + result;
                });
            } else {
                singleLineComment = singleLineComment + nextChar;
            }
        }

        singleLineComment += "\n";
        var paintedComment = commentStartTag + singleLineComment + spanEndtag;
        cb(index, paintedComment);
    }

    function htmlEscape(currentChar, cb) {
        if (currentChar == '<')
            cb("&lt;")
        else if (currentChar == '>')
            cb("&gt;");
    }

    function main(java_source) {
        var finalText = "";
        var result = "";
        var sourceText = java_source;
        sourceText = trim(sourceText);
        var readToken = "";
        var index = 0;
        for (index = 0; index < sourceText.length; index++) {
            var currentChar = sourceText.charAt(index);
            //alert("Current Char = "+currentChar);
            append = true;
            if (currentChar == ';' || currentChar == '\t' || currentChar == ' ' || currentChar == '\n' || currentChar == '(' || currentChar == ')') {
                processKeyWord(readToken, finalText, function(newFinalText) {
                    finalText = newFinalText;
                    finalText = finalText + currentChar;
                    readToken = "";
                    append = false;
                });
            } else if (currentChar == "+" || currentChar == '-' || currentChar == '*' || currentChar == '=') {
                finalText = finalText + currentChar;
                readToken = "";
                append = false;
            } else if (currentChar == '}' || currentChar == '{') {
                processKeyWord(readToken, finalText, function(newFinalText) {
                    finalText = newFinalText;
                    processFlowerBraces(currentChar, finalText, function(newFinalText) {
                        readToken = "";
                        append = false;
                        finalText = newFinalText;
                    });
                });
            } else if (currentChar == '"') {
                processDoubleQuotes(index, sourceText, function(result, quotedString) {
                    readToken = "";
                    append = false;
                    index = result;
                    finalText = finalText + quotedString;
                });
            } else if (currentChar == "'") {
                processSingleQuotes(index, sourceText, function(result, quotedString) {
                    readToken = "";
                    append = false;
                    index = result;
                    finalText = finalText + quotedString;
                });
            } else if (currentChar == '/' && sourceText.charAt(index + 1) == '*') {
                //alert("processing MC comment");
                processMultilineComment(index, sourceText, function(result, comment) {
                    readToken = "";
                    append = false;
                    index = result;
                    finalText = finalText + comment;
                });
            } else if (currentChar == '/' && sourceText.charAt(index + 1) == '/') {
                //alert("processing SingleLine comment");
                processSingleLineComment(index, sourceText, function(result, paintedComment) {
                    readToken = "";
                    append = false;
                    index = result;
                    finalText = finalText + paintedComment;
                });
            } else if (currentChar == '<' || currentChar == '>') {
                htmlEscape(currentChar, function(result) {
                    finalText = finalText + currentChar;
                    readToken = "";
                    append = false;
                    currentChar = result;
                });
            } else {
                readToken = readToken + currentChar;
            }
            if (append) {
                //alert("In append")
                finalText = finalText + currentChar;
            }
        }
        result = preStartTag + finalText + preEndTag;
        return result;
    }
    return main;
})();

exports.convert = java2html.convert;