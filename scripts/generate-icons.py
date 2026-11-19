import os
import zlib
import struct

def make_png(width, height, r, g, b):
    # Generates a solid colored rounded square icon with a white inner shape
    raw_data = bytearray()
    radius = width // 6
    
    for y in range(height):
        raw_data.append(0)  # Filter byte: None
        for x in range(width):
            # Check rounded corner
            dx = min(x, width - 1 - x)
            dy = min(y, height - 1 - y)
            is_corner = (dx < radius) and (dy < radius)
            in_shape = True
            if is_corner:
                dist = ((radius - dx) ** 2 + (radius - dy) ** 2) ** 0.5
                if dist > radius:
                    in_shape = False

            if not in_shape:
                raw_data.extend([0, 0, 0, 0])
                continue

            # Draw white geometric fox symbol in center
            cx, cy = width / 2, height / 2
            rel_x = (x - cx) / (width / 2)
            rel_y = (y - cy) / (height / 2)

            # Simple stylized triangle fox face:
            # y between -0.4 and 0.4, |x| <= 0.5 * (0.4 - y + 0.1)
            is_fox = False
            if -0.35 <= rel_y <= 0.35:
                w_at_y = 0.55 * (0.35 - rel_y) / 0.7
                if abs(rel_x) <= w_at_y + 0.05:
                    is_fox = True
            # Ears
            if -0.55 <= rel_y < -0.35:
                if 0.15 <= abs(rel_x) <= 0.35 and abs(rel_x) - 0.25 <= -(rel_y + 0.35):
                    is_fox = True

            if is_fox:
                raw_data.extend([255, 255, 255, 255])
            else:
                raw_data.extend([r, g, b, 255])

    # PNG chunks
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)

    png_bytes = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    return png_bytes

os.makedirs("public/icons", exist_ok=True)

# Generate 192x192 icon (Fox Orange: 249, 115, 22)
with open("public/icons/icon-192x192.png", "wb") as f:
    f.write(make_png(192, 192, 249, 115, 22))

# Generate 512x512 icon
with open("public/icons/icon-512x512.png", "wb") as f:
    f.write(make_png(512, 512, 249, 115, 22))

print("Icons generated successfully!")
