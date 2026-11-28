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
11. Contact shadows must use a multiply blob card (key contains |blob|); a soft card with a white background draws white squares under characters.
12. Build sets from the skill template's world pieces (facade houses, painted ground, cumulus) before writing custom geometry; the template look comes from world construction, not post.
13. Textures and ink come from metre-scaled painted textures on every set surface (tileTex, plank courses), not from flat colours; this moved the reviewer from 4.1 to 4.9. Long shots need clearly different angles, and a character must never be half cut off at the frame edge.
14. Script must be one flowing spoken story: sentences linked by cause and time ("and", "then", "but", "because"), no stacked one-liners or section-style fragments. Read it aloud before showing Andrew.
15. Music must be a real track that fits the mood (Kevin MacLeod, credited), re-timed to the cuts. Do not ship a synthesized placeholder score.
16. Animation needs real acting: walks, gestures, reactions, and camera travel through the world per the skill and tutorial. Standing cards with a gliding camera are not enough.
17. Every line must be instantly clear ("from a cold to death" confused him): state the range plainly, and name the source (4chan /x/ thread) in the first sentence.
18. Visual metaphors must be self-explanatory (a red cloud with eyes read as nothing). Show the real object (their photo, labelled) and the emotion on a face: close-up, angry expression, burst, big caption.
19. Captions break at natural phrases, never end on a joining word, and the punch word stands alone and large.
20. Before showing anything, audit one still per spoken phrase (scripts/caption_stills.py): every concrete noun is literally shown, every object has an obvious meaning, no filler props or abstract shapes, labels as screen overlays so they are never cut off; a fresh reviewer does the same check.
21. One connected world per story: each beat has its own distinct literal place along it, and the camera glides and follows things between them (no stack of hard-cut separate sets).
22. Things must happen on screen: characters walk, run, react and blink frame by frame; effects (sneeze spray, stream, dust, smoke, flames) are animated.
23. No signs or label boards to explain a picture; the action shows it.
24. Judge motion as a moving clip, not stills.
