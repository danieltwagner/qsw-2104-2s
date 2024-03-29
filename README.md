## Turning the QNAP QSW-2104-2S into a managed switch

https://forum.openwrt.org/t/hacking-into-qnap-qsw-1105-5t-2-5g-broadcom-based-switch/109381

The QNAP QSW-2104-2S is based on Broadcom's Robo2 platform and has management capabilities that are artificially restricted.
Fortunately it is possible to partially overcome these limitations, as described below.

It appears that the APIs described below are also available on the QSW-2104-2T and QSW-1105-5T switches, as well as other Robo2 devices. I strongly advise not to upload the modified QSW-2104-2S firmware included in this repository to other devices. If you are aware of other Robo2 devices where these APIs are available please file an issue and I'll include them here.

Update: There is at least one report of the [QSW-1108-8T](https://github.com/danieltwagner/qsw-2104-2s/issues/4) using a different hardware platform that doesn't offer the management capabilities mentioned below. If you have a QSW-1108-8T that is based on Broadcom's Robo2 please do submit an issue so that I can amend this notice.

## Establishing a connection

During startup the switch listens for web requests at 1.1.1.100 for 1 minute. If during that time no login happens it will stop listening.
Once a session has been established there is a 5 minute inactivity window after which the switch stops responding to web requests.

If you find that your [switch doesn't listen at 1.1.1.100](https://github.com/danieltwagner/qsw-2104-2s/issues/5) immediately after booting, you'll need serial access (see further below) to enable IP traffic. Once you've connected to the serial console, you can check the status of the `stop_ip` configuration parameter and disable it if it's set:
```
BCMCLI> getparam stop_ip
stop_ip => 1

BCMCLI> setparam stop_ip 0
Param stop_ip set to : 0

BCMCLI> getparam stop_ip
stop_ip => 0
```

After a reboot you should be able to reach the switch at 1.1.1.100.


## Firmware update to keep web interface up longer (optional)

The modified `fw-update-qsw-2104-2s-no-timeout.bin` firmware contained within this repository can be uploaded to stop the switch from cutting off web requests after 1 minute.

To update the firmware, set your computer's IP to e.g. 1.1.1.200 and navigate to http://1.1.1.100 once the LEDs signal the switch has finished booting. Then log in with password `Qsw_Update` and proceed to update the modified firmware.

## API routes

While the web interface is limited to only firmware updates, the switch does offer the follwing api routes (documented best effort and largely untested, if you spot any errors or omissions please file an issue!):

| Path                          | JSON fields in POST body                         | Notes                                                                              |
| :---------------------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------- |
| /api/autovoip/oui/create      | oui: "AA:BB:CC"                                  |                                                                                    |
| /api/autovoip/oui/delete      | oui: "AA:BB:CC"                                  |                                                                                    |
| /api/autovoip/oui/get         | -                                                |                                                                                    |
| /api/autovoip/state/get       | -                                                |                                                                                    |
| /api/autovoip/state/set       | gstate: uint                                     |                                                                                    |
| /api/cfg/default              | -                                                |                                                                                    |
| /api/cfg/save                 | -                                                |                                                                                    |
| /api/cfg/upload               | http multi-part upload                           | e.g. ```curl -F 'config.jsn=@/my/file'```. Reboot without /cfg/save to apply.      |
| /api/cfg/validate             | -                                                |                                                                                    |
| /api/dev/cfg/view             | query param "download"                           | supply a path like /cfg:config.jsn                                                 |
| /api/dos/get                  | -                                                |                                                                                    |
| /api/dos/set                  | macLand: uint,                                   |                                                                                    |
|                               | ipDaEqSa: uint                                   |                                                                                    |
|                               | tcpDpEqSp: uint                                  |                                                                                    |
|                               | udpDpEqSp: uint                                  |                                                                                    |
|                               | tcpNullScan: uint                                |                                                                                    |
|                               | tcpXmasScan: uint                                |                                                                                    |
|                               | tcpSynFinScan: uint                              |                                                                                    |
|                               | tcpSync: uint                                    |                                                                                    |
|                               | tcpHdrFrag: uint                                 |                                                                                    |
|                               | ipv4IcmpFrag: uint                               |                                                                                    |
|                               | ipv6IcmpFrag: uint                               |                                                                                    |
|                               | icmp4LongPing: uint                              |                                                                                    |
|                               | icmp6LongPing: uint                              |                                                                                    |
| /api/fw/data/get              | -                                                |                                                                                    |
| /api/fw/image/toggle          | -                                                |                                                                                    |
| /api/fw/upload                | http multi-part upload                           |                                                                                    |
| /api/fw/version/set           | index: int                                       |                                                                                    |
|                               | verInfo: str                                     |                                                                                    |
| /api/host/add                 | ipv6: 0                                          | reads like it wouldn't work for ipv6                                               |
|                               | ipaddr: "1.2.3.4"                                |                                                                                    |
| /api/host/delete              | ipv6: 0                                          | reads like it wouldn't work for ipv6                                               |
|                               | ipaddr: "1.2.3.4"                                |                                                                                    |
| /api/host/get                 | -                                                |                                                                                    |
| /api/host/state/set           | enable: uint                                     |                                                                                    |
| /api/intf/list/get            | -                                                |                                                                                    |
| /api/l2/table/count/get       | -                                                |                                                                                    |
| /api/l2/table/get             | start: { mac: vlan: portid: }                    |                                                                                    |
| /api/lag/create               | descr: str(17)                                   |                                                                                    |
|                               | members: str                                     | comma-separated list of port numbers (e.g. "4,5")                                  |
| /api/lag/delete               | lag: uint                                        |                                                                                    |
| /api/lag/get                  | lag: uint                                        |                                                                                    |
| /api/lag/hash/get             | -                                                |                                                                                    |
| /api/lag/hash/set             | hash: str                                        | options are "mac-da", "mac-dasa", "mac-dasa-vlan", "mac-dasa-vlan-ip"              |
| /api/lag/intf/set             | id: uint                                         | Modify existing LAG                                                                |
|                               | descr: str                                       |                                                                                    |
|                               | members: str                                     | comma-separated list of port numbers (e.g. "4,5")                                  |
| /api/lag/portmap/get          | -                                                |                                                                                    |
| /api/lbd/global/get           | -                                                |                                                                                    |
| /api/lbd/global/set           | globalEnabled: uint                              |                                                                                    |
|                               | txTime: uint,                                    |                                                                                    |
|                               | shutdownTime: uint                               |                                                                                    |
| /api/lbd/port/get             | -                                                |                                                                                    |
| /api/lbd/port/set             | port: uint                                       |                                                                                    |
|                               | enabled: uint,                                   |                                                                                    |
|                               | action: uint,                                    |                                                                                    |
|                               | transmit: uint                                   |                                                                                    |
| /api/mirror/delete            | -                                                |                                                                                    |
| /api/mirror/get               | -                                                |                                                                                    |
| /api/mirror/set               | descr:                                           |                                                                                    |
|                               | destPort:                                        | out of the box this was set to 1230392388 (?)                                      |
|                               | egressSrcPorts: []uint                           | port numbers, e.g. [ 1, 2 ]                                                        |
|                               | ingressSrcPorts: []uint                          |                                                                                    |
|                               | egressSrcVLANs: []uint                           | VLAN IDs, e.g. [ 1001 , 1002 ]                                                     |
|                               | ingressSrcVLANs: []uint                          |                                                                                    |
| /api/port/admin/get           | port: uint                                       |                                                                                    |
| /api/port/get                 | port: uint                                       | parameter is optional                                                              |
| /api/port/link/state/get      | port: uint                                       |                                                                                    |
| /api/port/list/get            | -                                                |                                                                                    |
| /api/port/phys/type/get       | port: uint                                       |                                                                                    |
| /api/port/set                 | port: uint                                       |                                                                                    |
|                               | descr: str                                       |                                                                                    |
|                               | admin: uint                                      |                                                                                    |
|                               | autoneg: 0/1, speed: uint, fdx: 0/1              | must be set together                                                               |
|                               | flow: uint                                       |                                                                                    |
| /api/port/speed/max/get       | port:uint                                        |                                                                                    |
| /api/port/stats_err/get       | port:uint                                        |                                                                                    |
| /api/port/stats_rst/set       | port:uint                                        |                                                                                    |
| /api/port/stats/clear         | ports: []int                                     | port numbers, e.g. [ 0, 1 ]                                                        |
| /api/port/stats/get           | port: uint                                       | parameter is optional                                                              |
| /api/qos/dot1p/mapping/get    | -                                                |                                                                                    |
| /api/qos/dot1p/mapping/set    | dot1p: []str                                     | [ "0x02","0x01","0x04","0x08","0x10","0x20","0x40","0x80" ] out of the box         |
| /api/qos/dscp/mapping/get     | -                                                |                                                                                    |
| /api/qos/dscp/mapping/set     | dscp: []str                                      | format tbc                                                                         |
| /api/qos/port/ratelimit/get   | port: uint                                       | parameter is optional                                                              |
| /api/qos/port/ratelimit/set   | port: uint                                       |                                                                                    |
|                               | ingress: { admin: uint, rate: uint, unit:"pps" } | "unit" might have more options, tbc                                                |
|                               | egress: { admin: uint, rate: uint, unit:"pps" }  | "unit" might have more options, tbc                                                |
| /api/qos/port/sched/get       | port: uint                                       | parameter is optional                                                              |
| /api/qos/port/sched/set       | port: uint                                       |                                                                                    |
|                               | mode: 0/1                                        | enable/disable, port 1 was enabled out of the box                                  |
|                               | rrWeights: []int                                 | max 8 weights. Port 0 had [ 128,128,128,128,128,128,128,128 ] out of the box       |
| /api/session/login            | user: str, pass: str                             |                                                                                    |
| /api/session/logout           | -                                                |                                                                                    |
| /api/sntp/get                 | -                                                |                                                                                    |
| /api/sntp/set                 | state: 0/1                                       | defaults to off out of the box                                                     |
|                               | poll: uint                                       |                                                                                    |
|                               | ipv4: "1.2.3.4"                                  |                                                                                    |
|                               | tz: uint                                         |                                                                                    |
| /api/storm/get                | -                                                |                                                                                    |
| /api/storm/set                | unicast: {admin: uint}                           |                                                                                    |
|                               | unicast: {meas:, level: uint}                    | "meas" format is tbc                                                               |
|                               | multicast: {admin: uint}                         |                                                                                    |
|                               | multicast: {meas:, level: uint}                  | "meas" format is tbc                                                               |
|                               | broadcast: {admin: uint}                         |                                                                                    |
|                               | broadcast: {meas:, level: uint}                  | "meas" format is tbc                                                               |
| /api/system/led/set           | led_offset: uint                                 |                                                                                    |
|                               | value: uint                                      |                                                                                    |
| /api/system/logintime/set     | can_logintime: uint                              | Also sets session timeout to 1d (fixed)                                            |
| /api/system/loopmode/set      | loopback_mode: 0/1                               | Enables/disables loopback detection                                                |
| /api/system/macaddr/set       | mac_addr: "00:11:22:33:44:55"                    |                                                                                    |
| /api/system/microled/set      | led_mode:uint                                    |                                                                                    |
| /api/system/params/get        | -                                                |                                                                                    |
| /api/system/params/set        | cfg_descr: str(64)                               |                                                                                    |
|                               | dev_id: str(32)                                  |                                                                                    |
|                               | dev_name: str(32)                                |                                                                                    |
|                               | dev_loc: str(32)                                 |                                                                                    |
|                               | dev_desc: str(31)                                |                                                                                    |
|                               | dhcpv4: 0/1                                      | When enabled, `ipv4, subnet, gw` act as static fallback (untested)                 |
|                               | ssl: 0/1                                         |                                                                                    |
|                               | l2Agetime: uint                                  |                                                                                    |
|                               | sessTTL: uint                                    | in minutes                                                                         |
|                               | ipv4: "1.2.3.4", subnet:"1.2.3.4", gw: "1.2.3.4" | Supply together. Applies immediately, but upon reboot only works as dhcp fallback. |
| /api/system/password/set      | {"pwd": "old", "new_pwd": "new"}                 |                                                                                    |
| /api/system/phy_fw_ver/get    | -                                                | Returns malformed (unclosed) JSON                                                  |
| /api/system/reboot            | -                                                |                                                                                    |
| /api/system/serial_number/set | serial_number: str                               |                                                                                    |
| /api/system/stop_ip/set       | stop_ip: 0/1                                     | Stop serving web traffic (!)                                                       |
| /api/system/sysloop_led/set   | system_loop_led: 0/1                             |                                                                                    |
| /api/system/testmode/set      | test_mode: uint                                  |                                                                                    |
| /api/user/detete              | user: str                                        |                                                                                    |
| /api/user/get                 | -                                                |                                                                                    |
| /api/user/set                 | add: uint                                        |                                                                                    |
|                               | user: str                                        |                                                                                    |
|                               | pass: str                                        |                                                                                    |
| /api/vlan/create              | vlan: uint                                       |                                                                                    |
| /api/vlan/delete              | vlan: uint                                       |                                                                                    |
| /api/vlan/get                 | vlan: uint                                       | parameter is optional                                                              |
| /api/vlan/mode/get            | -                                                |                                                                                    |
| /api/vlan/mode/set            | mode: uint                                       | 802.1q or port-based?                                                              |
| /api/vlan/port/get            | port: uint                                       |                                                                                    |
| /api/vlan/port/set            | port: uint                                       |                                                                                    |
|                               | accept: uint                                     |                                                                                    |
|                               | pvid: uint                                       |                                                                                    |
| /api/vlan/set                 | vlan: uint                                       |                                                                                    |
|                               | membership: [ {intf: uint, mbr: 0/1/2} ]         | mbr 1 = untagged, mbr 2 = tagged                                                   |
| /session_check                | -                                                |                                                                                    |

API activity will reset the inactivity window.
Note that it appears that there can only be one session simultaneously, i.e. when there's an active api session the web login won't work. However, the web user's session id can be shared with api requests.

Example API usage creating a new 802.1q VLAN (id 2), assigning tagged port membership for port 5 (leftmost SFP+) and untagged for ports 0 and 1 (rightmost 2.5g ports). Setting untagged ports will automatically also set port PVID.
```
$ curl 1.1.1.100/api/session/login -d '{"user":"admin", "pwd":"Qsw_Update"}' -v 2>&1 | grep Set-Cookie
< Set-Cookie: mgs=b5502488f7254cd6;
$ curl 1.1.1.100/api/vlan/create -H "Cookie: mgs=b5502488f7254cd6" -d '{"vlan":2}'
$ curl 1.1.1.100/api/vlan/set -H "Cookie: mgs=b5502488f7254cd6" -d '{"vlan":1, "membership":[{"intf":0,"mbr":0},{"intf":1,"mbr":0},{"intf":2,"mbr":1},{"intf":3,"mbr":1},{"intf":4,"mbr":1},{"intf":5,"mbr":1}]}'
$ curl 1.1.1.100/api/vlan/set -H "Cookie: mgs=b5502488f7254cd6" -d '{"vlan":2, "membership":[{"intf":0,"mbr":1},{"intf":1,"mbr":1},{"intf":2,"mbr":0},{"intf":3,"mbr":0},{"intf":4,"mbr":0},{"intf":5,"mbr":2}]}'
```

Persist config for the next boot:
```
$ curl 1.1.1.100/api/cfg/save -H "Cookie: mgs=b5502488f7254cd6"
{"status": 0}
```

If you're not using the modified firmware (above), setting a longer login time window once logged in may be advisable. This will also automatically set session timeout to 1 day. Note that this setting does not get persisted across reboots.
```
curl 1.1.1.100/api/system/logintime/set -H "Cookie: mgs=b5502488f7254cd6" -d '{"canlogin_time":31536000}
```

# Configuration before any VLAN changes:
```
$ curl 1.1.1.100/api/vlan/mode/get -H "Cookie: mgs=b5502488f7254cd6"
{"status":0,"mode":1}

$ curl 1.1.1.100/api/vlan/port/get -H "Cookie: mgs=b5502488f7254cd6"
{"port_data":[{"port":0, "pvid":1, "accept":0},{"port":1, "pvid":1, "accept":0},{"port":2, "pvid":1, "accept":0},{"port":3, "pvid":1, "accept":0},{"port":4, "pvid":1, "accept":0},{"port":5, "pvid":1, "accept":0}],"port_count":6,"port_first":0,"status":0}

$ curl 1.1.1.100/api/vlan/get -H "Cookie: mgs=b5502488f7254cd6"
{"vlanData":[{"id":1,"vlan":1,"tag":[],"untag":[0,1,2,3,4,5]}],"status":0}

$ curl 1.1.1.100/api/vlan/get -H "Cookie: mgs=b5502488f7254cd6" -d '{"vlan":1}'
{"vlanData":{"id":1,"vlan":1,"inUse":[],"tag":[],"untag":[0,1,2,3,4,5]},"mode":1,"vlanCountMax":128,"vlanidMin":1,"vlanidMax":4095,"vlanList": [1],"status":0}
```


## Serial console

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

Based on the bootloader's list output above, dump the bootloader as well as the firmware image:
```
dd bs=393216 count=1 if=flash.bin of=flash0.bin
dd skip=393216 iflag=skip_bytes bs=3092020 count=1 if=flash.bin of=flash1.bin
```

Both images start with the magic bytes `f8ff`, which also appear in other parts of the bootloader and first image:
```
$ $ binwalk -R "\xf8\xff" flash0.bin

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
65536         0x10000         Raw signature (\xf8\xff)
99196         0x1837C         Raw signature (\xf8\xff)
122556        0x1DEBC         Raw signature (\xf8\xff)
298456        0x48DD8         Raw signature (\xf8\xff)

$ binwalk -R "\xf8\xff" flash1.bin

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Raw signature (\xf8\xff)
455           0x1C7           Raw signature (\xf8\xff)
79317         0x135D5         Raw signature (\xf8\xff)
715379        0xAEA73         Raw signature (\xf8\xff)
716347        0xAEE3B         Raw signature (\xf8\xff)
716483        0xAEEC3         Raw signature (\xf8\xff)
716643        0xAEF63         Raw signature (\xf8\xff)
716903        0xAF067         Raw signature (\xf8\xff)
877157        0xD6265         Raw signature (\xf8\xff)
878909        0xD693D         Raw signature (\xf8\xff)
898496        0xDB5C0         Raw signature (\xf8\xff)
1074396       0x1064DC        Raw signature (\xf8\xff)
1410967       0x158797        Raw signature (\xf8\xff)
1414859       0x1596CB        Raw signature (\xf8\xff)
1417587       0x15A173        Raw signature (\xf8\xff)
1417611       0x15A18B        Raw signature (\xf8\xff)
1420419       0x15AC83        Raw signature (\xf8\xff)
1421324       0x15B00C        Raw signature (\xf8\xff)
1438208       0x15F200        Raw signature (\xf8\xff)
1439744       0x15F800        Raw signature (\xf8\xff)
3088100       0x2F1EE4        Raw signature (\xf8\xff)
```

The firmware image is running [Mongoose/6.14](https://github.com/cesanta/mongoose/tree/ab650ec5c99ceb52bb9dc59e8e8ec92a2724932b).

After some spelunking I figured out that the image is mapped to location 0x10010000.
1MB of RAM is mapped to 0x24800000 - 0x248FFFFF, along with other locations (see [here](https://github.com/Broadcom/Broadcom-Compute-Connectivity-Software-robo2-rsdk/blob/45422951b8db049be5dc8b0b60cd5dfb8183ae98/include/soc/robo2/bcm53158/memmap_bcm53158_a0.h)).
