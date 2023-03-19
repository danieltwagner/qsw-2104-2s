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

The flash chip is underneath the PCB and reads `Winbond 25q128jvsq 2119`, which is a 3.3v 128 mbit spi flash.

```
git clone https://github.com/setarcos/ch341prog.git
cd ch341prog && make
sudo ./ch341prog -i
sudo ./ch341prog -r flash.bin
```

We can see that there is some (uncompressed) contents in there
```
$ binwalk flash.bin

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
273187        0x42B23         mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 4bit
310176        0x4BBA0         CRC32 polynomial table, little endian
319086        0x4DE6E         Copyright string: "Copyright 2015-2017 Broadcom Limited"
325332        0x4F6D4         Unix path: /home/sw/QNAP/SW-UT2206QG/sourcecode/robo148/src/drivers/devfs/console_dev.c
326296        0x4FA98         Unix path: /home/sw/QNAP/SW-UT2206QG/sourcecode/robo148/src/drivers/devfs/flash_dev.c
327172        0x4FE04         Unix path: /dev/flash/image
1450467       0x1621E3        mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 4bit
1499452       0x16E13C        SHA256 hash constants, little endian
1500148       0x16E3F4        Base64 standard index table
1508408       0x170438        PEM certificate
1524784       0x174430        PEM RSA private key
1524848       0x174470        PEM EC private key
1525412       0x1746A4        Base64 standard index table
1526056       0x174928        AES S-Box
1534504       0x176A28        AES Inverse S-Box
1558486       0x17C7D6        Copyright string: "Copyright 2015-2017 Broadcom Limited"
1854976       0x1C4E00        GIF image data, version "89a", 1200 x 900
1859072       0x1C5E00        GIF image data, version "89a", 32 x 32
1861120       0x1C6600        PNG image, 160 x 72, 8-bit colormap, non-interlaced
1862114       0x1C69E2        Zlib compressed data, best compression
1863168       0x1C6E00        GIF image data, version "89a", 32 x 32
1865281       0x1C7641        HTML document header
1868610       0x1C8342        HTML document footer
1869372       0x1C863C        HTML document header
1872663       0x1C9317        HTML document footer
1983431       0x1E43C7        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
2078093       0x1FB58D        HTML document header
2163084       0x21018C        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
2219476       0x21DDD4        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
2229760       0x220600        HTML document header
2231872       0x220E40        HTML document footer
2233856       0x221600        HTML document header
2235470       0x221C4E        HTML document footer
2235904       0x221E00        Executable script, shebang: "/bin/bash"
2253231       0x2261AF        PEM certificate
4858339       0x4A21E3        mcrypt 2.2 encrypted data, algorithm: blowfish-448, mode: CBC, keymode: 4bit
4907324       0x4AE13C        SHA256 hash constants, little endian
4908020       0x4AE3F4        Base64 standard index table
4916280       0x4B0438        PEM certificate
4932656       0x4B4430        PEM RSA private key
4932720       0x4B4470        PEM EC private key
4933284       0x4B46A4        Base64 standard index table
4933928       0x4B4928        AES S-Box
4942376       0x4B6A28        AES Inverse S-Box
4966358       0x4BC7D6        Copyright string: "Copyright 2015-2017 Broadcom Limited"
5262848       0x504E00        GIF image data, version "89a", 1200 x 900
5266944       0x505E00        GIF image data, version "89a", 32 x 32
5268992       0x506600        PNG image, 160 x 72, 8-bit colormap, non-interlaced
5269986       0x5069E2        Zlib compressed data, best compression
5271040       0x506E00        GIF image data, version "89a", 32 x 32
5273153       0x507641        HTML document header
5276482       0x508342        HTML document footer
5277244       0x50863C        HTML document header
5280535       0x509317        HTML document footer
5391303       0x5243C7        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
5485965       0x53B58D        HTML document header
5570956       0x55018C        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
5627348       0x55DDD4        Copyright string: "copyright 2008 A Beautiful Site, LLC. "
5637632       0x560600        HTML document header
5639744       0x560E40        HTML document footer
5641728       0x561600        HTML document header
5643342       0x561C4E        HTML document footer
5643776       0x561E00        Executable script, shebang: "/bin/bash"
5661103       0x5661AF        PEM certificate
```

Based on the bootloader's list output above, dump the first image:
```
dd skip=393216 iflag=skip_bytes bs=3092020 count=1 if=flash.bin of=flash1.bin
```

Both images start with the magic bytes `f8ff`, which also appear in other parts of the image:
```
$ binwalk -R "\xf8\xff" flash.bin
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
65536         0x10000         Raw signature (\xf8\xff)
99196         0x1837C         Raw signature (\xf8\xff)
122556        0x1DEBC         Raw signature (\xf8\xff)
298456        0x48DD8         Raw signature (\xf8\xff)
393216        0x60000         Raw signature (\xf8\xff)
393671        0x601C7         Raw signature (\xf8\xff)
472533        0x735D5         Raw signature (\xf8\xff)
1108595       0x10EA73        Raw signature (\xf8\xff)
1109563       0x10EE3B        Raw signature (\xf8\xff)
1109699       0x10EEC3        Raw signature (\xf8\xff)
1109859       0x10EF63        Raw signature (\xf8\xff)
1110119       0x10F067        Raw signature (\xf8\xff)
1270373       0x136265        Raw signature (\xf8\xff)
1272125       0x13693D        Raw signature (\xf8\xff)
1291712       0x13B5C0        Raw signature (\xf8\xff)
1467612       0x1664DC        Raw signature (\xf8\xff)
1804183       0x1B8797        Raw signature (\xf8\xff)
1808075       0x1B96CB        Raw signature (\xf8\xff)
1810803       0x1BA173        Raw signature (\xf8\xff)
1810827       0x1BA18B        Raw signature (\xf8\xff)
1813635       0x1BAC83        Raw signature (\xf8\xff)
1814540       0x1BB00C        Raw signature (\xf8\xff)
1831424       0x1BF200        Raw signature (\xf8\xff)
1832960       0x1BF800        Raw signature (\xf8\xff)
3481316       0x351EE4        Raw signature (\xf8\xff)
3801088       0x3A0000        Raw signature (\xf8\xff)
3801543       0x3A01C7        Raw signature (\xf8\xff)
3880405       0x3B35D5        Raw signature (\xf8\xff)
4516467       0x44EA73        Raw signature (\xf8\xff)
4517435       0x44EE3B        Raw signature (\xf8\xff)
4517571       0x44EEC3        Raw signature (\xf8\xff)
4517731       0x44EF63        Raw signature (\xf8\xff)
4517991       0x44F067        Raw signature (\xf8\xff)
4678245       0x476265        Raw signature (\xf8\xff)
4679997       0x47693D        Raw signature (\xf8\xff)
4699584       0x47B5C0        Raw signature (\xf8\xff)
4875484       0x4A64DC        Raw signature (\xf8\xff)
5212055       0x4F8797        Raw signature (\xf8\xff)
5215947       0x4F96CB        Raw signature (\xf8\xff)
5218675       0x4FA173        Raw signature (\xf8\xff)
5218699       0x4FA18B        Raw signature (\xf8\xff)
5221507       0x4FAC83        Raw signature (\xf8\xff)
5222412       0x4FB00C        Raw signature (\xf8\xff)
5239296       0x4FF200        Raw signature (\xf8\xff)
5240832       0x4FF800        Raw signature (\xf8\xff)
6889188       0x691EE4        Raw signature (\xf8\xff)
7209472       0x6E0200        Raw signature (\xf8\xff)
7210496       0x6E0600        Raw signature (\xf8\xff)
```
