var fs = require("fs");

var PrinterId = function (id) {
  this.id = id;
}

PrinterId.prototype.toString = function () {
  return this.id;
}

PrinterId.get = function () {
  return new PrinterId(this.readOrCreateId());
}

PrinterId.logger = null;

// Join and normalise path components
PrinterId.filePath = require('path').join(process.cwd(), "PRINTER_ID");

PrinterId.generateId = function () {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 32; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

PrinterId.readOrCreateId = function () {
  if (PrinterId.logger) { logger.info("filePath", this.filePath); };
  if (fs.existsSync(this.filePath)) {
    return fs.readFileSync(this.filePath, 'utf8')
  } else {
    var id = this.generateId();
    fs.writeFileSync(this.filePath, id, 'utf8');
    return id;
  }
}

exports.PrinterId = PrinterId