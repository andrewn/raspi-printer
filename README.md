raspi-printer
=============

This is the way I hooked up my Raspberry Pi to get the printer working. I'm no expert though and if you hook something up wrong, you could completely break your Raspberry Pi. Use at your own risk.

## Connecting up the printer to the Raspberry Pi

You will need:
 - 2 jumpers that sit over the Raspberry Pi's serial pins (http://bit.ly/LiTwTm or http://bit.ly/L0KD5u)

1. Plug the printer's power connector (the one with 2 red/black wires) and the data connector (3 black/yellow/green wires) into the breadboard.

![](https://raw.github.com/andrewn/raspi-printer/master/docs/1.jpg)

2. Attach a jumper to connect the 2 grounds

![](https://raw.github.com/andrewn/raspi-printer/master/docs/2.jpg)

3. Connect the printer's power supply adapter using some more jumper cables. The black end should be in line with the black cable already on the board. The red end with the red cabnle coming from the printer connector.

![](https://raw.github.com/andrewn/raspi-printer/master/docs/3.jpg)


*NB: This next step is the one that could destroy your raspberry pi if you don't connect up the correct wires.*

4. There's a large collection of pins in the top-left of the Pi. Connect the pin on the top row, 3rd from the left to the ground. Connect the pin to the immediete right of that, (top row, 4th from the left) to the yellow wire of the printer's data cable.

You're connecting the transmit pin of the Raspberry Pi's serial interface with the Recieve wire of the printer.

![](https://raw.github.com/andrewn/raspi-printer/master/docs/4.jpg)

## Test the Pi's output to the printer

Without connecting the Pi to the printer, log into the Pi (I'm using the Debian Squeeze distro).

The Pi will be sending all the console logging output to the serial interface but we need to change the baud to match the printer's.

Backup the file we're about to change:
    $ sudo cp /boot/cmdline.txt /boot/cmdline.txt.backup

Open the file in a text editor:
    $ sudo nano /boot/cmdline.txt


In this file, change the number 115200 to 19200 e.g.

    dwc_otg.lpm_enable=0 console=ttyAMA0,19200 kgdboc=ttyAMA0,19200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 rootwait

Power off the Pi again.

Now, hook everything together, including connecting the printer's power adapter.

Power on the Pi again and the printer should start spewing out the start-up output that you see on the screen.

Success!

## Loading the printer software

On the Raspberry Pi you need to install the python-serial library so we can communicate with the printer via the serial interface.

    $ sudo apt-get install python-serial

Create a file called `PRINTER_ID`. It should contain the printer's unique ID and nothing else.

Next, you can run the printer.py app:

    $ cd /path/to/raspi-printer/
    $ sudo python printer.py

The software will poll every 10 secs looking for something to print.

## TODO
- create a unique ID if it doesn't find one
- do some basic validation of response
- don't crash if we encounter an error
- send a header containing software version number?
