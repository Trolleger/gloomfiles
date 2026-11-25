# Skill workflow checklist: mromidev "cartoon-3d-short" + the tutorial

Sources, read in full:
- the skill at `~/claude-shorts/skill/` (git clone of github.com/mromidev/claude-animated-shorts, commit e3b817b):
  - `SKILL.md`
  - `references/STYLE_BIBLE.md`
  - `references/reports/*.md` (CONTEXT, motion, depth, outlines, lighting, grade, textures, characters)
  - `templates/bridge/*`, `templates/scripts/*`, `templates/audio/*` (incl. `cues.md`), `templates/SCRIPT_example.md`
- the tutorial transcript `~/claude-shorts/video-research/transcript.txt` ("How to Make Viral Animated Shorts Using Claude (Full Workflow)")

Quotes in "double quotes" are the skill's or the presenter's own words. Everything else is paraphrase.

---

## 1. The skill's real workflow, in order

### 1.0 Ground rules stated at the top of SKILL.md
- References are private study material:
  - "Those videos are private study material. Never upload, publish or send them."
  - "Never copy their scripts, characters or shots. Story, characters and voice are always OUR OWN."
  - "Never say the channel's name in a voice-over or description."
- The skill author's user rules, as listed:
  - "No captions or labels in the video."
  - "English only."
  - "Voice: one steady tone."
  - "Jokes are researched real facts."
  - "Standard mix: music +3 dB, SFX -6 dB, voice unchanged."
  - "Final export 2K vertical: 1440x2560, `--scale 1.3333`."
  - "Opus max verifies every check."
  - "Save after every step."
  - "'Just do it' once the script is approved."
  - Andrew has overridden the caption rule: he asked for captions.
- Start point: "Start every new short from `templates/bridge/` (copy to `src/videos/<name>/`): the look lives in these values, the story lives in story.ts / build.ts layout / cast.ts roles."

### 1.1 Topic and facts (Pipeline step 1)
- "Pick one surprising true story with a physical cause and effect (it should be visual), plus a simple everyday analogy that explains it."
- Facts go at the top of SCRIPT.md, each with its source.
- The tutorial adds two checks:
  - don't pick a topic the reference channel already covered (the presenter dropped one that already had 5.7M views);
  - fact-check every number before writing; the bridge's 2 ft river depth became the joke.

### 1.2 Script (step 2)
- About 3.7 words/s, 55-70 s.
- Beat formula, in order:
  1. Hook: the absurd fact in one line.
  2. Setting: year, place, pride.
  3. Action: escalation over 3-4 beats.
  4. Snap: the moment it breaks.
  5. Deadpan double line ("Luckily ... / Unluckily ...").
  6. Explanation: one physics idea through an everyday analogy.
  7. Consequence: the rule it created.
  8. Callback twist.
- "Never describe on screen what the viewer already sees."
- STYLE_BIBLE (measured on the 20 reference shorts):
  - Hook is a "paradox stated as fact, sentence 1, no setup", about 10-16 words.
  - "You see," pivots into the explanation in 14 of 20.
  - Voice starts at frame 1-4, with no intro, no outro and no CTA.
  - Delivery is 3.5-4.1 words/s with almost no pauses.
  - "Every sentence is illustrated literally; props carry the joke."

### 1.3 Voice (step 3)
- Record or generate `voice.wav`, then get word timings into `words.json`.
- "Hand-fix the word timings. Everything is timed to words.json."

### 1.4 Shot plan in story.ts (step 4)
- Copy `templates/bridge/` to `src/videos/<name>/` and register a new composition.
- story.ts holds:
  - `SHOTS` (id, a/b frames, light day/golden, crowd mode, `tau` story time)
  - `XFADE` (crossfades at place or time changes)
  - `FLASH_AT` (white flash after the hook)
  - `CAMS` (per-shot keys `{f, dur?, cut?, s: f => {pos, look, fov, roll}}`)
  - `KICKS` (impact flip-shakes)
  - `DOF` / `dofAt` (lens blur per beat)
  - `FOREGROUND` (near framing props)
- "Every visual reaction lands 0-3 frames before its word."

### 1.5 World (step 5)
- `lights.ts`: LIGHTS plus the LOOK sky, river and cloud palette per light.
- `shade.ts`: two-tone shading.
- `build.ts`:
  - the town, houses and Kenney CC0 kit props, recoloured;
  - "sight-line culling of anything blocking a camera".
