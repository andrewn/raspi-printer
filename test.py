import serial
ser = serial.Serial('/dev/tty.usbserial', 19200)
ser.write('hello there')