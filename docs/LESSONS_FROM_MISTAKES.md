# Lessons from mistakes (add to gloom-files-visuals SKILL.md, section "Lessons from mistakes")
Rule from Andrew: every time a mistake is caught, add a lesson here so it never repeats.

1. Captions must come from exact word times, not guesses. Take word times from Piper's own phoneme alignment (piper-tts include_alignments, audio/make_voice_v4.py), never whisper tiny.en. Show the real spoken words, 1-3 at a time, gone right after the last word ends. Hand-anchored regexes caused out-of-sync captions.
2. Voice pacing: no glued-in pauses (gap 0.06 s), about 3.5+ words/s, under 1 s of total dead air. Re-run sound cues and music after any timing change.
3. Use the skill's own look values (light presets, ink widths, depth-of-field per shot). Do not invent a custom look and call it "following the skill". Colour per topic may change the tint, not the light model.
4. Day or golden light for most scenes; night only for the spooky ones. Golden at low sun turns floors violet: use day for interior or close-up shots.
5. Never pick a floor or road colour that is lilac or blue. Check one still per shot for a purple cast before showing anything.
6. A shot must show what its line says. A random floor object or yellow bars with no meaning fails; the verifier checks line vs picture for every shot.
7. Every scene needs a foreground prop, a grounded subject with a contact shadow, and a filled background. No cropped faces at the frame edge unless deliberate.
8. Judge short rendered motion clips with a fresh reviewer each round, not stills judged by the builder (builders score about 2 points too high). Pass is 7+ per area.
9. Never claim "following the skill" without checking it against the skill's steps: measure the reference, owners per file, 8-area scoring.
10. Never run a GPU render on Andrew's PC without his "render" in his own words.
