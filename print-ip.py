import serial
import commands
import re

def getIp():
    ifconfig = commands.getoutput('ifconfig')
    matches  = re.search('ddr:(.*?) ', ifconfig)
    print 'matches'
    if len(matches.groups()) > 0:
        return matches.group(1)
    else:
        return None

ser = serial.Serial('/dev/ttyAMA0', 19200)
while(getIp() == None):
    pass

ser.write(getIp())
ser.flush()