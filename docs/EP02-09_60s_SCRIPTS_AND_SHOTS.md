# Eps 2-9: 60-second scripts + per-beat world shot lists (for Andrew's approval)

Written 2026-11-26, cloud only. Nothing here is built or rendered. Approve, edit or reject per episode.

## How these were made (and the rules they follow)
- **Source:** the approved batch 1 scripts (`SCRIPTS_batch1.md`). No new facts were added. Every fact kept is from those checked scripts, with the same attributions and safety notes. Cut facts are listed per episode, so you can ask for any back.
- **Length:** the fast Joe take for ep 1 ran 278 words in 97 s, which is **2.87 words a second** (measured from `ep01_words_fast.json`, branch pc/ep01-voice). So 60 s is about 170 words. Each script below is 148 to 167 spoken words (52 to 58 s), which leaves room for gags, kicks and the 1 s end beat. Real timing is only known after the Joe take on your PC.
- **Hook:** sentence 1 states the strange fact with no setup (the skill's measured rule: a paradox stated as fact, 10 to 16 words, voice from frame 1). Every episode ends on a closed line, no "next time", no cliffhanger.
- **Tone:** informational eps (3, 4, 6, 7) are Gloom only, neutral, no jokes. Funny eps (2, 5, 8, 9) get at most two Moth or Biscuit gags.
- **Shots, per your style answers and the mromidev skill:** one place per shot, each place **literally shows its line**, a new place every 4 to 6 s, surreal dream-space scale (giant objects, floating islands, impossible rooms), colour set by topic, Gloom small and off to the side with one acting beat per shot, punchy camera (push-ins on every hold, kicks on impact words, glides of 18 to 40 frames, hard cuts on big jumps, 6 to 8 frame dissolves only where time passes), big captions of 2 to 4 words with the **key word in colour** (shown in CAPS + colour name below), in-scene text only for what the story names (dates, numbers, titles).
- **Music:** Kevin MacLeod (CC BY 4.0, credit line in every description). Every title below was checked against incompetech's own full track list on 2026-11-26. Each ep uses at most two tracks, crossfaded at the mood change.
- **Safety:** no private names (the only names are public figures already in the approved scripts), no links or board names on screen, gore only as a nod, no death toll on screen in ep 6.

## Build process each ep goes through after you approve (the skill's steps)
1. Joe take on your PC (no GPU), then hand-fixed word timings.
2. Shot plan as code: SHOTS (one per row below), XFADE at time jumps, CAMS keyed to the words, KICKS on the marked words, DOF per shot, FOREGROUND props in about a third of shots. Every visual reaction lands 0 to 3 frames before its word.
3. **One still per shot as a storyboard, sent to you for approval** (project rule 3).
4. Verifier loop on side-by-sides against the skill's reference frames, scores per area and numbered fixes, two rounds minimum. The verifier also fails any shot that doesn't depict its line. Then the frames are checked against the references before you see them.

All places are built from the skill's 3D kit models (recoloured) plus our prop library, never primitive-shape stand-ins. Gloom acts and walks; he never pops in or out.
5. Motion, sound re-timed to the cuts, then a full render only on your go.

Caption colours: **yellow** = key fact, **red** = danger or mystery word, **mint** = the claim or theory, **white** = everything else.

---

## EP 2: The Wow! Signal (funny)
**Colour:** deep space violet and cyan, hot amber for the printout. **Music:** "Comfortable Mystery" (light, curious) for shots 1-7, "Lightless Dawn" (cold, empty) from shot 8.

### Script (155 spoken words, about 54 s at the fast Joe pace)
- **Hook.** In 1977, a telescope in Ohio caught a signal from the sky for 72 seconds. It has never been heard again.
- **B1.** Days later, volunteer astronomer Jerry Ehman reads the printout. He circles six characters, 6-E-Q-U-J-5, and writes one word: "Wow!"
- *(Moth: "That's it? That's the whole reaction?")*
- **B2.** It's not a message. Each character is loudness. The U means about 30 times louder than the background. It rose, peaked and faded, which is how a real source in the sky should look.
- **B3.** It sat near 1420 megahertz, the hydrogen line. In 1959, scientists suggested that channel as a sensible place to call another civilisation. It came from the direction of Sagittarius.
- **B4.** Astronomers went back and listened. 1987. 1989. 1995. 1999. Nothing. *(Biscuit stares at the sky.)*
- **B5.** A 2017 comet idea was rejected by other astronomers. A 2024 preprint suggests a rare burst from a hydrogen cloud. Unconfirmed.
- **Close.** Ehman wouldn't draw "vast conclusions from half-vast data". Gloom: "Neither will I. Mostly."

**Cut for length:** the exact date (August 15) in the voice (kept as in-scene text), "listening for aliens" (the hook no longer says "from deep space", since the source is unconfirmed), "one character every 10 seconds", the reflected-Earth-signal and flickering-signal explanations.

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "a telescope in Ohio caught a signal from the sky" | A **giant radio dish standing on a floating chunk of Ohio farmland** in a violet void; a single cyan beam streaks in from a far star and strikes the dish | The signal arriving at the Ohio telescope | Fast push from the star along the beam into the dish, kick on "signal" | Gloom tiny on the field edge, holding his hat | A **SIGNAL** (red) | |
| 2 | "for 72 seconds. It has never been heard again." | The dish's red beacon glows; a **72-second counter made of glowing stars** fills up, then the beam snaps off and the sky empties | 72 seconds, then gone for good | Hold creeps in, hard cut to dark on "never" | none | **72** SECONDS (yellow) | 72 |
| 3 | "Days later, Ehman reads the printout" | A **paper printout as long as a road** unrolling across a night desert, a desk lamp the size of a street lamp | Ehman reading the printout | Low glide along the paper | Gloom walking the paper's edge, flashlight on it | THE **PRINTOUT** (yellow) | AUG 15 1977 |
| 4 | "circles six characters, 6EQUJ5, and writes 'Wow!'" | Macro on the paper: a **red pen as tall as a tower** circles 6EQUJ5 and writes Wow! | The circle and the word Wow! | Snap zoom to the circle, kick on "Wow" | **Moth gag**: pops up behind the paper, "That's it?" | **WOW!** (yellow) | 6EQUJ5, Wow! |
| 5 | "Each character is loudness. U means 30 times louder" | The six characters stand up as **3D blocks of different heights on a plain**, the U a skyscraper over the rest | Each character is a loudness level; U is the tallest | Crane up the U, push on "30" | Gloom at the U's foot, looking up | **30X** LOUDER (yellow) | 30X |
| 6 | "It rose, peaked and faded, like a real source in the sky" | The blocks become a **mountain ridge**; a moon rises over it, peaks, and sets in the same arc | Rose, peaked, faded, like a sky source | Glide along the ridge with the moon | none | **ROSE**, PEAKED, FADED (yellow) | |
| 7 | "near 1420 megahertz, the hydrogen line. In 1959 ... call another civilisation" | A **radio dial the size of a lighthouse** on a cliff, its needle swings and lands on 1420; a 1959 telephone on the cliff edge, receiver off the hook, cord running into space | 1420 MHz, and the 1959 'call another civilisation' idea | Push to the needle, kick when it lands | Gloom turning the dial | **1420** MHZ (yellow) | 1420, 1959 |
| 8 | "from the direction of Sagittarius" | Star field: the **Sagittarius constellation** draws itself in lines, an arrow from Earth points into it (library prop) | Where it came from | Whip-pan up into the stars | none | **SAGITTARIUS** (mint) | |
| 9 | "Astronomers went back and listened. 1987 ... 1999. Nothing." | **Four identical dishes on four floating islands**, each lit by a year; each points at the same empty patch of sky | The four later searches, all empty | Glide past the four, a small push on each year | **Biscuit gag**: on the last dish, staring up | **NOTHING** (red) | 1987, 1989, 1995, 1999 |
| 10 | "2017 comet idea was rejected. 2024 preprint ... hydrogen cloud. Unconfirmed." | A **cartoon comet** flies past and gets a giant red X stamped on it; behind it a **glowing hydrogen cloud** flares, with a "?" in the mist | The two later explanations, both unconfirmed | Push, kick on the stamp | Gloom holding the stamp | **UNCONFIRMED** (mint) | 2017, 2024 |
| 11 | Close: "vast conclusions from half-vast data. Neither will I. Mostly." | Back to the field: the dish small again, the printout blowing away across the stars | Ehman's line and the shrug | Slow pull-back to wide, end 1 s hold | Gloom deadpan to the side, then a tiny shrug on "Mostly" | **HALF-VAST** DATA (yellow) | |

New props: floating island base, giant pen, 1959 telephone, comet, hydrogen cloud. Library: dish, printout, constellation, stars, radio dial, desk lamp, bar chart.

---

## EP 3: Numbers Stations (informational)
**Colour:** cold teal and black, a single amber radio glow. **Music:** "Long Note Four" (sparse, eerie) throughout, "Cipher" under shots 5-7.

### Script (167 spoken words, about 58 s at the fast Joe pace)
- **Hook.** Turn a shortwave radio to the right spot, and a voice is reading numbers to someone. It has done it for decades.
- **B1.** First comes a signature: a tune, or a word like "Attention". Then a count. Then groups of digits, usually five. Then all of them again.
- **B2.** So who is it for? The leading explanation is a one-time pad. Only the person holding the matching pad can read each group. Used correctly, it can't be broken.
- **B3.** And radio is the perfect drop. Shortwave crosses continents, and anyone with a plain radio can listen without being traced.
- **B4.** The best-known British station opened with a folk song, "The Lincolnshire Poacher". It is believed, but not confirmed, to have been government-run. Its last recorded broadcast was July 2008.
- **B5.** The idea even reached a courtroom. In 2001, US prosecutors told a court that Cuban agents decoded messages from one such station on handheld radios.
- **Close.** Many stations still broadcast. The numbers are public. The meaning isn't.

**Cut for length:** "a female voice", hobbyists logging stations and giving them codes, "some governments have acknowledged old stations".

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "Right now, somewhere on shortwave radio, a voice is reading numbers" | A **shortwave radio as big as a house** alone on a dark plain, its dial glowing amber; glowing digits drift out of the speaker like smoke | A voice reading numbers on shortwave | Fast push into the dial, kick on "numbers" | Gloom small at the radio's foot, flashlight up | READING **NUMBERS** (red) | |
| 2 | "to someone. For decades." | Digits drift across a field of **calendar pages turning into falling leaves**, decades of them | Going on for decades | Glide with the drifting digits | none | **DECADES** (yellow) | |
| 3 | "First comes a signature: a tune, or a word like 'Attention'. Then a count." | A **music box the size of a bandstand** plays; notes float up and turn into a word ATTENTION, which falls and becomes a count 1-2-3 | The signature, then the count | Crane up with the notes | none | **ATTENTION** (red) | ATTENTION |
| 4 | "Then groups of digits, usually five. Then all of them again." | A **typewriter-key road**: five-digit blocks roll past on a conveyor, then the **same blocks roll past again** in a mirrored lane | Five-digit groups, read twice | Track alongside, push on "again" | Gloom ticks each block with chalk | **FIVE** DIGITS (yellow) | 5-digit groups |
| 5 | "So who is it for? One-time pad. Only the person holding the matching pad" | Two **identical giant notepads** on two distant floating rocks; a glowing thread of digits links matching pages | The one-time pad and its matching copy | Push across the gap between the rocks | Gloom on one rock, holding a page up to the light | **ONE-TIME** PAD (mint) | |
| 6 | "Used correctly, it can't be broken." | A page is torn off, a **crowbar and a drill bounce off it** with sparks, then the page burns to ash | Unbreakable when used right | Close, kick on "can't" | none | **UNBREAKABLE** (yellow) | |
| 7 | "radio is the perfect drop. Shortwave crosses continents" | A **tilted globe as a stage**; signal arcs leap from one tower across oceans; tiny lit windows with little radios dot the globe | Shortwave crossing continents | Orbit the globe, glide 30 frames | none | **CONTINENTS** (yellow) | |
| 8 | "listen without being traced" | One tiny lit window: a radio on a table, **footprints in snow outside fade away** | Listening without being traced | Push to the window | Gloom outside in the snow, looking at the fading tracks | **UNTRACEABLE** (red) | |
| 9 | "The Lincolnshire Poacher ... believed, but not confirmed ... government-run" | English **green fields under a giant gramophone horn**; folk-song notes float over hedgerows; a **grey building with no sign** half-hidden in fog | The British folk-song station and its unconfirmed operator | Glide over the fields, push into the fog | Gloom by a hedge, unsure | **NOT CONFIRMED** (mint) | |
| 10 | "last recorded broadcast July 2008" | The gramophone slows and stops; the horn falls silent and grows moss | Its last broadcast | Slow push, hard stop on "2008" | none | **2008** (yellow) | JULY 2008 |
| 11 | "reached a courtroom. In 2001, US prosecutors told a court ... handheld radios" | A **courtroom floating in the sea at night**, a gavel the size of a car; on the evidence table, a handheld radio and a notepad of digits (no faces, no names) | The 2001 court case and the handheld radios | Push to the table, kick on the gavel | Gloom in the public gallery, small | **2001** COURT (yellow) | 2001 |
| 12 | Close: "The numbers are public. The meaning isn't." | Back to the giant radio on the plain, digits still drifting up into the dark | Still broadcasting, meaning unknown | Slow pull-back, 1 s end hold | Gloom walks away | **THE MEANING** (red) | |

New props: music box, giant notepad pair, tilted globe stage, gramophone horn, floating courtroom. Library: shortwave radio (setFreq), world map, gavel, walkie-talkie, calendar page.

---

## EP 4: Cicada 3301 (informational)
**Colour:** black and acid green, cold white light. **Music:** "Investigations" (tense) for shots 1-8, "Darkest Child" (dark, unresolved) from shot 9.

### Script (165 spoken words, about 58 s at the fast Joe pace)
- **Hook.** In January 2012, an image appeared online asking for highly intelligent people. Nobody knows who posted it.
- **B1.** Solvers dug in. Hidden inside the image was data. Solving it led to another clue, then another.
- **B2.** The chase ran from images to a phone number, to websites, to paper signs with QR codes.
- **B3.** Every real message was signed with the same PGP key, so fakes could be spotted.
- **B4.** It came back in January 2013 and January 2014. The third round was never fully solved.
- **B5.** One solver said those who got far were asked about privacy and freedom of information, then invited to a private forum. What happened next is mostly unknown.
- **B6.** Guesses: an intelligence agency, a secret society, a game. None confirmed.
- **B7.** In 2015, a group using "3301" attacked a database. The real signers posted a signed denial. Their last verified message was April 2017.
- **Close.** The puzzle was built to find people. What it wanted them for is still unanswered.

**Cut for length:** the exact day (January 4, kept as in-scene text), the topic list (cryptography, steganography, privacy), "it referenced literature, poetry, art and music", "an anonymous message board" (also keeps the board unnamed).

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "an image appeared online asking for highly intelligent people" | A **single framed picture floating in a black void**, lit by one cold spotlight; a queue of tiny silhouettes walks toward it on a glowing path | The image asking for intelligent people | Push down the path into the frame | Gloom at the path's edge | **INTELLIGENT** PEOPLE (yellow) | JAN 4 2012 |
| 2 | "Nobody knows who posted it." | Behind the frame, an **empty chair** and a desk, the spotlight shows no one | Nobody knows who posted it | Whip around the frame | none | **NOBODY KNOWS** (red) | |
| 3 | "Hidden inside the image was data" | The picture **peels apart in layers like an onion**; green code glows between the layers | Data hidden inside the image | Fly through the layers, kick at the core | Gloom holding a magnifying lens to a layer | **HIDDEN** DATA (mint) | |
| 4 | "led to another clue, then another" | A **staircase of floating picture frames** spiralling up into dark, each lights as the last goes out | Clue after clue | Crane up the spiral | none | **ANOTHER CLUE** (yellow) | |
| 5 | "images, a phone number, websites, paper signs with QR codes" | A **street of giant objects**: a phone box as tall as a church, a glowing browser window as a billboard, a lamppost with a paper sign and a QR code (generic city, no real place) | The clue types: images, phone, websites, QR signs | Glide down the street past each | Gloom reading the lamppost sign | **QR CODES** (yellow) | |
| 6 | "signed with the same PGP key ... real clues from fakes" | A **giant wax seal stamp** presses down on a row of letters; real ones glow green, fakes crumble | Same key separates real from fake | Kick on each stamp | Gloom sorting letters | **SAME KEY** (yellow) | |
| 7 | "came back in 2013 and 2014. Third round never fully solved." | **Three doors on three floating islands**, labelled 2012, 2013, 2014; the first two swing open, the third stays locked with a chain | Three rounds, the third unsolved | Glide across, hard push on the locked door | none | **NEVER SOLVED** (red) | 2012, 2013, 2014 |
| 8 | "asked about privacy and freedom of information, then invited to a private forum" | A **velvet rope and a door in the sky**; a lone silhouette climbs a ladder of light to it; the door closes behind them | The private-forum invitation | Crane up the ladder, cut on the closing door | none | **PRIVATE** FORUM (mint) | |
| 9 | "What happened next is mostly unknown." | The other side of the door: **fog, nothing** | What happened next is unknown | Slow push into fog | none | **UNKNOWN** (red) | |
| 10 | "intelligence agency, secret society, game" | **Three shadow figures on three plinths**: a man in a trench coat, a hooded robe, a giant game die; each gets a "?" | The three guesses about who made it | Glide past, push on each | Gloom shrugs between them | **NONE CONFIRMED** (mint) | |
| 11 | "In 2015, a group using 3301 attacked a database. A signed denial." | A **vault of filing drawers** cracks; a counterfeit seal shatters; the real seal stamps "DENIED" on a letter | The 2015 imitators and the signed denial | Kick on the crack, then on the stamp | none | **FAKE** (red) | 2015 |
| 12 | "last verified message April 2017. Built to find people..." | The **first framed picture again**, now alone and dark; the queue of silhouettes is gone | Last message, still unanswered | Long pull-back, 1 s end hold | Gloom walking away down the empty path | **STILL UNANSWERED** (red) | APRIL 2017 |

New props: layered picture frame, phone box, browser billboard, velvet rope door, three plinth figures, filing vault. Library: lamppost, wax seal, lock, key, chair, desk, mask.

---

## EP 5: Max Headroom Hijack (funny)
**Colour:** 1980s CRT blue and static grey, neon magenta for the hijack. **Music:** "Night on the Docks" (late-night, jazzy) for shots 1-3, "Interloper" (tense, odd) from shot 4.

### Script (160 spoken words, about 56 s at the fast Joe pace)
- **Hook.** In 1987, someone hijacked two Chicago TV stations in one night. They have never been caught.
- **B1.** November 22, about 9:14 p.m. A sports report. Then the screen goes black for about 15 seconds.
- *(Moth: "Is it supposed to do that?")*
- **B2.** Then a figure in a Max Headroom mask and sunglasses appears, swaying in front of a moving metal panel. No voice. Just a buzz.
- **B3.** Engineers changed the studio link frequency and it stopped. The anchor said: "Well, if you're wondering what's happened, so am I."
- **B4.** About two hours later, it hit a public TV channel. This time with sound, for about 90 seconds. Nobody on duty could stop it.
- **B5.** How? A stronger microwave signal, aimed at the stations' towers, overrode the real one. That took skill and equipment.
- **B6.** The FCC investigated. No culprit. The legal time limit ran out in 1992.
- **Close.** A masked figure took over two TV stations. And walked away.

**Cut for length:** the 11:20 p.m. time (kept as in-scene text), "odd, rambling mischief", "it ended when the pirates stopped transmitting", "very hard to do today", the Biscuit gag (Moth's line is the one gag kept, plus a Biscuit cameo with no beat of its own).

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "someone hijacked two Chicago TV stations in one night" | A **Chicago skyline made of stacked CRT TVs** at night, two of the TV-skyscrapers flicker to magenta static | Two Chicago stations hijacked | Fast push into the two flickering towers, kick on "hijacked" | Gloom on a rooftop at the side | **HIJACKED** (red) | NOV 22 1987 |
| 2 | "never been caught" | An empty **police line-up wall** in the sky, height marks, no one standing there | Never caught | Hold creep, hard cut | none | **NEVER CAUGHT** (red) | |
| 3 | "9:14 p.m. A sports report. Then the screen goes black" | A **giant living-room CRT standing in a stadium**, showing a cartoon sports desk; it cuts to black and the stadium lights die one by one | The sports report going black | Push to the TV, hard cut to black on "black" | **Moth gag**: on the couch in the stands, "Is it supposed to do that?" | **BLACK** (red) | 9:14 PM, 15 S |
| 4 | "a figure in a Max Headroom mask and sunglasses, swaying in front of a moving metal panel" | Inside the TV: a **corridor of corrugated metal panels sliding like waves**; a figure in a Max Headroom-style mask and sunglasses sways (the story names it, so it can look like the real thing) | The masked figure and the metal panel | Slow push down the corridor, sway the roll 4 degrees with him | none | THE **MASK** (red) | |
| 5 | "No voice. Just a buzz." | A **giant speaker cone** buzzing, sand on it dancing into patterns | No voice, only a buzz | Kick on "buzz", vibrate | none | JUST A **BUZZ** (yellow) | |
| 6 | "Engineers changed the studio link frequency and it stopped" | A **control room as big as a cathedral**, an engineer silhouette pulls a lever the size of a tree; the dial spins | Engineers changing the frequency | Push to the lever, kick on "stopped" | none | **STOPPED** (yellow) | |
| 7 | "'if you're wondering what's happened, so am I'" | The **sports desk alone on a floating stage**, a single spotlight, a shrugging silhouette | The anchor's line | Push in slow | Biscuit cameo: asleep on the desk | "**SO AM I**" (yellow) | |
| 8 | "Two hours later, a public TV channel. With sound, 90 seconds" | A **clock tower** spins from 9:14 to 11:20; then a second TV-building glows magenta and a **90-second hourglass** pours | The second hijack, 90 seconds | Glide up the tower, cut to the hourglass | none | **90** SECONDS (yellow) | 11:20 PM, 90 |
| 9 | "Nobody on duty could stop it." | A night-shift office with an **empty chair spinning slowly**, phones ringing, coffee steaming | Nobody on duty could stop it | Push past the chair | Gloom picks up a ringing phone, shrugs | **NOBODY** COULD STOP IT (red) | |
| 10 | "A stronger microwave signal, aimed at the tower, overrode the real one" | Two **broadcast towers on cliffs**; a thin real beam between them, then a **fat magenta beam** from a hidden dish on a third cliff blasts over it | A stronger signal overriding the real one | Glide along the beams, kick on "overrode" | Gloom on the third cliff, pointing at the hidden dish | **STRONGER** SIGNAL (yellow) | |
| 11 | "FCC investigated. No culprit. Time limit ran out in 1992." | A **case file the size of a house**, pages flapping; a stamp slams NO CULPRIT; an hourglass runs out with 1992 on it | The FCC case, no culprit, 1992 | Push, kick on the stamp | Gloom holding the empty magnifier | **1992** (yellow) | NO CULPRIT, 1992 |
| 12 | Close: "A masked figure ... And walked away." | Snowy Chicago street of TV-buildings; **footprints lead away** into the static; a mask lies in the snow | A masked figure walking away | Pull back wide, 1 s end hold | none | **WALKED AWAY** (red) | |

New props: CRT skyline, corrugated panel corridor, giant lever, hourglass, Max Headroom-style mask figure. Library: CRT TV, couch, skyline, radio mast, speaker, wall clock, folder, chair.

---

## EP 6: The Dancing Plague of 1518 (informational)
**Colour:** warm candle amber and woodcut brown, deep red at dusk. **Music:** "Village Consort" (period, early music) for shots 1-6, "Echoes of Time" (darker) from shot 7.

### Script (164 spoken words, about 57 s at the fast Joe pace)
- **Hook.** In July 1518, a woman in Strasbourg started dancing in the street. She didn't stop for days.
- **B1.** No music, say the accounts. Others joined. Within a week, dozens were dancing.
- **B2.** By August, estimates range from 50 to 400 people. The true figure is uncertain.
- **B3.** A physician's notes, sermons and city council records from the time confirm the dancing.
- **B4.** The council's first fix was more dancing. Guild halls were opened, and musicians were hired. It backfired.
- **B5.** So they banned public dancing and music, and sent the dancers to a shrine.
- **B6.** You'll often hear that up to 15 people died a day. But Strasbourg records from the time don't mention deaths. That claim comes later.
- **B7.** One theory is poisoning from mouldy grain, called ergot. One historian rejects it, because poisoned people couldn't dance for days. The most popular view is a mass illness brought on by stress.
- **Close.** In early September, it faded. Nobody knows why it began.

**Cut for length:** "religious belief" as a third theory (the visual still nods to it with the shrine). Nothing else cut; this one was already close to length.

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "a woman in Strasbourg started dancing in the street" | A **woodcut-style Strasbourg street rising like a staircase into the sky**, the cathedral spire huge in the back; one small figure dancing alone on the cobbles | A woman dancing in a Strasbourg street | Fast push down the street to her, kick on "dancing" | Gloom in a doorway at the side | **DANCING** (yellow) | JULY 1518 |
| 2 | "She didn't stop for days." | The same spot as **suns and moons race overhead**, her shadow spins around her like a clock hand | For days | Locked wide that creeps in, sky time-lapse | none | **FOR DAYS** (red) | |
| 3 | "There was no music" | A **row of instruments floating, all silent**, strings cut, a lute with no strings | No music | Glide past the silent instruments | none | **NO MUSIC** (red) | |
| 4 | "Others joined. Within a week, dozens." | The street **fills with dancers in a growing ring**, the ring spreads out over the rooftops | Others join, dozens | Crane up as the ring grows | none | **DOZENS** (yellow) | |
| 5 | "By August, 50 to 400 people. Uncertain." | A **huge abacus bridge over the river**, beads sliding from 50 toward 400 and wobbling back, never settling | 50 to 400, uncertain | Track along the abacus | Gloom pushing a bead, unsure | **50 TO 400** (yellow) | 50, 400 |
| 6 | "A physician's notes, sermons and council records ... confirm" | **Three giant documents standing like tombstone monoliths** in a candlelit field: a medical notebook, a sermon page, a council ledger with a wax seal | The three kinds of records from the time | Glide past each, push on the seal | Gloom reading the ledger with his flashlight | **RECORDS CONFIRM** (yellow) | 1518 |
| 7 | "first fix was more dancing. Guild halls, musicians. It backfired." | A **guild hall as big as a mountain**, doors thrown open, musicians on the steps; dancers pour in, then the hall **bursts at the seams** with more | The council's 'more dancing' plan backfiring | Push into the doors, kick on "backfired" | none | **BACKFIRED** (red) | |
| 8 | "banned public dancing and music, sent the dancers to a shrine" | A **ban notice nailed to a giant door**, the music stops; a road of candles leads up a hill to a small mountain shrine, figures walking up it | The ban and the shrine | Push to the notice, then crane up the road | none | **BANNED** (red) | BANNED |
| 9 | "up to 15 people died a day. But records from the time don't mention deaths." | The **council ledger as a vast open book-landscape**; one page has a blank gap, a feather pen hovering over it, writing nothing (no figure on screen, no bodies, no number) | No deaths in the records from the time | Push to the blank, slow | Gloom at the gap's edge, looking in | **NOT IN THE RECORDS** (mint) | |
| 10 | "That claim comes later." | Later books stack up on top of the ledger like **storeys of a tower**, each a different century's binding | The death claims come later | Crane up the tower | none | **LATER ACCOUNTS** (mint) | |
| 11 | "mouldy grain, called ergot. One historian rejects it" | A **field of giant wheat with dark ergot spurs**; a red X stamps over it | The ergot theory, rejected by one historian | Glide through the wheat, kick on the stamp | none | **ERGOT?** (mint) | |
| 12 | "most popular view: mass illness brought on by stress" | A **storm cloud shaped like a fist** over the town, dark threads drop from it to the dancers | Stress-induced mass illness | Push from cloud down to the dancers | Gloom under the cloud | **STRESS** (yellow) | |
| 13 | Close: "In early September, it faded. Nobody knows why it began." | The street at dawn, **empty, autumn leaves** drifting, one shoe left on the cobbles | It faded in September | Pull back to wide, 1 s end hold | Gloom walks off | **NOBODY KNOWS WHY** (red) | SEPTEMBER |

New props: woodcut street, silent instruments, abacus bridge, document monoliths, guild hall, wheat field with ergot, storm fist cloud. Library: dancer, timber house, cobbles, notice card, open book, pen.

---

## EP 7: The Voynich Manuscript (informational)
**Colour:** parchment gold and leaf green, night blue for the star charts. **Music:** "Teller of the Tales" (warm, old) for shots 1-8, "Mesmerize" (strange, hypnotic) from shot 9. Illustrations are redrawn originals, never copies of pages.

### Script (151 spoken words, about 53 s at the fast Joe pace)
- **Hook.** There's a book with about 240 pages that nobody on Earth can read.
- **B1.** It's the Voynich manuscript, named for the book dealer who bought it in 1912. Today it's at Yale's Beinecke Library.
- **B2.** Open it and it's full of drawings. Plants nobody can match to real ones. Circular charts of stars. Tiny figures bathing in green pools joined by pipes.
- **B3.** Around them, about 38,000 words in an unknown alphabet of roughly 20 to 25 main characters.
- **B4.** So how old is it? Carbon dating in 2009 put the parchment between 1404 and 1438. That dates the material, not the writing.
- **B5.** And the writing behaves like a language. Word frequencies follow the same pattern as real languages. But words repeat oddly, and the structure is unusually predictable.
- **B6.** Codebreakers from both world wars tried. Cipher, unknown language, invented language, hoax: none of the proposed solutions is accepted.
- **Close.** It might say something. It might say nothing. Nobody has proved which.

**Cut for length:** the 8,000 to 9,000 unique-word count.

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "a book with about 240 pages" | A **closed book the size of a cathedral** on a hill at sunset, pages fanning open in the wind | The 240-page book | Fast push to the spine, kick on "240" | Gloom tiny at its foot | **240 PAGES** (yellow) | 240 |
| 2 | "that nobody on Earth can read" | Earth as a **small globe on a reading stand**, a pair of giant reading glasses over it, the text through the lenses still unreadable glyphs | Nobody can read it | Push through the lenses | none | **NOBODY** CAN READ IT (red) | |
| 3 | "named for the book dealer who bought it in 1912" | A **1912 bookshop as a cosy island**, a price tag on the book, a bell over the door rings | The 1912 book dealer | Push into the shop window | none | **1912** (yellow) | 1912 |
| 4 | "Today it's at Yale's Beinecke Library" | A **library building made of glowing marble panels** floating in clouds, the book in a glass case at the centre | Where it is now: Yale | Glide up to the case | Gloom outside the glass, peering in | **YALE** (yellow) | BEINECKE LIBRARY |
| 5 | "Plants nobody can match to real ones" | A **garden of impossible plants** (redrawn originals), each with a blank botanist's label | Plants with no real match | Glide through the garden | Gloom holding a field guide, flipping, no match | **NO MATCH** (red) | |
| 6 | "Circular charts of stars" | A **planetarium dome**, a spinning ring chart of stars overhead | Circular star charts | Spin the roll slowly with the chart | none | **STAR CHARTS** (yellow) | |
| 7 | "Tiny figures bathing in green pools joined by pipes" | **Green pools on terraces joined by brass pipes** like a water park, tiny figures in them (clothed, cartoon, original) | Figures in green pools joined by pipes | Glide down the pipes | none | **GREEN POOLS** (mint) | |
| 8 | "about 38,000 words in an unknown alphabet" | **A canyon wall carved with glyphs**, a counter rolling to 38,000 in the sky | 38,000 words in an unknown alphabet | Crane down the wall, kick when the counter lands | Gloom with a lantern at the base | **38,000** WORDS (yellow) | 38,000 |
| 9 | "So how old is it? Carbon dating ... 1404 to 1438. Dates the material, not the writing" | A **parchment sheet as a desert floor**, a giant ruler-slider across it with a glowing window from 1404 to 1438; the ink on top stays dark and undated | Parchment date, not the writing | Track along the slider, push on the gap | Gloom measuring with a tape | **1404 TO 1438** (yellow) | 1404, 1438 |
| 10 | "behaves like a language. Frequencies follow the pattern" | **Two mountain ranges side by side**, one labelled English, one made of glyphs, with the same skyline shape | Frequencies match real languages | Glide between them | none | LIKE A **LANGUAGE** (mint) | |
| 11 | "words repeat oddly, structure unusually predictable" | A **tiled path where the same three glyph tiles repeat** into the distance | Odd repetition and predictability | Fast forward track | none | **ODD** (red) | |
| 12 | "Codebreakers from both world wars tried" | **A WWI field desk and a WWII code machine** on two floating rocks, both covered in dust | Both world wars' codebreakers | Push past both | none | **BOTH WORLD WARS** (yellow) | |
| 13 | "Cipher, unknown language, invented language, hoax: none accepted" | **Four doors in a row on a cliff**, each with a key in it; each key turns and snaps | The four theories, none accepted | Glide past, kick on each snap | Gloom trying the last key | **NONE ACCEPTED** (mint) | |
| 14 | Close: "It might say something. It might say nothing." | The giant book on the hill closes, the sunset fades | Something or nothing, unproved | Pull back, 1 s end hold | Gloom walks off with his lantern | **NOBODY HAS PROVED** IT (red) | |

New props: giant book, reading glasses, glass case, impossible plants, star ring chart, pool terraces with pipes, glyph wall, keys and doors, code machine. Library: book, open book, curve chart, desk, lamp.

---

## EP 8: Polybius (funny)
**Colour:** neon purple and arcade green on black. **Music:** "8bit Dungeon Level" (arcade) for shots 1-5, "Spy Glass" (sneaky, investigative) from shot 6.

### Script (166 spoken words, about 58 s at the fast Joe pace)
- **Hook.** The most dangerous arcade game ever made. There's no proof it ever existed.
- **B1.** The story goes: 1981, Portland, Oregon. A black cabinet appears in arcades. Kids line up to play.
- *(Moth: "It sounds fun.")*
- **B2.** Then come the claims. Seizures, amnesia, nightmares. Men in black collect data from the machines. Then the machines vanish.
- **B3.** So where's the evidence? The earliest web mention is a gaming-site entry, dated 1998 on the page but showing 2000 in archives. The first print mention is a magazine in 2003.
- **B4.** No cabinet. No chip. No 1980s article. No record of the company in the legend.
- **B5.** But some of it did happen. In 1981, two players got sick at one Portland arcade. Ten days later, the FBI raided Portland arcades. The target was illegal gambling machines. *(Biscuit knocks a coin off the table.)*
- **B6.** A writer at Inverse called it "almost certainly invented". Games called Polybius exist now, but they were made later.
- **Close.** The cabinet never existed. The legend is doing very well.

**Cut for length:** "German-sounding" company name detail, the month of the magazine (September, kept as in-scene text "SEP 2003").

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "The most dangerous arcade game ever made" | A **black arcade cabinet as tall as a skyscraper** in a neon desert, its screen pulsing purple | The 'most dangerous' cabinet | Fast push up its face, kick on "dangerous" | Gloom tiny at its base | **MOST DANGEROUS** (red) | |
| 2 | "no proof it ever existed" | The cabinet **flickers like a hologram**, wireframe, then gone; a dust outline on the ground | No proof it existed | Hold creep, hard cut on "existed" | none | **NO PROOF** (red) | |
| 3 | "1981, Portland. A black cabinet. Kids line up." | A **1981 arcade on a rainy Portland street island**, a queue of kid silhouettes snakes around the block to one black cabinet | Portland 1981, kids queueing | Glide along the queue | **Moth gag**: in the queue, "It sounds fun." | **PORTLAND 1981** (yellow) | 1981 |
| 4 | "Seizures, amnesia, nightmares" | Inside the cabinet's screen: **a spiral tunnel**, three words float by as neon signs | The claimed effects | Fly down the spiral, kick on each word | none | **NIGHTMARES** (red) | |
| 5 | "Men in black collect data. Machines vanish." | **Men-in-black silhouettes with clipboards** on a dark loading dock; cabinets are wheeled into a fog bank and gone | Men in black, machines vanishing | Push, cut on "vanish" | none | **MEN IN BLACK** (mint) | |
| 6 | "earliest web mention ... 1998 on the page, 2000 in archives" | A **library of old computer monitors stacked like a cliff**, one glows with a page dated 1998, an archive stamp slams 2000 beside it | The first web mention and its two dates | Crane up the cliff, kick on the stamp | Gloom on a ladder, flashlight on the screen | **1998? 2000?** (yellow) | 1998, 2000 |
| 7 | "first print mention ... 2003" | A **magazine as big as a billboard** flaps open in the wind on a hill | The first print mention | Push to the cover | none | **FIRST PRINT** (yellow) | SEP 2003 |
| 8 | "No cabinet. No chip. No 1980s article. No record of the company." | **Four empty museum plinths** under spotlights, each with a label and nothing on it | No cabinet, chip, article or company | Glide past, small push on each | Gloom looking under the last plinth | **NOTHING** (red) | |
| 9 | "two players got sick at one Portland arcade" | Back in the 1981 arcade: **two players on a bench** holding their stomachs, a first-aid kit (no gore) | The real sick players | Push in | none | **REAL** (yellow) | 1981 |
| 10 | "Ten days later, the FBI raided Portland arcades. Gambling machines." | **FBI-jacket silhouettes** wheel out cabinets showing cherries and coins; a 10-day calendar flips | The real FBI raid on gambling machines | Glide along the raid, kick on "raided" | **Biscuit gag**: on a stool, knocks a coin off the table | **FBI RAID** (yellow) | 10 DAYS |
| 11 | "Inverse: almost certainly invented. Games called Polybius exist now, made later" | A **newspaper page as a floor** with the quote; modern game boxes on a shelf, each with a "made later" date tag | Inverse's verdict and the later games | Push across the page, then glide the shelf | none | **ALMOST CERTAINLY INVENTED** (mint) | INVERSE |
| 12 | Close: "never existed. The legend is doing very well." | The dust outline from shot 2, now surrounded by a **crowd of glowing screens** each showing the cabinet | The legend outliving the cabinet | Pull back wide, 1 s end hold | Gloom deadpan in the crowd | **LEGEND WINS** (yellow) | |

New props: giant cabinet, spiral tunnel, loading dock and fog, monitor cliff, museum plinths, gambling cabinets, game box shelf. Library: arcade cabinet, magazine, silhouettes (men in black), calendar page, stool.

---

## EP 9: The Bloop (funny)
**Colour:** abyss blue and bioluminescent teal, icy white at the end. **Music:** "Atlantean Twilight" (deep, mysterious) for shots 1-7, "Ice Flow" (cool, light) from shot 8.

### Script (148 spoken words, about 52 s at the fast Joe pace)
- **Hook.** In 1997, ocean microphones caught a sound too powerful for any animal on Earth. It took eight years to find out what made it.
- **B1.** A US science agency, NOAA, was listening with underwater microphones, mainly for volcanoes.
- **B2.** It picked up an ultra-low rumble, rising in pitch for about a minute. Sensors thousands of kilometres apart heard it. They traced it to the South Pacific. *(Moth hides.)*
- **B3.** They named it the Bloop. It looked a bit like an animal's call. The internet guessed a giant creature, a secret test, a submarine.
- **B4.** NOAA's researchers ruled out anything man-made early on. One suspected ice.
- **B5.** So the microphones moved closer to Antarctica. In 2005, they found the source. An icequake. An iceberg cracking and breaking away.
- **B6.** Later, similar sounds were recorded from icebergs breaking up near South Georgia.
- **Close.** No monster. Just ice. Gloom: "A bit disappointing. Mostly." *(Biscuit, relieved.)*

**Cut for length:** nothing factual. "Loud enough that scientists wondered what could make it" was folded into the hook.

### Shots
| # | Line | What's shown | Why it's relevant | Camera | Cast | Caption | In-scene text |
|---|---|---|---|---|---|---|---|
| 1 | "ocean microphones caught a sound too powerful for any animal" | Deep ocean: a **single hydrophone on a cable**; a huge sound ring blasts out of the dark and knocks it sideways | A sound too powerful for an animal | Fast push down the cable, kick on "powerful" | none | **TOO POWERFUL** (red) | 1997 |
| 2 | "It took eight years to find out what made it" | A **sea floor of calendars**, eight of them flipping in a current | Eight years to solve | Glide over, push on the eighth | Gloom in a diving helmet at the side | **8 YEARS** (yellow) | 8 |
| 3 | "NOAA, listening ... mainly for volcanoes" | An **underwater volcano range glowing orange**, hydrophone buoys hanging in the water above like lanterns | NOAA listening for volcanoes | Crane down past the buoys to the volcano | none | **VOLCANOES** (yellow) | NOAA |
| 4 | "ultra-low rumble, rising in pitch for about a minute" | A **spectrogram as a glowing ramp** rising out of the sea floor like a ski jump | The rising rumble | Track up the ramp | none | **RISING** (yellow) | |
| 5 | "Sensors thousands of kilometres apart heard it" | A **map of the Pacific as a seabed**, buoys light up one after another, glowing lines between them stretch across the ocean | Sensors thousands of km apart | Fast whip-glide across the map | **Moth gag**: hiding behind a buoy | **THOUSANDS OF KM** (yellow) | |
| 6 | "traced it to the South Pacific" | The lines cross at one point; a **giant red pin** drops into the deep, kick of sand | Traced to the South Pacific | Push down to the pin, kick on "traced" | none | **SOUTH PACIFIC** (yellow) | |
| 7 | "named it the Bloop. Like an animal's call. Giant creature, secret test, submarine." | A **giant sea-monster silhouette** rises in the dark, then turns into a **submarine**, then a **test bunker**, like shadow puppets | The Bloop and the internet's guesses | Push in, cut on each shape | Gloom holding a lantern, unimpressed | **THE BLOOP** (red) | |
| 8 | "ruled out anything man-made. One suspected ice." | The submarine and bunker get **stamped with an X**; a single **ice crystal** floats into the beam | Man-made ruled out, ice suspected | Kick on the stamp, then a slow push to the crystal | none | **ICE?** (mint) | |
| 9 | "the microphones moved closer to Antarctica" | Buoys **swim south like a school of fish** toward a wall of white; the water turns pale blue | Microphones moved toward Antarctica | Glide with the buoys | none | **ANTARCTICA** (yellow) | |
| 10 | "In 2005, they found the source. An icequake." | An **ice shelf as tall as a city**; it cracks top to bottom with a huge sound ring | 2005: the icequake | Low hero angle, big kick on "icequake" | none | **ICEQUAKE** (yellow) | 2005 |
| 11 | "An iceberg cracking and breaking away" | The **iceberg breaks off** and slides into the sea, a slow wave rolls toward camera | The iceberg breaking away | Pull back as the wave comes | none | **BREAKING AWAY** (yellow) | |
| 12 | "similar sounds ... icebergs breaking up near South Georgia" | A **chain of icebergs floating past a jagged green island**, each one cracking with a smaller sound ring | Similar sounds near South Georgia | Glide along the chain | none | **SOUTH GEORGIA** (yellow) | |
| 13 | Close: "No monster. Just ice. A bit disappointing. Mostly." | Calm sea surface at dawn, a small iceberg floats by | Just ice | Wide, 1 s end hold | Gloom on the iceberg, deadpan; **Biscuit** beside him, relieved | **JUST ICE** (yellow) | |

New props: hydrophone on cable, sound ring, calendar seabed, underwater volcano, spectrogram ramp, giant pin, shadow-puppet shapes, ice shelf. Library: ocean, iceberg, buoy, spectrogram, monster silhouette.

---

## What I need from you
Per episode: **OK** (it goes to stills), or edits (lines, facts to bring back, shots to change). Any fact listed as cut can come back if you say so; each one costs about 3 s.
