import sys,glob
from PIL import Image
d=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 5
fs=sorted(glob.glob(d+'/B*.png')); ims=[Image.open(f).convert('RGB').resize((360,640)) for f in fs]
rows=(len(ims)+cols-1)//cols; sh=Image.new('RGB',(360*cols,640*rows))
for i,im in enumerate(ims): sh.paste(im,((i%cols)*360,(i//cols)*640))
sh.save(d+'/sheet.jpg',quality=85)
