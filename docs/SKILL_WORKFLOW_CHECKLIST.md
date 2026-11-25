# Skill workflow checklist (cartoon-3d-short + tutorial), followed literally for ep01

Source: skill/SKILL.md, references/reports/*, tutorial transcript. Hard rules from Andrew override: big bold captions are allowed, every beat gets its own world, storyboard approval before a full build, no GPU render without his go.

## Tutorial lessons that failed last time
- Make the pictures from measured references, not opinion. Compare against reference frames, not against the previous round.
- Check stills before any video (cameras inside walls, wrong colours).
- Split work by owned files (cam / world / mat / char / post), one verifier looks at side-by-sides and scores.
- Reference gap list: ink lines on ~3 of 4 edges, saturated colours with blue/violet shadows and deep-but-not-black darks, painted textures with grain and gaps, blurred backgrounds (DOF on ~1/3 of screen time), 3.5-head characters with thin limbs, gliding cameras that are almost never still.

## Steps
1. [x] Read SKILL.md, README, STYLE_BIBLE, CONTEXT, lighting/motion reports, story.ts, tutorial transcript.
2. [x] Script locked: v6 (no 1906), fast Joe voice, word timings (build/ep01/ep01_words_fast.json), music + mix reused.
3. [ ] Shot plan (story.ts equivalent): per beat = own world, light preset, camera keys, DOF, foreground props, cast role. Camera keys are word-anchored (every reaction lands 0-3 frames before its word).
4. [ ] World per beat built in code (Kenney models missing: props are procedural), painted textures with seams, light presets (day / golden / night-blue), fog = horizon colour.
5. [ ] Characters: Gloom (and extras) as lit cards on the NOINK layer, guides inside each world.
6. [ ] Post chain unchanged: ink -> lens pre -> lens main -> bloom -> NEUTRAL tone map -> grade, MSAA 4.
7. [ ] Look checks: one still per beat (stills only, scale 0.5), side by sides against reference frames (sbs_sheet).
8. [ ] **Storyboard to Andrew: one still per beat next to reference frames. Wait for OK.**
9. [ ] After OK: contact-sheet review loop (render stills every ~2 s, check camera rules: glides 18-40 f, no static hold >= 4 f, push-ins 0.15-0.35 %/f, rolls 4-5 deg, flip-sign kicks on impacts, hard cuts only on big jumps, 6-8 f crossfade at place changes).
10. [ ] Audio: re-run make_audio.py if any section timing or word anchor changes.
11. [ ] **Ask Andrew before any full GPU render** (about 6 min on the GTX 1060). Then mux with `-map 0:v:0 -map 1:a:0`, run qa_video.py.
12. [ ] Deliver, update tracker and INDEX.md in the repo (no Notion).
