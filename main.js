var glob = require("glob"),
  path = require("path"),
  fs = require("fs"),
  java2html = require("./java2html.js"),
  stream = require("stream"),
  Transform = stream.Transform || require('readable-stream').Transform,
  util = require('util');

function Java2htmlStream(options) {
  // allow use without new
  if (!(this instanceof Java2htmlStream)) {
    return new Java2htmlStream(options);
  }
  // init Transform
  Transform.call(this, options);
}
util.inherits(Java2htmlStream, Transform);

Java2htmlStream.prototype._transform = function (chunk, enc, cb) {
  var upperChunk = java2html.convert(chunk.toString());
  this.push(upperChunk);
  cb();
};

var copy = function() {
  glob(__dirname + "/src/**/*.*", function(err, files) {
    var processed = 0;
    files.forEach(function(file) {
      var dir = path.dirname(file);
      var filename = path.basename(file);
      var srcPath = dir + '/' + filename;
      var name_only = filename.split(".")[0];
      //fs.createReadStream(srcPath).pipe(fs.createWriteStream("test/" + name_only + '.html'));
      var java2htmlStream = new Java2htmlStream();
      fs.createReadStream(srcPath).pipe(java2htmlStream);
      java2htmlStream.pipe(fs.createWriteStream(dir + '/' + name_only + '.html'));
      processed++;
    });
    console.log(processed + " files processed");
  }); 
}

copy();

