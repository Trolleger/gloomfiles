# Gloom Files 3D prop library

Source: `src/videos/gloom/props/*.ts` (builders return a three.js group with handles in `.h`). Thumbnail sheet: `previews/prop-sheet-v1.png` (render: `./render.sh still PropSheet out.png`).
Composition rule: a set = floorRoom/ground + props + cast cards. The skill's post chain (ink, lens blur, bloom, grade) is added by `ShotView`.

## Built (55 props)
| Module | Props |
|---|---|
| sky.ts | stars, moon, constellation (+SAGITTARIUS), glowSprite |
| terrain.ts | ground, hills, tree (round/cone/dead), rock, playa, ocean, iceberg, buoy |
| buildings.ts | house, timber house, hut, skyscraper, skyline, lamppost, fence, cobbles |
| furniture.ts | floorRoom, desk, desk lamp, mug, pen, bookshelf, chair, couch, crate, archive boxes, CRT TV, monitor, arcade cabinet |
| devices.ts | radio dish (tilts, red beacon), radio mast, shortwave radio (`setFreq`), wall clock, gavel, walkie-talkie, microphone, speaker |
| paper.ts | printout (Wow! sheet), notice card, corkboard, pin, red thread, book, open book, folder, magazine, calendar page, world map, wax seal, lock, key, mask |
| charts.ts | bar chart (`setBars`), curve, spectrogram |
| figures.ts | flat silhouette (extras, men in black), dancer, monster |
| cast.ts | Professor Gloom, Moth, Biscuit cards |

## Used so far
- Ep 2: dish, hut, wall clock, desk, lamp, mug, pen, printout, bar chart, shortwave radio, stars, constellation, bookshelf.
- Ep 1: corkboard (x2), notice cards, pin, thread, calendar pages, bookshelf, desk x3, book, open book, monitor x3, silhouettes, pen.

## Not built yet (needed by later episodes)
- Ep 3 numbers stations: paper pad tearing, signal arcs on the world map, folk-song notes.
- Ep 4 Cicada: image-with-hidden-bits board, QR lamppost signs (lamppost exists).
- Ep 5 Max Headroom: rabbit-ear antenna, TV static screen, two broadcast towers.
- Ep 6 Dancing plague: woodcut-style medieval street, guild hall, ledger pages.
- Ep 7 Voynich: parchment swatch with slider, glyph strip, redrawn plants/star charts.
- Ep 8 Polybius: neon arcade interior, stool, queue.
- Ep 9 Bloop: underwater cutaway, hydrophone buoys moving, ice shelf cracking (iceberg/buoy exist).
- Ep 10+: Kryptos sculpture, backrooms hallway, UVB-76 tower, Tully fossil, Racetrack stones.

## Known limits
- Prop sheet: hills, flats and some card sizes still need framing fixes.
- Cast cards are flat bean cards by design (skill style); everything else is real 3D.
