# INKBREAK — Browser FPS Build

INKBREAK is a Three.js FPS rendered like a living notebook drawn in blue ballpoint pen. This build contains the arena roguelite loop, movement systems, weapon progression, enemy reactions, dynamic page geometry, environmental interactions, boss encounter, three Story chapters, and a responsive landscape mobile control layer.

## Run locally

Serve the folder over HTTP because the game uses ES modules:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. The project can also be deployed as a static site to Vercel.

## Desktop controls

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

## Mobile controls

The mobile build is designed for landscape orientation and uses a reduced, touch-first HUD.

- Left virtual joystick — analogue movement with a radial deadzone
- Push the joystick fully forward — automatic sprint
- Drag anywhere on clear gameplay space (outside controls) — smooth camera look
- FIRE — hold to continuously fire / repeatedly use the knife
- AIM — tap to toggle ADS; the Ruler Rifle switches into its scope
- RELOAD — dedicated reload button
- CROUCH — tap to toggle crouch; tap while sprinting to slide
- DASH — directional dash based on the current joystick direction
- JUMP — jump / slide-jump
- WEAPON — cycles through currently unlocked weapons
- USE — Story notes and interactions
- II — pause

The installed PWA requests landscape orientation through the manifest. Browser pages cannot universally force rotation, especially iOS Safari, so portrait orientation shows an INKBREAK-themed `ROTATE THE PAGE` screen until the device is turned sideways. Gameplay input does not wait on fullscreen/orientation APIs.

## Mobile HUD

The landscape HUD intentionally removes desktop-only clutter. The touch layout was rebuilt around independent multi-touch pointers so movement, camera look, FIRE and action buttons can be used simultaneously without stealing one another's gestures. Health, stamina and ammunition stay compact in the upper-left, the active objective remains near the top center, and the middle of the screen stays open for aiming. The full desktop weapon rack, coordinates and keyboard hint strip are hidden on touch devices.

## Directional awareness

The HUD uses small hand-drawn edge chevrons instead of permanent enemy markers. Objective markers can point from off-screen, while enemy hints appear only for nearby threats or contacts that recently fired. Quiet, distant enemies stay hidden so searching the environment still matters.

## Arena Mode

Arena Mode uses varied objectives rather than only kill-all rounds. Objective types include ERASE, HOLD THE LINE, RELAY, MARKED, INK RUN, BREAKOUT, and NO MARGIN. Completing objectives and kills award Ink.

Between rounds, the game pauses on a taped notebook sheet and offers three randomly drawn upgrades. Upgrades cost Ink and stack for the duration of the run. The pool includes damage, reload, movement, survivability, headshot, fire-rate, knife execution, dash, slide, Ruler penetration, Marker splash, shotgun ricochet, pistol cube burst, SMG ramp-up, last-round damage, crouched sniper stealth, cube shock, stamina, dash cooldown, sprint efficiency, low-health damage, and ammo-refund mutations.

Enemy types cooperate more deliberately: heavies anchor pressure, riflemen support them, flankers take side angles, rushers become more aggressive under sniper cover, and Correctors use cleaner tactical positioning in Story Mode.

The Sketchyard sniper nest uses a dedicated walkable stair surface. The visible paper steps remain, while traversal uses a stable stepped height field.

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

The current story is structured as three connected chapters with full-screen taped-paper dialogue, checkpoints, environmental notes, exploration, choices, combat encounters, and scripted redraw events. Chapters flow directly into the next unlocked chapter, so a first playthrough is designed to provide roughly 10–15+ minutes of varied continuous story gameplay.

### Chapter Zero — The Margin
Wake in Margin District, follow Mara's signal, fight Copies, investigate a relay, hear the unknown voice call you a “borrowed line,” survive the ambush, and escape.

### Chapter One — Wrong Page
Enter a half-finished city with roads and architecture that fail to resolve. The chapter adds environmental writing, a Mara/relay choice, a bridge-redraw set piece, the cleaner CORRECTOR faction, and evidence that The Artist may have been repairing the page rather than destroying it.

### Chapter Two — Corrections
Enter the Correction Archive, clear an intake patrol, inspect records about Borrowed Lines and Mara, defend the Ink Press during a timed multi-wave encounter, outrun the Archive as it redraws behind you, and face the PROOFREADER mini-boss.

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

- Desktop and landscape mobile play are supported by the same static build.
- Three.js is loaded from jsDelivr in the current static build.
- Audio is generated procedurally through Web Audio, so no external sound files are required.


## iOS / mobile install notes

