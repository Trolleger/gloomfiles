# Build files

One folder per episode (`ep01` to `ep17`).
- `voiceover.txt`: spoken lines only, one per line, tagged [gloom] or [moth]. Feed these to Piper. Suggested voices: gloom = en_US-norman-medium, moth = en_US-joe-medium (both commercial-safe).
- `build.json`: the same lines plus stage directions (action lines), and the scene list from SHOT_PLANS.md. Episodes 10 to 17 have no scene list yet (shot plans come after script approval).
- `spoken_words` and `est_seconds_at_2.5wps` are rough. Real timing is only known after Piper renders each line.

Generated from SCRIPTS_batch1.md, SCRIPTS_batch2.md, SCRIPT_v6_info_heavy.md and SHOT_PLANS.md. If a script changes, regenerate.
