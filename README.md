# INKBREAK — Browser FPS Build

INKBREAK is a desktop-first Three.js FPS rendered like a living notebook drawn in blue ballpoint pen. This build merges the arena roguelite loop, movement systems, weapon progression, enemy reactions, dynamic page geometry, environmental interactions, boss encounter, and three Story chapters.

## Run locally

Serve the folder over HTTP because the game uses ES modules:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a desktop browser. The project can also be deployed as a static site to Vercel.

## Controls

- WASD — move
- Mouse — look
- Hold LMB — fire / knife attack
- Tap RMB — reload
- Hold RMB — ADS; Ruler Rifle gets a magnified scope
- Shift — sprint
- Ctrl / C — crouch; press while sprinting to slide
- Q — directional dash
- Space — jump / slide-jump
- 0–6 — weapon slots
- E — read Story field notes / interact
- Esc — pause

## Directional awareness

The HUD now uses small hand-drawn edge chevrons instead of permanent enemy markers. Objective markers can point from off-screen, while enemy hints appear only for nearby threats or contacts that recently fired. Quiet, distant enemies stay hidden so searching the environment still matters.

## Arena Mode

Arena Mode uses varied objectives rather than only kill-all rounds. Objective types include ERASE, HOLD THE LINE, RELAY, MARKED, INK RUN, BREAKOUT, and NO MARGIN. Completing objectives and kills award Ink.

Between rounds, the game pauses on a taped notebook sheet and offers three randomly drawn upgrades. Upgrades cost Ink and stack for the duration of the run. The pool includes damage, reload, movement, survivability, headshot, fire-rate, knife execution, dash, slide, Ruler penetration, Marker splash, shotgun ricochet, pistol cube burst, SMG ramp-up, last-round damage, crouched sniper stealth, cube shock, stamina, dash cooldown, sprint efficiency, low-health damage, and ammo-refund mutations.

Enemy types cooperate more deliberately: heavies anchor pressure, riflemen support them, flankers take side angles, rushers become more aggressive under sniper cover, and Correctors use cleaner tactical positioning in Story Mode.

The Sketchyard sniper nest now uses a dedicated walkable stair surface. The visible paper steps remain, but the player no longer collides with invisible overlapping stair risers while climbing.

## Interactive environment

The living page is part of combat:

- explosive Ink canisters
- breakable paper walls
- Ink puddles that boost player movement and slow enemies
- folded-paper launch ramps
- Eraser zones that temporarily remove and redraw cover
- Story bridges and barriers that physically draw themselves into the level

## Knife / CROSSOUT

Weapon slot 0 is the Ink Knife. Enemies below 25% health can be executed with a close-range CROSSOUT. Executions restore health, stamina, a little ammunition, award Ink, and give a short movement burst. Upgrades can strengthen the reward.

## Story Mode

The current story is structured as three connected chapters with full-screen taped-paper dialogue, checkpoints, environmental notes, exploration, choices, combat encounters, and scripted redraw events. Chapters now flow directly into the next unlocked chapter, so a first playthrough is designed to provide roughly 10–15+ minutes of varied continuous story gameplay rather than a single short combat corridor.

### Chapter Zero — The Margin
Wake in Margin District, follow Mara's signal, fight Copies, investigate a relay, hear the unknown voice call you a “borrowed line,” survive the ambush, and escape.

### Chapter One — Wrong Page
Enter a half-finished city with roads and architecture that fail to resolve. The chapter adds environmental writing, a Mara/relay choice, a bridge-redraw set piece, the cleaner CORRECTOR faction, and evidence that The Artist may have been repairing the page rather than destroying it.

### Chapter Two — Corrections
Enter the Correction Archive, clear an intake patrol, inspect records about Borrowed Lines and Mara, defend the Ink Press during a timed multi-wave encounter, outrun the Archive as it redraws behind you, and face the PROOFREADER mini-boss. The chapter pushes the central mystery further: Mara appears on several pages at once, while the Archive cannot identify the player's original owner or page.

Chapter progress is stored in `localStorage`, and the main menu includes Chapter Select. Chapters unlock sequentially.

## Current weapon set

0. Ink Knife
1. Sketch Carbine
2. Pencil Pistol
3. Cross-Out Shotgun
4. Scribble SMG
5. Ruler Rifle
6. Marker Heavy

Every firearm has its own silhouette, ammo pool, recoil profile, fire cadence, ADS position, and role. The Ruler Rifle has the full scope treatment.

## Notes

- Desktop-first. Mobile devices receive an INKBREAK-themed “play on a bigger screen” notice while touch controls are still in development.
- Three.js is loaded from jsDelivr in the current static build.
- Audio is generated procedurally through Web Audio, so no external sound files are required.