- `paint.ts`: HD Canvas2D painted textures, "with seams painted in as dark tints".
- `world.ts`:
  - sky shader, with "fog = horizon colour";
  - per-frame posing;
  - "sun frozen per shot and camera-relative".

### 1.6 Characters (step 6)
- `toon.ts`: the `Pen` API.
  - 600x1000 design canvas, soles at y = 975.
  - Bean heads, stick limbs, plum variable-width outline, face library.
- `cast.ts`:
  - camera-facing billboards, crowds, effect cards, blinks, walk cycles;
  - "All billboards go on the `NOINK` layer."
- `cardshade.ts`: "cards lit by the scene light, no emissive."

### 1.7 Post (step 7)
- "Composer order: ink → lens pre → lens main → bloom → NEUTRAL tone map → grade (MSAA 4)."
- "Every pixel parameter scales with output height / 1920."

### 1.8 Sound (step 8)
- An event table drives synthesized SFX plus an original score ducked under the voice.
- Output: mix.wav (48 kHz, exact length), stems, cues.md.
- "Lock the picture's time constants before the sound is made. Any later timing change means re-running the sound."
- The bridge mix (cues.md): -15.0 LUFS integrated, -1.2 dBTP true peak, LRA 2.6 LU.

### 1.9 Look checks: the storyboard and contact-sheet review loop (step 9, plus "Look-match loop")
1. Render stills with `node scripts/bridge-stills.mjs out/<name>/x_ 100,400 0.5`. A sandbox copy can be rendered with `BRIDGE_ENTRY=...`.
2. Make side-by-sides against reference frames with `python scripts/sbs_sheet.py out.jpg --ours ... --ref ...`.
3. Send them to an Opus max verifier: "1-3 images, a ≤200-word verdict."
4. The look-match loop:
   1. "Measure the reference first. One analysis agent per topic (motion, depth, textures, characters, lighting, outlines, grade), each writing numbers, not adjectives". Reports are "the source of truth for every agent after".
   2. "Sandboxes, one owner per file." Owners:
      - cam: story.ts
      - world: world.ts, lights.ts, shade.ts, grade.ts
      - mat: paint.ts, build.ts
      - char: toon.ts, cast.ts, cardshade.ts
      - post: ink.ts, Bridge.tsx, lensblur.ts
      Agents edit only their own files and render stills from their own sandbox.
   3. Merge with `bridge_merge.py`, run `tsc`, then "re-sync every sandbox from main".
   4. Verify with "a fresh Opus max agent": side-by-side sheets, a score out of 10 per area (colour day / golden, lighting, ink, textures, characters, depth, composition), and a numbered fix list with frame numbers. Each fix goes back to its file owner.
   5. Contracts between owners live in exported constants (`NOINK`, `dofAt`, `FOREGROUND`, `LIGHTS`, `LOOK`).
- Bridge scores went from round 1 (5/3/4/5/4/7/4/6) to the final values: colour day 7, golden 5-6, lighting 5-6, ink 6, textures 5-6, characters 7, depth 6-7, composition 6-7.

### 1.10 Final render and QA (step 10)
- `npx remotion render src/index.ts <Comp> out/<name>/video.mp4 --codec h264 --crf 16 --scale 1.3333`
- "Mux with `-map 0:v:0 -map 1:a:0` (Remotion writes a silent audio track)."
- QA with `python scripts/short_qa.py final.mp4 out/<name>/qa shots.json`. It checks "every frame for black, white, frozen and pop frames, plus loudness and sheets" (2 s contact sheets of 60 frames with frame numbers). `bridge_shots.py` writes shots.json from story.ts.
- "Fix anything it finds, then run a deep Opus audit."

### 1.11 Deliver (step 11)
SendUserFile the final mp4, update memory, write notes.

### 1.12 Camera rules (SKILL "Final look values", "Look targets", motion.md)
- SKILL final values:
  - "cuts on big jumps, smootherstep glides 18-40 f, every hold creeps (no static hold ≥4 f), flip kicks decaying over 7 f on impacts, 4-4.6° rolls, foreground props (`FOREGROUND`) in ~1/3 of shots."
- SKILL look targets:
  - "Hard cuts on big jumps. Everything else is a smootherstep glide of 18-40 f, peak ≤ 25 px/f at 720p."
  - "Every hold pushes in 0.15-0.35 %/f, with 0.6 %/f on punch words."
  - "Rolls of 4-5°."
  - "No hand-held float. Impact shakes flip sign every frame and decay over 7 f."
- motion.md numbers:
  - The reference camera moves in 65 % of frames.
  - Moves happen 6 times per 10 s, ease in and out over about 23 f, with a median peak of 14-16 px/f.
  - Whips are rare (about 0.45 per minute) and always carry strong motion blur.
- depth.md:
  - Shot mix: CU 3 %, MS 27 %, FS 28 %, WS 12 %, EWS 8 %, inserts 22 %.
  - Camera height median 0.79 × character height, 82 % at eye level.
  - Head top at y ≈ 0.28 (CU), 0.35 (MS), 0.38 (FS), 0.50 (WS). Horizon at 0.40-0.50. fov 34-46.
  - "No focus pulls inside shots."
- Readability trap: "Flat holds read as freezes in QA (frozen span ≥12 f): every hold needs a creeping push-in."

### 1.13 Scene and world rules
- "Fog = horizon colour, 25→420 m day, 20→360 m golden."
- Lighting follows the story: warm and bright for the setup, deep night-blue at the explanation (tutorial 2:36; STYLE_BIBLE "noon -> sunset -> night-blue for the explanation").
- Day light: "az 75 / el 48 ... (cool tint ONLY in shade)".
- Golden light: "az 6 / el 7 (backlit low sun) ... violet-blue shade ... Never lemon, never lavender lit faces."
- Colour:
  - "Day median luma ~.57. Non-ink p5 ~.23 (no crushed blacks). Lit chroma C* p90 ~55."
  - "Golden: peach horizon #ffd08a, violet-blue shadows (never brown)".
- Ink:
  - "World lines: about 3 px at 1080 wide, near-black #0b0a0c, nearly constant with distance. Silhouettes, depth jumps and normal creases only. No line on wall/floor joins or the horizon. Character cards are never outlined by the world ink."
  - The final values use #030303, 5.1 px near → 3.3 px far.
- Depth: "DOF on about 1/3 of screen time (CU, MS, inserts), cInf 10-16 px at 1080, focus on the eyes. Establishing and wide shots stay sharp." "Bloom only on HDR emissives: threshold 1.0."
- Albedos: muted brick, cream, ochre and terracotta. Stone is warm grey or beige (saturation −35 %). Iron is dark and desaturated, never black (textures.md: "never below L* 19 except in ink lines").
- Film grain OFF ("the reference has none").

### 1.14 Character rules
- "About 3.5 head-heights tall, legs 1.4 HH."
- "Stick limbs about 0.055 of head width, ink-dot hands."
- "Bean head (h/w ~0.93, narrower chin, pointier crown)."
- "No blush or eye highlights. Faces at brightness ~.93."
- "Walk bob 3-7 %, lean 1-7°, planted feet."
- "Blinks every 0.5-2.3 s, lasting 4 f."
- Character ink is dark plum (#201628-#2f1d28), thicker on the bottom/shadow side.
- motion.md: characters are drawn on ones, with no idle loops and no line boil. Acting beats land 0-3 f before the word.

### 1.15 Asset rules
- Kenney CC0 kit props, recoloured by material name. SKILL gotcha: "Kenney nature-kit materials are teal."
- Textures are painted procedurally in Canvas2D (`paint.ts`, HD versions), with seams painted in as dark tints, never as geometry lines.
- The tutorial (5:39): "37 free 3D models, trees, rocks, flowers, market stalls, a cart, even a windmill. And every texture ... was painted by code."
- Readability traps (SKILL), check every new prop:
  - swings need two ropes;
  - props closer than about 2 m to the lens become blobs;
  - foreground bushes cut by the frame edge read as balls;
  - check flags;
  - side-lit signs need an unlit material;
  - golden rim light is inner only;
  - rails at chest height should cross legs, not torsos.

### 1.16 Disk and process gotchas (SKILL)
- Every Remotion bundle copies `public/` into the temp folder and never deletes it. Set REMOTION_TMP or TEMP to a big drive and clean it up afterwards.
- Remotion writes a silent audio track, so mux with `-map 0:v:0 -map 1:a:0`.
- Scratch `.ts` files inside `out/` break tsc.
- Sub-agents can't write report files in that harness, so have them return ≤150 words and save the report yourself.

---

## 2. From the tutorial transcript

### 2.1 Why the first version looked cheap, and the fixes
The presenter's prompt (6:40): "The original is colorful, high contrast. It looks premium. Ours looks dull. So go analyze it frame by frame. Take your time. Use 10 agents if you have to."

Diagnosis (6:44-7:35):
- No black ink lines on the 3D world.
- Pastel, flat colours instead of bold colours with long blue shadows and deep darks.
- Plain wood and stone instead of hand-painted grain with dark gaps between planks.
- Sharp backgrounds where the originals blur them.
- Circle heads and chunky bodies that looked "like clip art pasted on top".

Team (7:35-8:35): Claude used 12 agents.
- 7 measured the gap: colour, ink, light/shadow, textures, characters, depth/framing, motion.
- 1 handled sound.
- 4 rebuilt: camera, world, characters, final look.
- Each rebuild agent got its own copy of the project and owned its files; Claude merged file by file. "When you use a lot of agents, don't just split the jobs, split the files." He gave it 10 hours.

What the measuring agents found (8:35-9:46):
- Ink: lines on almost 3 of 4 edges in the original, zero in theirs. The blur ran in the same pass and wiped the ink out, and the blur itself was too weak to see.
- Camera: theirs "snapped from one spot to the next in three frames. The original glides over about 23 frames. Slow in, slow out."
- Colour: "The original has no pure black anywhere. Ours went almost black, and at sunset their shadows are purple. Ours were brown."
- Bodies: theirs are 3.5 heads tall; ours were under 3, with limbs 5x too thick.
- Their own notes were wrong:
  - the original's heads are actually rounder (38 measured);
  - the camera moves in 65 % of frames, not 20 %: "The tool just couldn't see moves that slow".

Tips from the presenter:
- "Don't ask Claude what it thinks of a video. Make it measure. You can't recreate an opinion. You can recreate a number." (3:38)
- Check still frames before rendering video (6:09). That caught "the camera was stuck inside a house. The trees were teal, and a chain was right in front of everyone's faces."
- Measure the reference at 30 fps, every frame: "20 shorts, about 18 minutes of video, over 32,000 frames".
- Make 2-second contact sheets of 60 frames (549 of them); track the camera with phase correlation; flag hard cuts; measure brightness, contrast and saturation per shot.

### 2.2 What the finished short looks like, scene by scene
"The Bridge That Fell for a Song", 67.5 s, 2025 frames, 15 shots. Shot table from `templates/bridge/story.ts` SHOTS; transcript 5:39-6:09.

**Worlds.** ONE continuous outdoor world: a town, the suspension bridge, the river below it, a park with a swing, and the river bank. The time of day changes (day → golden → day); the world doesn't. The tutorial: "Two towers, iron chains, and a deck 5m wide", "37 free 3D models", 14 faces for the characters.

**Shots** (frames at 30 fps; length in seconds):

| # | Frames | Length | Light | What's on screen |
|---|---|---|---|---|
| 1 | 0-130 | 4.3 s | day | march on the bridge; hook, ends on the white flash |
| 2 | 130-283 | 5.1 s | day | town establishing, march |
| 3 | 283-444 | 5.4 s | day | march |
| 4 | 444-534 | 3.0 s | day | march; cut on "bouncing" |
| 5 | 534-643 | 3.6 s | day | march |
| 6 | 643-823 | 6.0 s | day | march; cut up over the column |
| 7 | 823-987 | 5.5 s | day | march; cuts on "chains" and "nobody" |
| 8 | 987-1134 | 4.9 s | day | snap; bolt, kick, aerial, deck drops |
| 9 | 1134-1212 | 2.6 s | day | soldiers in the river; 6 f crossfade |
| 10 | 1212-1303 | 3.0 s | day | river |
| 11 | 1303-1411 | 3.6 s | golden | bridge at sunset, 8 f crossfade |
| 12 | 1411-1620 | 7.0 s | golden | park swing analogy |
| 13 | 1620-1735 | 3.8 s | golden | march; cut on "pushing" |
| 14 | 1735-1863 | 4.3 s | day | bank; cut to the officer hammering the sign |
| 15 | 1863-2025 | 5.4 s | day | tourists; crane pull-out to the end |

**Shot lengths:** 2.6-7.0 s, median about 4.3 s.

**Cuts and transitions:**
- 10 hard cuts inside shots (keys with `cut: true` in CAMS).
- 6 crossfades of 6-8 f at place or time changes.
- 1 white 4-frame flash after the hook.
- Everything else is a glide of 18-40 f, plus creeping push-ins on holds.
- Kicks on the snap, the drop and the hammer blows.
- One crane pull-out at the end.

**Camera rule the presenter emphasises:** the originals "almost never cut. 12 of the 20 have one hard cut or none at all. Instead, the camera physically travels into the next moment." The bridge short itself uses cuts for big jumps, per motion.md: turn the fly-snaps into cuts.

**Lighting arc:** day for setup and action → golden for the explanation and swing analogy → day for the consequence and callback.

**Process milestones:**
- a 5-second Blender look test first (a courier character; the third camera push flew past the character);
- moved from Blender to three.js with Remotion;
- "About an hour after the switch, all 15 shots were working. 2025 frames";
- stills checked before any video;
- then 4 verifier rounds of look-matching.

---

## 3. Reference frames and contact sheets in the skill folder
These are private study material: never upload, publish or send them (SKILL.md). Paths are relative to `~/claude-shorts/skill/`.

**Reference frames.** 38 JPEGs, two per reference short at frames 60 and 180. Shorts 15 and 17 have only frame 60.
```
references/frames/short01_0060.jpg  references/frames/short01_0180.jpg
references/frames/short02_0060.jpg  references/frames/short02_0180.jpg
references/frames/short03_0060.jpg  references/frames/short03_0180.jpg
references/frames/short04_0060.jpg  references/frames/short04_0180.jpg
references/frames/short05_0060.jpg  references/frames/short05_0180.jpg
references/frames/short06_0060.jpg  references/frames/short06_0180.jpg
references/frames/short07_0060.jpg  references/frames/short07_0180.jpg
references/frames/short08_0060.jpg  references/frames/short08_0180.jpg
references/frames/short09_0060.jpg  references/frames/short09_0180.jpg
references/frames/short10_0060.jpg  references/frames/short10_0180.jpg
references/frames/short11_0060.jpg  references/frames/short11_0180.jpg
references/frames/short12_0060.jpg  references/frames/short12_0180.jpg
references/frames/short13_0060.jpg  references/frames/short13_0180.jpg
references/frames/short14_0060.jpg  references/frames/short14_0180.jpg
references/frames/short15_0060.jpg
references/frames/short16_0060.jpg  references/frames/short16_0180.jpg
references/frames/short17_0060.jpg
references/frames/short18_0060.jpg  references/frames/short18_0180.jpg
references/frames/short19_0060.jpg  references/frames/short19_0180.jpg
references/frames/short20_0060.jpg  references/frames/short20_0180.jpg
```

**Contact sheets.** 20, one per short, 60 frames each.
```
references/sheets/short01_sheet.jpg ... references/sheets/short20_sheet.jpg   (short01 to short20, all present)
```

**Not in the repo, but referenced by the reports:**
- the videos (`references/vids/`), the per-video 2 s sheets (`references/measure/*_sheets/`) and `refs_sheet.jpg`;
- the per-topic crop folders (`references/<topic>/...`).

Only the 38 frames and 20 sheets above ship with the skill.

**Review tooling in the skill:**
- `templates/scripts/sbs_sheet.py`: ours vs reference side-by-side.
- `templates/scripts/short_qa.py`: per-frame QA and 2 s contact sheets with frame numbers.
- `templates/scripts/bridge-stills.mjs`: stills.
- `templates/scripts/bridge_shots.py`: shots.json for QA.
- `templates/scripts/bridge_merge.py`: sandbox merge.

---

## 4. Where Ep01 (gloomfiles) currently departs from the skill
Observed from the PC slice renders and stills on 2026-11-25. These are notes for the next look pass, not measurements.
- **Not built from `templates/bridge/`.** gloomfiles has its own `src/videos/gloom/` stack. The skill says to start every short from the bridge template, where "the look lives in these values".
- **One interior room only.** The skill's proven short is one continuous outdoor world with day/golden light changes and sky, fog and haze. Ep01 is a single dark room, warm-lit at the board. So far there's no "night-blue at the explanation" shift.
- **The look-match loop hasn't been run:**
  - no side-by-side sheets against `references/frames/`;
  - no per-area verifier scores;
  - no `short_qa.py` contact sheets.
  The PC uses the repo's own `qa_video.py` instead.
- **Captions and labels are on screen.** The skill's rule is "No captions or labels in the video." Andrew asked for captions, so this is a deliberate departure, but the floating label plates are extra on top of that.
- **Not yet checked against the skill numbers:**
  - camera: glides 18-40 f, a push-in on every hold, rolls of 4-5°, foreground props in about 1/3 of shots, DOF on about 1/3 of screen time;
  - ink widths, no pure black, Gloom's proportions against the 3.5 HH body spec.
  Measure, don't eyeball (tutorial 3:38).
