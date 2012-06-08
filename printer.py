import serial
import time
import urllib

import argparse

parser = argparse.ArgumentParser(description='A free range printer')
parser.add_argument("--debug", help="output to /dev/null", action="store_true")
args = parser.parse_args()

RASPI_SERIAL = '/dev/ttyAMA0'
DEBUG_SERIAL = '/dev/master'

printerDevice = DEBUG_SERIAL if args.debug else RASPI_SERIAL
printerId = None
printer   = None

printerHost = "http://printer.gofreerange.com:80"

def readFileContents(filepath):
    with open(filepath,'r') as f:
        output = f.read()
    return output

def getPrinterId():
    return readFileContents('PRINTER_ID')

def initSettings():
    print "init settings"

    global printerId
    printerId = getPrinterId()

def initPrinter():
    global printer
    printer = serial.Serial(printerDevice, 19200)

def getPrinterUrl():
    return printerHost + "/printer/" + printerId

def checkForDownload():
    url = getPrinterUrl()
    print "Check for download: " + url
    response = urllib.urlopen(url)
    status = str( response.getcode() )

    print "Status: " + status

    if status == '200':
        print "has response"
        sendToPrinter(response)
    else:
        print "got response: " + status
        time.sleep(5)

def sendToPrinter(f):
    bytes = f.read()
    for b in bytes:
        printer.write(b)
    printer.flush()


initSettings()
initPrinter()
print printerId
print printerDevice

#while(True):
checkForDownload()
