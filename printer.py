import serial
import time
import urllib2

import random
import string

from optparse import OptionParser

parser = OptionParser(description='A free range printer')
parser.add_option("--debug", help="output to /dev/null", action="store_true")
(options, args) = parser.parse_args()

RASPI_SERIAL = '/dev/ttyAMA0'
DEBUG_SERIAL = '/dev/master'

printerType = 'A2-raw'

pollingTimeoutSecs = 10

printerDevice = DEBUG_SERIAL if options.debug else RASPI_SERIAL
printerId = None
printer   = None

printerHost = "http://printer.gofreerange.com:80"

def readFileContents(filepath):
    with open(filepath,'r') as f:
        output = f.read()
    return output

def writeFileContents(filepath, contents):
    with open(filepath,'w') as f:
        f.write(contents)

def createPrinterId():
    # Create a unique, 16 char string composed of a-z0-9
    # See: http://stackoverflow.com/a/621658
    return "".join([random.choice(string.ascii_lowercase + string.digits)
                    for i in xrange(16)])

def getPrinterId():
    idFromFile = None
    try:
        # :todo: Make this a config option
        idFromFile = readFileContents('/home/pi/raspi-printer/PRINTER_ID')
    except IOError:
        pass
    return idFromFile

def storePrinterId(pid):
    writeFileContents('PRINTER_ID', pid)

def initSettings():
    print "init settings"

    global printerId
    printerId = getPrinterId()

    if not printerId:
        printerId = createPrinterId()
        storePrinterId(printerId)
        print "Created new printer id: " + printerId

def initPrinter():
    global printer
    printer = serial.Serial(printerDevice, 19200)

def getPrinterUrl():
    return printerHost + "/printer/" + printerId

def checkForDownload():
    url = getPrinterUrl()

    req = urllib2.Request(url)
    req.add_header('Accept', 'application/vnd.freerange.printer.' + printerType)

    print "Checking for download: " + url
    response = urllib2.urlopen(req)

    content_length = int(response.info()['Content-length'])

    print "Content length: " + str(content_length)

    status = str( response.getcode() )

    print "Status: " + status

    if status == '200' and content_length > 0:
        print "has response"
        sendToPrinter(response)
    elif content_length == 0:
        print "content length was 0"
    else:
        print "got response: " + status

def sendToPrinter(f):
    print "Printing."
    bytes = f.read()
    for b in bytes:
        printer.write(b)
    printer.flush()


initSettings()
initPrinter()
print printerId
print printerDevice

while(True):
    checkForDownload()
    time.sleep(pollingTimeoutSecs)
