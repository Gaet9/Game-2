import Phaser from "phaser";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private dir: -1 | 1 = -1;
  private readonly speed = 90;
  public alive = true;
  public hp = 3;
  private readonly platforms?: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene, x: number, y: number, platforms?: Phaser.Physics.Arcade.StaticGroup) {
    super(scene, x, y, "enemy");
    this.platforms = platforms;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(0);
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(this.dir * this.speed);
    this.setFlipX(this.dir === 1);

    if (body.blocked.left) this.dir = 1;
    if (body.blocked.right) this.dir = -1;

    // Edge guard: if we're about to walk off a platform, turn around.
    if (this.platforms && body.blocked.down) {
      const lookAheadX = this.x + this.dir * 14;
      const lookAheadY = body.bottom + 2;
      const supporting = this.scene.physics.overlapRect(lookAheadX - 2, lookAheadY, 4, 4, true, true);

      const hasAnySupport = supporting.some((b) => {
        const texKey = (b.gameObject as Phaser.GameObjects.GameObject & { texture?: { key: string } }).texture?.key;
        return texKey === "platform";
      });

      if (!hasAnySupport) this.dir = this.dir === 1 ? -1 : 1;
    }
  }

  public kill() {
    if (!this.alive) return;
    this.alive = false;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    this.scene.tweens.add({
      targets: this,
      y: this.y - 18,
      alpha: 0,
      duration: 220,
      ease: "Quad.easeOut",
      onComplete: () => this.destroy()
    });
  }

  public takeDamage(amount: number) {
    if (!this.alive) return;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) this.kill();
  }
}

