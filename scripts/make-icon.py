# wowissan — renders .claude-plugin/icon.png (indigo cloth + khit diamond band + speech bubble).
# Usage: uv run --with pillow python scripts/make-icon.py .claude-plugin/icon.png
# Needs Noto Sans Thai Looped Black (OFL) at /usr/share/fonts/noto/.
import sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
S = 1024
SS = 2  # supersample for smooth edges
W = S * SS

INDIGO_TOP = (22, 32, 82)
INDIGO_BOT = (44, 62, 140)
GOLD = (242, 178, 52)
GOLD_DARK = (196, 128, 28)
CREAM = (255, 246, 228)
RED = (200, 52, 44)

img = Image.new('RGB', (W, W))
px = img.load()
for y in range(W):
    t = y / (W - 1)
    c = tuple(round(a + (b - a) * t) for a, b in zip(INDIGO_TOP, INDIGO_BOT))
    for x in range(W):
        px[x, y] = c
d = ImageDraw.Draw(img)


def diamond(cx, cy, r, fill):
    d.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=fill)


# Khit/mudmee-style diamond band along the bottom.
band_y = int(W * 0.865)
band_h = int(W * 0.135)
d.rectangle([0, band_y, W, W], fill=(16, 24, 64))
d.rectangle([0, band_y, W, band_y + 10 * SS], fill=GOLD)
n = 7
step = W / n
r = band_h * 0.36
cy = band_y + band_h * 0.54
for i in range(n + 1):
    cx = step * (i + 0.5)
    diamond(cx, cy, r, GOLD)
    diamond(cx, cy, r * 0.62, RED)
    diamond(cx, cy, r * 0.28, CREAM)
    diamond(cx - step / 2, cy, r * 0.22, GOLD_DARK)

# Small diamond accents along the top.
for i in range(n):
    diamond(step * (i + 0.5), W * 0.075, W * 0.018, GOLD_DARK)

# Speech bubble.
bx0, by0, bx1, by1 = W * 0.13, W * 0.17, W * 0.87, W * 0.62
d.rounded_rectangle([bx0 + 14 * SS, by0 + 18 * SS, bx1 + 14 * SS, by1 + 18 * SS],
                    radius=W * 0.11, fill=(10, 16, 46))  # shadow
tail = [(W * 0.30, by1 - 4), (W * 0.46, by1 - 4), (W * 0.27, W * 0.75)]
d.polygon([(x + 14 * SS, y + 18 * SS) for x, y in tail], fill=(10, 16, 46))
d.rounded_rectangle([bx0, by0, bx1, by1], radius=W * 0.11, fill=CREAM)
d.polygon(tail, fill=CREAM)

font_big = ImageFont.truetype('/usr/share/fonts/noto/NotoSansThaiLooped-Black.ttf', int(W * 0.30))
font_small = ImageFont.truetype('/usr/share/fonts/noto/NotoSansThaiLooped-Black.ttf', int(W * 0.105))


def center_text(text, font, cx, cy, fill):
    l, t, r_, b = d.textbbox((0, 0), text, font=font)
    d.text((cx - (l + r_) / 2, cy - (t + b) / 2), text, font=font, fill=fill)


center_text('เว้า', font_big, W * 0.5, (by0 + by1) / 2, INDIGO_TOP)
center_text('อีสาน', font_small, W * 0.66, W * 0.745, GOLD)

img = img.resize((S, S), Image.LANCZOS)
img.save(OUT, optimize=True)
print('saved', OUT, img.size)
