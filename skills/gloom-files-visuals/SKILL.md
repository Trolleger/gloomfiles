---
name: "gloom-files-visuals"
description: "Use for any Gloom Files storyboard, shot plan, art, animation or render task; it layers the series rules on the mromidev animated-shorts skill."
---

# Gloom Files: visual rules (source of truth)

Follow the mromidev animated-shorts skill's PROCESS the whole time (installed on Andrew's PC in ~/claude-shorts; tutorial analysis: https://claude.ai/artifact/Y7g6N96NGeysuGPNV2Nz7Y). You don't need its template code. The look can be Andrew's own, but every step of the process is required:
1. Word-timed shot plan, with camera moves anchored to words.
2. A distinct place for every beat.
3. The skill's 3D kit models, not primitive shapes.
4. Character acting and walks.
5. Sound re-timed to the cuts.
6. The verifier loop: render frames, compare them side by side with the skill's reference frames, fix, repeat.

## RULE 1: what's shown must be what's said
- Every shot literally depicts the narration line playing at that moment. "A target 1 km away in a storm" means you show that range in the rain. "Eight tries, three hits" means 8 targets with 3 hit.
- No decorative or generic places. Never one room, board or wall for the whole episode, even when the source is an online thread.
- Shot plans are a table: line -> what's shown -> why it's relevant. Andrew approves it.
- The verifier must also check line-vs-picture relevance for every shot. A shot that doesn't depict its line fails.

## Style (from Andrew's answers, 2026-11-25)
- Painterly toy-diorama look with sketchy, hand-drawn ink lines.
- Colour changes with the topic.
- Surreal dream-space worlds (impossible scale, floating places), still literal to the line.
- A new place every 4-6 s.
- Punchy camera: zooms and shakes on the big moments. No static holds.
- Professor Gloom (English professor, tweed, bow tie, very long white beard, blue eyes, flashlight) mostly stays off to the side with simple acting. The world is the star. He never pops in and out.
- Moth and Biscuit only appear as occasional gags.
- Captions are big and bold, with the key word highlighted in colour.
- In-scene text only for key things the story names (a book title, a date, a clock). No stray text.
- Real-world objects can look like the real thing when the story names them (e.g. Death Note).
- References: ZachDFilms, Retroyap shorts. It must NOT look AI-made.

## Audio
- Voice: Piper en_US-joe-medium (CC0).
- Music changes with the mood. Kevin MacLeod tracks with a CC BY credit are fine. Commercial-safe only.
- Sound effects are anchored to words and cuts.

## Gates
1. Script approved (see the gloom-files-script skill).
2. Shot plan approved.
3. One still per beat. Then the verifier loop, and the coordinator checks the real frames against the references itself, never trusting a self-report.
4. Andrew approves the storyboard.
5. Build the motion.
6. Ask Andrew before any GPU render on his PC (he games on it; a full episode takes ~15-20 min).

## Tracking
- GitHub repo github.com/Trolleger/gloomfiles and /mnt/project-files/shorts/ (INDEX.md, EPISODE_TRACKER.md). Never Notion.