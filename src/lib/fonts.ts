import {staticFile, continueRender, delayRender} from 'remotion';
const handle = delayRender('fonts');
const faces = [
  new FontFace('Anton', `url(${staticFile('fonts/Anton.ttf')})`),
  new FontFace('Special Elite', `url(${staticFile('fonts/SpecialElite.ttf')})`),
];
Promise.all(faces.map((f) => f.load())).then((l) => {
  l.forEach((f) => (document as any).fonts.add(f));
  continueRender(handle);
}).catch(() => continueRender(handle));
