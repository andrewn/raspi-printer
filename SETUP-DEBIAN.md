Setting up on Debian
===

How to get set-up with a wifi dongle on the Raspberry Pi.

These instructions are based on the [Adafruit Occidentalis 0.2](http://learn.adafruit.com/adafruit-raspberry-pi-educational-linux-distro/occidentalis-v0-dot-2) raspian distro since it offers some features that make it easy ot get started without having to plug the Pi into a keyboard and monitor. Namely, running sshd by default and the avahi deamon so you can easily log into the Pi using `ssh pi@raspberrypi.local`. Everything should just work on the standard Pi Raspbian image.

Configure wifi
----

Create the `/etc/wpa_supplicant/wpa_supplicant.conf` config file with the following contents, depending on your wireless networks.

Giving the SSID and password for each network seems to be enough 

    # First network
    network={
        ssid="<<<YOUR_SSID_IN_QUOTE_MARKS>>>"
        psk="<<<YOUR_NETWORK_PASSWORD_IN_QUOTE_MARKS>>>"
    }

    # Second network to try
    network={
        ssid="<<<YOUR_SSID_IN_QUOTE_MARKS>>>"
        psk="<<<YOUR_NETWORK_PASSWORD_IN_QUOTE_MARKS>>>"
    }

    # Connect to any open network (last resort)
    network={
        key_mgmt=NONE
    }


Change `/etc/network/interfaces` to use the file you've just created:

    auto lo
     
    iface lo inet loopback
    iface eth0 inet dhcp
     
    allow-hotplug wlan0
    auto wlan0
    iface wlan0 inet manual
      wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf

    iface default inet dhcp


Run the printer as a daemon
----

Create the following file in `/etc/init.d/raspi-printer`.

    #!/bin/bash

    # See: http://jimmyg.org/blog/2010/python-daemon-init-script.html

    set -e

    DAEMON="/home/pi/raspi-printer/printer.py"
    ARGS=""
    PIDFILE="/var/run/raspi-printer.pid"

    case "$1" in
      start)
        if /sbin/start-stop-daemon --status --pidfile $PIDFILE 
            then echo "Already running"; exit 0; fi

        echo "Starting server"
        /sbin/start-stop-daemon --start --pidfile $PIDFILE \
            --background --make-pidfile \
            --exec $DAEMON $ARGS
        ;;
      stop)
        echo "Stopping server"
        /sbin/start-stop-daemon --stop --pidfile $PIDFILE --verbose
        rm $PIDFILE
        ;;
      *)
        echo "Usage: /etc/init.d/raspi-printer {start|stop}"
        exit 1
        ;;
    esac

    exit 0

Give the files execute permissions:

    $ sudo chmod +x /etc/init.d/raspi-printer

Enable the service to be started at boot:

    $ sudo update-rc.d -f raspi-printer defaults

