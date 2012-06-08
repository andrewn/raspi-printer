raspi-printer
=============


## Test the Pi's output to the printer

$ sudo cp /boot/cmdline.txt /boot/cmdline.txt.backup

$ sudo nano /boot/cmdline.txt

Change ttyAMA0,115200 to ttyAMA0,19200:

dwc_otg.lpm_enable=0 console=ttyAMA0,19200 kgdboc=ttyAMA0,19200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 rootwait

## 

sudo apt-get install python-serial