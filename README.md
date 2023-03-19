## QNAP QSW-2104-2S
https://forum.openwrt.org/t/hacking-into-qnap-qsw-1105-5t-2-5g-broadcom-based-switch/109381


With ethernet ports facing towards you, pins are from left to right:
VCC, switch RX (connect to serial TX), GND, switch TX (connect to serial RX).

```
BCM53158 SWITCH firmware Feb 22 2018
boot_src = M7. Initializing M7


Copyright 2015-2017 Broadcom Limited
         All rights reserved

Unit 0: ChipID: 53161 Rev 17
Unit 0: Straps: 00005041
Unit 0: PLL1 CH1 POSTDIV 13
LED Boot up -> 0s-3s
Unit 0: LED Refresh cycle config
Unit 0: LED Delay config
Unit 0: LED Strap load
Loading LED Firmware
.......
Unit 0: bootloader LED Start
Buffered Logs:
OTP_FLAGS = 0x8c


Broadcom ROBO OS Bootloader Version 2.4

Bootloader: QSPI flash Model: winbond Size: 128 Mbit

DEVFS: Initializing..
DEVFS: Device /dev/ttyS0 registered
DEVFS: Device /dev/flash0 registered
Press any key to interrupt Auto Boot
1 Bootloader: Auto boot Interrupted, Launching Cli
BCMCLI> help
config_get [<param>] (get all or given config)
config_set <param> <value> (set given config)
list (List all images)
getreg <register>
reboot (Reboot the system)
rz (receive a file via zmodem)
setreg <register> <value>
save (save boot config)

BCMCLI> list
+-----------------------------------------------------------------+
| Image | Offset   | Len      |       Version                     |
+-----------------------------------------------------------------+
|  1    | 10060000 | 3092020 | SW-UT2206QG_1.00-0.07 |
|  2    | 103a0000 | 3092020 | SW-UT2206QG_1.00-0.07  |
+-----------------------------------------------------------------+
```

## Dumping flash

The flash chip is underneath the PCB and reads `Winbond 25q128jvsq 2119`, which is a 128 mbit spi flash.

```
git clone https://github.com/setarcos/ch341prog.git
cd ch341prog && make
sudo ./ch341prog -i
sudo ./ch341prog -r flash.bin
```

