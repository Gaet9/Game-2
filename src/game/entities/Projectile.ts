import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, dir: -1 | 1) {
    super(scene, x, y, "projectile");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setVelocityX(dir * 620);
    body.setSize(8, 6, true);

    this.setFlipX(dir === -1);
  }
}

