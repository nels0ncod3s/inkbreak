# SKETCH//FIRE — Main Browser Build

A browser-based 3D FPS made with HTML, CSS, JavaScript and Three.js. Everything is styled like blue ballpoint ink on off-white notebook paper.

## Run locally

Serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The same folder can be deployed as a static site to Vercel.

## Modes

### Arena Mode
Five escalating rounds in **Sketchyard XL**, with weapon unlocks, enemy classes, dynamic arena redraws and a Round 5 fight against **The Artist**.

### Story Mode // Chapter Zero
A separate map, **Margin District**, now with a short cinematic/narrative flow:

1. Wake-up animation with the world fading into view.
2. Full-screen conversation with Mara.
3. Follow the first signal mark.
4. Fight two copied Riflemen.
5. Full-screen post-fight dialogue.
6. Investigate the old relay.
7. Hear an unknown voice over the relay.
8. Survive a three-enemy ambush including a Rusher.
9. Reach extraction.
10. Finish Chapter Zero with a full-screen dialogue sting.

Full-screen story dialogue pauses player input. Press `Space` or `Enter` to advance each page.

## Controls

- `WASD` — move
- Mouse — look
- Hold `LMB` — fire / repeatedly slash with the knife
- Tap `RMB` — reload firearms
- Hold `RMB` — ADS
- Hold `RMB` with the **Ruler Rifle** — full scope
- `Shift` — sprint
- `Ctrl` / `C` — crouch; use while sprinting to slide
- `Q` — directional dash
- `Space` — jump / slide jump / advance Story dialogue
- `0` — Ink Knife
- `1` to `6` — firearms
- `Esc` — pause / release pointer lock

## Weapon silhouettes

The weapon viewmodels are no longer one rifle scaled six different ways.

| Key | Weapon | Visual / gameplay identity |
| --- | --- | --- |
| `0` | Ink Knife | dedicated blade, guard, handle and hand; close-range melee |
| `1` | Sketch Carbine | original modular rifle silhouette |
| `2` | Pencil Pistol | dedicated short slide, frame, pistol grip and short barrel |
| `3` | Cross-Out Shotgun | long barrel/tube, pump and shotgun stock |
| `4` | Scribble SMG | compact receiver, short front end, straight magazine and foregrip |
| `5` | Ruler Rifle | long precision barrel, ruler rail and scope |
| `6` | Marker Heavy | thick marker-like cylindrical body and oversized muzzle |

The knife is unlocked from the start. Firearm progression remains tied to Arena rounds.

## Enemy death effect — cube breakup

Enemy deaths now physically break apart into **paper/ink cube chunks**:

- chunks originate around the enemy's actual body parts
- headshots create a more violent breakup
- cubes burst outward with gravity and angular spin
- chunks bounce and skid across the paper floor
- blue sketch outlines remain around each fragment
- fragments fade and shrink away after settling
- Heavies, Guardians and The Artist create larger breakup effects
- the existing loose ink scribbles remain as a secondary accent behind the cube breakup

The original body pieces disappear quickly after death so the cube fragmentation becomes the dominant death animation.

## Sniper platform / movement collision

Sketchyard XL includes a high sniper nest. Its staircase was rebuilt as straight, overlapping solid blocks with smaller height increments, removing the gaps that could let the player fall through. Platform tops use the controller's walkable-surface logic, so the player can climb, land on and walk off raised geometry normally.

## Combat / movement already included

- crouch
- sprint-to-slide
- slide jump momentum
- directional dash
- headshots
- enemy flinch and knockback
- ink impact effects
- health / stamina / ammo
- pickups
- automatic fire
- reload animation
- procedural combat audio
- ADS and Ruler Rifle scope
- Rifleman, Rusher, Sniper, Heavy, Flanker and boss AI
- dynamic round layouts
- taped-paper menus
- desktop-only mobile notice

## Mobile

Phones and coarse-pointer devices receive a themed message asking the player to use a laptop/desktop. Mobile controls are planned later.
