# How others make animated shorts, and what Gloom Files is missing

Research date: 2026-11-26. Read only: nothing in the repo or on the PC was changed.
Compared against: repo `Trolleger/gloomfiles`, branch `cloud/ep01-worlds-rebuild` (commit 0810b9b), composition `Ep01V8`, and the 720p preview `ep01v8_preview720.mp4`.

## What I could and couldn't verify about the big channels
- **ZachDFilms:** never published his pipeline. Third-party pages say Blender, with a small team or contract animators. One commissioned short was made "inside Blender ... with a small team" of three (Odin Lee's video description). None of this comes from the channel itself, so treat it as likely, not confirmed.
- **Retroyap:** I found nothing public about their tools.
- **Claude-driven pipelines (best evidence):** two creators have published full Claude workflows for this exact style, and both list their mistakes. One is `nocodehack/make-short` (Blender 5 + EEVEE + a critic agent). The other is JessyClips' "Every Step and Mistake" video (Blender + Whisper). Most of the lessons below come from them and from mromidev's own skill.

## Ranked gaps (most damage first)

### 1. Captions are timed by a guess, and they show different words than the voice says
- **What we do:** `audio/make_voice_v3.py` gets word times from **faster-whisper `tiny.en`**, the smallest and least accurate Whisper model. It matches them to the script with difflib and fills any misses by spreading them evenly. In the output every word starts exactly where the last one ended (e.g. "A" runs 0.00-0.42 s), which is a known Whisper artifact: it doesn't detect silence. On top of that, `Episode4.tsx` shows **paraphrased phrases** ("COLDS", "ONE METRE TARGET") that stay **0.3 s past the end of each sentence**, so what you read is not what you hear.
- **What others do:** the reference shows 1-3 of the actual spoken words at a time, with a hard swap on each word (STYLE_BIBLE). The WhisperX paper explains why plain Whisper word times drift, and fixes it with phoneme-level forced alignment (wav2vec2).
- **Fix:** we already know the exact text, so don't transcribe: **align**. Best option: take the durations straight from Piper. It knows each phoneme's length when it speaks, so the timings are exact by construction (see piper discussion #425 and the piper-plus timing module). Fallback: WhisperX `align()` or torchaudio's MMS forced aligner, given the script text. Then show the real spoken words, 1-3 per card, hard cut on the word's start frame, key word in colour. Check it with a waveform-plus-caption overlay strip before any render.

### 2. The voice is too slow and has dead air
- **What we do:** 189 words in 59.98 s = **3.15 words/s**. There are nine 0.35 s silences glued between sentences (`GAP`), on top of Piper's own pauses at full stops.
- **What others do:** the reference measures 3.5-4.1 words/s (median 3.7). All the gaps over 0.25 s add up to **under 1 s per video**. Voice starts on frame 1-4 (STYLE_BIBLE). Retention guides all say the same: dead air in the first seconds loses viewers.
- **Fix:** set the gap to ~0.05 s, set Piper `--sentence-silence` low, and try `LENGTH_SCALE` 0.85-0.9. Target ~3.6 words/s and ~52 s, or keep 60 s and add story detail. Re-run the audio after (the skill: "any later timing change means re-running the sound").

### 3. Sets are empty rooms with floating objects
- **What I saw in the preview:** most beats are a checker floor, a bare wall and a few props floating in the air (giant cubes, a lone sink, a scales prop hovering). Characters are often cut off at the frame edge.
- **What others do:** the reference shows dense, lived-in sets with ground clutter, 3 depth layers and a foreground prop in about a third of shots (skill `FOREGROUND`). make-short: faces fill 30-40 % of the frame.
- **Fix:** each beat needs a foreground prop, a midground subject on the ground with a contact shadow, and a dressed background (kit models, 10-30 small props), not a wall. Add more CC0 kits (Kenney City/Survival/Holiday, Quaternius, Poly Pizza CC0). Add a verifier rule: nothing floats unless the line says so, and no character is cut by the frame edge unless it's deliberate.

### 4. Every world is the same purple night, lit flat
- **What I saw:** almost every frame is purple-blue night with no clear sun and weak shadows. This matches the verifier's "flat lighting".
- **What others do:** the skill ships two tuned presets (day: sky #3e7fd2, lit 1.58 / shade .30 with cool shade; golden: backlit low sun, violet shadows). The reference changes light with the story (noon, then sunset, then night-blue for the explanation). JessyClips: one fixed sun per shot, a warm rim per character, real shadows.
- **Fix:** happens with the bridge-engine move (already in progress in the "Rebuild episode 1 the skill's way" thread). Use day/golden for most beats and night only for the spooky ones. Colour per topic is a deviation Andrew approved, but it changes the tint, not the light model. Optional extra after the skill values are in: a soft ambient-occlusion pass (N8AO) to ground objects. Test it against the reference first, because the skill doesn't use it.

### 5. Self-scoring and judging stills instead of motion
- **What we do:** the verifier rounds scored stills. Ep01 v8 took 13+ rounds of stills, then looked 4/10 in motion.
- **What others do:** make-short: "Never self-score. Builders rate about 2 points too high." Their first render scored 4.2 and reached 7.9 only after a fresh critic scored the **final mp4** with a fixed rubric. JessyClips: "Compare animation frames, not stills". Keep a timestamped problem list and re-render only the clips that changed. mromidev: a fresh Opus verifier with side-by-sides against reference frames.
- **Fix:** score short motion clips (2-3 s at 0.5 scale, rendered in the cloud) against reference clips. Use a fixed rubric and a fresh critic each round, never the builder. Pass at 7+ per area. Write each mistake into a lessons file so it never comes back.

### 6. Camera moves too rarely and uses soft transitions
- **What others do:** JessyClips measured the reference at **~24 camera moves a minute** (median 1.2 s); their own first short had 11.6. They plan one named move per sentence from a fixed list and never use the same transition twice in a row. STYLE_BIBLE: ease-out bursts, transitions that follow an object, whip pans, fly-throughs, and only 6-8 frame dissolves.
- **Fix:** in the shot plan, give every sentence a named move anchored to a word. Swap generic crossfades for follow-the-object or whip-pan transitions.

### 7. Depth blur is missing
- **What others do:** lens blur on about a third of screen time, 10-16 px at 1080 on close-ups, wides sharp (skill `dofAt`).
- **Fix:** comes with the bridge engine. Make sure the `dofAt` table is filled in for every ep01 shot, not left at default.

### 8. Character acting is thin
- **What others do:** make-short holds a reaction for 12-24 frames after each gag. The skill uses walk cycles, blinks every 0.5-2.3 s and a lean.
- **Fix:** give each beat one readable action (walk in, point, flinch) and a held reaction after punch words.

## What we're already doing right
Script formula, word-anchored cuts and kicks, the Kenney CC0 kits, the verifier idea, and moving onto the skill's own engine. Nobody I found uses a fundamentally different tool that we'd need to switch to. Blender is the common choice, but mromidev's three.js/Remotion route is proven for this exact look, and it renders on Andrew's GPU in minutes.

## Sources
- mromidev skill: /mnt/project-files/shorts/skills/mromidev-original/ (SKILL.md, STYLE_BIBLE.md)
- make-short (Claude + Blender, critic loop): https://github.com/nocodehack/make-short
- JessyClips, "How to Make These Animated Shorts Using Claude (Every Step and Mistake)": https://www.youtube.com/watch?v=_lyBiwSalWI (description and chapters only; YouTube blocked the transcript)
- mromidev skill write-up: https://explainx.ai/blog/claude-animated-shorts-remotion-threejs-agent-skill-github-trending-guide-2026
- WhisperX paper (why Whisper word times drift, forced-alignment fix): https://arxiv.org/abs/2303.00747v1 and https://github.com/m-bain/whisperx
- Forced alignment comparison: https://arxiv.org/pdf/2406.19363
- Piper phoneme durations: https://www.github.com/rhasspy/piper/discussions/425 , https://docs.rs/crate/piper-plus/0.2.0/source/src/timing.rs
- ZachDFilms (third-party, unconfirmed): https://shapes.inc/zackdfilms/faq , https://www.youtube.com/watch?v=aCzbfDGmgzg , https://www.autoclips.app/guides/how-to-make-zack-d-films-animation-with-ai
- Retention: https://www.opus.pro/blog/youtube-shorts-hook-formulas , https://aibrify.com/en/blog/youtube-shorts-retention-curve-playbook
- N8AO: https://github.com/N8python/n8ao