- Includes PNG manifest icons at 192px and 512px plus Apple touch icons at 152px, 167px and 180px.
- Includes Apple standalone/status-bar metadata for Add to Home Screen on iPhone/iPad.
- The manifest requests landscape orientation; iOS Safari may still require the user to rotate manually, so the in-game rotate gate remains the fallback.
- Mobile joystick input is bound directly to the joystick and becomes active synchronously when gameplay starts; it does not wait for fullscreen/orientation APIs.

## Mobile input rebuild (2026-09-10)
- Mobile look input now binds directly to the WebGL canvas.
- Joystick, look, fire, and action buttons use one Pointer Events implementation.
- Removed competing Touch Events handlers and disabled the legacy invisible look overlay.
- Story-mode firing no longer depends on Arena round boot state.
- Added cache-busted asset URLs for mobile input revisions.

## Mobile input V6 reliability pass

The mobile input layer was rebuilt around a single document-level Touch Events router.
Each active finger receives one role for its lifetime: movement joystick, camera look,
fire, or one action button. Gameplay hit testing uses the controls' screen rectangles,
not DOM stacking, so transparent HUD layers cannot intercept look input. Pointer
capture and the previous competing look-overlay handlers were removed. The joystick
becomes active synchronously when a mobile match starts and does not wait on
fullscreen or orientation APIs.

## Performance / geometry optimization pass (2026-09-11)

This build now includes a browser-oriented performance manager designed to hold a 60 FPS target where the device has enough CPU/GPU headroom. It cannot guarantee 60 FPS on every browser/device, so `AUTO` adapts visual cost rather than letting frame time run away.

### Rendering

- Added **AUTO / Performance / Balanced / Quality** presets in Settings.
- AUTO classifies the device conservatively from available memory / CPU hints, watches frame-time EMA and long-frame ratio, then dynamically reduces render pixel ratio when necessary.
- Mobile pixel density is capped more aggressively than desktop to reduce GPU load, heat, and battery drain.
- The paper style uses unlit `MeshBasicMaterial`, so real-time shadows stay disabled by design.
- Static paper-box fills are **GPU-instanced per active map region**.
- Static sketch outlines and hatching are **merged into region-level line batches**, preserving the blue-pen look while dramatically reducing line draw calls.
- Three.js frustum culling remains enabled. Additional region visibility and sketch-detail LOD hide inactive Story/Arena regions and expensive ghost/hatching detail at lower quality levels.
- Press `F3` (or launch with `?perf`) to show FPS, frame time, pixel ratio, renderer draw calls/triangles, and active pooled FX counts.

### Frame pacing / effects

- Core movement, enemy simulation, cube debris, ink particles, and shell casings now step on a fixed 60 Hz simulation tick with a capped catch-up budget to avoid spiral-of-death spikes.
- Ink splatter, shell casings, enemy death cubes, bullet impacts, and enemy-shot tracers use bounded object pools instead of repeatedly allocating/discarding Three.js objects during combat.
- Procedural gunshot noise reuses one Web Audio noise buffer rather than allocating a fresh audio buffer for every event.
- A death-cube lifetime bug that could leave stale debris alive indefinitely was corrected.

### Map / collision / AI

- Gameplay collision uses simplified primitive `Box3` volumes instead of deriving physical collision from detailed/rotated sketch render meshes.
- A spatial hash broad phase means the player and AI query nearby colliders instead of scanning every collider in every movement test.
- Player penetration recovery attempts a small radial escape when dynamic geometry would otherwise leave the player embedded/stuck.
- AI movement uses the same collider grid as player physics and tries collision-aware lateral steering when its direct route is blocked.
- This vanilla Three.js project does **not** currently use a NavMesh. The shared primitive-collider grid is therefore the single source of truth for movement/pathing alignment. A real navigation grid/A* layer should be introduced if Story spaces become substantially more complex.

### Lazy scene construction / memory

- Story chapters are now constructed on demand when selected/reached instead of building every Story map at initial page load.
- INKBREAK currently has no external GLTF/texture/audio asset library to stream. When authored assets are introduced, use `THREE.LoadingManager` plus per-chapter resource ownership/disposal rather than blocking startup with one large bundle.

### Pickups

- **Health:** compact plus-shaped green medkit silhouette, red center emblem, green pulse ring, health badge, distinct rising pickup tone, green HUD notification.
- **Ammo:** wide amber ammunition-crate silhouette with raised cartridge rails, amber pulse ring, ammo badge, mechanical/noise pickup sound, amber HUD notification.
- Health/ammo badge art shares one generated canvas texture atlas to avoid separate texture bindings.
