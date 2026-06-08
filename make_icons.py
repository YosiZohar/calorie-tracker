"""Generate simple PNG app icons with pure Python (no external deps).
Draws a green rounded background with a white circle (plate) and a darker
'apple' dot, sized 192 and 512. Output: icon-192.png, icon-512.png.
"""
import struct
import zlib


def _chunk(tag, data):
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(path, size):
    bg = (22, 163, 74)      # green
    plate = (255, 255, 255) # white
    apple = (220, 38, 38)   # red
    leaf = (21, 128, 61)    # dark green

    cx = cy = size / 2
    plate_r = size * 0.33
    apple_r = size * 0.17
    corner = size * 0.18  # rounded corner radius

    rows = bytearray()
    for y in range(size):
        rows.append(0)  # filter type 0 for each scanline
        for x in range(size):
            # rounded-corner mask -> transparent outside
            a = 255
            for ox, oy in ((corner, corner), (size - corner, corner),
                           (corner, size - corner), (size - corner, size - corner)):
                in_corner = (
                    (x < corner and ox == corner) or (x > size - corner and ox == size - corner)
                ) and (
                    (y < corner and oy == corner) or (y > size - corner and oy == size - corner)
                )
                if in_corner and ((x - ox) ** 2 + (y - oy) ** 2) > corner ** 2:
                    a = 0
            r, g, b = bg
            d_plate = (x - cx) ** 2 + (y - cy) ** 2
            if d_plate <= plate_r ** 2:
                r, g, b = plate
            # apple sits slightly lower-center
            d_apple = (x - cx) ** 2 + (y - (cy + size * 0.03)) ** 2
            if d_apple <= apple_r ** 2:
                r, g, b = apple
            # small leaf above apple
            d_leaf = (x - (cx + size * 0.06)) ** 2 + (y - (cy - size * 0.12)) ** 2
            if d_leaf <= (size * 0.05) ** 2:
                r, g, b = leaf
            rows.extend((r, g, b, a))

    raw = bytes(rows)
    compressed = zlib.compress(raw, 9)
    png = b"\x89PNG\r\n\x1a\n"
    png += _chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += _chunk(b"IDAT", compressed)
    png += _chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)
    print("wrote", path)


if __name__ == "__main__":
    write_png("icon-192.png", 192)
    write_png("icon-512.png", 512)
