# Build files

One folder per episode (`ep01` to `ep17`).
- `voiceover.txt`: spoken lines only, one per line, tagged [gloom] or [moth]. Feed these to Piper. Voice: Andrew chose **en_US-joe-medium (CC0) for ALL narration** (Gloom and Moth alike); the earlier norman suggestion is retired.
- `build.json`: the same lines plus stage directions (action lines), and the scene list from SHOT_PLANS.md. Episodes 10 to 17 have no scene list yet (shot plans come after script approval).
- `spoken_words` and `est_seconds_at_2.5wps` are rough. Real timing is only known after Piper renders each line.

Generated from SCRIPTS_batch1.md, SCRIPTS_batch2.md, SCRIPT_v6_info_heavy.md and SHOT_PLANS.md. If a script changes, regenerate.

## Episode 1 voice (Joe)
- `ep01/ep01_words.json` (default take, 107.9 s) and `ep01/ep01_words_fast.json` (Piper length scale 0.85, 97.5 s): per-word timings
  `{word, start, end, section}` in seconds from the start of the voice file, plus `sections[]` and `voice_len`. The words are the
  script's exact words; times come from faster-whisper tiny.en, aligned by order, near-zero words stretched to >= 0.08 s.
- The WAVs are NOT in git (`public/audio/` is ignored): put `ep01_voice.wav` / `ep01_voice_fast.wav` in `public/audio/ep01/`.
- `src/videos/gloom/ep01.tsx` reads them; switch takes with the one-line `TAKE` constant at the top.
