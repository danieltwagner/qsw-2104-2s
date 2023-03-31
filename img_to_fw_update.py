#!/usr/bin/env python3

import os
import struct
import sys

MAGIC_BYTES = 0x20201103
BASE_ADDR   = 0x10010000

def le_to_be(value):
    return ((value & 0xFF) << 24) | ((value & 0xFF00) << 8) | ((value & 0xFF0000) >> 8) | ((value & 0xFF000000) >> 24)

def crc(data):
    
    crc_table = [0] * 256
    for i in range(256):
        uVar1 = i
        for j in range(8):
            if uVar1 & 1 == 0:
                uVar1 >>= 1
            else:
                uVar1 = (uVar1 >> 1) ^ 0xEDB88320
            j -= 1
        crc_table[i] = le_to_be(uVar1)
    
    result = 0xFFFFFFFF

    for b in data:
        result = (crc_table[(b ^ (result) >> 24) & 0xFF] ^ (result << 8)) & 0xFFFFFFFF
    
    return result

def main(path_in: str, path_out: str, version_str):
    with open(path_in, 'rb') as f_in:
        image_bytes = f_in.read()

    checksum = crc(image_bytes)
    print(f"Computed CRC {checksum:08x}")

    version_str = version_str[:79]
    print(f"Will use '{version_str.decode()}' as image version string")

    with open(path_out, 'wb') as f_out:
        f_out.write(struct.pack('<L', MAGIC_BYTES))
        f_out.write(struct.pack('<L', len(image_bytes)))
        f_out.write(struct.pack('<L', BASE_ADDR))
        f_out.write(struct.pack('<L', checksum))
        f_out.write(version_str + b"\x00" * (80 - len(version_str)))
        f_out.write(image_bytes)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} input_file name")
        sys.exit(1)

    path_in = sys.argv[1]
    if not os.path.exists(path_in):
        print(f"Input file {path_in} does not exist")
        sys.exit(1)

    path_in_name, path_in_ext = os.path.splitext(path_in)
    path_out = path_in_name + '_fw_update' + path_in_ext

    if os.path.exists(path_out):
        print(f"Output file {path_out} already exists, refusing to overwrite")
        sys.exit(1)

    version_str = sys.argv[2]
    clean_version_str = version_str.encode('ascii', errors='ignore')

    main(path_in, path_out, clean_version_str)
