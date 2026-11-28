# one still per spoken phrase for the line-vs-picture audit.  usage: python3 scripts/caption_stills.py frames|sheet <words.json> [stillsDir]
import json, re, sys, glob, os
from PIL import Image, ImageDraw, ImageFont
W = json.load(open(sys.argv[2]))['words']
chunks = []; cur = []
for k, w in enumerate(W):
    cur.append(w); n = W[k + 1] if k + 1 < len(W) else None
    if re.search(r'[.,:;?!"]$', w['word']) or len(cur) >= 5 or not n or n['section'] != w['section']: chunks.append(cur); cur = []
fr = [int(30 * (c[0]['start'] + 0.7 * (c[-1]['end'] - c[0]['start']))) for c in chunks]
if sys.argv[1] == 'frames': print(','.join(map(str, fr))); sys.exit()
d0 = sys.argv[3]; cols = 7; w, h = 270, 480; per = 14
for part in range((len(fr) + per - 1) // per):
    sub = list(range(part * per, min(len(fr), part * per + per)))
    sh = Image.new('RGB', (w * cols, (h + 56) * ((len(sub) + cols - 1) // cols)), 'black'); d = ImageDraw.Draw(sh)
    for n, i in enumerate(sub):
        x, y = (n % cols) * w, (n // cols) * (h + 56); t = ' '.join(q['word'] for q in chunks[i])
        d.text((x + 3, y + 3), f"#{i+1} t={fr[i]/30:.1f}s", fill='yellow'); words = t.split(); d.text((x + 3, y + 18), ' '.join(words[:5]), fill='white'); d.text((x + 3, y + 34), ' '.join(words[5:]), fill='white')
        sh.paste(Image.open(f"{d0}/f{fr[i]:04d}.jpg").convert('RGB').resize((w, h)), (x, y + 56))
    sh.save(f"review/audit_{part+1}.png")
print(len(fr), "phrases")
