# SKETCH//FIRE — Living Page Build

A browser-based 3D arena FPS made with HTML, CSS, JavaScript and Three.js. The arena, weapons, enemies and effects are presented like blue ballpoint drawings on off-white notebook paper.

## Run

Serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Controls

- `WASD` — move
- Mouse — look
- Hold `LMB` — automatic fire
- **Tap `RMB`** — reload
- **Hold `RMB`** — aim down sights
- Hold `RMB` with the **Ruler Rifle** — full magnified scope
- `Shift` — sprint
- `Ctrl` / `C` — crouch; use while sprinting to slide
- `Q` — directional dash
- `Space` — jump / momentum jump from a slide
- `1` to `6` — switch unlocked weapons
- `Esc` — release pointer lock / menu

The RMB control is intentionally hybrid: a quick click reloads, while holding it for a moment enters ADS. This preserves the requested RMB reload control while still giving the rifle a conventional scope mechanic.


## Main menu / pause flow

The build now opens on a dedicated main menu instead of immediately acting like the first pointer-lock screen is a finished UI.

- **Play** starts Page 1.
- **Controls** shows the full movement/combat layout.
- **Settings** exposes mouse sensitivity, base FOV and master volume.
- `Esc` during play opens a separate pause menu.
- The pause menu can resume, restart the run, open Controls/Settings, or return to the main menu.
- Restarting or returning to the main menu resets Page/Round progression, health, movement state, weapon unlocks and ammunition cleanly.

## Match structure

Each page is divided into five escalating rounds. Enemy pressure remains capped so the player is not attacked by the entire notebook at once.

There is now a short **redraw phase** before combat begins. The notebook physically draws or removes new cover, then the enemies enter.

### Round 1 — First Marks
Basic Riflemen and the original arena layout.

### Round 2 — Close the Gap
Rushers arrive. New low barricades are drawn into the spawn/mid lanes.

### Round 3 — Long Lines
Snipers arrive and sight lines change. Tall pieces of cover are drawn into open lanes so sniper fire can be broken deliberately.

### Round 4 — Bad Ideas in Blue Ink
Heavies and Flankers enter. Diagonal cross-lane cover changes how the center of the map flows.

### Round 5 — The Final Drawing
First clear a mixed enemy wave. The boss does **not** spawn on top of ordinary enemies. When the page is clear, **The Artist** is drawn into the arena alone.

After Round 5, the next Page begins with gentle enemy health/damage scaling while unlocked weapons remain available.

## The Artist boss

The former Page Guardian placeholder has been replaced by a full three-phase boss encounter.

### Phase I — First Stroke
- 920 base HP before Page scaling
- keeps medium/long distance
- fires multi-line ink volleys
- arena starts with a ring of drawn cover

### Phase II — Redraw
At roughly 66% HP:
- arena cover is erased and redrawn into a new layout
- The Artist becomes more aggressive
- fire cadence increases
- the player gets a brief protection window while the geometry changes

### Phase III — Cross-Out
At roughly 33% HP:
- the arena redraws again with fewer safe structures
- The Artist moves faster and attacks from changing angles
- ink volleys become wider and more frequent

The boss has a dedicated health/phase HUD and a unique larger silhouette with additional pen-like shoulder and crown pieces. Killing it produces the largest scribble/unravel effect in the game.

## Scope / ADS

All weapons can use a light ADS zoom by holding RMB.

The **Ruler Rifle** gets the full scope treatment:
- strong FOV magnification
- notebook-paper scope mask
- double hand-drawn optic ring
- blue-ink crosshair
- normal HUD crosshair hidden while scoped
- normal HUD elements fade behind the optic
- the 3D rifle viewmodel is removed from the fully scoped sight picture so its optic/barrel cannot overlap the reticle
- reduced shot spread while aiming

Standard ADS now uses per-weapon sight offsets. In particular, the SMG and Marker Heavy are positioned so their attachments / oversized barrel no longer sit over the center of the screen while aiming.

Tapping RMB instead of holding it still performs the existing reload action.

## Dynamic arena redraws

Rounds 2–5 now alter the playable arena. These are real collision structures rather than decorative lines. Old round structures are removed before the next layout is drawn.

The Artist can also redraw the arena during its phase changes, so the player cannot rely on one piece of cover for the entire boss fight.

## Procedural combat audio

No external audio assets are required. Web Audio generates the current MVP soundscape at runtime:

- distinct gunshot profiles for all six weapons
- enemy gunfire
- heavier boss/heavy shots
- magazine removal / insertion / charging sounds
- body, headshot and kill feedback
- paper-like footsteps
- crouched footsteps
- slide scrape
- dash swoosh
- health/ammo pickup tones
- round start/completion stingers
- arena redraw scratching
- boss phase stingers

This is intentionally an MVP sound system. Recorded/custom-designed samples can replace the procedural sounds later without changing the gameplay logic.

## Weapons

| Key | Weapon | Role | Availability |
| --- | --- | --- | --- |
| `1` | Sketch Carbine | automatic all-rounder | Start |
| `2` | Pencil Pistol | precision sidearm | Start |
| `3` | Cross-Out Shotgun | close-range multi-pellet damage | Round 2 |
| `4` | Scribble SMG | high fire rate / aggression | Round 3 |
| `5` | Ruler Rifle | precision / scoped anti-heavy weapon | Round 4 |
| `6` | Marker Heavy | slow heavy automatic damage | Round 5 |

## Current core loop

1. Enter the Page.
2. Watch the arena redraw for the incoming round.
3. Fight a deliberately limited number of simultaneous enemies.
4. Use sprint, crouch, slide and dash to reposition.
5. Switch weapons according to enemy type and range.
6. Recover health/ammunition between rounds.
7. Clear the Round 5 mixed wave.
8. Fight The Artist through three arena-changing phases.
9. Complete the Page and continue into a harder one.

The next major unfinished systems are objectives, Ink currency, between-round upgrades and a fuller long-term run/meta-progression layer.
