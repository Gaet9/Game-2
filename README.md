## Phaser Platformer (web + desktop)

A small Mario-like 2D platformer built with **Phaser 3**. Features:

- **Player**: run/jump, facing direction
- **Enemies**: patrol, hurt on touch, **stomp to kill**
- **Obstacles**: platforms + hazards
- **PV/HP bar**: HUD health bar + game over
- **Weapons**: pickups + projectiles

### Requirements

- Node.js 18+ (recommended)

### Quick checks

```bash
npm install
npm run check
```

### Run (web)

```bash
npm install
npm run dev
```

### Build (web)

```bash
npm run build:web
npm run preview
```

### Run (desktop)

```bash
npm run start:desktop
```

### Build installer (Windows)

```bash
npm run build:desktop
```

### Controls

- **Move**: Arrow keys or A/D
- **Jump**: Space
- **Shoot**: J (when you have a weapon)

### Repo structure (high level)

- `src/game/scenes/`: Phaser scenes (boot + main level)
- `src/game/entities/`: gameplay objects (player, enemies, projectiles)
- `src/game/ui/`: HUD (PV bar, ammo/weapon indicator)
- `src/game/audio/`: audio interface (placeholder now)
- `electron/`: desktop wrapper

### Developer notes

- Placeholder graphics are generated at runtime in `src/game/scenes/BootScene.ts`.
- The main gameplay loop is in `src/game/scenes/LevelScene.ts`, using Arcade Physics.

