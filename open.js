  var SerialPort = require("serialport").SerialPort
  var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 19200
  });
  serialPort.on("open", function () { 
     console.log("open", arguments); 
     serialPort.write("JAVASCRIPT RULEZ OK\n\n\n\n\n\n\n\n\n", function (err, results) { console.log(err, results); } );
  });
