## Agent context (Phaser Platformer)

### Product summary

This repository is a **2D Mario-like platformer** built with **Phaser 3** and shipped as:

- **Web** build (Vite)
- **Windows desktop** build (Electron loading the same web bundle)

### Key gameplay requirements

- Player (“little man”) can run/jump and has a **PV/HP bar**.
- Enemies patrol and **damage on contact**.
- Enemies can be **killed by stomping** (jumping on top); stomping causes a small player bounce.
- Hazards/obstacles exist (platforms, pits/spikes) and can reduce PV.
- Weapons can be **picked up** and enable **projectile attacks**.

### Engineering constraints / conventions

- Prefer **TypeScript** everywhere (`src/` and `electron/`).
- Prefer small, testable modules: entities in `src/game/entities`, UI in `src/game/ui`.
- Keep Phaser logic deterministic and frame-rate independent when possible.
- Avoid “narration comments”. Use comments only for non-obvious intent/tradeoffs.
- Keep assets optional: gameplay must work with placeholder graphics.

### Where things live

- Gameplay: `src/game/scenes/LevelScene.ts`
- Player: `src/game/entities/Player.ts`
- Enemies: `src/game/entities/Enemy.ts`
- HUD: `src/game/ui/Hud.ts`
- Desktop: `electron/main.ts`

