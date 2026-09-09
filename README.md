# SKETCH//FIRE — Arena + Story Prototype

A browser-based 3D FPS made with HTML, CSS, JavaScript and Three.js. The world, weapons, enemies and effects are presented like blue ballpoint drawings on off-white notebook paper.

## Run

Serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main menu

The main menu now has two playable modes:

- **Arena Mode** — the existing five-round Living Page progression in Sketchyard XL.
- **Story Mode // Prologue** — a short Chapter Zero prototype on a separate map, **The Margin District**, with radio dialogue, navigation objectives, a small combat encounter and extraction.
- **Controls** — complete input reference.
- **Settings** — mouse sensitivity, base FOV and master volume.

`Esc` during either mode opens the pause menu. Restarting preserves the currently selected mode; Main Menu returns to mode selection.

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
- `Esc` — pause / release pointer lock

The RMB control remains hybrid: a quick tap reloads, while holding it enters ADS.

## ADS / scope fix

The Ruler Rifle keeps its clean full-screen scope, with the 3D rifle removed from the fully scoped sight picture.

Every other weapon now uses a dedicated **focus sight** when holding RMB:

- the normal crosshair disappears
- a hand-drawn iron/focus reticle appears at screen center
- the weapon is lowered and shifted away from the center on a per-weapon basis
- the SMG, Marker Heavy, shotgun, carbine and pistol no longer cover the aiming point
- aiming still reduces weapon spread and uses each weapon's own ADS FOV

## Platform / jumping fix

The movement controller now treats collider tops as real walkable surfaces instead of pretending every box extends to the heavens.

New behavior:

- falling onto a box/platform lands on its top surface
- jumping over low cover lets the player land on it
- walking off a raised platform correctly transitions into a fall
- small height changes can be stepped up automatically
- ceiling collision prevents jumping through the underside of geometry
- crouch/slide collider height continues to work on raised surfaces

### Sniper Nest

Sketchyard XL now contains a high **Sniper Nest** near the left side of the arena:

- elevated deck around 4.45m above the floor
- eight physical stair steps leading up to it
- low sketch railings
- long sightlines over the arena
- useful position for the Ruler Rifle and sniper testing

## Story Mode // Chapter Zero: The Margin

This is intentionally a short campaign prototype, not a full story campaign yet.

The story map is physically separate from Sketchyard XL and has a tighter street/corridor layout made from tall paper buildings and a checkpoint gate.

Current sequence:

1. Spawn in the **Margin District**.
2. Receive radio dialogue from **Mara**.
3. Follow a drawn signal marker down the street.
4. Reach the signal and trigger a two-enemy contact.
5. Eliminate both figures.
6. Follow a second marker to extraction.
7. Receive the Chapter Zero ending dialogue and return to the main menu.

The story HUD includes a current objective and radio dialogue panel. Death during the combat section respawns the player at a nearby story checkpoint rather than back in Sketchyard XL.

## Arena match structure

Arena Mode is divided into five escalating rounds with capped simultaneous enemy pressure.

### Round 1 — First Marks
Basic Riflemen and the original arena layout.

### Round 2 — Close the Gap
Rushers arrive and low barricades are drawn into the arena.

### Round 3 — Long Lines
Snipers arrive and new cover breaks open sightlines.

### Round 4 — Bad Ideas in Blue Ink
Heavies and Flankers enter while diagonal cover changes the center lanes.

### Round 5 — The Final Drawing
Clear a mixed wave, then face **The Artist** alone through three phases and multiple arena redraws.

After Round 5, the next Page begins with gentle enemy health/damage scaling while unlocked weapons remain available.

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

### Arena
Move → fight → unlock weapons → survive escalating rounds → use changing cover → fight The Artist → advance to the next Page.

### Story prototype
Explore → receive dialogue → follow a marker → survive a scripted encounter → extract → complete Chapter Zero.

The larger unfinished systems remain objectives for Arena Mode, Ink currency, draw-your-upgrades, a longer story campaign, more story-specific AI encounters, and additional maps.

## UI polish pass
- Main, pause, controls, and settings sheets now use visible masking-tape strips.
- Bottom HUD regions have been separated to prevent weapon/control text overlap.
- The idle `DASH READY` badge has been removed; movement status appears only when crouching, sliding, dashing, or aiming.
- Mobile/coarse-pointer devices now receive a themed full-screen notice directing players to a laptop/desktop; mobile controls are marked as coming soon.
