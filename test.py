import serial
ser = serial.Serial('/dev/ttyAMA0', 19200)
ser.write('hello there')