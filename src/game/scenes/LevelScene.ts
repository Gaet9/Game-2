import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Hud } from "../ui/Hud";
import { Sfx } from "../audio/Sfx";

export class LevelScene extends Phaser.Scene {
  public static readonly KEY = "LevelScene";

  private readonly worldWidth = 6400;
  private readonly worldHeight = 1200;
  private readonly groundY = 1184; // center of 32px tiles so bottom aligns with 1200

  private player!: Player;
  private hud!: Hud;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyJ!: Phaser.Input.Keyboard.Key;
  private keyR!: Phaser.Input.Keyboard.Key;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private sfx!: Sfx;

  constructor() {
    super(LevelScene.KEY);
  }

  create() {
    this.sfx = new Sfx();
    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyJ = kb.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keyR = kb.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    const platforms = this.physics.add.staticGroup();
    this.buildLevelPlatforms(platforms);

    const spikes = this.physics.add.staticGroup();
    const lava = this.physics.add.staticGroup();
    this.buildHazards({ spikes, lava });

    const pickups = this.physics.add.staticGroup();
    this.buildPickups(pickups);

    this.player = new Player(this, 140, this.groundY - 90, {
      left: () => this.cursors.left.isDown || this.keyA.isDown,
      right: () => this.cursors.right.isDown || this.keyD.isDown,
      jumpJustPressed: () => Phaser.Input.Keyboard.JustDown(this.cursors.space),
      shootJustPressed: () => Phaser.Input.Keyboard.JustDown(this.keyJ)
    });

    this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: false });

    this.physics.add.collider(this.player, platforms);
    this.physics.add.overlap(this.player, spikes, () => {
      const knockDir = this.player.facing === 1 ? -1 : 1;
      this.player.takeDamage(15, this.time.now, knockDir * 220);
      this.sfx.play("hurt");
    });
    this.physics.add.overlap(this.player, lava, () => {
      // Instant death.
      this.player.takeDamage(10_000, this.time.now, 0);
      this.sfx.play("hurt");
    });
    this.physics.add.overlap(this.player, pickups, (_p, pickupObj) => {
      pickupObj.destroy();
      this.player.giveBlaster(18);
      this.sfx.play("pickup");
    });
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.hud = new Hud(this, this.player);

    const enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.spawnEnemies(enemies, platforms);

    this.physics.add.collider(enemies, platforms);

    this.physics.add.collider(this.projectiles, platforms, (proj) => {
      proj.destroy();
    });
    this.physics.add.overlap(this.projectiles, enemies, (projObj, enemyObj) => {
      projObj.destroy();
      (enemyObj as Enemy).kill();
    });

    this.physics.add.overlap(this.player, enemies, (_playerObj, enemyObj) => {
      const enemy = enemyObj as Enemy;
      if (!enemy.alive) return;

      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
      const playerFalling = playerBody.velocity.y > 0;
      const playerAbove = playerBody.bottom <= enemyBody.top + 8;

      if (playerFalling && playerAbove) {
        enemy.kill();
        this.player.bounceAfterStomp();
        this.sfx.play("stomp");
        return;
      }

      const knockDir = this.player.x < enemy.x ? -1 : 1;
      this.player.takeDamage(10, this.time.now, knockDir * 260);
      this.sfx.play("hurt");
    });

    this.player.on("shoot", ({ x, y, dir }: { x: number; y: number; dir: -1 | 1 }) => {
      const p = new Projectile(this, x + dir * 16, y, dir);
      this.projectiles.add(p);
      this.sfx.play("shoot");
    });

    this.player.on("jump", () => {
      this.sfx.play("jump");
    });
  }

  update() {
    this.player.update(this.time.now);
    this.hud.update();

    if (this.player.pv <= 0) {
      if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
        this.scene.restart();
      }
      return;
    }

    // If you fall out of the world (missed lava), treat as instant death.
    if (this.player.y > this.worldHeight + 200) {
      this.player.takeDamage(10_000, this.time.now, 0);
    }
  }

  private buildLevelPlatforms(platforms: Phaser.Physics.Arcade.StaticGroup) {
    const tile = (x: number, y: number, w = 32, h = 32) => {
      const s = platforms.create(x, y, "platform") as Phaser.Physics.Arcade.Sprite;
      s.setDisplaySize(w, h);
      s.refreshBody();
      return s;
    };

    // Ground strip with pits (missing ground). Lava is placed there separately.
    const pits = this.getPits();
    const isInPit = (x: number) => pits.some((p) => x >= p.fromX && x < p.toX);
    for (let x = 0; x < this.worldWidth; x += 32) {
      if (!isInPit(x)) tile(x + 16, this.groundY, 32, 32);
    }

    // Low warm-up platforms near start.
    for (let x = 240; x < 560; x += 32) tile(x + 16, this.groundY - 120, 32, 24);
    for (let x = 720; x < 980; x += 32) tile(x + 16, this.groundY - 220, 32, 24);

    // Mid-tier "bridges" and obstacles.
    for (let x = 1180; x < 1640; x += 32) tile(x + 16, this.groundY - 180, 32, 24);
    for (let x = 1380; x < 1540; x += 32) tile(x + 16, this.groundY - 320, 32, 24);

    // Vertical climb section (stacked ledges).
    for (let i = 0; i < 8; i++) {
      tile(2100 + i * 56, this.groundY - 120 - i * 70, 64, 20);
    }

    // High route: long upper walkway with gaps.
    for (let x = 2600; x < 3600; x += 32) {
      if ((x / 32) % 9 !== 0) tile(x + 16, this.groundY - 520, 32, 20);
    }

    // Lower route: staggered platforms above lava pits.
    for (let x = 2600; x < 3600; x += 96) {
      tile(x + 16, this.groundY - 140, 64, 18);
      tile(x + 64, this.groundY - 240, 64, 18);
    }

    // Late-game tall tower-ish section.
    for (let i = 0; i < 10; i++) {
      tile(4200, this.groundY - 80 - i * 90, 96, 20);
      tile(4400, this.groundY - 140 - i * 90, 96, 20);
    }

    // Final long stretch with more obstacles.
    for (let x = 4700; x < 6300; x += 32) {
      if ((x / 32) % 13 !== 0 && (x / 32) % 17 !== 0) tile(x + 16, this.groundY - 160, 32, 20);
    }
  }

  private buildHazards(hazards: { spikes: Phaser.Physics.Arcade.StaticGroup; lava: Phaser.Physics.Arcade.StaticGroup }) {
    const spike = (x: number, y: number) => {
      const s = hazards.spikes.create(x, y, "spikes") as Phaser.Physics.Arcade.Sprite;
      s.setDisplaySize(32, 32);
      s.refreshBody();
      return s;
    };

    const lavaTile = (x: number, y: number) => {
      const s = hazards.lava.create(x, y, "lava") as Phaser.Physics.Arcade.Sprite;
      s.setDisplaySize(32, 32);
      s.refreshBody();
      return s;
    };

    // Fill pits with lava (instant death).
    for (const pit of this.getPits()) {
      for (let x = pit.fromX; x < pit.toX; x += 32) {
        lavaTile(x + 16, this.groundY);
      }
    }

    // Spikes sprinkled across routes.
    spike(608, this.groundY);
    spike(800, this.groundY);
    spike(1328, this.groundY - 212);
    spike(1488, this.groundY - 212);
    spike(2864, this.groundY - 552);
    spike(3056, this.groundY - 552);
    spike(5104, this.groundY - 192);
    spike(5664, this.groundY - 192);
  }

  private buildPickups(pickups: Phaser.Physics.Arcade.StaticGroup) {
    const p = pickups.create(1320, 340, "pickup_blaster") as Phaser.Physics.Arcade.Sprite;
    p.setDisplaySize(18, 18);
    p.refreshBody();
  }

  private spawnEnemies(enemies: Phaser.Physics.Arcade.Group, platforms: Phaser.Physics.Arcade.StaticGroup) {
    const add = (x: number, y: number) => enemies.add(new Enemy(this, x, y, platforms));

    // Early area
    add(520, this.groundY - 54);
    add(860, this.groundY - 54);

    // Mid bridges/climb
    add(1320, this.groundY - 210);
    add(1560, this.groundY - 210);
    add(2140, this.groundY - 240);
    add(2360, this.groundY - 420);

    // Split routes
    add(2880, this.groundY - 580);
    add(3160, this.groundY - 260);
    add(3400, this.groundY - 360);

    // Tower/finale
    add(4300, this.groundY - 170);
    add(4460, this.groundY - 350);
    add(5000, this.groundY - 220);
    add(5400, this.groundY - 220);
    add(6000, this.groundY - 220);
  }

  private getPits() {
    // Keep pit sizes aligned to 32px tiles.
    return [
      { fromX: 640, toX: 832 },
      { fromX: 1680, toX: 1856 },
      { fromX: 2624, toX: 2816 },
      { fromX: 3616, toX: 3904 },
      { fromX: 4768, toX: 4960 }
    ];
  }
}

