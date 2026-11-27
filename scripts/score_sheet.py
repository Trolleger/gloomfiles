# usage: python3 scripts/score_sheet.py <stillsDir> <name>   -> review/<name>_{A,B}.png (ours above matched reference frames)
import os,sys
from PIL import Image,ImageDraw
S,NAME=sys.argv[1],sys.argv[2]
T=os.path.expanduser('~/.claude/projects/-home-andrew-claude-shorts/4593f755-d863-4acc-bb26-9ffadc8ed79d/tool-results/')
K=os.path.expanduser('~/claude-shorts/skill/references/frames/')
frames=[70,250,330,470,610,760,900,1060,1250,1420,1500,1580,1560,1640]
ref=[T+'mcp-Claude_Browser-blob-1795660959878-fwwwyb.jpg',K+'short07_0060.jpg',K+'short19_0060.jpg',K+'short10_0060.jpg',T+'mcp-Claude_Browser-blob-1795660959879-uqcljc.jpg',K+'short09_0060.jpg',K+'short18_0060.jpg',T+'mcp-Claude_Browser-blob-1795660959879-o99i1m.jpg',K+'short05_0180.jpg',K+'short02_0060.jpg',K+'short14_0060.jpg',K+'short20_0060.jpg',K+'short12_0060.jpg',K+'short04_0060.jpg']
w,h=270,480
def fit(p):
    im=Image.open(p).convert('RGB')
    if 'Browser' in p:
        W,H=im.size; im=im.crop((int(W*0.30),int(H*0.08),int(W*0.67),int(H*0.95)))
    return im.resize((w,h))
for part,idx in enumerate([range(0,7),range(7,14)]):
    sh=Image.new('RGB',(w*7,(h+22)*2),'black'); d=ImageDraw.Draw(sh)
    for n,i in enumerate(idx):
        sh.paste(Image.open(os.path.join(S,'f%04d.jpg'%frames[i])).convert('RGB').resize((w,h)),(n*w,22)); d.text((n*w+4,4),"OURS",fill='white')
        sh.paste(fit(ref[i]),(n*w,h+44)); d.text((n*w+4,h+26),"REFERENCE",fill='yellow')
    sh.save(os.path.expanduser(f'~/claude-shorts/gloomfiles/review/{NAME}_{"AB"[part]}.png'))
