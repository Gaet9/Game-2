import Phaser from "phaser";

export type PlayerInput = {
  left: () => boolean;
  right: () => boolean;
  jumpJustPressed: () => boolean;
  shootJustPressed: () => boolean;
};

export type PlayerWeaponState =
  | { kind: "none" }
  | { kind: "blaster"; ammo: number; cooldownMs: number; lastShotAtMs: number };

export class Player extends Phaser.Physics.Arcade.Sprite {
  public pvMax = 100;
  public pv = 100;
  public facing: -1 | 1 = 1;

  public weapon: PlayerWeaponState = { kind: "none" };

  private readonly controls: PlayerInput;
  private invulnerableUntilMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, input: PlayerInput) {
    super(scene, x, y, "player");
    this.controls = input;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(520, 900);
    body.setDragX(800);
    // The sprite is tall; use a slightly slimmer body for platforming feel.
    body.setSize(12, 42, true);
    body.setOffset(3, 6);
  }

  public update(nowMs: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const speed = 280;
    if (this.controls.left() === this.controls.right()) {
      body.setAccelerationX(0);
    } else if (this.controls.left()) {
      body.setAccelerationX(-speed * 5);
      this.facing = -1;
    } else {
      body.setAccelerationX(speed * 5);
      this.facing = 1;
    }

    this.setFlipX(this.facing === -1);

    if (this.controls.jumpJustPressed() && body.blocked.down) {
      body.setVelocityY(-560);
      this.emit("jump");
    }

    if (this.controls.shootJustPressed()) {
      this.tryConsumeShot(nowMs);
    }

    const isInvulnerable = nowMs < this.invulnerableUntilMs;
    this.setAlpha(isInvulnerable ? 0.6 : 1);
  }

  public bounceAfterStomp() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-360);
  }

  public takeDamage(amount: number, nowMs: number, knockbackX?: number) {
    if (nowMs < this.invulnerableUntilMs) return;

    this.pv = Math.max(0, this.pv - amount);
    this.invulnerableUntilMs = nowMs + 900;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-240);
    if (knockbackX) body.setVelocityX(knockbackX);
  }

  public giveBlaster(ammo: number) {
    this.weapon = { kind: "blaster", ammo, cooldownMs: 180, lastShotAtMs: -1_000_000 };
  }

  public canShoot(nowMs: number) {
    if (this.weapon.kind === "none") return false;
    return this.weapon.ammo > 0 && nowMs - this.weapon.lastShotAtMs >= this.weapon.cooldownMs;
  }

  private tryConsumeShot(nowMs: number) {
    if (this.weapon.kind !== "blaster") return;
    if (!this.canShoot(nowMs)) return;

    // Consume ammo and emit a fire event. The scene decides how to spawn projectiles.
    this.weapon = {
      ...this.weapon,
      ammo: this.weapon.ammo - 1,
      lastShotAtMs: nowMs
    };

    this.emit("shoot", { x: this.x, y: this.y - 6, dir: this.facing });
  }
}

