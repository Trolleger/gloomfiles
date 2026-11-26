import sys,glob,os
from PIL import Image,ImageDraw
S,tag=sys.argv[1],sys.argv[2]
T=os.path.expanduser('~/.claude/projects/-home-andrew-claude-shorts/4593f755-d863-4acc-bb26-9ffadc8ed79d/tool-results/')
K='/home/andrew/claude-shorts/skill/references/frames/'
ours=sorted(glob.glob(S+'/S*.png'))
cap=["curse strangers (rooftop PC, beam)","only works when he stops trying","Death Note thread","colds, buses, death","photo ritual (bathroom)","lab: 40 targets + controls","3 of 8","1m target, 1000m, storm","silent a week","others like me (attic)","comment left","luckily/unluckily (scales)","so scared you froze","1942 fear alone","callback: silence"]
ref=[T+'mcp-Claude_Browser-blob-1795660959878-fwwwyb.jpg',K+'short07_0060.jpg',K+'short16_0060.jpg',K+'short19_0060.jpg',T+'mcp-Claude_Browser-blob-1795660959879-uqcljc.jpg',K+'short09_0060.jpg',K+'short18_0060.jpg',T+'mcp-Claude_Browser-blob-1795660959879-o99i1m.jpg',K+'short10_0060.jpg',K+'short05_0180.jpg',K+'short02_0060.jpg',K+'short14_0060.jpg',K+'short20_0060.jpg',K+'short12_0060.jpg',K+'short04_0060.jpg']
w,h=270,480
def fit(p):
    im=Image.open(p).convert('RGB')
    if 'Browser' in p:
        W,H=im.size; im=im.crop((int(W*0.30),int(H*0.08),int(W*0.67),int(H*0.95)))
    return im.resize((w,h))
parts=[range(0,8),range(8,15)]
os.makedirs('review',exist_ok=True)
for part,idx in enumerate(parts):
    sh=Image.new('RGB',(w*8,(h+22)*2),'black'); d=ImageDraw.Draw(sh)
    for n,i in enumerate(idx):
        sh.paste(Image.open(ours[i]).convert('RGB').resize((w,h)),(n*w,22)); d.text((n*w+4,4),f"OURS S{i+1:02d} {cap[i]}",fill='white')
        sh.paste(fit(ref[i]),(n*w,h+44)); d.text((n*w+4,h+26),"REFERENCE "+("Retroyap" if 'Browser' in ref[i] else os.path.basename(ref[i])[:-4]),fill='yellow')
    sh.save(f'review/ep01v8_{tag}_{"AB"[part]}.png')
