# Update routine (2 minutes, every thread, after EVERY review round, episode, or caught mistake)

Trigger: a reviewer score came back, Andrew gave feedback, a bug or wrong assumption was found, or something worked well enough to repeat.

1. Skip if nothing new. Check LESSONS.md first; do not duplicate.
2. Run: `skills/gloom-animated-shorts/scripts/add_lesson.sh "<area>" "<lesson: what happened, the rule, how to check>" "<source: ep/thread/date>"`
   Areas: script, voice, captions, light, world, characters, camera, post, sound, process, tooling.
   This appends a numbered dated lesson to LESSONS.md, adds a CHANGELOG line, bumps the patch version in VERSION.
3. If the lesson changes how work must be done, also edit the matching section (2-5) of SKILL.md by hand and bump the minor version.
4. Record what WORKED too (scores that went up and why), not only mistakes: run the same script with area `worked`.
5. Mirror: copy the folder to `/mnt/project-files/shorts/skills/gloom-animated-shorts/` (the script does it if the folder exists).
6. Commit and push to the repo (small PR or the thread's branch). Say so in one line in your reply.
7. Update the claude.ai skills: call `propose_skills` (kind improvement) for `gloom-files-visuals` and/or `gloom-files-script` with ONLY the new lesson as `edits` (add it under "Lessons from mistakes"). Andrew taps save on the card.

Rules: never delete a lesson (mark it superseded instead). Keep each lesson to 2-3 sentences with a concrete check. Never write secrets. Upstream folder stays untouched.
