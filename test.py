import serial
ser = serial.Serial('/dev/ttyAMA0', 19200)
for i in range(100):
    ser.write('HELLO WORLD!')
ser.flush