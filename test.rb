require 'serialport'

SERIAL_PORT = "/dev/ttyAMA0"
sp = SerialPort.new SERIAL_PORT, 9600

sp.write "HELLO, HOW ARE YOU?\r\n"
puts "Done"
puts sp.read