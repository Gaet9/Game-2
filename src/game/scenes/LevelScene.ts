import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Hud } from "../ui/Hud";
import { Sfx } from "../audio/Sfx";

export class LevelScene extends Phaser.Scene {
  public static readonly KEY = "LevelScene";

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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.physics.world.setBounds(0, 0, 2400, 540);
    this.cameras.main.setBounds(0, 0, 2400, 540);

    const platforms = this.physics.add.staticGroup();
    this.buildLevelPlatforms(platforms);

    const hazards = this.physics.add.staticGroup();
    this.buildHazards(hazards);

    const pickups = this.physics.add.staticGroup();
    this.buildPickups(pickups);

    this.player = new Player(this, 140, 420, {
      left: () => this.cursors.left.isDown || this.keyA.isDown,
      right: () => this.cursors.right.isDown || this.keyD.isDown,
      jumpJustPressed: () => Phaser.Input.Keyboard.JustDown(this.cursors.space),
      shootJustPressed: () => Phaser.Input.Keyboard.JustDown(this.keyJ)
    });

    this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: false });

    this.physics.add.collider(this.player, platforms);
    this.physics.add.overlap(this.player, hazards, () => {
      const knockDir = this.player.facing === 1 ? -1 : 1;
      this.player.takeDamage(15, this.time.now, knockDir * 220);
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
    enemies.add(new Enemy(this, 520, 470, platforms));
    enemies.add(new Enemy(this, 920, 290, platforms));

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

    // If you fall into a pit, take damage and reset near start.
    if (this.player.y > 640) {
      this.player.takeDamage(25, this.time.now, 0);
      this.player.setPosition(140, 420);
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    }
  }

  private buildLevelPlatforms(platforms: Phaser.Physics.Arcade.StaticGroup) {
    const tile = (x: number, y: number, w = 32, h = 32) => {
      const s = platforms.create(x, y, "platform") as Phaser.Physics.Arcade.Sprite;
      s.setDisplaySize(w, h);
      s.refreshBody();
      return s;
    };

    // Ground strip with pits (missing ground).
    const pits = [
      { fromX: 640, toX: 768 },
      { fromX: 1680, toX: 1792 }
    ];
    const isInPit = (x: number) => pits.some((p) => x >= p.fromX && x < p.toX);
    for (let x = 0; x < 2400; x += 32) {
      if (!isInPit(x)) tile(x + 16, 524, 32, 32);
    }

    // Floating platforms.
    for (let x = 240; x < 520; x += 32) tile(x + 16, 420, 32, 24);
    for (let x = 760; x < 980; x += 32) tile(x + 16, 340, 32, 24);
    for (let x = 1220; x < 1420; x += 32) tile(x + 16, 380, 32, 24);

  }

  private buildHazards(hazards: Phaser.Physics.Arcade.StaticGroup) {
    const spike = (x: number, y: number) => {
      const s = hazards.create(x, y, "spikes") as Phaser.Physics.Arcade.Sprite;
      s.setDisplaySize(32, 32);
      s.refreshBody();
      return s;
    };

    // Spikes near pits to teach jumping.
    spike(608, 524);
    spike(800, 524);
    spike(1648, 524);
    spike(1824, 524);
  }

  private buildPickups(pickups: Phaser.Physics.Arcade.StaticGroup) {
    const p = pickups.create(1320, 340, "pickup_blaster") as Phaser.Physics.Arcade.Sprite;
    p.setDisplaySize(18, 18);
    p.refreshBody();
  }
}

