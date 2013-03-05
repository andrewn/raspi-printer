var serialport = require("serialport");
/*

  var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 19200
  });
*/

serialport.list(function (err, ports) {
  console.log(err);
  console.log(ports);
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });
