---
name: gloom-animated-shorts
description: "Our own maintained version of the mromidev animated-shorts skill for Gloom Files. Use for ANY Gloom Files script, storyboard, art, animation, sound or render task. Read it first, then follow UPDATE_ROUTINE.md after every round, episode or mistake."
---

# Gloom Files animated shorts (our maintained skill) , version in ./VERSION

Layout of this folder (repo: github.com/Trolleger/gloomfiles, `skills/gloom-animated-shorts/`; mirror: `/mnt/project-files/shorts/skills/gloom-animated-shorts/`):
- `upstream/` : mromidev's ORIGINAL skill, untouched (SKILL.md, STYLE_BIBLE.md, SCRIPT_example.md). It is the BASE. Read upstream/SKILL.md and upstream/STYLE_BIBLE.md IN FULL yourself before any task. Never work from a summary.
- `SKILL.md` (this file): our layer on top: series rules, deviations, hard gates.
- `LESSONS.md`: numbered, dated lessons from every caught mistake. Read all of it before any task.
- `CHANGELOG.md` + `VERSION`: what changed and when.
- `UPDATE_ROUTINE.md`: the short routine every thread runs after each round, episode or mistake. This is how the skill keeps improving.
- `reference/`: research (how others make shorts) and the ep01 checklist.

## 0. Base rule
The upstream skill's PROCESS, template engine (templates/bridge/) and FINAL LOOK VALUES are the base. Only the deviations listed in section 2 are allowed. Never invent a custom look and call it "following the skill". Never claim "following the skill" without checking each step.

## 1. Process (from upstream, all required)
1. Facts + full source digest. 2. Script (formula below). 3. Voice + exact word times (Piper alignment). 4. Word-timed shot plan (camera moves anchored to words, every reaction 0-3 frames before its word). 5. A distinct world per beat, built from the template's world pieces and kit models (not primitives). 6. Characters with walks and acting. 7. Post chain: ink, lens pre, lens main, bloom, NEUTRAL tone map, grade, MSAA 4. 8. Sound re-timed to the cuts. 9. Look checks: stills, then short motion clips, side by side with the skill's reference frames. 10. Final render. 11. Deliver + run UPDATE_ROUTINE.md.
Look-match loop: measure reference, sandboxes with one owner per file (cam / world / mat / char / post), merge, re-sync, fresh verifier scores 8 areas out of 10, map fixes to owners.

## 2. Gloom Files layer (deviations and additions)
- Series: animated Shorts/TikTok/Reels internet-mystery series fronted by Professor Gloom (English professor, tweed, bow tie, very long white beard, blue eyes, flashlight). Moth and Biscuit are occasional gags. Gloom mostly stays off to the side; the world is the star.
- EVERY beat is its own full 3D world that literally depicts the line (a target 1 km away in a storm shows that range in the rain; 8 tries, 3 hits shows 8 targets with 3 hit). Never one room, board or wall for a whole episode. A new place every 4-6 s. Surreal dream-space is fine but still literal.
- Approved deviations from upstream: big bold captions (1-3 real spoken words at a time, key word in colour, hard swap on the word start); colour tint changes with topic (tint only, not the light model); in-scene text only for named key things (book title, date); real named objects may look real.
- Captions: word times from Piper phoneme alignment (or forced alignment), never a small whisper model.
- Voice: Piper en_US-joe-medium (CC0), ~3.5-3.7 words/s, gaps ~0.06 s, under 1 s total dead air, voice from frame 1. About 60 s per episode. Music changes with the mood (Kevin MacLeod with CC BY credit is fine, commercial-safe only). Sound effects anchored to words and cuts. Re-run sound after any timing change.
- Light: day or golden for most scenes, night only for spooky beats. No lilac or blue floors, no purple cast on day scenes. Check one still per shot.
- Every scene: recognisable foreground prop, grounded subject with contact shadow (multiply blob), filled textured background. No flat UI boards, floating props, empty checker floors, or characters cropped at the frame edge unless deliberate.
- Camera: punchy; glides 18-40 f, no static hold of 4 f or more, impact flip-shakes, hard cuts only on big jumps. Vary Gloom's placement and pose per shot.
- Must NOT look AI-made. References: ZachDFilms, Retroyap shorts, plus the skill's reference frames.

## 3. Script rules
- ~150-170 words for ~60 s at the Joe pace you measure; standalone, no cliffhanger; hook in sentence one; voice from frame 1.
- Read the WHOLE raw source before drafting; write a source digest (every claim, quote, number, turn) and show it to Andrew with the script, marking used and cut.
- Upstream formula: hook (paradox or absurd fact), setting, 3-4 escalating beats, the snap, pivot ("You see,") into an everyday analogy, consequence, callback twist, deadpan contrast beat where it fits.
- Narrate a story with cause and effect, never a list of one-liners and never a description of the forum thread. Every sentence concrete and showable. No AI phrasing. Attribute every claim; say plainly when unverifiable.
- Tone by topic: serious = informational and neutral; light = funny allowed.
- Safety: no names/handles of private people, no harmful links, gore only as a nod, never state unconfirmed origins as fact.
- Self-check: specific detail per line; read aloud as a stranger; every line showable as its own world; word count; list every cut fact.

## 4. Gates (Andrew's rules)
1. Script approved. 2. Word-timed shot plan table (line -> what is shown -> why) approved. 3. One still per beat next to reference frames, verifier loop, and the coordinator checks the real frames itself (never trust a builder's self-report; builders over-score by ~2). 4. Andrew approves the storyboard. 5. Build motion; judge short rendered motion clips with a FRESH reviewer, pass = 7+ per area. 6. NO GPU render on Andrew's PC ("ark", GTX 1060, he games on it) until he types "render" or equivalent in the thread himself. A full ep takes ~6 min there. Cloud has no GPU (about 18 s/frame).
Tracking: GitHub repo + /mnt/project-files/shorts/ (INDEX.md, EPISODE_TRACKER.md). NEVER Notion.

## 5. Known engine facts (verified)
- Template world builder is bridge-only: it does not give you other worlds for free. Port its pieces (facade houses, painted ground, cumulus, cobble), then build sets from them before writing custom geometry. The look comes from world construction, not post.
- Kenney GLBs are missing in the cloud (kenney.nl blocked), so props are procedural and missing GLBs fail silently. Metre-scaled painted textures (tileTex, plank courses) on every surface moved the reviewer 4.1 to 4.9.
- Ep01 rebuild status: ~4.9/10 on the reviewer, target 7+. Ep01's custom two-tone shader caused the flat ~4/10 look.
- Stills: bundle once, render sequentially (parallel renders fail). Mux with `-map 0:v:0 -map 1:a:0`. Set TEMP to a big drive; clean old remotion bundle folders after a project.

## 6. Self-improvement (the point of this skill)
After every review round, episode or caught mistake, run UPDATE_ROUTINE.md. A lesson not written down WILL repeat. Lessons live in LESSONS.md; rules that change behaviour are promoted into sections 2-5 of this file.
