# Gloom Files: Series Bible

~60 s vertical YouTube Shorts. Series name: Gloom Files, fronted by Professor Gloom. Internet mysteries and unexplained stories, told as an investigation of the source. Regular uploads.

## Cast
- **Professor Gloom**: deadpan narrator. Flat, serious.
- **Moth**: nervous sidekick.
- **Biscuit**: the cat gag.
- Serious/informational episodes (like the pilot): Gloom only. No reaction gags, no cat.

## Tone rules
- Funny episodes: dark, spooky, a bit scary, still funny.
- Informational episodes: neutral documentary voice. No jokes, no filler, no debunk. Just explain.
- Tone is chosen per episode (Tone column in the tracker). Sensitive topics are always informational.
- Scripts follow the source closely. The animation depicts the source itself (e.g. thread posts as pinned cards).
- Captions: big and bold, 2 to 4 words at a time. Numbers always shown on screen.

## Platforms
YouTube Shorts, TikTok and Reels. Keep scripts platform-neutral: no "subscribe" or "follow" lines, and keep captions and key text in the centre safe area.

## Safety rules
- Never show names, handles, usernames or links that could lead viewers to a harmful source or a private person.
- Claims are always attributed ("says", "according to the thread"), never stated as fact.
- Gore toned down to a nod. No slurs. No jokes about deaths. Nothing involving children.
- No copied images. Sources for context beats go in the video description.
- Sensitive topics get an on-screen disclaimer at the start and end.
- Andrew sees and approves every script before anything is built.

## Pipeline
1. Pick a story and pitch it.
2. Write the script and review it with Andrew.
3. Andrew approves the script.
4. Build in Remotion (three.js scenes) with free Piper TTS. Commercial-safe voices only: en_US-joe-medium (CC0), en_US-norman-medium (public domain). Avoid ryan, hfc_male (non-commercial) and alan (unclear).
5. Music: royalty-free or synthesized.
6. Render on Andrew's PC ("ark", Linux, GTX 1060 3GB). Full 1080x1920 takes about 90 min at concurrency 1 with --gl=angle. GPU heavy and he games on it, so render only when he says.
7. Upload, then log date and views in the tracker.

## Script format
- Header: episode title, format, safeguards, cast, world, captions, on-screen disclaimer.
- Voice-over split into labelled beats (hook, posts/steps with timestamps, context beats, close).
- Sources list for the video description.
- Target about 60 s, roughly 150 to 250 words for informational pacing.
- See shorts/SCRIPT_v6_info_heavy.md for the pilot as the reference example.
